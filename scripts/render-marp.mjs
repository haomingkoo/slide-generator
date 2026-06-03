import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  normalizeSlideSpecs,
  resolveSlideSpecsPath,
  validateSlideSpecs
} from "./validate-slide-specs.mjs";
import { resolveEffectiveThemePath } from "./theme-utils.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const writeHtml = process.argv.includes("--html");

if (!target) {
  console.error("Usage: node scripts/render-marp.mjs <project-dir> [--html]");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  const slideSpecsPath = await resolveSlideSpecsPath(projectDir);
  const slideSpecs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  validateSlideSpecs(slideSpecs, slideSpecsPath);
  runNodeScript("scripts/validate-claim-ledger.mjs", projectDir);
  runNodeScript("scripts/lint-claim-refs.mjs", projectDir);
  const audienceModelPath = path.join(projectDir, "work", "audience-model.json");
  if (await exists(audienceModelPath)) {
    runNodeScript("scripts/validate-audience-model.mjs", projectDir);
  }
  const storySpinePath = path.join(projectDir, "work", "story-spine.json");
  if (await exists(storySpinePath)) {
    runNodeScript("scripts/validate-story-spine.mjs", projectDir);
  }
  const designContractPath = path.join(projectDir, "work", "design-contract.json");
  if (await exists(designContractPath)) {
    runNodeScript("scripts/validate-design-contract.mjs", projectDir);
  }

  const architecturePath = path.join(projectDir, "work", "architecture-map.json");
  if (await exists(architecturePath)) {
    runNodeScript("scripts/validate-arch-map.mjs", projectDir);
  }

  const { deck, slides } = normalizeSlideSpecs(slideSpecs, slideSpecsPath);
  const themePath = path.join(repoRoot, "renderers", "marp", "themes", `${deck.theme}.css`);
  if (!(await exists(themePath))) {
    throw new Error(`missing Marp theme: ${themePath}`);
  }

  const deckDir = path.join(projectDir, "deck");
  await mkdir(deckDir, { recursive: true });

  const markdown = renderDeckMarkdown(deck, slides);
  const markdownPath = path.join(deckDir, "index.md");
  const notesPath = path.join(deckDir, "speaker-notes.txt");
  await writeFile(markdownPath, markdown);
  await writeFile(notesPath, renderSpeakerNotes(slides));

  if (writeHtml) {
    const htmlPath = path.join(deckDir, "index.html");
    const effectiveThemePath = await resolveEffectiveThemePath(repoRoot, projectDir, deck);
    runMarp(markdownPath, effectiveThemePath, htmlPath);
    console.log(`Marp HTML written: ${path.relative(repoRoot, htmlPath)}`);
  }

  console.log(`Marp Markdown written: ${path.relative(repoRoot, markdownPath)}`);
  console.log(`speaker notes written: ${path.relative(repoRoot, notesPath)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function renderDeckMarkdown(deck, slides) {
  const paginate = deck.paginate !== false;
  const frontmatter = [
    "---",
    "marp: true",
    `theme: ${deck.theme}`,
    `paginate: ${paginate ? "true" : "false"}`,
    "size: 16:9",
    `title: ${JSON.stringify(deck.title)}`,
    "---"
  ].join("\n");

  return [
    frontmatter,
    slides.map((slide, index) => renderSlide(slide, index)).join("\n\n---\n\n")
  ].join("\n\n");
}

function renderSlide(slide, index) {
  const className = slide.layout.replaceAll("_", "-");
  const parts = [
    `<!-- _class: ${className} -->`,
    `<!-- slide_id: ${slide.slide_id} -->`
  ];
  if (slide.motion?.type === "transition") {
    parts.push(`<!-- transition: ${slide.motion.transition} -->`);
  }
  if (index === 0) {
    parts.push("<!-- _paginate: skip -->");
  }

  parts.push(renderSlideBody(slide));

  const notes = normalizeNotes(slide.speaker_notes);
  if (notes) {
    parts.push(`<!--\n${escapeComment(notes)}\n-->`);
  }

  return parts.filter(Boolean).join("\n\n");
}

function renderSlideBody(slide) {
  switch (slide.layout) {
    case "title":
      return renderTitleSlide(slide);
    case "section":
      return renderSectionSlide(slide);
    case "narrative":
      return [`## ${slide.title}`, renderBody(slide.body, slide)].join("\n\n");
    case "two_column":
      return renderColumns(slide);
    case "comparison":
      return renderComparison(slide);
    case "table":
      return renderTableSlide(slide);
    case "code":
      return renderCodeSlide(slide);
    case "architecture":
      return renderArchitectureSlide(slide);
    case "quote":
      return renderQuoteSlide(slide);
    default:
      throw new Error(`unsupported layout: ${slide.layout}`);
  }
}

function renderTitleSlide(slide) {
  return [
    slide.eyebrow ? `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>` : "",
    `# ${slide.title}`,
    slide.subtitle ? `<p class="subtitle">${escapeHtml(slide.subtitle)}</p>` : "",
    slide.body ? renderBody(slide.body, slide) : ""
  ].filter(Boolean).join("\n\n");
}

function renderSectionSlide(slide) {
  return [
    slide.eyebrow ? `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>` : "",
    `# ${slide.title}`,
    slide.body ? renderBody(slide.body, slide) : ""
  ].filter(Boolean).join("\n\n");
}

function renderColumns(slide) {
  return [
    `## ${slide.title}`,
    `<div class="columns">
${renderPanel(slide.left)}
${renderPanel(slide.right)}
</div>`
  ].join("\n\n");
}

function renderComparison(slide) {
  return [
    `## ${slide.title}`,
    `<div class="comparison">
<div class="panel panel-was">
${renderPanelInner(slide.left)}
</div>
<div class="panel panel-is">
${renderPanelInner(slide.right)}
</div>
</div>`
  ].join("\n\n");
}

function renderTableSlide(slide) {
  const headers = slide.table.headers.map(escapeTableCell).join(" | ");
  const divider = slide.table.headers.map(() => "---").join(" | ");
  const rows = slide.table.rows.map((row) => row.map(escapeTableCell).join(" | "));
  return [`## ${slide.title}`, `| ${headers} |\n| ${divider} |\n${rows.map((row) => `| ${row} |`).join("\n")}`].join("\n\n");
}

function renderCodeSlide(slide) {
  return [
    `## ${slide.title}`,
    slide.code.caption ? `<p class="caption">${escapeHtml(slide.code.caption)}</p>` : "",
    `\`\`\`${slide.code.language}\n${escapeCodeFence(slide.code.source)}\n\`\`\``
  ].filter(Boolean).join("\n\n");
}

function renderArchitectureSlide(slide) {
  return [
    `## ${slide.title}`,
    slide.body ? renderBody(slide.body, slide) : "",
    slide.mermaid ? renderFlowDiagram(slide.mermaid) : ""
  ].filter(Boolean).join("\n\n");
}

function renderQuoteSlide(slide) {
  return [
    `<blockquote>${escapeHtml(slide.quote)}</blockquote>`,
    slide.attribution ? `<p class="attribution">${escapeHtml(slide.attribution)}</p>` : "",
    slide.title ? `<p class="quote-title">${escapeHtml(slide.title)}</p>` : ""
  ].filter(Boolean).join("\n\n");
}

function renderPanel(panel) {
  return `<div class="panel">
${renderPanelInner(panel)}
</div>`;
}

function renderPanelInner(panel) {
  if (typeof panel === "string") {
    return `<p>${escapeHtml(panel)}</p>`;
  }
  return [
    panel.title ? `<h3>${escapeHtml(panel.title)}</h3>` : "",
    renderBodyHtml(panel.body)
  ].filter(Boolean).join("\n");
}

function renderBody(body, slide = {}) {
  if (typeof body === "string") return body;
  const marker = slide.motion?.type === "step_reveal" ? "*" : "-";
  return body.map((item) => `${marker} ${item}`).join("\n");
}

function renderBodyHtml(body) {
  if (typeof body === "string") return `<p>${escapeHtml(body)}</p>`;
  return `<ul>
${body.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
</ul>`;
}

function renderFlowDiagram(mermaid) {
  const nodes = [];
  const seen = new Set();
  for (const match of String(mermaid).matchAll(/\b([A-Za-z][A-Za-z0-9_]*)\[([^\]]+)\]/g)) {
    const id = match[1];
    const label = match[2];
    if (seen.has(id)) continue;
    seen.add(id);
    nodes.push(label);
  }
  if (nodes.length < 2) {
    return `<pre><code>${escapeHtml(mermaid)}</code></pre>`;
  }
  return `<div class="flow-diagram">
${nodes.map((node, index) => [
  `<div class="flow-node">${escapeHtml(node)}</div>`,
  index < nodes.length - 1 ? `<div class="flow-arrow">→</div>` : ""
].join("\n")).join("\n")}
</div>`;
}

function renderSpeakerNotes(slides) {
  return slides
    .map((slide, index) => {
      const notes = normalizeNotes(slide.speaker_notes) || "(no speaker notes)";
      return `Slide ${index + 1} - ${slide.slide_id}: ${slide.title}\n${notes}`;
    })
    .join("\n\n");
}

function normalizeNotes(notes) {
  if (notes === undefined) return "";
  if (typeof notes === "string") return notes;
  if (Array.isArray(notes)) return notes.join("\n");
  if (notes && typeof notes === "object") {
    const lines = [];
    lines.push(`Key message: ${notes.key_message}`);
    if (notes.transition_in) lines.push(`Transition in: ${notes.transition_in}`);
    if (Array.isArray(notes.talk_track) && notes.talk_track.length > 0) {
      lines.push("Talk track:");
      lines.push(...notes.talk_track.map((item) => `- ${item}`));
    }
    if (Array.isArray(notes.delivery_cues) && notes.delivery_cues.length > 0) {
      lines.push(`Delivery cues: ${notes.delivery_cues.join("; ")}`);
    }
    if (Array.isArray(notes.avoid_saying) && notes.avoid_saying.length > 0) {
      lines.push(`Avoid saying: ${notes.avoid_saying.join("; ")}`);
    }
    if (notes.transition_out) lines.push(`Transition out: ${notes.transition_out}`);
    if (notes.timing_seconds) lines.push(`Timing: ${notes.timing_seconds}s`);
    if (Array.isArray(notes.claim_ids) && notes.claim_ids.length > 0) {
      lines.push(`Claims: ${notes.claim_ids.join(", ")}`);
    }
    return lines.join("\n");
  }
  return "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeComment(value) {
  return String(value).replaceAll("--", "- -");
}

function escapeTableCell(value) {
  return String(value).replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

function escapeCodeFence(value) {
  return String(value).replaceAll("```", "`\u200b``");
}

async function exists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

function runNodeScript(script, projectDir) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, script), projectDir], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`${script} failed\n${result.stdout}${result.stderr}`);
  }
}

function runMarp(markdownPath, themePath, htmlPath) {
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
    "--html",
    "--output",
    htmlPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`Marp render failed\n${result.stdout}${result.stderr}`);
  }
}
