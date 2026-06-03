import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeSlideSpecs, resolveSlideSpecsPath } from "./validate-slide-specs.mjs";
import { resolveEffectiveThemePath } from "./theme-utils.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const wantsPptx = process.argv.includes("--pptx");
const wantsPdf = process.argv.includes("--pdf");

if (!target || (!wantsPptx && !wantsPdf)) {
  console.error("Usage: node scripts/export-marp.mjs <project-dir> [--pptx] [--pdf]");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  await stat(projectDir);

  runNodeScript("scripts/render-marp.mjs", [projectDir, "--html"]);
  runNodeScript("scripts/inspect-rendered-marp.mjs", [projectDir]);
  runNodeScript("scripts/browser-qa-marp.mjs", [projectDir]);

  const slideSpecsPath = await resolveSlideSpecsPath(projectDir);
  const slideSpecs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  const { deck } = normalizeSlideSpecs(slideSpecs, slideSpecsPath);
  const themePath = await resolveEffectiveThemePath(repoRoot, projectDir, deck);
  const markdownPath = path.join(projectDir, "deck", "index.md");
  const exportDir = path.join(projectDir, "deck", "exports");
  await mkdir(exportDir, { recursive: true });

  const baseName = slugify(deck.title || "deck");
  const outputs = [];
  if (wantsPptx) {
    outputs.push(await exportWithMarp(markdownPath, themePath, path.join(exportDir, `${baseName}.pptx`)));
  }
  if (wantsPdf) {
    outputs.push(await exportWithMarp(markdownPath, themePath, path.join(exportDir, `${baseName}.pdf`)));
  }

  const report = {
    deck_title: deck.title,
    source_markdown: path.relative(repoRoot, markdownPath),
    qa_required_before_export: true,
    browser_qa: path.relative(repoRoot, path.join(projectDir, "qa", "browser-qa.json")),
    google_slides_handoff: wantsPptx ? "Import the PPTX into Google Slides for the first supported handoff path." : null,
    outputs
  };
  await writeFile(path.join(exportDir, "export-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  runNodeScript("scripts/inspect-exports.mjs", [projectDir]);
  console.log(`exports written: ${outputs.map((item) => item.path).join(", ")}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function exportWithMarp(markdownPath, themePath, outputPath) {
  const marpBin = path.join(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "marp.cmd" : "marp"
  );
  const result = spawnSync(marpBin, [
    markdownPath,
    "--theme",
    themePath,
    "--output",
    outputPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`Marp export failed for ${outputPath}\n${result.stdout}${result.stderr}`);
  }
  const info = await stat(outputPath);
  if (info.size < 1024) {
    throw new Error(`Marp export created suspiciously small file: ${outputPath}`);
  }
  return {
    path: path.relative(repoRoot, outputPath),
    bytes: info.size
  };
}

function runNodeScript(script, args) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, script), ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`${script} failed\n${result.stdout}${result.stderr}`);
  }
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "deck";
}
