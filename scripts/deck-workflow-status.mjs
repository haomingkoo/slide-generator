import { spawnSync } from "node:child_process";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const renderReady = process.argv.includes("--render-ready");
const agentic = process.argv.includes("--agentic");
const strict = process.argv.includes("--strict") || renderReady || agentic;

if (!target) {
  console.error("Usage: node scripts/deck-workflow-status.mjs <project-dir> [--render-ready|--agentic|--strict]");
  process.exit(2);
}

const projectDir = path.resolve(target);

const checks = [
  { path: "input/brief.md", phase: "intake" },
  { path: "work/intake-brief.md", phase: "intake" },
  { path: "work/source-map.md", phase: "source_review" },
  { path: "work/claim-ledger.json", phase: "evidence", script: "scripts/validate-claim-ledger.mjs", renderRequired: true },
  { path: "work/audience-model.json", phase: "audience", script: "scripts/validate-audience-model.mjs", renderRequired: true },
  { path: "work/story-spine.json", phase: "story", script: "scripts/validate-story-spine.mjs", renderRequired: true },
  { path: "work/slide-sorter.md", phase: "story" },
  { path: "work/content-priority.md", phase: "content_priority" },
  { path: "work/visual-aid-plan.json", phase: "visual_plan" },
  { path: "work/design-contract.json", phase: "design", script: "scripts/validate-design-contract.mjs", renderRequired: true },
  { path: "work/slide-specs.json", phase: "render_plan", script: "scripts/validate-slide-specs.mjs", renderRequired: true },
  { path: "deck/index.html", phase: "rendered" },
  { path: "qa/browser-qa.json", phase: "qa", validateJson: validateBrowserQa },
  { path: "work/review-log.json", phase: "human_review", script: "scripts/validate-review-log.mjs" }
];

try {
  await stat(projectDir);
  const results = [];
  for (const check of checks) {
    results.push(await runCheck(check));
  }

  const failed = results.filter((item) => item.status === "fail");
  const missing = results.filter((item) => item.status === "missing");
  const requiredMissing = renderReady
    ? results.filter((item) => item.renderRequired && item.status !== "pass")
    : agentic
      ? results.filter((item) => item.status !== "pass")
      : [];
  const relevantFailures = renderReady
    ? requiredMissing
    : agentic
      ? results.filter((item) => item.status !== "pass")
      : results.filter((item) => item.status !== "pass");
  const next = relevantFailures[0];
  const status = renderReady
    ? requiredMissing.length === 0 ? "pass" : "fail"
    : failed.length === 0 && requiredMissing.length === 0 ? "pass" : "fail";

  const report = {
    project: path.relative(repoRoot, projectDir),
    mode: renderReady ? "render-ready" : agentic ? "agentic" : "status",
    status,
    next_step: next ? describeNext(next) : describePass(renderReady, agentic),
    checks: results,
    summary: {
      passed: results.filter((item) => item.status === "pass").length,
      missing: missing.length,
      failed: failed.length
    }
  };

  console.log(JSON.stringify(report, null, 2));
  if (strict && report.status !== "pass") process.exit(1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function runCheck(check) {
  const absolutePath = path.join(projectDir, check.path);
  const exists = await fileExists(absolutePath);
  if (!exists) {
    return { ...publicCheck(check), status: "missing", message: `${check.path} is missing` };
  }
  if (check.script) {
    const result = spawnSync(process.execPath, [path.join(repoRoot, check.script), projectDir], {
      cwd: repoRoot,
      encoding: "utf8"
    });
    if (result.status !== 0) {
      return {
        ...publicCheck(check),
        status: "fail",
        message: `${check.script} failed`,
        stderr: result.stderr.trim(),
        stdout: result.stdout.trim()
      };
    }
  }
  if (check.validateJson) {
    const validation = await check.validateJson(absolutePath);
    if (validation) return { ...publicCheck(check), status: "fail", message: validation };
  }
  return { ...publicCheck(check), status: "pass" };
}

function publicCheck(check) {
  return {
    path: check.path,
    phase: check.phase,
    render_required: check.renderRequired === true
  };
}

function describeNext(check) {
  if (check.status === "missing") return `Create ${check.path} for the ${check.phase} phase.`;
  return `Repair ${check.path} for the ${check.phase} phase: ${check.message}`;
}

function describePass(isRenderReady, isAgentic) {
  if (isRenderReady) return "Render HTML with npm run render:marp -- <project-dir> --html, then run browser QA.";
  if (isAgentic) return "All known workflow checks passed.";
  return "All known workflow checks passed.";
}

async function validateBrowserQa(filePath) {
  const report = JSON.parse(await readFile(filePath, "utf8"));
  if (report.status !== "pass") return `browser QA status is ${report.status}`;
  return null;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
