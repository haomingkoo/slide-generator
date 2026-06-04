import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const target = process.argv[2];
const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const MODES = new Set([
  "hackathon_demo",
  "investor_pitch",
  "technical_architecture",
  "executive_consulting",
  "teaching_tutorial",
  "sales",
  "training",
  "update",
  "custom"
]);
const HARD_GATE_TYPES = new Set(["validator", "human_review", "browser_qa", "export_qa", "source_audit"]);

if (isCli) {
  if (!target) {
    console.error("Usage: node scripts/validate-quality-rubric.mjs <project-dir|quality-rubric.json>");
    process.exit(2);
  }

  try {
    const rubricPath = await resolveRubricPath(target);
    const rubric = JSON.parse(await readFile(rubricPath, "utf8"));
    validateRubric(rubric, rubricPath);
    console.log(`quality rubric valid: ${rubricPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function resolveRubricPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "quality-rubric.json") : resolved;
}

export function validateRubric(rubric, rubricPath = "quality-rubric.json") {
  requireObject(rubric, `${rubricPath}: quality rubric`);
  if (rubric.version !== 1) throw new Error(`${rubricPath}: version must be 1`);
  if (!MODES.has(rubric.deck_mode)) {
    throw new Error(`${rubricPath}: deck_mode must be one of ${[...MODES].join(", ")}`);
  }

  requireObject(rubric.target, `${rubricPath}: target`);
  requireScore(rubric.target.overall_score, `${rubricPath}: target.overall_score`);
  requireScore(rubric.target.minimum_slide_score, `${rubricPath}: target.minimum_slide_score`);
  requireInteger(rubric.target.max_repair_iterations, `${rubricPath}: target.max_repair_iterations`, { min: 1, max: 10 });
  requireString(rubric.target.stop_condition, `${rubricPath}: target.stop_condition`);
  if (rubric.target.minimum_slide_score > rubric.target.overall_score) {
    throw new Error(`${rubricPath}: target.minimum_slide_score cannot exceed target.overall_score`);
  }

  requireArray(rubric.hard_gates, `${rubricPath}: hard_gates`, { min: 3, max: 20 });
  const hardGateIds = new Set();
  for (const [index, gate] of rubric.hard_gates.entries()) {
    const label = `${rubricPath}: hard_gates[${index}]`;
    requireObject(gate, label);
    requireId(gate.id, `${label}.id`);
    if (hardGateIds.has(gate.id)) throw new Error(`${label}.id duplicates ${gate.id}`);
    hardGateIds.add(gate.id);
    if (!HARD_GATE_TYPES.has(gate.type)) {
      throw new Error(`${label}.type must be one of ${[...HARD_GATE_TYPES].join(", ")}`);
    }
    requireString(gate.requirement, `${label}.requirement`);
    if (gate.command !== undefined) requireString(gate.command, `${label}.command`);
  }

  requireArray(rubric.dimensions, `${rubricPath}: dimensions`, { min: 4, max: 12 });
  const dimensionIds = new Set();
  let totalWeight = 0;
  for (const [index, dimension] of rubric.dimensions.entries()) {
    const label = `${rubricPath}: dimensions[${index}]`;
    requireObject(dimension, label);
    requireId(dimension.id, `${label}.id`);
    if (dimensionIds.has(dimension.id)) throw new Error(`${label}.id duplicates ${dimension.id}`);
    dimensionIds.add(dimension.id);
    requireString(dimension.label, `${label}.label`);
    requireInteger(dimension.weight, `${label}.weight`, { min: 1, max: 50 });
    totalWeight += dimension.weight;
    requireString(dimension.question, `${label}.question`);
    requireStringArray(dimension.pass_criteria, `${label}.pass_criteria`, { min: 2, max: 8 });
    requireString(dimension.repair_guidance, `${label}.repair_guidance`);
  }
  if (totalWeight !== 100) {
    throw new Error(`${rubricPath}: dimension weights must sum to 100, got ${totalWeight}`);
  }

  if (rubric.role_reviews !== undefined) {
    requireObject(rubric.role_reviews, `${rubricPath}: role_reviews`);
    for (const role of ["researcher", "story_strategist", "designer", "critic"]) {
      requireString(rubric.role_reviews[role], `${rubricPath}: role_reviews.${role}`);
    }
  }
}

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function requireArray(value, label, { min = 0, max = Infinity } = {}) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  if (value.length < min) throw new Error(`${label} must contain at least ${min} item(s)`);
  if (value.length > max) throw new Error(`${label} has too many items`);
}

function requireStringArray(value, label, options = {}) {
  requireArray(value, label, options);
  for (const [index, item] of value.entries()) {
    requireString(item, `${label}[${index}]`);
  }
}

function requireId(value, label) {
  requireString(value, label);
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/i.test(value)) {
    throw new Error(`${label} must use stable snake_case`);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function requireInteger(value, label, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isInteger(value)) throw new Error(`${label} must be an integer`);
  if (value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}`);
}

function requireScore(value, label) {
  requireInteger(value, label, { min: 0, max: 100 });
}
