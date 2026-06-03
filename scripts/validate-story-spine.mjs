import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { SLIDE_JOBS } from "./validate-slide-specs.mjs";

const target = process.argv[2];

if (!target) {
  console.error("Usage: node scripts/validate-story-spine.mjs <project-dir|story-spine.json>");
  process.exit(2);
}

try {
  const spinePath = await resolveStorySpinePath(target);
  const spine = JSON.parse(await readFile(spinePath, "utf8"));
  validateStorySpine(spine, spinePath);
  console.log(`story spine valid: ${spinePath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveStorySpinePath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "story-spine.json") : resolved;
}

function validateStorySpine(spine, spinePath) {
  requireObject(spine, `${spinePath}: story spine`);
  requireObject(spine.audience_shift, `${spinePath}: audience_shift`);
  requireString(spine.audience_shift.from, `${spinePath}: audience_shift.from`);
  requireString(spine.audience_shift.to, `${spinePath}: audience_shift.to`);
  requireString(spine.throughline, `${spinePath}: throughline`);
  requireArray(spine.beats, `${spinePath}: beats`, { min: 1, max: 30 });

  const beatIds = new Set();
  for (const [index, beat] of spine.beats.entries()) {
    const label = `${spinePath}: beats[${index}]`;
    requireObject(beat, label);
    requireId(beat.id, `${label}.id`);
    if (beatIds.has(beat.id)) throw new Error(`${label}.id duplicates ${beat.id}`);
    beatIds.add(beat.id);
    if (!SLIDE_JOBS.has(beat.role)) {
      throw new Error(`${label}.role must be one of ${[...SLIDE_JOBS].join(", ")}`);
    }
    requireStringArray(beat.slide_ids, `${label}.slide_ids`, { min: 1, max: 8 });
    requireString(beat.transition, `${label}.transition`);
    if (beat.audience_question_ids !== undefined) {
      requireStringArray(beat.audience_question_ids, `${label}.audience_question_ids`, { max: 8 });
    }
    if (beat.handles_objection_ids !== undefined) {
      requireStringArray(beat.handles_objection_ids, `${label}.handles_objection_ids`, { max: 8 });
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
