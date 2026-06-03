import { spawnSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const threshold = readNumberOption("--threshold");
const minSlideScore = readNumberOption("--min-slide-score");
const writeHistory = process.argv.includes("--write-history");

if (!target) {
  console.error("Usage: node scripts/score-deck.mjs <project-dir> [--threshold 88] [--min-slide-score 75] [--write-history]");
  process.exit(2);
}

const projectDir = path.resolve(target);
const steps = [];

try {
  runStep("validate quality rubric", "scripts/validate-quality-rubric.mjs", [projectDir]);
  runStep("validate slide scorecard", "scripts/validate-slide-scorecard.mjs", [projectDir]);
  runStep("validate repair plan", "scripts/validate-repair-plan.mjs", [projectDir]);

  const [rubric, scorecard, repairPlan] = await Promise.all([
    readJson(path.join(projectDir, "work", "quality-rubric.json")),
    readJson(path.join(projectDir, "qa", "slide-scorecard.json")),
    readJson(path.join(projectDir, "qa", "repair-plan.json"))
  ]);

  if (threshold !== null && threshold < rubric.target.overall_score) {
    throw new Error(`--threshold cannot lower the rubric target (${rubric.target.overall_score}); use ${rubric.target.overall_score} or higher`);
  }
  if (minSlideScore !== null && minSlideScore < rubric.target.minimum_slide_score) {
    throw new Error(`--min-slide-score cannot lower the rubric minimum (${rubric.target.minimum_slide_score}); use ${rubric.target.minimum_slide_score} or higher`);
  }

  const overallTarget = threshold ?? scorecard.target.overall_score ?? rubric.target.overall_score;
  const slideTarget = minSlideScore ?? scorecard.target.minimum_slide_score ?? rubric.target.minimum_slide_score;
  const scoreMeetsTarget = scorecard.overall_score >= overallTarget
    && scorecard.minimum_slide_score >= slideTarget
    && (scorecard.verdict === "ready_for_human_review" || scorecard.verdict === "ready_to_present");

  const report = {
    project: path.relative(repoRoot, projectDir),
    status: "hard_gates_passed",
    quality_score_status: scoreMeetsTarget ? "meets_target" : "below_target",
    overall_score: scorecard.overall_score,
    minimum_slide_score: scorecard.minimum_slide_score,
    target: {
      overall_score: overallTarget,
      minimum_slide_score: slideTarget
    },
    verdict: scorecard.verdict,
    note: "Numeric scores are agent-authored review signals. They guide repair but do not prove slide quality.",
    next_step: scoreMeetsTarget
      ? "Hard gates pass and the self-assessed score meets the target. Continue with human review or export QA."
      : describeNext(scorecard, repairPlan),
    steps
  };

  if (writeHistory) await updateHistory(projectDir, rubric, scorecard, repairPlan, report);
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function describeNext(scorecard, repairPlan) {
  const firstRepair = repairPlan.repairs?.[0];
  if (firstRepair) {
    return `Repair ${firstRepair.artifact}: ${firstRepair.action}`;
  }
  if (scorecard.role_reviews?.researcher?.source_coverage !== "sufficient") {
    return "Researcher review says evidence is not sufficient. Resolve source gaps before polishing.";
  }
  return "Repair the lowest scoring dimension or slide, then re-render and re-score.";
}

async function updateHistory(projectDir, rubric, scorecard, repairPlan, report) {
  const historyPath = path.join(projectDir, "qa", "score-history.json");
  let history = {
    version: 1,
    deck_goal: scorecard.deck_goal,
    target: rubric.target,
    iterations: []
  };
  try {
    history = JSON.parse(await readFile(historyPath, "utf8"));
  } catch {
    // First run creates the history file.
  }
  history.iterations = history.iterations.filter((item) => item.iteration !== scorecard.iteration);
  history.iterations.push({
    iteration: scorecard.iteration,
    scored_at: scorecard.scored_at,
    overall_score: scorecard.overall_score,
    minimum_slide_score: scorecard.minimum_slide_score,
    verdict: scorecard.verdict,
    status: report.status,
    scorecard_path: "qa/slide-scorecard.json",
    repair_plan_path: "qa/repair-plan.json",
    artifact_sha256: scorecard.validated_artifact.sha256,
    repair_count: repairPlan.repairs.length
  });
  history.iterations.sort((left, right) => left.iteration - right.iteration);
  await mkdir(path.join(projectDir, "qa"), { recursive: true });
  await writeFile(historyPath, JSON.stringify(history, null, 2) + "\n");
}

function runStep(name, script, args) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, script), ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  steps.push({
    name,
    script,
    status: result.status === 0 ? "pass" : "fail",
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  });
  if (result.status !== 0) {
    throw new Error(`${name} failed\n${result.stdout}${result.stderr}`);
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function readNumberOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new Error(`${name} must be an integer between 0 and 100`);
  }
  return value;
}
