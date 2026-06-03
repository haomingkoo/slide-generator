import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "docs/workflow.md",
  "docs/architecture.md",
  "docs/codex-ecosystem.md",
  "docs/claude-review-brief.md",
  "docs/review-findings.md",
  "docs/runtime-compatibility.md",
  "docs/no-hallucination-policy.md",
  "docs/quality-rubric.md",
  "docs/skill-eval-loop.md",
  ".gitignore",
  "scripts/spec-constants.mjs",
  "scripts/validate-claim-ledger.mjs",
  "scripts/lint-claim-refs.mjs",
  "scripts/validate-arch-map.mjs",
  "tests/validator-negative.mjs",
  "skills/slide-generator/SKILL.md",
  ".agents/skills/slide-generator/SKILL.md",
  ".claude/skills/slide-generator/SKILL.md",
  ".claude/commands/make-deck.md",
  "skills/slide-generator/references/workflow.md",
  "skills/slide-generator/references/intake-and-one-shot.md",
  "skills/slide-generator/references/deck-operations.md",
  "skills/slide-generator/references/memory-management.md",
  "skills/slide-generator/references/source-grounding.md",
  "skills/slide-generator/references/visual-aid-catalog.md",
  "skills/slide-generator/references/theme-selection.md",
  "skills/slide-generator/references/codebase-review.md",
  "skills/slide-generator/references/brand-system.md",
  "skills/slide-generator/references/frontend-rendering.md",
  "skills/slide-generator/references/pptx-workflow.md",
  "skills/slide-generator/references/pdf-ingestion.md",
  "skills/slide-generator/references/product-workflow-lessons.md",
  "skills/slide-generator/references/evals.md",
  "visual-catalog/comparisons/was-is.md",
  "visual-catalog/architecture/runtime-flow.md",
  "visual-catalog/code/snippet-slide.md",
  "design-systems/clean-surgical-light/DESIGN.md",
  "design-systems/warm-editorial-light/DESIGN.md",
  "design-systems/dark-runtime/DESIGN.md",
  "workflows/make-deck.md",
  "projects/_template/input/brief.md",
  "tests/fixtures/valid-project/work/claim-ledger.json",
  "tests/fixtures/valid-project/work/slide-specs.json",
  "tests/fixtures/valid-project/work/architecture-map.json",
  "evals/evals.json"
];

for (const file of requiredFiles) {
  await access(file);
}

const evals = JSON.parse(await readFile("evals/evals.json", "utf8"));
if (evals.skill_name !== "slide-generator") {
  throw new Error("evals/evals.json must target slide-generator");
}
if (!Array.isArray(evals.evals) || evals.evals.length < 3) {
  throw new Error("evals/evals.json must include at least 3 evals");
}
for (const item of evals.evals) {
  if (!item.prompt || !item.expected_output || !Array.isArray(item.files)) {
    throw new Error(`eval ${item.id ?? "unknown"} is missing required fields`);
  }
}

const skill = await readFile("skills/slide-generator/SKILL.md", "utf8");
await assertMirroredSkill("skills/slide-generator", ".agents/skills/slide-generator");
await assertMirroredSkill("skills/slide-generator", ".claude/skills/slide-generator");
for (const phrase of [
  "claim-ledger.json",
  "Memory Rules",
  "references/intake-and-one-shot.md",
  "references/deck-operations.md",
  "references/product-workflow-lessons.md",
  "No factual claim",
  "Dark mode is not the default"
]) {
  if (!skill.includes(phrase)) {
    throw new Error(`slide-generator skill is missing required phrase: ${phrase}`);
  }
}

const deckOperations = await readFile("skills/slide-generator/references/deck-operations.md", "utf8");
for (const phrase of [
  "Website To Deck",
  "Brief To Deck",
  "Token Strategy"
]) {
  if (!deckOperations.includes(phrase)) {
    throw new Error(`deck-operations reference is missing required phrase: ${phrase}`);
  }
}

const productLessons = await readFile("skills/slide-generator/references/product-workflow-lessons.md", "utf8");
for (const phrase of [
  "Gamma",
  "Figma Slides",
  "Gemini In Google Slides",
  "Plus AI",
  "SlideSpeak",
  "template_intelligence.json",
  "source-handling mode",
  "Product Principles To Adopt"
]) {
  if (!productLessons.includes(phrase)) {
    throw new Error(`product-workflow-lessons reference is missing required phrase: ${phrase}`);
  }
}

const intakeReference = await readFile("skills/slide-generator/references/intake-and-one-shot.md", "utf8");
for (const phrase of [
  "One-Shot Contract",
  "source_handling",
  "Ask Once, Then Move"
]) {
  if (!intakeReference.includes(phrase)) {
    throw new Error(`intake-and-one-shot reference is missing required phrase: ${phrase}`);
  }
}

console.log("slides-generator scaffold validated");

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function assertMirroredSkill(sourceDir, repoDir) {
  const sourceFiles = (await listFiles(sourceDir)).map((file) => path.relative(sourceDir, file)).sort();
  const repoFiles = (await listFiles(repoDir)).map((file) => path.relative(repoDir, file)).sort();
  if (JSON.stringify(sourceFiles) !== JSON.stringify(repoFiles)) {
    throw new Error(`${sourceDir} and ${repoDir} have different file lists`);
  }
  for (const rel of sourceFiles) {
    const source = await readFile(path.join(sourceDir, rel), "utf8");
    const repo = await readFile(path.join(repoDir, rel), "utf8");
    if (source !== repo) {
      throw new Error(`${sourceDir} and ${repoDir} are out of sync: ${rel}`);
    }
  }
}
