import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];

if (!target) {
  console.error("Usage: node scripts/inspect-exports.mjs <project-dir>");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  const reportPath = path.join(projectDir, "deck", "exports", "export-report.json");
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const browserQaPath = path.join(projectDir, "qa", "browser-qa.json");
  const browserQa = JSON.parse(await readFile(browserQaPath, "utf8"));
  const issues = [];
  const inspectedOutputs = [];

  if (report.qa_required_before_export !== true) {
    issues.push("export report must state qa_required_before_export: true");
  }
  if (browserQa.status !== "pass") {
    issues.push(`browser QA status is ${browserQa.status}`);
  }
  if (!Array.isArray(report.outputs) || report.outputs.length === 0) {
    issues.push("export report has no outputs");
  }

  for (const output of report.outputs ?? []) {
    const filePath = path.resolve(repoRoot, output.path);
    const info = await stat(filePath);
    const inspection = {
      path: output.path,
      bytes: info.size,
      type: filePath.endsWith(".pptx") ? "pptx" : filePath.endsWith(".pdf") ? "pdf" : "unknown",
      status: "pass",
      notes: []
    };
    if (info.size < 4096) {
      issues.push(`${output.path} is suspiciously small (${info.size} bytes)`);
      inspection.status = "fail";
    }
    if (output.bytes !== info.size) {
      issues.push(`${output.path} byte count in report does not match file size`);
      inspection.status = "fail";
    }
    const header = await readHeader(filePath);
    if (filePath.endsWith(".pdf") && header.toString("utf8", 0, 4) !== "%PDF") {
      issues.push(`${output.path} does not start with a PDF header`);
      inspection.status = "fail";
    }
    if (filePath.endsWith(".pptx") && header.toString("utf8", 0, 2) !== "PK") {
      issues.push(`${output.path} does not look like a PPTX zip container`);
      inspection.status = "fail";
    }
    if (filePath.endsWith(".pptx")) {
      const editability = inspectPptxEditability(filePath);
      inspection.editability = editability;
      if (editability.mode === "image_based") {
        inspection.notes.push("Marp PPTX export appears image-based: good for visual handoff, not native editable text.");
      }
    }
    inspectedOutputs.push(inspection);
  }

  const inspectionReport = {
    project: path.relative(repoRoot, projectDir),
    generated_at: new Date().toISOString(),
    status: issues.length > 0 ? "fail" : "pass",
    browser_qa: path.relative(repoRoot, browserQaPath),
    outputs: inspectedOutputs,
    caveats: [
      "This check verifies file existence, headers, size, and basic PPTX editability signals.",
      "It does not replace visual inspection of PPTX/PDF after import into PowerPoint or Google Slides."
    ]
  };
  await mkdir(path.join(projectDir, "qa"), { recursive: true });
  await writeFile(path.join(projectDir, "qa", "export-inspection.json"), JSON.stringify(inspectionReport, null, 2) + "\n");

  if (issues.length > 0) {
    throw new Error(["export inspection failed", ...issues].join("\n"));
  }
  console.log(`exports inspected: ${path.relative(repoRoot, reportPath)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function readHeader(filePath) {
  const buffer = await readFile(filePath);
  return buffer.subarray(0, 8);
}

function inspectPptxEditability(filePath) {
  const list = spawnSync("unzip", ["-Z1", filePath], { encoding: "utf8" });
  if (list.status !== 0) {
    return {
      mode: "unknown",
      reason: "unzip was not available or could not list the PPTX container"
    };
  }
  const slideXmlFiles = list.stdout
    .split(/\r?\n/)
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry));
  let textRuns = 0;
  let imageFills = 0;
  for (const slideXml of slideXmlFiles) {
    const slide = spawnSync("unzip", ["-p", filePath, slideXml], { encoding: "utf8" });
    if (slide.status !== 0) continue;
    textRuns += countMatches(slide.stdout, /<a:t(?:\s|>)/g);
    imageFills += countMatches(slide.stdout, /<a:blip\b/g);
  }
  const mode = textRuns === 0 && imageFills >= slideXmlFiles.length ? "image_based" : "mixed_or_editable";
  return {
    mode,
    slide_count: slideXmlFiles.length,
    text_runs: textRuns,
    image_fills: imageFills
  };
}

function countMatches(value, pattern) {
  return [...String(value).matchAll(pattern)].length;
}
