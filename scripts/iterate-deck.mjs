import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const threshold = readOption("--threshold");
const minSlideScore = readOption("--min-slide-score");

if (!target) {
  console.error("Usage: node scripts/iterate-deck.mjs <project-dir> [--threshold 88] [--min-slide-score 75]");
  process.exit(2);
}

const projectDir = path.resolve(target);
const steps = [];

try {
  runStep("build rendered deck", "scripts/build-deck.mjs", [projectDir, "--render"]);
  const scoreArgs = [projectDir];
  if (threshold) scoreArgs.push("--threshold", threshold);
  if (minSlideScore) scoreArgs.push("--min-slide-score", minSlideScore);
  runStep("validate quality score artifacts", "scripts/score-deck.mjs", scoreArgs);
  await writeIterationStatus("hard_gates_passed", "Build, browser QA, scorecard, and repair-plan validation passed. Numeric quality score remains advisory.");
  console.log(`deck hard gates and advisory score validated for ${path.relative(repoRoot, projectDir)}`);
} catch (error) {
  await writeIterationStatus("needs_repair", error.message).catch(() => {});
  console.error(error.message);
  process.exit(1);
}

async function writeIterationStatus(status, message) {
  await mkdir(path.join(projectDir, "qa"), { recursive: true });
  await writeFile(path.join(projectDir, "qa", "iteration-status.json"), JSON.stringify({
    project: path.relative(repoRoot, projectDir),
    generated_at: new Date().toISOString(),
    status,
    message,
    note: "This runner is deterministic. Claude/Codex performs critique and repair by updating artifacts, then reruns this command."
  }, null, 2) + "\n");
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

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}
