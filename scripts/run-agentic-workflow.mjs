import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const init = process.argv.includes("--init");
const render = process.argv.includes("--render");
const exportDeck = process.argv.includes("--export");

if (!target) {
  console.error("Usage: node scripts/run-agentic-workflow.mjs <project-dir> [--init] [--render] [--export]");
  process.exit(2);
}

const projectDir = path.resolve(target);
const steps = [];

try {
  if (init) runStep("create starter artifacts", "scripts/create-deck-artifacts.mjs", [projectDir]);
  runStep("check render readiness", "scripts/deck-workflow-status.mjs", [projectDir, "--render-ready"]);
  if (render || exportDeck) {
    runStep("render HTML", "scripts/render-marp.mjs", [projectDir, "--html"]);
    runStep("inspect rendered HTML", "scripts/inspect-rendered-marp.mjs", [projectDir]);
    runStep("run browser QA", "scripts/browser-qa-marp.mjs", [projectDir]);
  }
  if (exportDeck) {
    runStep("export PPTX/PDF", "scripts/export-marp.mjs", [projectDir, "--pptx", "--pdf"]);
    runStep("inspect exports", "scripts/inspect-exports.mjs", [projectDir]);
  }

  await mkdir(path.join(projectDir, "qa"), { recursive: true });
  await writeFile(path.join(projectDir, "qa", "agentic-run.json"), JSON.stringify({
    project: path.relative(repoRoot, projectDir),
    generated_at: new Date().toISOString(),
    mode: { init, render, export: exportDeck },
    status: "pass",
    steps
  }, null, 2) + "\n");
  console.log(`agentic workflow run passed for ${path.relative(repoRoot, projectDir)}`);
} catch (error) {
  await mkdir(path.join(projectDir, "qa"), { recursive: true }).catch(() => {});
  await writeFile(path.join(projectDir, "qa", "agentic-run.json"), JSON.stringify({
    project: path.relative(repoRoot, projectDir),
    generated_at: new Date().toISOString(),
    mode: { init, render, export: exportDeck },
    status: "fail",
    steps,
    error: error.message
  }, null, 2) + "\n").catch(() => {});
  console.error(error.message);
  process.exit(1);
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
