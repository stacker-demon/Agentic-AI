/**
 * AegisSentry Bot Logic — Client-Side Dummy Engine
 *
 * This module simulates the FastAPI Presidio pipeline entirely in the browser.
 * To swap to the real FastAPI endpoint, replace the `sanitizePromptLocal` call
 * in AegisSentryBot.tsx with a fetch() to /api/v1/analyze.
 */

export interface RiskFinding {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  pattern: RegExp;
}

export interface AuditResult {
  safe: boolean;
  score: number; // 0–100 (100 = fully safe)
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  findings: Array<{ type: string; severity: string; description: string }>;
  message: string;
  advice: string;
}

// ─── Risk Pattern Registry ────────────────────────────────────────────────────
const RISK_PATTERNS: RiskFinding[] = [
  {
    type: 'EMAIL_ADDRESS',
    severity: 'high',
    description: 'Email address detected',
    pattern: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    type: 'PHONE_NUMBER',
    severity: 'high',
    description: 'Phone number detected',
    pattern: /(\+?\d{1,3}[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/g,
  },
  {
    type: 'CREDIT_CARD',
    severity: 'critical',
    description: 'Credit/debit card number detected',
    pattern: /\b(?:\d{4}[\s\-]?){3}\d{4}\b/g,
  },
  {
    type: 'SSN',
    severity: 'critical',
    description: 'Social Security Number (SSN) pattern detected',
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
  },
  {
    type: 'PASSWORD',
    severity: 'critical',
    description: 'Password or secret key reference detected',
    pattern: /\b(password|passwd|secret|api[_\s]?key|token|auth)\s*[:=]\s*\S+/gi,
  },
  {
    type: 'IP_ADDRESS',
    severity: 'medium',
    description: 'IP address detected',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  },
  {
    type: 'URL_WITH_CREDENTIALS',
    severity: 'critical',
    description: 'URL with embedded credentials detected',
    pattern: /https?:\/\/[^:]+:[^@]+@/gi,
  },
  {
    type: 'MEDICAL_TERM',
    severity: 'medium',
    description: 'Medical or health information detected',
    pattern: /\b(diagnosis|prescribed|medication|dosage|patient|symptoms|treatment|disease|disorder)\b/gi,
  },
  {
    type: 'FINANCIAL_DATA',
    severity: 'high',
    description: 'Financial information detected',
    pattern: /\b(bank\s?account|routing\s?number|iban|swift|aba)\b/gi,
  },
  {
    type: 'PERSONAL_ID',
    severity: 'high',
    description: 'Government ID number pattern detected',
    pattern: /\b(passport|driving\s?license|national\s?id|voter\s?id)\s*[:#]?\s*[A-Z0-9]{6,}/gi,
  },
];

const SEVERITY_WEIGHTS: Record<string, number> = {
  low: 5,
  medium: 15,
  high: 25,
  critical: 40,
};

// ─── Advice Map ───────────────────────────────────────────────────────────────
const ADVICE_MAP: Record<string, string> = {
  EMAIL_ADDRESS: 'Replace emails with a generic placeholder like "user@example.com" or describe the scenario without real addresses.',
  PHONE_NUMBER: 'Use a fake number like (555) 555-5555 instead of real phone numbers.',
  CREDIT_CARD: '🚨 NEVER share real card numbers with AI. Use "4111 1111 1111 1111" (test card) for demonstrations.',
  SSN: '🚨 CRITICAL: SSNs are the highest-risk PII. Use placeholder like XXX-XX-XXXX.',
  PASSWORD: '🚨 Remove all credentials. Never paste passwords or API keys into AI prompts.',
  IP_ADDRESS: 'Replace real IPs with 192.0.2.x (documentation range) or 127.0.0.1.',
  URL_WITH_CREDENTIALS: '🚨 Strip credentials from URLs immediately. Use env variables instead.',
  MEDICAL_TERM: 'Anonymize patient data. Use generic terms or synthetic data for medical scenarios.',
  FINANCIAL_DATA: 'Replace real account details with fictional equivalents from test datasets.',
  PERSONAL_ID: 'Use a fictional ID or describe the format without sharing real document numbers.',
};

// ─── Core Analysis Function ───────────────────────────────────────────────────
export function sanitizePromptLocal(text: string): AuditResult {
  if (!text.trim()) {
    return {
      safe: true,
      score: 100,
      riskLevel: 'safe',
      findings: [],
      message: 'Enter a prompt to audit.',
      advice: '',
    };
  }

  const findings: Array<{ type: string; severity: string; description: string }> = [];
  let totalDeduction = 0;

  for (const rule of RISK_PATTERNS) {
    const matches = text.match(rule.pattern);
    if (matches) {
      findings.push({
        type: rule.type,
        severity: rule.severity,
        description: rule.description,
      });
      totalDeduction += SEVERITY_WEIGHTS[rule.severity] ?? 10;
    }
  }

  const score = Math.max(0, 100 - totalDeduction);
  const safe = findings.length === 0;

  let riskLevel: AuditResult['riskLevel'] = 'safe';
  if (score < 20) riskLevel = 'critical';
  else if (score < 50) riskLevel = 'high';
  else if (score < 70) riskLevel = 'medium';
  else if (score < 90) riskLevel = 'low';

  // Build advice from the highest-severity finding
  const criticalFinding = findings.find(f => f.severity === 'critical');
  const highFinding = findings.find(f => f.severity === 'high');
  const topFinding = criticalFinding ?? highFinding ?? findings[0];
  const advice = topFinding ? (ADVICE_MAP[topFinding.type] ?? 'Review and remove sensitive information before submitting.') : '';

  const message = safe
    ? `✅ Prompt appears safe (Score: ${score}/100). No PII patterns detected.`
    : `⚠️ ${findings.length} risk${findings.length > 1 ? 's' : ''} detected (Score: ${score}/100): ${findings.map(f => f.type.replace(/_/g, ' ')).join(', ')}.`;

  return { safe, score, riskLevel, findings, message, advice };
}

// ─── FastAPI Bridge ───────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function mapApiResponseToAuditResult(data: any): AuditResult {
  const score = data.privacy_score;
  const findings = data.entities.map((e: any) => ({
    type: e.entity_type,
    severity: e.risk_level,
    description: `${e.entity_type.replace(/_/g, ' ')} detected with ${Math.round(e.score * 100)}% confidence`,
  }));

  const safe = findings.length === 0;
  const riskLevel = data.risk_level as AuditResult['riskLevel'];

  // Build advice from the highest-severity finding
  const criticalFinding = findings.find((f: any) => f.severity === 'critical');
  const highFinding = findings.find((f: any) => f.severity === 'high');
  const topFinding = criticalFinding ?? highFinding ?? findings[0];
  const advice = topFinding ? (ADVICE_MAP[topFinding.type] ?? 'Review and remove sensitive information before submitting.') : '';

  const message = safe
    ? `✅ Prompt appears safe (Score: ${score}/100). No PII patterns detected.`
    : `⚠️ ${findings.length} risk${findings.length > 1 ? 's' : ''} detected (Score: ${score}/100): ${findings.map((f: any) => f.type.replace(/_/g, ' ')).join(', ')}.`;

  return { safe, score, riskLevel, findings, message, advice };
}

export async function sanitizePromptRemote(text: string): Promise<AuditResult> {
  if (!text.trim()) {
    return {
      safe: true,
      score: 100,
      riskLevel: 'safe',
      findings: [],
      message: 'Enter a prompt to audit.',
      advice: '',
    };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.statusText}`);
    }

    const data = await res.json();
    return mapApiResponseToAuditResult(data);
  } catch (error) {
    console.error('Audit API Error:', error);
    // Fallback to local engine if backend is down
    return sanitizePromptLocal(text);
  }
}
