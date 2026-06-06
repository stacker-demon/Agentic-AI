from presidio_analyzer import AnalyzerEngine, RecognizerRegistry
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from pydantic import BaseModel
from typing import List, Optional

# ─── Response models ─────────────────────────────────────────────────────────

class EntityResult(BaseModel):
    entity_type: str
    start: int
    end: int
    score: float           # Presidio confidence 0.0–1.0
    risk_level: str        # low | medium | high | critical


class AnalysisResponse(BaseModel):
    anonymized_text: str
    entities: List[EntityResult]
    privacy_score: int     # 0–100 (100 = fully safe)
    risk_level: str        # safe | low | medium | high | critical
    entity_count: int


# ─── Risk classification ──────────────────────────────────────────────────────

CRITICAL_ENTITIES = {"CREDIT_CARD", "US_SSN", "US_BANK_NUMBER", "IBAN_CODE", "CRYPTO", "US_PASSPORT"}
HIGH_ENTITIES     = {"EMAIL_ADDRESS", "PHONE_NUMBER", "US_DRIVER_LICENSE", "MEDICAL_LICENSE", "NRP"}
MEDIUM_ENTITIES   = {"IP_ADDRESS", "URL", "LOCATION", "DATE_TIME", "US_ITIN"}
LOW_ENTITIES      = {"PERSON", "ORG", "ORGANIZATION"}

SEVERITY_WEIGHTS = {
    "critical": 40,
    "high":     25,
    "medium":   12,
    "low":       5,
}

def _classify_entity(entity_type: str) -> str:
    if entity_type in CRITICAL_ENTITIES:
        return "critical"
    if entity_type in HIGH_ENTITIES:
        return "high"
    if entity_type in MEDIUM_ENTITIES:
        return "medium"
    return "low"


# ─── Presidio setup ───────────────────────────────────────────────────────────

# Initialize once at module load (expensive operation)
_analyzer  = AnalyzerEngine()
_anonymizer = AnonymizerEngine()

# Anonymizer operators — replace each entity type with a typed placeholder
_OPERATORS = {
    "DEFAULT": OperatorConfig("replace", {"new_value": "<REDACTED>"}),
    "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "<EMAIL>"}),
    "PHONE_NUMBER":  OperatorConfig("replace", {"new_value": "<PHONE>"}),
    "CREDIT_CARD":   OperatorConfig("replace", {"new_value": "<CREDIT_CARD>"}),
    "US_SSN":        OperatorConfig("replace", {"new_value": "<SSN>"}),
    "PERSON":        OperatorConfig("replace", {"new_value": "<PERSON>"}),
    "IP_ADDRESS":    OperatorConfig("replace", {"new_value": "<IP_ADDRESS>"}),
    "URL":           OperatorConfig("replace", {"new_value": "<URL>"}),
    "LOCATION":      OperatorConfig("replace", {"new_value": "<LOCATION>"}),
}


# ─── Core analysis function ───────────────────────────────────────────────────

def analyze_and_anonymize(text: str, language: str = "en") -> AnalysisResponse:
    """
    Detects PII in `text` using Microsoft Presidio, anonymizes it,
    and returns a structured AnalysisResponse with a weighted privacy score.
    Raw PII is never stored — only the anonymized text is returned.
    """
    # 1. Analyze
    analyzer_results = _analyzer.analyze(text=text, language=language)

    # 2. Anonymize
    anonymized = _anonymizer.anonymize(
        text=text,
        analyzer_results=analyzer_results,
        operators=_OPERATORS,
    )

    # 3. Build entity list with risk classification
    entities: List[EntityResult] = []
    total_deduction = 0

    for res in analyzer_results:
        risk = _classify_entity(res.entity_type)
        entities.append(EntityResult(
            entity_type=res.entity_type,
            start=res.start,
            end=res.end,
            score=round(res.score, 3),
            risk_level=risk,
        ))
        total_deduction += SEVERITY_WEIGHTS[risk]

    # 4. Privacy score (capped at 0)
    privacy_score = max(0, 100 - total_deduction)

    # 5. Overall risk level
    if privacy_score >= 90:
        risk_level = "safe"
    elif privacy_score >= 70:
        risk_level = "low"
    elif privacy_score >= 50:
        risk_level = "medium"
    elif privacy_score >= 20:
        risk_level = "high"
    else:
        risk_level = "critical"

    return AnalysisResponse(
        anonymized_text=anonymized.text,
        entities=entities,
        privacy_score=privacy_score,
        risk_level=risk_level,
        entity_count=len(entities),
    )
