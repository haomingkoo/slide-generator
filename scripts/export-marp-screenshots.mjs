import { spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { normalizeSlideSpecs, resolveSlideSpecsPath } from "./validate-slide-specs.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];

if (!target) {
  console.error("Usage: node scripts/export-marp-screenshots.mjs <project-dir>");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  const slideSpecsPath = await resolveSlideSpecsPath(projectDir);
  const specs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  const { deck, slides } = normalizeSlideSpecs(specs, slideSpecsPath);
  const markdownPath = path.join(projectDir, "deck", "index.md");
  const themePath = path.join(repoRoot, "renderers", "marp", "themes", `${deck.theme}.css`);
  const screenshotDir = path.join(projectDir, "qa", "screenshots");
  const outputBase = path.join(screenshotDir, "slide.png");

  await rm(screenshotDir, { recursive: true, force: true });
  await mkdir(screenshotDir, { recursive: true });

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
    "--images",
    "png",
    "--image-scale",
    "1",
    "--output",
    outputBase
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`Marp screenshot export failed\n${result.stdout}${result.stderr}`);
  }

  const pngs = (await readdir(screenshotDir)).filter((file) => file.endsWith(".png")).sort();
  if (pngs.length !== slides.length) {
    throw new Error(`screenshot export wrote ${pngs.length} PNGs, expected ${slides.length}`);
  }

  console.log(`Marp screenshots written: ${path.relative(repoRoot, screenshotDir)} (${pngs.length} slides)`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
