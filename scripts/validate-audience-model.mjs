import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
const PRIORITIES = new Set(["high", "medium", "low"]);
const DECISION_POWER = new Set(["decider", "influencer", "user", "reviewer", "learner", "mixed", "unknown"]);

if (!target) {
  console.error("Usage: node scripts/validate-audience-model.mjs <project-dir|audience-model.json>");
  process.exit(2);
}

try {
  const modelPath = await resolveAudienceModelPath(target);
  const model = JSON.parse(await readFile(modelPath, "utf8"));
  validateAudienceModel(model, modelPath);
  console.log(`audience model valid: ${modelPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveAudienceModelPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "audience-model.json") : resolved;
}

function validateAudienceModel(model, modelPath) {
  requireObject(model, `${modelPath}: audience model`);
  requireArray(model.segments, `${modelPath}: segments`, { min: 1, max: 6 });
  const questionIds = new Set();
  const objectionIds = new Set();

  for (const [index, segment] of model.segments.entries()) {
    const label = `${modelPath}: segments[${index}]`;
    requireObject(segment, label);
    requireId(segment.id, `${label}.id`);
    requireString(segment.role, `${label}.role`);
    if (!DECISION_POWER.has(segment.decision_power)) {
      throw new Error(`${label}.decision_power must be one of ${[...DECISION_POWER].join(", ")}`);
    }
    requireStringArray(segment.current_knowledge, `${label}.current_knowledge`, { max: 8 });
    requireStringArray(segment.stakes, `${label}.stakes`, { min: 1, max: 8 });
    requireStringArray(segment.success_criteria, `${label}.success_criteria`, { min: 1, max: 8 });
    validateQuestions(segment.likely_questions, `${label}.likely_questions`, questionIds);
    validateObjections(segment.objections, `${label}.objections`, objectionIds);
    validateJargon(segment.jargon, `${label}.jargon`);
  }

  requireObject(model.audience_pov_critique, `${modelPath}: audience_pov_critique`);
  for (const field of [
    "what_they_care_about",
    "what_will_feel_unproven",
    "where_deck_sounds_like_us_not_them",
    "required_reframe"
  ]) {
    requireString(model.audience_pov_critique[field], `${modelPath}: audience_pov_critique.${field}`);
  }
}

function validateQuestions(questions, label, ids) {
  requireArray(questions, label, { max: 12 });
  for (const [index, question] of questions.entries()) {
    const itemLabel = `${label}[${index}]`;
    requireObject(question, itemLabel);
    requireId(question.id, `${itemLabel}.id`);
    if (ids.has(question.id)) throw new Error(`${itemLabel}.id duplicates ${question.id}`);
    ids.add(question.id);
    requireString(question.question, `${itemLabel}.question`);
    if (!PRIORITIES.has(question.priority)) {
      throw new Error(`${itemLabel}.priority must be one of ${[...PRIORITIES].join(", ")}`);
    }
  }
}

function validateObjections(objections, label, ids) {
  requireArray(objections, label, { max: 12 });
  for (const [index, objection] of objections.entries()) {
    const itemLabel = `${label}[${index}]`;
    requireObject(objection, itemLabel);
    requireId(objection.id, `${itemLabel}.id`);
    if (ids.has(objection.id)) throw new Error(`${itemLabel}.id duplicates ${objection.id}`);
    ids.add(objection.id);
    requireString(objection.objection, `${itemLabel}.objection`);
    if (!PRIORITIES.has(objection.severity)) {
      throw new Error(`${itemLabel}.severity must be one of ${[...PRIORITIES].join(", ")}`);
    }
  }
}

function validateJargon(jargon, label) {
  requireObject(jargon, label);
  for (const field of ["allowed", "define_on_first_use", "avoid"]) {
    requireStringArray(jargon[field], `${label}.${field}`, { max: 16 });
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
