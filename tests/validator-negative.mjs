import { spawnSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileFingerprint } from "../scripts/artifact-utils.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "slides-generator-validator-"));

try {
  await expectFail("external source without url", async (project) => {
    const data = validProjectData();
    data.ledger[0].source = { kind: "paper", title: "No URL" };
    await writeProject(project, data);
    return ["scripts/validate-claim-ledger.mjs", project];
  });

  await expectFail("factual slide without claim ids", async (project) => {
    const data = validProjectData();
    data.slides.slides[0].claim_ids = [];
    data.slides.slides[0].title = "DPO is 3x faster than PPO";
    data.slides.slides[0].no_claims_reason = "title only";
    delete data.slides.slides[0].claim_use;
    await writeProject(project, data);
    return ["scripts/lint-claim-refs.mjs", project];
  });

  await expectFail("claim-free slide without reason", async (project) => {
    const data = validProjectData();
    data.slides.slides[0] = {
      slide_id: "slide_01",
      layout: "title",
      title: "Agenda",
      claim_ids: [],
      unsupported_claims: []
    };
    await writeProject(project, data);
    return ["scripts/lint-claim-refs.mjs", project];
  });

  await expectFail("claim-free content layout", async (project) => {
    const data = validProjectData();
    data.slides.slides[0] = {
      slide_id: "slide_01",
      layout: "narrative",
      title: "A calm operating principle",
      body: ["Short setup", "Simple next step"],
      claim_ids: [],
      unsupported_claims: [],
      no_claims_reason: "generic principle"
    };
    await writeProject(project, data);
    return ["scripts/lint-claim-refs.mjs", project];
  });

  await expectFail("claim use not allowed", async (project) => {
    const data = validProjectData();
    data.slides.slides[0].claim_use = "investor proof";
    await writeProject(project, data);
    return ["scripts/lint-claim-refs.mjs", project];
  });

  await expectFail("architecture absolute path evidence", async (project) => {
    const data = validProjectData();
    data.architecture.nodes[0].evidence = "/etc/hosts";
    await writeProject(project, data);
    return ["scripts/validate-arch-map.mjs", project];
  });

  await expectFail("architecture path traversal evidence", async (project) => {
    const data = validProjectData();
    data.architecture.nodes[0].evidence = "../../../../../README.md:1";
    await writeProject(project, data);
    return ["scripts/validate-arch-map.mjs", project];
  });

  await expectFail("architecture source prefix is not evidence", async (project) => {
    const data = validProjectData();
    data.architecture.nodes[0].evidence = "source: trust me";
    await writeProject(project, data);
    return ["scripts/validate-arch-map.mjs", project];
  });

  await expectFail("architecture trailing blank line reference", async (project) => {
    const data = validProjectData();
    data.architecture.nodes[0].evidence = "app/ui.py:4";
    await writeProject(project, data);
    return ["scripts/validate-arch-map.mjs", project];
  });

  await expectFail("render-ready rejects unknown claim refs", async (project) => {
    await copyRenderFixture(project);
    const slidesPath = path.join(project, "work", "slide-specs.json");
    const slides = JSON.parse(await readFile(slidesPath, "utf8"));
    slides.slides[2].claim_ids = ["claim_does_not_exist"];
    await writeFile(slidesPath, JSON.stringify(slides, null, 2));
    return ["scripts/deck-workflow-status.mjs", project, "--render-ready"];
  });

  await expectFail("render-ready validates architecture map when present", async (project) => {
    await copyRenderFixture(project);
    await mkdir(path.join(project, "input", "codebase", "app"), { recursive: true });
    await writeFile(path.join(project, "input", "codebase", "app", "ui.py"), "def build():\n    return True\n");
    await writeFile(path.join(project, "work", "architecture-map.json"), JSON.stringify({
      nodes: [
        {
          id: "frontend",
          label: "Frontend",
          evidence: "/etc/hosts"
        }
      ],
      edges: []
    }, null, 2));
    return ["scripts/deck-workflow-status.mjs", project, "--render-ready"];
  });

  await expectFail("workflow status rejects stale browser QA", async (project) => {
    await copyRenderFixture(project);
    await mkdir(path.join(project, "deck"), { recursive: true });
    await mkdir(path.join(project, "qa"), { recursive: true });
    await writeFile(path.join(project, "deck", "index.html"), "<!doctype html><title>changed deck</title>\n");
    await writeFile(path.join(project, "qa", "browser-qa.json"), JSON.stringify({
      status: "pass",
      validated_artifact: {
        path: "deck/index.html",
        sha256: "not-the-current-hash",
        bytes: 1,
        mtime_ms: 1
      }
    }, null, 2));
    return ["scripts/deck-workflow-status.mjs", project, "--strict"];
  });

  await expectFail("workflow status rejects stale slide specs after browser QA", async (project) => {
    await copyRenderFixture(project);
    runNode(["scripts/render-marp.mjs", project, "--html"]);
    runNode(["scripts/browser-qa-marp.mjs", project]);
    const slidesPath = path.join(project, "work", "slide-specs.json");
    const slides = JSON.parse(await readFile(slidesPath, "utf8"));
    slides.slides[0].title = "Mutated after QA";
    await writeFile(slidesPath, JSON.stringify(slides, null, 2));
    return ["scripts/deck-workflow-status.mjs", project, "--agentic"];
  });

  await expectFail("quality scorecard rejects stale rendered artifact", async (project) => {
    await copyRenderFixture(project);
    const scorecardPath = path.join(project, "qa", "slide-scorecard.json");
    const scorecard = JSON.parse(await readFile(scorecardPath, "utf8"));
    scorecard.validated_artifact.sha256 = "not-the-current-rendered-deck";
    await writeFile(scorecardPath, JSON.stringify(scorecard, null, 2));
    return ["scripts/validate-slide-scorecard.mjs", project];
  });

  await expectFail("quality scorecard rejects weighted score mismatch", async (project) => {
    await copyRenderFixture(project);
    const scorecardPath = path.join(project, "qa", "slide-scorecard.json");
    const scorecard = JSON.parse(await readFile(scorecardPath, "utf8"));
    scorecard.overall_score = 99;
    await writeFile(scorecardPath, JSON.stringify(scorecard, null, 2));
    return ["scripts/validate-slide-scorecard.mjs", project];
  });

  await expectFail("repair plan rejects missing repairs below target", async (project) => {
    await copyRenderFixture(project);
    const scorecardPath = path.join(project, "qa", "slide-scorecard.json");
    const repairPath = path.join(project, "qa", "repair-plan.json");
    const scorecard = JSON.parse(await readFile(scorecardPath, "utf8"));
    const repairPlan = JSON.parse(await readFile(repairPath, "utf8"));
    scorecard.overall_score = 70;
    scorecard.dimension_scores[0].score = 0;
    scorecard.dimension_scores[0].repair_priority = "blocker";
    scorecard.verdict = "needs_repair";
    repairPlan.status = "open";
    repairPlan.source_scorecard.overall_score = 70;
    repairPlan.repairs = [];
    await writeFile(scorecardPath, JSON.stringify(scorecard, null, 2));
    await writeFile(repairPath, JSON.stringify(repairPlan, null, 2));
    return ["scripts/validate-repair-plan.mjs", project];
  });

  await expectFail("score deck cannot lower rubric threshold", async (project) => {
    await copyRenderFixture(project);
    return ["scripts/score-deck.mjs", project, "--threshold", "0"];
  });

  await expectFail("ab scorer rejects zero min delta", async (project) => {
    await copyAbEvalFixture(project);
    return ["scripts/score-ab-eval.mjs", project, "--min-delta", "0"];
  });

  await expectFail("ab scorer rejects same run comparison", async (project) => {
    await copyAbEvalFixture(project);
    return ["scripts/score-ab-eval.mjs", project, "--baseline", "baseline-one-shot", "--candidate", "baseline-one-shot"];
  });

  await expectFail("create deck artifacts refuses outside repo target", async () => {
    const outsideRepo = path.join(tmpRoot, "outside-repo-target");
    return ["scripts/create-deck-artifacts.mjs", outsideRepo];
  });

  await expectNormalizedMarpFingerprint();

  console.log("negative validator fixtures rejected as expected");
} finally {
  await rm(tmpRoot, { recursive: true, force: true });
}

async function expectFail(name, buildCommand) {
  const project = path.join(tmpRoot, slug(name));
  await mkdir(project, { recursive: true });
  const args = await buildCommand(project);
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status === 0) {
    throw new Error(`${name}: expected failure, got success\n${result.stdout}`);
  }
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`${args.join(" ")} failed unexpectedly\n${result.stderr}\n${result.stdout}`);
  }
}

async function writeProject(project, data) {
  const workDir = path.join(project, "work");
  const codeDir = path.join(project, "input", "codebase", "app");
  await mkdir(workDir, { recursive: true });
  await mkdir(codeDir, { recursive: true });
  await writeFile(path.join(workDir, "claim-ledger.json"), JSON.stringify(data.ledger, null, 2));
  await writeFile(path.join(workDir, "slide-specs.json"), JSON.stringify(data.slides, null, 2));
  await writeFile(path.join(workDir, "architecture-map.json"), JSON.stringify(data.architecture, null, 2));
  await writeFile(path.join(codeDir, "ui.py"), "def ask_backend(question: str) -> dict:\n    payload = {\"question\": question}\n    return payload\n");
}

async function copyRenderFixture(project) {
  await cp(path.join(repoRoot, "tests", "fixtures", "render-project"), project, {
    recursive: true,
    force: true
  });
}

async function copyAbEvalFixture(project) {
  await cp(path.join(repoRoot, "evals", "source-backed", "hackathon-rubric-eval"), project, {
    recursive: true,
    force: true
  });
  runNode(["scripts/render-marp.mjs", project, "--html"]);
  runNode(["scripts/browser-qa-marp.mjs", project]);
  const baseline = path.join(project, "baseline-one-shot");
  runNode(["scripts/render-marp.mjs", baseline, "--html"]);
  runNode(["scripts/browser-qa-marp.mjs", baseline]);
}

async function expectNormalizedMarpFingerprint() {
  const project = path.join(tmpRoot, "marp-fingerprint-normalization");
  await mkdir(project, { recursive: true });
  const left = path.join(project, "left.html");
  const right = path.join(project, "right.html");
  const changed = path.join(project, "changed.html");
  await writeFile(left, marpHtml("a".repeat(32), "Same title"));
  await writeFile(right, marpHtml("b".repeat(32), "Same title"));
  await writeFile(changed, marpHtml("b".repeat(32), "Changed title"));
  const leftHash = await fileFingerprint(left);
  const rightHash = await fileFingerprint(right);
  const changedHash = await fileFingerprint(changed);
  if (leftHash.sha256 !== rightHash.sha256) {
    throw new Error("Marp fingerprint normalization should ignore generated theme IDs");
  }
  if (rightHash.sha256 === changedHash.sha256) {
    throw new Error("Marp fingerprint normalization must still detect content changes");
  }
}

function marpHtml(themeId, title) {
  return `<!doctype html><html><body><svg data-marpit-svg=""><foreignObject><section data-theme="${themeId}" style="--theme:${themeId};"><h1>${title}</h1></section></foreignObject></svg></body></html>`;
}

function validProjectData() {
  return {
    ledger: [
      {
        claim_id: "claim_001",
        claim: "DPO removes the need to train a separate reward model for preference optimization.",
        type: "external_source",
        source: {
          kind: "paper",
          title: "Direct Preference Optimization",
          url: "https://arxiv.org/abs/2305.18290"
        },
        evidence: "The source presents DPO as optimizing a language model directly from preferences rather than fitting a reward model first.",
        confidence: "high",
        allowed_slide_use: ["method comparison", "mechanism explanation"]
      }
    ],
    slides: {
      slides: [
        {
          slide_id: "slide_01",
          title: "DPO removes a reward-model training step",
          claim_ids: ["claim_001"],
          claim_use: "method comparison",
          unsupported_claims: []
        }
      ]
    },
    architecture: {
      nodes: [
        {
          id: "frontend",
          label: "Planner UI",
          kind: "frontend",
          evidence: "app/ui.py:1"
        },
        {
          id: "backend",
          label: "Backend API",
          kind: "backend",
          evidence: "inference: backend receives the payload shown by the UI adapter"
        }
      ],
      edges: [
        {
          from: "frontend",
          to: "backend",
          label: "sends question payload",
          evidence: "app/ui.py:2"
        }
      ],
      boundaries: [
        {
          id: "app",
          contains: ["frontend", "backend"]
        }
      ]
    }
  };
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
