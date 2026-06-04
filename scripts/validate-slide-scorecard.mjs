import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileFingerprint, fingerprintsMatch } from "./artifact-utils.mjs";
import { validateRubric } from "./validate-quality-rubric.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const VERDICTS = new Set(["needs_repair", "ready_for_human_review", "ready_to_present", "blocked_on_evidence", "scoped_draft"]);
const GATE_STATUSES = new Set(["pass", "fail", "warn"]);
const COVERAGE = new Set(["sufficient", "thin", "missing", "stale", "conflicted", "not_requested"]);
const REPAIR_PRIORITIES = new Set(["none", "low", "medium", "high", "blocker"]);
const SLIDE_DECISIONS = new Set(["accept", "repair", "reject", "move_to_appendix"]);
const ISSUE_SEVERITIES = new Set(["blocker", "quality", "polish"]);
const ISSUE_CATEGORIES = new Set(["story", "visual", "evidence", "delivery", "audience", "research", "accessibility", "export"]);

if (!target) {
  console.error("Usage: node scripts/validate-slide-scorecard.mjs <project-dir|slide-scorecard.json>");
  process.exit(2);
}

try {
  const paths = await resolveScorecardPaths(target);
  const [scorecard, rubric, slideSpecs] = await Promise.all([
    readJson(paths.scorecardPath),
    readJson(paths.rubricPath),
    readJson(paths.slideSpecsPath)
  ]);
  validateRubric(rubric, paths.rubricPath);
  await validateScorecard(scorecard, rubric, slideSpecs, paths);
  console.log(`slide scorecard valid: ${paths.scorecardPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolveScorecardPaths(targetPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  const projectDir = info.isDirectory() ? resolved : path.dirname(path.dirname(resolved));
  return {
    projectDir,
    scorecardPath: info.isDirectory() ? path.join(resolved, "qa", "slide-scorecard.json") : resolved,
    rubricPath: path.join(projectDir, "work", "quality-rubric.json"),
    slideSpecsPath: path.join(projectDir, "work", "slide-specs.json"),
    htmlPath: path.join(projectDir, "deck", "index.html")
  };
}

async function validateScorecard(scorecard, rubric, slideSpecs, paths) {
  const label = `${paths.scorecardPath}: scorecard`;
  requireObject(scorecard, label);
  if (scorecard.version !== 1) throw new Error(`${label}.version must be 1`);
  requireInteger(scorecard.iteration, `${label}.iteration`, { min: 1, max: rubric.target.max_repair_iterations });
  requireString(scorecard.scored_at, `${label}.scored_at`);
  requireString(scorecard.deck_goal, `${label}.deck_goal`);
  if (!VERDICTS.has(scorecard.verdict)) {
    throw new Error(`${label}.verdict must be one of ${[...VERDICTS].join(", ")}`);
  }
  requireScore(scorecard.overall_score, `${label}.overall_score`);
  requireScore(scorecard.minimum_slide_score, `${label}.minimum_slide_score`);

  requireObject(scorecard.target, `${label}.target`);
  requireScore(scorecard.target.overall_score, `${label}.target.overall_score`);
  requireScore(scorecard.target.minimum_slide_score, `${label}.target.minimum_slide_score`);
  if (scorecard.target.overall_score < rubric.target.overall_score) {
    throw new Error(`${label}.target.overall_score cannot be lower than rubric target`);
  }
  if (scorecard.target.minimum_slide_score < rubric.target.minimum_slide_score) {
    throw new Error(`${label}.target.minimum_slide_score cannot be lower than rubric minimum slide score`);
  }

  await validateArtifactFreshness(scorecard, paths);
  validateRoleReviews(scorecard.role_reviews, label);
  validateHardGates(scorecard.hard_gates, rubric, label, scorecard.verdict);
  validateDimensionScores(scorecard, rubric, label);
  validateSlideScores(scorecard, slideSpecs, label);
  validateSummary(scorecard.summary, label);
  validateVerdict(scorecard, rubric, label);
}

async function validateArtifactFreshness(scorecard, paths) {
  await stat(paths.htmlPath);
  requireObject(scorecard.validated_artifact, `${paths.scorecardPath}: validated_artifact`);
  const current = await fileFingerprint(paths.htmlPath, repoRoot);
  if (!fingerprintsMatch(scorecard.validated_artifact, current)) {
    throw new Error(`${paths.scorecardPath}: slide scorecard is stale for deck/index.html; expected ${scorecard.validated_artifact?.sha256 ?? "missing hash"}, current ${current.sha256}`);
  }
}

function validateRoleReviews(roleReviews, label) {
  requireObject(roleReviews, `${label}.role_reviews`);
  requireObject(roleReviews.researcher, `${label}.role_reviews.researcher`);
  if (!COVERAGE.has(roleReviews.researcher.source_coverage)) {
    throw new Error(`${label}.role_reviews.researcher.source_coverage must be one of ${[...COVERAGE].join(", ")}`);
  }
  requireString(roleReviews.researcher.summary, `${label}.role_reviews.researcher.summary`);
  requireStringArray(roleReviews.researcher.evidence_gaps, `${label}.role_reviews.researcher.evidence_gaps`, { max: 20 });

  for (const role of ["story_strategist", "designer", "critic"]) {
    requireObject(roleReviews[role], `${label}.role_reviews.${role}`);
    requireString(roleReviews[role].summary, `${label}.role_reviews.${role}.summary`);
    requireStringArray(roleReviews[role].top_risks, `${label}.role_reviews.${role}.top_risks`, { max: 20 });
  }
}

function validateHardGates(hardGates, rubric, label, verdict) {
  requireArray(hardGates, `${label}.hard_gates`, { min: rubric.hard_gates.length, max: 30 });
  const requiredGateIds = new Set(rubric.hard_gates.map((gate) => gate.id));
  const seen = new Set();
  let failed = false;
  for (const [index, gate] of hardGates.entries()) {
    const gateLabel = `${label}.hard_gates[${index}]`;
    requireObject(gate, gateLabel);
    requireId(gate.id, `${gateLabel}.id`);
    if (seen.has(gate.id)) throw new Error(`${gateLabel}.id duplicates ${gate.id}`);
    seen.add(gate.id);
    if (!requiredGateIds.has(gate.id)) throw new Error(`${gateLabel}.id is not in quality-rubric.json`);
    if (!GATE_STATUSES.has(gate.status)) {
      throw new Error(`${gateLabel}.status must be one of ${[...GATE_STATUSES].join(", ")}`);
    }
    requireString(gate.evidence, `${gateLabel}.evidence`);
    if (gate.status === "fail") failed = true;
  }
  for (const id of requiredGateIds) {
    if (!seen.has(id)) throw new Error(`${label}.hard_gates is missing ${id}`);
  }
  if (failed && (verdict === "ready_for_human_review" || verdict === "ready_to_present")) {
    throw new Error(`${label}.verdict cannot be ${verdict} while a hard gate fails`);
  }
}

function validateDimensionScores(scorecard, rubric, label) {
  requireArray(scorecard.dimension_scores, `${label}.dimension_scores`, { min: rubric.dimensions.length, max: rubric.dimensions.length });
  const dimensionMap = new Map(rubric.dimensions.map((dimension) => [dimension.id, dimension]));
  const seen = new Set();
  let weightedScore = 0;
  for (const [index, item] of scorecard.dimension_scores.entries()) {
    const itemLabel = `${label}.dimension_scores[${index}]`;
    requireObject(item, itemLabel);
    requireId(item.dimension_id, `${itemLabel}.dimension_id`);
    if (seen.has(item.dimension_id)) throw new Error(`${itemLabel}.dimension_id duplicates ${item.dimension_id}`);
    seen.add(item.dimension_id);
    const dimension = dimensionMap.get(item.dimension_id);
    if (!dimension) throw new Error(`${itemLabel}.dimension_id is not in quality-rubric.json`);
    requireScore(item.score, `${itemLabel}.score`);
    requireString(item.rationale, `${itemLabel}.rationale`);
    requireString(item.evidence, `${itemLabel}.evidence`);
    if (!REPAIR_PRIORITIES.has(item.repair_priority)) {
      throw new Error(`${itemLabel}.repair_priority must be one of ${[...REPAIR_PRIORITIES].join(", ")}`);
    }
    if (item.score < 80 && item.repair_priority === "none") {
      throw new Error(`${itemLabel}.repair_priority cannot be none when score is below 80`);
    }
    weightedScore += item.score * dimension.weight / 100;
  }
  for (const id of dimensionMap.keys()) {
    if (!seen.has(id)) throw new Error(`${label}.dimension_scores is missing ${id}`);
  }
  const expected = Math.round(weightedScore);
  if (Math.abs(expected - scorecard.overall_score) > 1) {
    throw new Error(`${label}.overall_score must match weighted dimension scores: expected about ${expected}, got ${scorecard.overall_score}`);
  }
}

function validateSlideScores(scorecard, slideSpecs, label) {
  requireObject(slideSpecs, `${label}: slide-specs`);
  requireArray(slideSpecs.slides, `${label}: slide-specs.slides`, { min: 1 });
  const slideIds = new Set(slideSpecs.slides.map((slide) => slide.slide_id));
  requireArray(scorecard.slide_scores, `${label}.slide_scores`, { min: slideIds.size, max: slideIds.size });
  const seen = new Set();
  let min = 100;
  for (const [index, item] of scorecard.slide_scores.entries()) {
    const itemLabel = `${label}.slide_scores[${index}]`;
    requireObject(item, itemLabel);
    requireId(item.slide_id, `${itemLabel}.slide_id`);
    if (!slideIds.has(item.slide_id)) throw new Error(`${itemLabel}.slide_id is not in slide-specs.json`);
    if (seen.has(item.slide_id)) throw new Error(`${itemLabel}.slide_id duplicates ${item.slide_id}`);
    seen.add(item.slide_id);
    requireScore(item.score, `${itemLabel}.score`);
    min = Math.min(min, item.score);
    if (!SLIDE_DECISIONS.has(item.decision)) {
      throw new Error(`${itemLabel}.decision must be one of ${[...SLIDE_DECISIONS].join(", ")}`);
    }
    requireStringArray(item.strengths, `${itemLabel}.strengths`, { min: 1, max: 8 });
    requireArray(item.issues, `${itemLabel}.issues`, { max: 12 });
    if ((item.score < scorecard.target.minimum_slide_score || item.decision !== "accept") && item.issues.length === 0) {
      throw new Error(`${itemLabel}.issues must explain low-scoring or non-accepted slides`);
    }
    for (const [issueIndex, issue] of item.issues.entries()) {
      const issueLabel = `${itemLabel}.issues[${issueIndex}]`;
      requireObject(issue, issueLabel);
      if (!ISSUE_SEVERITIES.has(issue.severity)) {
        throw new Error(`${issueLabel}.severity must be one of ${[...ISSUE_SEVERITIES].join(", ")}`);
      }
      if (!ISSUE_CATEGORIES.has(issue.category)) {
        throw new Error(`${issueLabel}.category must be one of ${[...ISSUE_CATEGORIES].join(", ")}`);
      }
      requireString(issue.note, `${issueLabel}.note`);
      if (issue.severity !== "polish" || item.score < scorecard.target.minimum_slide_score) {
        requireString(issue.repair_action, `${issueLabel}.repair_action`);
      }
    }
  }
  if (min !== scorecard.minimum_slide_score) {
    throw new Error(`${label}.minimum_slide_score must equal the lowest slide score: expected ${min}, got ${scorecard.minimum_slide_score}`);
  }
}

function validateSummary(summary, label) {
  requireObject(summary, `${label}.summary`);
  requireString(summary.score_rationale, `${label}.summary.score_rationale`);
  requireStringArray(summary.strongest_slides, `${label}.summary.strongest_slides`, { max: 10 });
  requireStringArray(summary.weakest_slides, `${label}.summary.weakest_slides`, { max: 10 });
  requireStringArray(summary.top_repairs, `${label}.summary.top_repairs`, { max: 10 });
}

function validateVerdict(scorecard, rubric, label) {
  const passesTarget = scorecard.overall_score >= scorecard.target.overall_score
    && scorecard.minimum_slide_score >= scorecard.target.minimum_slide_score;
  if (passesTarget && scorecard.verdict === "needs_repair") {
    throw new Error(`${label}.verdict should not be needs_repair when score thresholds pass`);
  }
  if (!passesTarget && (scorecard.verdict === "ready_for_human_review" || scorecard.verdict === "ready_to_present")) {
    throw new Error(`${label}.verdict cannot be ${scorecard.verdict} below score thresholds`);
  }
  if (scorecard.iteration > rubric.target.max_repair_iterations) {
    throw new Error(`${label}.iteration exceeds rubric max_repair_iterations`);
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

function requireInteger(value, label, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isInteger(value)) throw new Error(`${label} must be an integer`);
  if (value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}`);
}

function requireScore(value, label) {
  requireInteger(value, label, { min: 0, max: 100 });
}
