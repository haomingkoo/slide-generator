import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
const DECISIONS = new Set(["accept", "copy_edit", "visual_edit", "claim_edit", "story_edit", "remove_or_split"]);

if (!target) {
  console.error("Usage: node scripts/validate-review-log.mjs <project-dir|review-log.json>");
  process.exit(2);
}

try {
  const reviewLogPath = await resolveReviewLogPath(target);
  const reviewLog = JSON.parse(await readFile(reviewLogPath, "utf8"));
  validateReviewLog(reviewLog, reviewLogPath);
  console.log(`review log valid: ${reviewLogPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveReviewLogPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  return info.isDirectory() ? path.join(resolved, "work", "review-log.json") : resolved;
}

function validateReviewLog(log, logPath) {
  requireObject(log, `${logPath}: review log`);
  requireString(log.deck_goal, `${logPath}: deck_goal`);
  requireArray(log.sessions, `${logPath}: sessions`, { min: 1, max: 50 });
  for (const [sessionIndex, session] of log.sessions.entries()) {
    const label = `${logPath}: sessions[${sessionIndex}]`;
    requireObject(session, label);
    requireString(session.date, `${label}.date`);
    requireString(session.summary, `${label}.summary`);
    requireArray(session.slide_reviews, `${label}.slide_reviews`, { max: 100 });
    for (const [reviewIndex, review] of session.slide_reviews.entries()) {
      const reviewLabel = `${label}.slide_reviews[${reviewIndex}]`;
      requireObject(review, reviewLabel);
      requireId(review.slide_id, `${reviewLabel}.slide_id`);
      if (!DECISIONS.has(review.decision)) {
        throw new Error(`${reviewLabel}.decision must be one of ${[...DECISIONS].join(", ")}`);
      }
      requireString(review.note, `${reviewLabel}.note`);
      if (review.repair_target !== undefined) {
        requireString(review.repair_target, `${reviewLabel}.repair_target`);
      }
    }
    if (session.recurring_issues !== undefined) {
      requireStringArray(session.recurring_issues, `${label}.recurring_issues`, { max: 20 });
    }
    if (session.new_rules !== undefined) {
      requireStringArray(session.new_rules, `${label}.new_rules`, { max: 20 });
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
