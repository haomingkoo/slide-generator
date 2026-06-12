import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const SLIDE_THEMES = new Set([
  "clean-surgical-light",
  "warm-editorial-light",
  "dark-runtime",
  "cool-campaign-light"
]);

export const SLIDE_LAYOUTS = new Set([
  "title",
  "section",
  "narrative",
  "two_column",
  "comparison",
  "table",
  "code",
  "architecture",
  "quote"
]);

export const SLIDE_JOBS = new Set([
  "hook",
  "context",
  "problem",
  "stakes",
  "gap",
  "insight",
  "key_idea",
  "contribution",
  "solution",
  "why_now",
  "method",
  "mechanism",
  "evaluation_setup",
  "result",
  "limitation",
  "discussion",
  "comparison",
  "evidence",
  "demo",
  "demo_plan",
  "working_proof",
  "rubric_alignment",
  "technical_depth",
  "architecture_context",
  "runtime_flow",
  "code_evidence",
  "market",
  "customer",
  "audience",
  "product",
  "traction",
  "business_model",
  "go_to_market",
  "budget",
  "metrics",
  "competition",
  "team",
  "ask",
  "executive_summary",
  "recommendation",
  "chart_evidence",
  "roadmap",
  "risk",
  "trust_boundary",
  "decision",
  "action",
  "summary",
  "close",
  "backup",
  "qa"
]);

export const VISUAL_AID_TYPES = new Set([
  "none",
  "comparison",
  "table",
  "code",
  "architecture",
  "quote",
  "image",
  "animated_sequence",
  "interactive_demo"
]);

export const MOTION_TYPES = new Set([
  "none",
  "transition",
  "step_reveal"
]);

const TITLE_MAX = 96;
const BODY_ITEM_MAX = 180;
const BODY_ITEMS_MAX = 5;
const NOTES_MAX = 1400;
const TALK_TRACK_ITEMS_MAX = 5;
const CODE_LINES_MAX = 28;
const CODE_CHARS_MAX = 1400;
const TABLE_COLS_MAX = 5;
const TABLE_ROWS_MAX = 8;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scripts/validate-slide-specs.mjs <project-dir|slide-specs.json>");
    process.exit(2);
  }

  try {
    const slideSpecsPath = await resolveSlideSpecsPath(target);
    const slideSpecs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
    validateSlideSpecs(slideSpecs, slideSpecsPath);
    console.log(`slide specs valid: ${slideSpecsPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export async function resolveSlideSpecsPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "slide-specs.json") : resolved;
}

export function normalizeSlideSpecs(specs, specPath = "slide-specs.json") {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) {
    throw new Error(`${specPath}: slide specs must be an object`);
  }

  const deck = specs.deck && typeof specs.deck === "object" && !Array.isArray(specs.deck)
    ? specs.deck
    : {};
  const slides = Array.isArray(specs.slides)
    ? specs.slides
    : Array.isArray(specs.deck?.slides)
      ? specs.deck.slides
      : null;

  if (!slides) {
    throw new Error(`${specPath}: slide specs must include slides array`);
  }

  return { deck, slides };
}

export function validateSlideSpecs(specs, specPath = "slide-specs.json") {
  const { deck, slides } = normalizeSlideSpecs(specs, specPath);
  validateDeck(deck, specPath);

  if (slides.length === 0) {
    throw new Error(`${specPath}: slides array must not be empty`);
  }

  const ids = new Set();
  for (const [index, slide] of slides.entries()) {
    validateSlide(slide, index, ids, specPath);
  }
}

function validateDeck(deck, specPath) {
  requireString(deck.title, `${specPath}: deck.title`);

  if (!SLIDE_THEMES.has(deck.theme)) {
    throw new Error(`${specPath}: deck.theme must be one of ${[...SLIDE_THEMES].join(", ")}`);
  }

  if (deck.size !== undefined && deck.size !== "16:9") {
    throw new Error(`${specPath}: only 16:9 slide size is supported by the first renderer`);
  }

  if (deck.paginate !== undefined && typeof deck.paginate !== "boolean") {
    throw new Error(`${specPath}: deck.paginate must be boolean when present`);
  }
}

function validateSlide(slide, index, ids, specPath) {
  const label = slide?.slide_id ?? `slide at index ${index}`;
  if (!slide || typeof slide !== "object" || Array.isArray(slide)) {
    throw new Error(`${specPath}: ${label} must be an object`);
  }

  requireString(slide.slide_id, `${specPath}: ${label}.slide_id`);
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/i.test(slide.slide_id)) {
    throw new Error(`${specPath}: ${label}.slide_id must use stable snake_case`);
  }
  if (ids.has(slide.slide_id)) {
    throw new Error(`${specPath}: duplicate slide_id ${slide.slide_id}`);
  }
  ids.add(slide.slide_id);

  if (!SLIDE_LAYOUTS.has(slide.layout)) {
    throw new Error(`${specPath}: ${label}.layout must be one of ${[...SLIDE_LAYOUTS].join(", ")}`);
  }

  if (!SLIDE_JOBS.has(slide.slide_job)) {
    throw new Error(`${specPath}: ${label}.slide_job must be one of ${[...SLIDE_JOBS].join(", ")}`);
  }

  requireString(slide.title, `${specPath}: ${label}.title`);
  if (slide.title.length > TITLE_MAX) {
    throw new Error(`${specPath}: ${label}.title is too long for a slide title`);
  }

  if (!Array.isArray(slide.claim_ids)) {
    throw new Error(`${specPath}: ${label}.claim_ids must be an array`);
  }
  if (!Array.isArray(slide.unsupported_claims)) {
    throw new Error(`${specPath}: ${label}.unsupported_claims must be an array`);
  }
  if (slide.claim_ids.length > 6) {
    throw new Error(`${specPath}: ${label} references too many claims for one slide`);
  }

  validateBody(slide.body, `${specPath}: ${label}.body`, { optional: true });
  validateSpeakerNotes(slide.speaker_notes, `${specPath}: ${label}.speaker_notes`);
  validateVisualAid(slide.visual_aid, `${specPath}: ${label}.visual_aid`);
  validateMotion(slide.motion, `${specPath}: ${label}.motion`, slide);

  switch (slide.layout) {
    case "title":
    case "section":
      break;
    case "narrative":
      validateBody(slide.body, `${specPath}: ${label}.body`);
      break;
    case "two_column":
      validatePanel(slide.left, `${specPath}: ${label}.left`);
      validatePanel(slide.right, `${specPath}: ${label}.right`);
      break;
    case "comparison":
      validatePanel(slide.left, `${specPath}: ${label}.left`);
      validatePanel(slide.right, `${specPath}: ${label}.right`);
      break;
    case "table":
      validateTable(slide.table, `${specPath}: ${label}.table`);
      break;
    case "code":
      validateCode(slide.code, `${specPath}: ${label}.code`);
      break;
    case "architecture":
      if (typeof slide.mermaid !== "string" || slide.mermaid.trim().length === 0) {
        validateBody(slide.body, `${specPath}: ${label}.body`);
      }
      break;
    case "quote":
      if (typeof slide.quote !== "string" || slide.quote.trim().length === 0) {
        throw new Error(`${specPath}: ${label}.quote must be present for quote layout`);
      }
      if (slide.quote.length > 260) {
        throw new Error(`${specPath}: ${label}.quote is too long`);
      }
      break;
  }
}

function validateVisualAid(visualAid, label) {
  if (!visualAid || typeof visualAid !== "object" || Array.isArray(visualAid)) {
    throw new Error(`${label} must be an object`);
  }
  if (!VISUAL_AID_TYPES.has(visualAid.type)) {
    throw new Error(`${label}.type must be one of ${[...VISUAL_AID_TYPES].join(", ")}`);
  }
  requireString(visualAid.purpose, `${label}.purpose`);
  if (visualAid.purpose.length > 220) {
    throw new Error(`${label}.purpose is too long`);
  }
  if (visualAid.validation !== undefined) {
    if (!visualAid.validation || typeof visualAid.validation !== "object" || Array.isArray(visualAid.validation)) {
      throw new Error(`${label}.validation must be an object`);
    }
    requireString(visualAid.validation.expected, `${label}.validation.expected`);
    requireString(visualAid.validation.fallback, `${label}.validation.fallback`);
    if (visualAid.validation.browser_check_required !== undefined && typeof visualAid.validation.browser_check_required !== "boolean") {
      throw new Error(`${label}.validation.browser_check_required must be boolean when present`);
    }
  }
  if (["animated_sequence", "interactive_demo"].includes(visualAid.type)) {
    if (visualAid.validation?.browser_check_required !== true) {
      throw new Error(`${label}: animated or interactive aids must require browser validation`);
    }
    requireString(visualAid.validation.fallback, `${label}.validation.fallback`);
  }
}

function validateMotion(motion, label, slide) {
  if (motion === undefined) return;
  if (!motion || typeof motion !== "object" || Array.isArray(motion)) {
    throw new Error(`${label} must be an object`);
  }
  if (!MOTION_TYPES.has(motion.type)) {
    throw new Error(`${label}.type must be one of ${[...MOTION_TYPES].join(", ")}`);
  }
  requireString(motion.purpose, `${label}.purpose`);
  requireString(motion.reduced_motion_fallback, `${label}.reduced_motion_fallback`);
  if (motion.type === "transition") {
    validateTransition(motion.transition, `${label}.transition`);
  }
  if (motion.type === "step_reveal") {
    if (!Array.isArray(slide.body)) {
      throw new Error(`${label}: step_reveal requires slide.body to be an array`);
    }
  }
}

function validateTransition(transition, label) {
  requireString(transition, label);
  if (!/^[a-z][a-z0-9-]*(?:\s+(?:0?\.\d+|[1-4](?:\.\d+)?)s)?$/i.test(transition)) {
    throw new Error(`${label} must be a simple Marp transition name, optionally with 0-4s duration`);
  }
}

function validatePanel(panel, label) {
  if (typeof panel === "string") {
    requireString(panel, label);
    if (panel.length > BODY_ITEM_MAX) throw new Error(`${label} is too long`);
    return;
  }
  if (!panel || typeof panel !== "object" || Array.isArray(panel)) {
    throw new Error(`${label} must be a string or object`);
  }
  if (panel.title !== undefined) {
    requireString(panel.title, `${label}.title`);
    if (panel.title.length > 64) throw new Error(`${label}.title is too long`);
  }
  validateBody(panel.body, `${label}.body`);
}

function validateBody(body, label, { optional = false } = {}) {
  if (body === undefined && optional) return;
  if (typeof body === "string") {
    requireString(body, label);
    if (body.length > BODY_ITEM_MAX) throw new Error(`${label} is too long`);
    return;
  }
  if (!Array.isArray(body) || body.length === 0) {
    throw new Error(`${label} must be a non-empty string or array`);
  }
  if (body.length > BODY_ITEMS_MAX) {
    throw new Error(`${label} has too many items for a readable slide`);
  }
  for (const [index, item] of body.entries()) {
    requireString(item, `${label}[${index}]`);
    if (item.length > BODY_ITEM_MAX) {
      throw new Error(`${label}[${index}] is too long`);
    }
  }
}

function validateSpeakerNotes(notes, label) {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) {
    throw new Error(`${label} must be an object`);
  }
  requireString(notes.key_message, `${label}.key_message`);
  requireNonEmptyStringArray(notes.talk_track, `${label}.talk_track`, TALK_TRACK_ITEMS_MAX);
  for (const field of ["transition_in", "transition_out"]) {
    if (notes[field] !== undefined) {
      requireString(notes[field], `${label}.${field}`);
      if (notes[field].length > 320) throw new Error(`${label}.${field} is too long`);
    }
  }
  if (notes.timing_seconds !== undefined) {
    if (!Number.isInteger(notes.timing_seconds) || notes.timing_seconds < 10 || notes.timing_seconds > 600) {
      throw new Error(`${label}.timing_seconds must be an integer from 10 to 600`);
    }
  }
  validateOptionalStringArray(notes.delivery_cues, `${label}.delivery_cues`, 6);
  validateOptionalStringArray(notes.avoid_saying, `${label}.avoid_saying`, 6);
  validateOptionalStringArray(notes.claim_ids, `${label}.claim_ids`, 6);

  const normalized = flattenText(notes).join("\n");
  if (normalized.length > NOTES_MAX) {
    throw new Error(`${label} is too long; keep notes concise and human-editable`);
  }
}

function validateTable(table, label) {
  if (!table || typeof table !== "object" || Array.isArray(table)) {
    throw new Error(`${label} must be an object`);
  }
  if (!Array.isArray(table.headers) || table.headers.length === 0) {
    throw new Error(`${label}.headers must be a non-empty array`);
  }
  if (table.headers.length > TABLE_COLS_MAX) {
    throw new Error(`${label} has too many columns for a presentation slide`);
  }
  for (const [index, header] of table.headers.entries()) {
    requireString(header, `${label}.headers[${index}]`);
  }
  if (!Array.isArray(table.rows) || table.rows.length === 0) {
    throw new Error(`${label}.rows must be a non-empty array`);
  }
  if (table.rows.length > TABLE_ROWS_MAX) {
    throw new Error(`${label} has too many rows for a presentation slide`);
  }
  for (const [rowIndex, row] of table.rows.entries()) {
    if (!Array.isArray(row) || row.length !== table.headers.length) {
      throw new Error(`${label}.rows[${rowIndex}] must match the header count`);
    }
    for (const [cellIndex, cell] of row.entries()) {
      requireString(cell, `${label}.rows[${rowIndex}][${cellIndex}]`);
    }
  }
}

function validateCode(code, label) {
  if (!code || typeof code !== "object" || Array.isArray(code)) {
    throw new Error(`${label} must be an object`);
  }
  requireString(code.language, `${label}.language`);
  requireString(code.source, `${label}.source`);
  if (code.source.length > CODE_CHARS_MAX || code.source.split(/\r?\n/).length > CODE_LINES_MAX) {
    throw new Error(`${label}.source is too long for one slide`);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function requireNonEmptyStringArray(value, label, maxItems) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array`);
  }
  if (value.length > maxItems) {
    throw new Error(`${label} has too many items`);
  }
  for (const [index, item] of value.entries()) {
    requireString(item, `${label}[${index}]`);
  }
}

function validateOptionalStringArray(value, label, maxItems) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array when present`);
  }
  if (value.length > maxItems) {
    throw new Error(`${label} has too many items`);
  }
  for (const [index, item] of value.entries()) {
    requireString(item, `${label}[${index}]`);
  }
}

function flattenText(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenText);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenText);
  }
  return [];
}
