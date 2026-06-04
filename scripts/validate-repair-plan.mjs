import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
const STATUSES = new Set(["open", "in_progress", "complete", "blocked"]);
const PRIORITIES = new Set(["low", "medium", "high", "blocker"]);
const OWNERS = new Set(["researcher", "story_strategist", "designer", "critic", "repairer", "presenter"]);
const ARTIFACTS = new Set([
  "input/brief.md",
  "work/source-map.md",
  "work/claim-ledger.json",
  "work/audience-model.json",
  "work/story-spine.json",
  "work/content-priority.md",
  "work/design-contract.json",
  "work/quality-rubric.json",
  "work/slide-specs.json",
  "work/review-log.json",
  "qa/slide-scorecard.json",
  "deck/index.html"
]);

if (!target) {
  console.error("Usage: node scripts/validate-repair-plan.mjs <project-dir|repair-plan.json>");
  process.exit(2);
}

try {
  const paths = await resolveRepairPaths(target);
  const [repairPlan, scorecard, slideSpecs] = await Promise.all([
    readJson(paths.repairPlanPath),
    readJson(paths.scorecardPath),
    readJson(paths.slideSpecsPath)
  ]);
  validateRepairPlan(repairPlan, scorecard, slideSpecs, paths.repairPlanPath);
  console.log(`repair plan valid: ${paths.repairPlanPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveRepairPaths(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  const projectDir = info.isDirectory() ? resolved : path.dirname(path.dirname(resolved));
  return {
    projectDir,
    repairPlanPath: info.isDirectory() ? path.join(resolved, "qa", "repair-plan.json") : resolved,
    scorecardPath: path.join(projectDir, "qa", "slide-scorecard.json"),
    slideSpecsPath: path.join(projectDir, "work", "slide-specs.json")
  };
}

function validateRepairPlan(plan, scorecard, slideSpecs, planPath) {
  const label = `${planPath}: repair plan`;
  requireObject(plan, label);
  if (plan.version !== 1) throw new Error(`${label}.version must be 1`);
  requireInteger(plan.iteration, `${label}.iteration`, { min: 1, max: 10 });
  if (plan.iteration !== scorecard.iteration) {
    throw new Error(`${label}.iteration must match slide-scorecard iteration`);
  }
  if (!STATUSES.has(plan.status)) {
    throw new Error(`${label}.status must be one of ${[...STATUSES].join(", ")}`);
  }
  requireString(plan.strategy, `${label}.strategy`);
  requireObject(plan.target, `${label}.target`);
  requireScore(plan.target.overall_score, `${label}.target.overall_score`);
  requireScore(plan.target.minimum_slide_score, `${label}.target.minimum_slide_score`);
  requireObject(plan.source_scorecard, `${label}.source_scorecard`);
  requireString(plan.source_scorecard.path, `${label}.source_scorecard.path`);
  requireScore(plan.source_scorecard.overall_score, `${label}.source_scorecard.overall_score`);
  requireScore(plan.source_scorecard.minimum_slide_score, `${label}.source_scorecard.minimum_slide_score`);
  if (plan.source_scorecard.overall_score !== scorecard.overall_score) {
    throw new Error(`${label}.source_scorecard.overall_score must match slide-scorecard`);
  }

  requireArray(plan.blocked_on, `${label}.blocked_on`, { max: 20 });
  const needsRepair = scorecard.overall_score < plan.target.overall_score
    || scorecard.minimum_slide_score < plan.target.minimum_slide_score
    || scorecard.verdict === "needs_repair";
  requireArray(plan.repairs, `${label}.repairs`, { min: needsRepair && plan.status !== "blocked" ? 1 : 0, max: 40 });

  const slideIds = new Set(slideSpecs.slides.map((slide) => slide.slide_id));
  const repairIds = new Set();
  for (const [index, repair] of plan.repairs.entries()) {
    const repairLabel = `${label}.repairs[${index}]`;
    requireObject(repair, repairLabel);
    requireId(repair.repair_id, `${repairLabel}.repair_id`);
    if (repairIds.has(repair.repair_id)) throw new Error(`${repairLabel}.repair_id duplicates ${repair.repair_id}`);
    repairIds.add(repair.repair_id);
    if (!PRIORITIES.has(repair.priority)) {
      throw new Error(`${repairLabel}.priority must be one of ${[...PRIORITIES].join(", ")}`);
    }
    if (!OWNERS.has(repair.owner)) {
      throw new Error(`${repairLabel}.owner must be one of ${[...OWNERS].join(", ")}`);
    }
    if (!ARTIFACTS.has(repair.artifact)) {
      throw new Error(`${repairLabel}.artifact must be one of ${[...ARTIFACTS].join(", ")}`);
    }
    requireArray(repair.slide_ids, `${repairLabel}.slide_ids`, { max: slideIds.size });
    for (const [slideIndex, slideId] of repair.slide_ids.entries()) {
      requireId(slideId, `${repairLabel}.slide_ids[${slideIndex}]`);
      if (!slideIds.has(slideId)) throw new Error(`${repairLabel}.slide_ids[${slideIndex}] is not in slide-specs.json`);
    }
    requireString(repair.problem, `${repairLabel}.problem`);
    requireString(repair.action, `${repairLabel}.action`);
    requireString(repair.success_criteria, `${repairLabel}.success_criteria`);
    requireBoolean(repair.requires_research, `${repairLabel}.requires_research`);
    requireBoolean(repair.touches_claims, `${repairLabel}.touches_claims`);
    requireInteger(repair.expected_score_lift, `${repairLabel}.expected_score_lift`, { min: 0, max: 25 });
    requireStringArray(repair.validation_commands, `${repairLabel}.validation_commands`, { min: 1, max: 8 });
    if (repair.touches_claims && !repair.validation_commands.some((command) => /claim|ledger|source/i.test(command))) {
      throw new Error(`${repairLabel}.validation_commands must include a source/claim check when touches_claims is true`);
    }
  }

  if (plan.status === "complete" && needsRepair) {
    throw new Error(`${label}.status cannot be complete while scorecard still needs repair`);
  }
  if (plan.status === "blocked" && plan.blocked_on.length === 0) {
    throw new Error(`${label}.blocked_on must explain blocked status`);
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
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

function requireBoolean(value, label) {
  if (typeof value !== "boolean") throw new Error(`${label} must be a boolean`);
}

function requireInteger(value, label, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isInteger(value)) throw new Error(`${label} must be an integer`);
  if (value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}`);
}

function requireScore(value, label) {
  requireInteger(value, label, { min: 0, max: 100 });
}
