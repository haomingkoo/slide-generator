export const CLAIM_TYPES = new Set([
  "user_file",
  "codebase",
  "external_source",
  "inference",
  "assumption"
]);

export const CLAIM_CONFIDENCE_LEVELS = new Set(["high", "medium", "low"]);

export const CLAIM_LEDGER_REQUIRED_FIELDS = [
  "claim_id",
  "claim",
  "type",
  "source",
  "evidence",
  "confidence",
  "allowed_slide_use"
];
