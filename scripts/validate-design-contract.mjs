import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/validate-design-contract.mjs <project-dir|design-contract.json>");
  process.exit(2);
}

try {
  const contractPath = await resolveDesignContractPath(target);
  const contract = JSON.parse(await readFile(contractPath, "utf8"));
  validateDesignContract(contract, contractPath);
  console.log(`design contract valid: ${contractPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveDesignContractPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "design-contract.json") : resolved;
}

function validateDesignContract(contract, contractPath) {
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    throw new Error(`${contractPath}: design contract must be an object`);
  }
  if (contract.version !== 1) {
    throw new Error(`${contractPath}: version must be 1`);
  }

  requireObject(contract.source, `${contractPath}: source`);
  requireString(contract.source.type, `${contractPath}: source.type`);
  requireArray(contract.source.references, `${contractPath}: source.references`);

  requireObject(contract.direction, `${contractPath}: direction`);
  for (const field of ["personality", "audience_fit", "density", "depth", "grid"]) {
    requireString(contract.direction[field], `${contractPath}: direction.${field}`);
  }

  requireObject(contract.tokens, `${contractPath}: tokens`);
  requireObject(contract.tokens.colors, `${contractPath}: tokens.colors`);
  for (const field of ["background", "surface", "text", "muted", "accent", "secondary_accent", "border"]) {
    requireString(contract.tokens.colors[field], `${contractPath}: tokens.colors.${field}`);
  }

  requireObject(contract.tokens.typography, `${contractPath}: tokens.typography`);
  for (const field of ["heading", "body", "mono"]) {
    requireString(contract.tokens.typography[field], `${contractPath}: tokens.typography.${field}`);
  }
  requireNonEmptyStringArray(contract.tokens.typography.scale, `${contractPath}: tokens.typography.scale`);

  requireObject(contract.tokens.spacing, `${contractPath}: tokens.spacing`);
  requireString(contract.tokens.spacing.base, `${contractPath}: tokens.spacing.base`);
  requireNonEmptyStringArray(contract.tokens.spacing.scale, `${contractPath}: tokens.spacing.scale`);
  requireNonEmptyStringArray(contract.tokens.radius, `${contractPath}: tokens.radius`);
  if (!Array.isArray(contract.tokens.shadow)) {
    throw new Error(`${contractPath}: tokens.shadow must be an array`);
  }

  requireObject(contract.patterns, `${contractPath}: patterns`);
  for (const field of ["title_slide", "section_slide", "comparison_slide", "table_slide", "code_slide", "architecture_slide"]) {
    requireString(contract.patterns[field], `${contractPath}: patterns.${field}`);
  }

  requireObject(contract.rules, `${contractPath}: rules`);
  requireNonEmptyStringArray(contract.rules.avoid, `${contractPath}: rules.avoid`);
  requireNonEmptyStringArray(contract.rules.must_preserve, `${contractPath}: rules.must_preserve`);
  requireNonEmptyStringArray(contract.rules.accessibility, `${contractPath}: rules.accessibility`);

  requireArray(contract.decisions, `${contractPath}: decisions`);
  if (contract.decisions.length === 0) {
    throw new Error(`${contractPath}: decisions must not be empty`);
  }
  for (const [index, decision] of contract.decisions.entries()) {
    requireObject(decision, `${contractPath}: decisions[${index}]`);
    requireString(decision.decision, `${contractPath}: decisions[${index}].decision`);
    requireString(decision.rationale, `${contractPath}: decisions[${index}].rationale`);
    requireString(decision.date, `${contractPath}: decisions[${index}].date`);
  }
}

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
}

function requireNonEmptyStringArray(value, label) {
  requireArray(value, label);
  if (value.length === 0) {
    throw new Error(`${label} must not be empty`);
  }
  for (const [index, item] of value.entries()) {
    requireString(item, `${label}[${index}]`);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}
