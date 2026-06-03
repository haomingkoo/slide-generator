import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  CLAIM_CONFIDENCE_LEVELS,
  CLAIM_LEDGER_REQUIRED_FIELDS,
  CLAIM_TYPES
} from "./spec-constants.mjs";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/validate-claim-ledger.mjs <project-dir|claim-ledger.json>");
  process.exit(2);
}

try {
  const ledgerPath = await resolveLedgerPath(target);
  const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
  const claims = extractClaims(ledger);
  validateClaims(claims, ledgerPath);
  console.log(`claim ledger valid: ${ledgerPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveLedgerPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "claim-ledger.json") : resolved;
}

function extractClaims(ledger) {
  if (Array.isArray(ledger)) return ledger;
  if (Array.isArray(ledger?.claims)) return ledger.claims;
  throw new Error("claim ledger must be an array or an object with a claims array");
}

function validateClaims(claims, ledgerPath) {
  if (claims.length === 0) {
    throw new Error(`${ledgerPath}: claim ledger must contain at least one claim`);
  }

  const ids = new Set();
  for (const [index, claim] of claims.entries()) {
    const label = claim?.claim_id ?? `claim at index ${index}`;
    if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
      throw new Error(`${ledgerPath}: ${label} must be an object`);
    }

    for (const field of CLAIM_LEDGER_REQUIRED_FIELDS) {
      if (!hasNonEmptyValue(claim[field])) {
        throw new Error(`${ledgerPath}: ${label} is missing ${field}`);
      }
    }

    if (typeof claim.claim_id !== "string") {
      throw new Error(`${ledgerPath}: claim_id at index ${index} must be a string`);
    }
    if (ids.has(claim.claim_id)) {
      throw new Error(`${ledgerPath}: duplicate claim_id ${claim.claim_id}`);
    }
    ids.add(claim.claim_id);

    if (!CLAIM_TYPES.has(claim.type)) {
      throw new Error(`${ledgerPath}: ${label} has invalid type ${claim.type}`);
    }
    if (!CLAIM_CONFIDENCE_LEVELS.has(claim.confidence)) {
      throw new Error(`${ledgerPath}: ${label} has invalid confidence ${claim.confidence}`);
    }
    if (claim.type === "external_source" && !hasExternalSourceUrl(claim.source)) {
      throw new Error(`${ledgerPath}: ${label} is external_source but has no source.url`);
    }
  }
}

function hasNonEmptyValue(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0 && value.every(hasNonEmptyValue);
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== undefined && value !== null;
}

function hasExternalSourceUrl(source) {
  if (typeof source === "string") return /^https?:\/\//.test(source);
  return typeof source?.url === "string" && source.url.trim().length > 0;
}
