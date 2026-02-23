export interface ScrubResult {
  text: string;
  redactedCount: number;
}

const PHI_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // SSN
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN REDACTED]' },
  // DOB patterns
  {
    pattern:
      /\b(?:born on|date of birth|dob|birthday)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/gi,
    replacement: '[DOB REDACTED]',
  },
  // Email
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '[EMAIL REDACTED]',
  },
  // Medical conditions (common terms)
  {
    pattern:
      /\b(?:diagnosed with|suffering from|history of|treatment for)\s+[a-zA-Z\s]{3,30}/gi,
    replacement: '[MEDICAL CONDITION REDACTED]',
  },
  // Medication names (common patterns)
  {
    pattern:
      /\b(?:taking|prescribed|medication|medicine)\s+[a-zA-Z]{3,20}(?:\s+\d+\s*mg)?/gi,
    replacement: '[MEDICATION REDACTED]',
  },
  // Credit card (basic)
  {
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    replacement: '[CARD REDACTED]',
  },
  // Address patterns (basic)
  {
    pattern:
      /\b\d{1,5}\s+[A-Za-z\s]{3,30}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|Court|Ct|Way)\b/gi,
    replacement: '[ADDRESS REDACTED]',
  },
];

export function scrubPHIRegex(text: string): ScrubResult {
  let scrubbed = text;
  let redactedCount = 0;

  for (const { pattern, replacement } of PHI_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    const matches = scrubbed.match(pattern);
    if (matches) {
      redactedCount += matches.length;
      pattern.lastIndex = 0;
      scrubbed = scrubbed.replace(pattern, replacement);
    }
  }

  return { text: scrubbed, redactedCount };
}
