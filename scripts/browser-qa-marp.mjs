import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { normalizeSlideSpecs, resolveSlideSpecsPath } from "./validate-slide-specs.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const viewports = selectViewports();

if (!target) {
  console.error("Usage: node scripts/browser-qa-marp.mjs <project-dir> [--viewport standard|all]");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  await stat(projectDir);
  const slideSpecsPath = await resolveSlideSpecsPath(projectDir);
  const specs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  const { slides } = normalizeSlideSpecs(specs, slideSpecsPath);
  const htmlPath = path.join(projectDir, "deck", "index.html");
  await stat(htmlPath);

  const qaDir = path.join(projectDir, "qa");
  const screenshotDir = path.join(qaDir, "browser-screenshots");
  await mkdir(screenshotDir, { recursive: true });

  const browser = await chromium.launch();
  const issues = [];
  const viewportReports = [];
  for (const viewport of viewports) {
    const viewportReport = await inspectViewport(browser, {
      htmlPath,
      slides,
      screenshotRoot: screenshotDir,
      viewport
    });
    viewportReports.push(viewportReport);
    issues.push(...viewportReport.issues.map((issue) => `${viewport.name}: ${issue}`));
  }
  await browser.close();

  const consoleMessages = viewportReports.flatMap((item) => item.console_messages.map((message) => ({
    viewport: item.viewport.name,
    ...message
  })));

  const report = {
    project: path.relative(repoRoot, projectDir),
    html: path.relative(repoRoot, htmlPath),
    viewport_mode: viewportMode(),
    generated_at: new Date().toISOString(),
    viewports: viewportReports,
    console_messages: consoleMessages,
    screenshots_dir: path.relative(repoRoot, screenshotDir),
    status: issues.length === 0 && consoleMessages.filter((item) => item.type !== "warning").length === 0 ? "pass" : "fail",
    issues
  };
  await writeFile(path.join(qaDir, "browser-qa.json"), `${JSON.stringify(report, null, 2)}\n`);

  const consoleErrors = consoleMessages.filter((item) => item.type !== "warning");
  if (issues.length > 0 || consoleErrors.length > 0) {
    throw new Error([
      "browser QA failed",
      ...issues,
      ...consoleErrors.map((item) => `${item.viewport}: console ${item.type}: ${item.text}`)
    ].join("\n"));
  }

  console.log(`browser QA passed: ${path.relative(repoRoot, path.join(qaDir, "browser-qa.json"))}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function inspectViewport(browser, { htmlPath, slides, screenshotRoot, viewport }) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => {
    consoleMessages.push({ type: "pageerror", text: error.message });
  });

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.waitForSelector("svg.bespoke-marp-slide", { timeout: 5000 });

  const structure = await page.evaluate(() => {
    const sections = [...document.querySelectorAll("section")];
    return {
      slideCount: document.querySelectorAll("svg.bespoke-marp-slide").length,
      sectionCount: sections.length,
      noteCount: document.querySelectorAll(".bespoke-marp-note").length,
      presenterControls: Boolean(document.querySelector("[data-bespoke-marp-osc='presenter']"))
    };
  });

  const issues = [];
  if (structure.slideCount !== slides.length) {
    issues.push(`browser rendered ${structure.slideCount} slide SVGs, expected ${slides.length}`);
  }
  if (structure.sectionCount !== slides.length) {
    issues.push(`browser rendered ${structure.sectionCount} sections, expected ${slides.length}`);
  }
  if (structure.noteCount !== slides.length) {
    issues.push(`browser rendered ${structure.noteCount} presenter notes, expected ${slides.length}`);
  }
  if (!structure.presenterControls) {
    issues.push("browser deck is missing presenter controls");
  }

  const slideReports = await page.evaluate(() => {
    const textSelector = "h1,h2,h3,h4,p,li,td,th,blockquote,code,pre,.caption,.subtitle,.eyebrow,.attribution";
    const boundSelector = "h1,h2,h3,h4,p,ul,ol,table,pre,blockquote,.columns,.comparison,.panel,.subtitle,.eyebrow,.caption,.attribution";
    const sections = [...document.querySelectorAll("section")];
    return sections.map((section, index) => {
      const sectionRect = rectToPlain(section.getBoundingClientRect());
      const overflow = section.scrollWidth > section.clientWidth + 2 || section.scrollHeight > section.clientHeight + 2;
      const outOfBounds = [...section.querySelectorAll(boundSelector)]
        .filter((el) => isVisible(el))
        .map((el) => ({ tag: describe(el), rect: rectToPlain(el.getBoundingClientRect()) }))
        .filter((item) => outside(item.rect, sectionRect));
      const contrastIssues = [...section.querySelectorAll(textSelector)]
        .filter((el) => isVisible(el) && el.textContent.trim().length > 0)
        .map((el) => contrastReport(el, section))
        .filter((item) => item && item.ratio < item.minimum);
      const density = densityReport(section, textSelector);
      return {
        index,
        id: section.id,
        className: section.className,
        overflow,
        outOfBounds,
        contrastIssues,
        density,
        fragmentCount: section.querySelectorAll("[data-marpit-fragment]").length
      };
    });

    function describe(el) {
      const cls = typeof el.className === "string" && el.className ? `.${el.className.split(/\s+/).join(".")}` : "";
      return `${el.tagName.toLowerCase()}${cls}`;
    }

    function parseRgb(value) {
      const match = String(value).match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(",").map((part) => part.trim());
      const alpha = parts[3] === undefined ? 1 : Number.parseFloat(parts[3]);
      if (alpha === 0) return null;
      return parts.slice(0, 3).map((part) => Number.parseFloat(part));
    }

    function rectToPlain(rect) {
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom)
      };
    }

    function outside(rect, parent) {
      const tolerance = 2;
      return rect.x < parent.x - tolerance ||
        rect.y < parent.y - tolerance ||
        rect.right > parent.right + tolerance ||
        rect.bottom > parent.bottom + tolerance;
    }

    function isVisible(el) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number.parseFloat(style.opacity || "1") > 0.01 &&
        rect.width > 0 &&
        rect.height > 0;
    }

    function contrastReport(el, section) {
      const style = getComputedStyle(el);
      const foreground = parseRgb(style.color);
      const background = findBackground(el, section);
      if (!foreground || !background) return null;
      const ratio = contrastRatio(foreground, background);
      const fontSize = Number.parseFloat(style.fontSize || "16");
      const fontWeight = Number.parseInt(style.fontWeight || "400", 10);
      const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const minimum = largeText ? 3 : 4.5;
      return {
        tag: describe(el),
        text: el.textContent.trim().slice(0, 80),
        ratio: Math.round(ratio * 100) / 100,
        minimum,
        foreground: style.color,
        background: `rgb(${background.join(", ")})`
      };
    }

    function findBackground(el, boundary) {
      let current = el;
      while (current) {
        const color = parseRgb(getComputedStyle(current).backgroundColor);
        if (color) return color;
        if (current === boundary) break;
        current = current.parentElement;
      }
      return [255, 255, 255];
    }

    function luminance([r, g, b]) {
      return [r, g, b]
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    }

    function contrastRatio(foreground, background) {
      const a = luminance(foreground);
      const b = luminance(background);
      const lighter = Math.max(a, b);
      const darker = Math.min(a, b);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function densityReport(section, selector) {
      const textNodes = [...section.querySelectorAll(selector)]
        .filter((el) => isVisible(el) && el.textContent.trim().length > 0)
        .map((el) => ({
          tag: describe(el),
          text: el.textContent.trim().replace(/\s+/g, " ")
        }));
      const combined = textNodes.map((item) => item.text).join(" ");
      const wordCount = combined ? combined.split(/\s+/).filter(Boolean).length : 0;
      const charCount = combined.length;
      const bulletCount = section.querySelectorAll("li").length;
      const tableCellCount = section.querySelectorAll("td,th").length;
      const codeLineCount = [...section.querySelectorAll("pre,code")]
        .map((el) => el.textContent.split(/\r?\n/).filter((line) => line.trim().length > 0).length)
        .reduce((sum, count) => sum + count, 0);
      const maxBlockChars = textNodes.reduce((max, item) => Math.max(max, item.text.length), 0);
      const warnings = [];
      if (wordCount > 190) warnings.push(`high word count (${wordCount})`);
      if (charCount > 1250) warnings.push(`high character count (${charCount})`);
      if (bulletCount > 12) warnings.push(`too many bullets (${bulletCount})`);
      if (tableCellCount > 32) warnings.push(`dense table (${tableCellCount} cells)`);
      if (codeLineCount > 24) warnings.push(`dense code block (${codeLineCount} lines)`);
      if (maxBlockChars > 420) warnings.push(`long uninterrupted text block (${maxBlockChars} chars)`);
      return {
        wordCount,
        charCount,
        bulletCount,
        tableCellCount,
        codeLineCount,
        maxBlockChars,
        warnings
      };
    }
  });

  for (const [index, slide] of slides.entries()) {
    const report = slideReports[index];
    if (!report) continue;
    if (report.overflow) issues.push(`${slide.slide_id}: section scroll overflow detected`);
    for (const item of report.outOfBounds) {
      issues.push(`${slide.slide_id}: ${item.tag} is outside slide bounds`);
    }
    for (const item of report.contrastIssues) {
      issues.push(`${slide.slide_id}: low contrast ${item.ratio}:1 on ${item.tag} (${item.text})`);
    }
    for (const warning of report.density?.warnings ?? []) {
      issues.push(`${slide.slide_id}: visual density warning: ${warning}`);
    }
    if (slide.layout === "architecture" && report.density?.codeLineCount > 0) {
      issues.push(`${slide.slide_id}: architecture slide rendered code instead of a visual flow`);
    }
    if (slide.motion?.type === "step_reveal" && report.fragmentCount === 0) {
      issues.push(`${slide.slide_id}: step_reveal motion requested but no Marp fragments rendered`);
    }
    if (["animated_sequence", "interactive_demo"].includes(slide.visual_aid?.type) && report.fragmentCount === 0) {
      issues.push(`${slide.slide_id}: ${slide.visual_aid.type} requested but no browser-visible interaction primitive rendered`);
    }
  }

  const viewportScreenshotDir = path.join(screenshotRoot, viewport.name);
  await mkdir(viewportScreenshotDir, { recursive: true });
  const navigation = await verifyNavigation(page, slides, viewportScreenshotDir);
  issues.push(...navigation.issues);
  await page.close();
  return {
    viewport,
    structure,
    console_messages: consoleMessages,
    slide_reports: slideReports,
    navigation,
    screenshots_dir: path.relative(repoRoot, viewportScreenshotDir),
    status: issues.length === 0 ? "pass" : "fail",
    issues
  };
}

async function verifyNavigation(page, slides, screenshotDir) {
  const issues = [];
  await page.addStyleTag({
    content: ".bespoke-marp-osc,.bespoke-progress-parent,[data-bespoke-marp-osc]{display:none!important;visibility:hidden!important;}"
  });
  for (const [index, slide] of slides.entries()) {
    await advanceToSlide(page, index + 1);
    const active = await page.evaluate(() => {
      const svg = document.querySelector("svg.bespoke-marp-active");
      const section = svg?.querySelector("section");
      return {
        id: section?.id ?? null,
        title: section?.querySelector("h1,h2,blockquote")?.textContent?.trim() ?? null
      };
    });
    const expectedId = String(index + 1);
    if (active.id !== expectedId) {
      issues.push(`${slide.slide_id}: keyboard navigation active id ${active.id}, expected ${expectedId}`);
    }
    const locator = page.locator("svg.bespoke-marp-active");
    await locator.screenshot({ path: path.join(screenshotDir, `slide-${String(index + 1).padStart(2, "0")}.png`) });
  }
  return { screenshots: slides.length, issues };
}

async function advanceToSlide(page, expectedNumber) {
  for (let attempts = 0; attempts < 12; attempts += 1) {
    const activeId = await page.evaluate(() => document.querySelector("svg.bespoke-marp-active section")?.id ?? null);
    if (activeId === String(expectedNumber)) return;
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(60);
  }
}

function viewportMode() {
  const value = readOption("--viewport");
  return value || "all";
}

function selectViewports() {
  const mode = viewportMode();
  const all = [
    { name: "standard-16x9", width: 1280, height: 720 },
    { name: "laptop-review", width: 1366, height: 768 },
    { name: "small-window", width: 1024, height: 576 }
  ];
  if (mode === "all") return all;
  if (mode === "standard") return [all[0]];
  throw new Error(`unknown viewport mode: ${mode}`);
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}
