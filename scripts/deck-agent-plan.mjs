import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const write = process.argv.includes("--write");

if (!target) {
  console.error("Usage: node scripts/deck-agent-plan.mjs <project-dir> [--write]");
  process.exit(2);
}

const projectDir = path.resolve(target);

try {
  const workflow = runJson("scripts/deck-workflow-status.mjs", [projectDir]);
  const renderReady = runJson("scripts/deck-workflow-status.mjs", [projectDir, "--render-ready"]);
  const quality = runJson("scripts/deck-workflow-status.mjs", [projectDir, "--quality"]);
  const heuristic = runJson("scripts/heuristic-status.mjs", [projectDir]);
  const plan = buildPlan({ workflow, renderReady, quality, heuristic });

  if (write) {
    await mkdir(path.join(projectDir, "qa"), { recursive: true });
    await writeFile(path.join(projectDir, "qa", "deck-agent-plan.json"), JSON.stringify(plan, null, 2) + "\n");
  }

  console.log(JSON.stringify(plan, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function buildPlan({ workflow, renderReady, quality, heuristic }) {
  const problem = firstProblem(renderReady) || firstProblem(workflow) || firstProblem(quality);
  const project = workflow.project || path.relative(repoRoot, projectDir);
  const action = problem ? actionFor(problem, project) : finalReviewAction(project);
  const heuristicNext = heuristic?.registry?.next || "Check review logs after the next human or browser critique.";

  return {
    project,
    status: problem ? "needs_agent_action" : "ready_for_review_or_export",
    active_module: action.module,
    next_actions: [action],
    context_to_load: contextFor(action.module),
    verification: action.verify,
    heuristic_next: heuristicNext,
    command_hints: {
      workflow_status: `npm run workflow:status -- ${project}`,
      heuristic_status: `npm run heuristic:status -- ${project}`,
      write_this_plan: `npm run deck:agent -- ${project} --write`
    },
    guardrails: [
      "Edit the smallest artifact that resolves the active failure.",
      "Do not add unsupported slide claims.",
      "Run the verification command before calling the deck improved.",
      "Record repeated failures in review-log or heuristic-registry."
    ]
  };
}

function firstProblem(report) {
  return report?.checks?.find((check) => check.status !== "pass") || null;
}

function actionFor(problem, project) {
  const module = moduleFor(problem);
  const base = {
    module,
    artifact: problem.path,
    reason: problem.message || `Repair ${problem.path} for ${problem.phase}.`
  };

  if (problem.path === "input/brief.md") {
    return {
      ...base,
      instruction: "Write the user's deck goal, audience, source-handling mode, output format, time limit, style preference and must-include items.",
      command: null,
      verify: `npm run workflow:status -- ${project}`
    };
  }

  if (problem.path === "work/intake-brief.md" || problem.path === "work/deck-plan.md") {
    return {
      ...base,
      instruction: "Run planning mode: define audience shift, proof spine, research plan, slide logic, visual direction and QA gates.",
      command: null,
      verify: `npm run workflow:status -- ${project}`
    };
  }

  if (problem.path === "work/source-map.md" || problem.path === "work/claim-ledger.json") {
    return {
      ...base,
      instruction: "Research or inspect provided sources, then create source map and claim ledger before writing factual slides.",
      command: `npm run validate:ledger -- ${project}`,
      verify: `npm run validate:ledger -- ${project}`
    };
  }

  if (problem.path === "work/slide-specs.json") {
    return {
      ...base,
      instruction: "Repair slide specs so every slide has a job, claim refs, visual aid, speaker note and validation expectations.",
      command: `npm run validate:slides -- ${project}`,
      verify: `npm run validate:slides -- ${project}`
    };
  }

  if (problem.path === "work/design-contract.json") {
    return {
      ...base,
      instruction: "Choose a coherent visual system, layout rules, typography, color tokens and density limits.",
      command: `npm run validate:design -- ${project}`,
      verify: `npm run validate:design -- ${project}`
    };
  }

  if (problem.path === "deck/index.html") {
    return {
      ...base,
      instruction: "Render the deck from current artifacts.",
      command: `npm run deck:build -- ${project} --render`,
      verify: `npm run deck:build -- ${project} --render`
    };
  }

  if (problem.path === "qa/browser-qa.json") {
    return {
      ...base,
      instruction: "Rerun browser QA and inspect high-risk screenshots if the deck is visually important.",
      command: `npm run qa:browser -- ${project}`,
      verify: `npm run qa:browser -- ${project}`
    };
  }

  if (problem.path === "qa/slide-scorecard.json" || problem.path === "qa/repair-plan.json") {
    return {
      ...base,
      instruction: "Create or repair quality scorecard and repair plan, then run the quality gate.",
      command: `npm run deck:iterate -- ${project} --threshold 88`,
      verify: `npm run deck:score -- ${project}`
    };
  }

  return {
    ...base,
    instruction: `Repair ${problem.path} for the ${problem.phase} phase.`,
    command: `npm run workflow:status -- ${project}`,
    verify: `npm run workflow:status -- ${project}`
  };
}

function finalReviewAction(project) {
  return {
    module: "quality-loop",
    artifact: "qa/",
    reason: "All known workflow checks pass.",
    instruction: "Perform human or agent review, then export or publish. If review finds a repeated failure, promote it into the heuristic registry.",
    command: `npm run deck:iterate -- ${project} --threshold 88`,
    verify: `npm run heuristic:status -- ${project}`
  };
}

function moduleFor(problem) {
  const phaseMap = {
    intake: "intake",
    planning: "planning",
    source_review: "source-backed-research",
    evidence: "source-backed-research",
    evidence_integrity: "source-backed-research",
    architecture_evidence: "source-backed-research",
    audience: "planning",
    story: "planning",
    content_priority: "content-priority",
    visual_plan: "visual-aid-selection",
    design: "visual-style-system",
    quality_target: "quality-loop",
    render_plan: "rendering",
    rendered: "rendering",
    qa: "browser-visual-qa",
    human_review: "quality-loop",
    quality_score: "quality-loop",
    quality_repair: "quality-loop"
  };
  return phaseMap[problem.phase] || "heuristic-system";
}

function contextFor(module) {
  const common = ["docs/skill-bank.md", "skills/slide-generator/SKILL.md"];
  const refs = {
    intake: ["skills/slide-generator/references/intake-and-one-shot.md"],
    planning: ["skills/slide-generator/references/planning-mode.md", "skills/slide-generator/references/audience-and-presenter-support.md"],
    "source-backed-research": ["skills/slide-generator/references/source-grounding.md", "skills/slide-generator/references/research-coverage.md"],
    "content-priority": ["skills/slide-generator/references/content-prioritization.md"],
    "visual-aid-selection": ["skills/slide-generator/references/visual-aid-catalog.md"],
    "visual-style-system": ["skills/slide-generator/references/visual-style-system.md", "skills/slide-generator/references/design-contract.md"],
    rendering: ["skills/slide-generator/references/frontend-rendering.md"],
    "browser-visual-qa": ["skills/slide-generator/references/design-quality-gates.md", "skills/slide-generator/references/frontend-rendering.md"],
    "quality-loop": ["skills/slide-generator/references/quality-score-loop.md"],
    "heuristic-system": ["docs/heuristic-slide-system.md", "docs/heuristic-registry.md"]
  };
  return [...common, ...(refs[module] || refs["heuristic-system"])];
}

function runJson(script, args) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, script), ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const output = result.stdout.trim();
  if (!output) {
    throw new Error(`${script} did not produce JSON\n${result.stderr}`);
  }
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`${script} produced invalid JSON: ${error.message}\n${output}`);
  }
}
