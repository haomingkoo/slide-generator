import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { normalizeSlideSpecs, resolveSlideSpecsPath } from "./validate-slide-specs.mjs";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/inspect-rendered-marp.mjs <project-dir>");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  await stat(projectDir);
  const slideSpecsPath = await resolveSlideSpecsPath(projectDir);
  const specs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  const { slides } = normalizeSlideSpecs(specs, slideSpecsPath);
  const deckDir = path.join(projectDir, "deck");
  const html = await readFile(path.join(deckDir, "index.html"), "utf8");
  const markdown = await readFile(path.join(deckDir, "index.md"), "utf8");
  const notes = await readFile(path.join(deckDir, "speaker-notes.txt"), "utf8");

  const renderedSections = countMatches(html, /<section\b/g);
  if (renderedSections !== slides.length) {
    throw new Error(`rendered HTML has ${renderedSections} sections, expected ${slides.length}`);
  }

  const noteBlocks = countMatches(html, /class="bespoke-marp-note"/g);
  if (noteBlocks !== slides.length) {
    throw new Error(`rendered HTML has ${noteBlocks} presenter-note blocks, expected ${slides.length}`);
  }

  if (!html.includes("view=presenter") && !html.includes("Presenter view")) {
    throw new Error("rendered HTML does not expose Marp presenter view controls");
  }

  for (const slide of slides) {
    if (!markdown.includes(`slide_id: ${slide.slide_id}`)) {
      throw new Error(`rendered Markdown is missing slide_id marker ${slide.slide_id}`);
    }
    if (!notes.includes(slide.slide_id)) {
      throw new Error(`speaker notes file is missing ${slide.slide_id}`);
    }
  }

  console.log(`rendered Marp deck inspected: ${slides.length} slides`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function countMatches(value, pattern) {
  return (value.match(pattern) || []).length;
}
