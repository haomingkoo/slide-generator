import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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
      title: "Agenda",
      claim_ids: [],
      unsupported_claims: []
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
