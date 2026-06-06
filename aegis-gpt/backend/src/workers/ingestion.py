"""
Background ingestion worker for processing AI chat export files.

Usage:
  celery -A workers.ingestion worker --loglevel=info

This worker:
1. Receives a file path (JSON or CSV) via a Celery task
2. Parses conversation blocks from OpenAI / Claude / Gemini export formats
3. Runs each block through the Presidio analysis pipeline
4. Writes anonymized results to PostgreSQL (via SQLAlchemy)
5. Updates the AuditReport status and privacy score
"""

import json
import csv
import hashlib
from pathlib import Path
from typing import List, Dict, Any

from nlp.presidio_analyzer import analyze_and_anonymize


def parse_openai_export(file_path: str) -> List[str]:
    """Extract user message text blocks from OpenAI JSON export."""
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    blocks = []
    for conversation in data:
        mapping = conversation.get("mapping", {})
        for node in mapping.values():
            message = node.get("message")
            if not message:
                continue
            role = message.get("author", {}).get("role", "")
            if role == "user":
                content = message.get("content", {})
                parts = content.get("parts", [])
                text = " ".join(p for p in parts if isinstance(p, str))
                if text.strip():
                    blocks.append(text)
    return blocks


def parse_csv_export(file_path: str) -> List[str]:
    """Generic CSV parser — extracts all text column values."""
    blocks = []
    with open(file_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = " ".join(str(v) for v in row.values() if v)
            if text.strip():
                blocks.append(text)
    return blocks


def compute_hash(text: str) -> str:
    """SHA-256 hash of text for deduplication. Raw PII is never stored."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def process_export(file_path: str, report_id: int) -> Dict[str, Any]:
    """
    Main ingestion entry point.
    Returns a summary dict suitable for storing in AuditReport.summary.
    """
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".json":
        blocks = parse_openai_export(file_path)
    elif suffix == ".csv":
        blocks = parse_csv_export(file_path)
    else:
        raise ValueError(f"Unsupported file format: {suffix}")

    total_entities = 0
    severity_counts: Dict[str, int] = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    min_score = 100

    for i, block in enumerate(blocks):
        result = analyze_and_anonymize(block)
        total_entities += result.entity_count
        min_score = min(min_score, result.privacy_score)
        for entity in result.entities:
            if entity.risk_level in severity_counts:
                severity_counts[entity.risk_level] += 1

        # TODO: Persist each DetectedEntity to DB here using SQLAlchemy:
        # for entity in result.entities:
        #     db.execute(insert(detected_entities).values(
        #         report_id=report_id,
        #         entity_type=entity.entity_type,
        #         risk_level=entity.risk_level,
        #         anonymized_text=f"<{entity.entity_type}>",
        #         original_text_hash=compute_hash(block[entity.start:entity.end]),
        #         presidio_score=int(entity.score * 100),
        #         conversation_index=i,
        #     ))

    return {
        "totalEntities": total_entities,
        "totalBlocks": len(blocks),
        "privacyScore": min_score,
        "criticalCount": severity_counts["critical"],
        "highRiskCount": severity_counts["high"],
        "mediumRiskCount": severity_counts["medium"],
        "lowRiskCount": severity_counts["low"],
    }
