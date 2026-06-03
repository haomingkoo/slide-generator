import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const writeDesignContract = process.argv.includes("--write-design-contract");

if (!target) {
  console.error("Usage: node scripts/extract-brand-contract.mjs <project-dir> [--write-design-contract]");
  process.exit(2);
}

try {
  const projectDir = path.resolve(target);
  const brandDir = path.join(projectDir, "input", "brand");
  const workDir = path.join(projectDir, "work");
  await mkdir(workDir, { recursive: true });

  const files = await listFiles(brandDir);
  const textFiles = files.filter((file) => /\.(md|txt|css|json|svg|html)$/i.test(file));
  const assetFiles = files.filter((file) => /\.(png|jpe?g|webp|gif|pdf|pptx|key)$/i.test(file));
  const colorCounts = new Map();
  const fonts = new Map();
  const references = [];

  for (const file of textFiles) {
    const relative = path.relative(projectDir, file);
    references.push(relative);
    const content = await readFile(file, "utf8");
    for (const color of extractHexColors(content)) {
      colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1);
    }
    for (const font of extractFonts(content)) {
      fonts.set(font, (fonts.get(font) ?? 0) + 1);
    }
  }

  references.push(...assetFiles.map((file) => path.relative(projectDir, file)));

  const colors = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([hex, count]) => ({ hex, count }));
  const typography = [...fonts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([family, count]) => ({ family, count }));

  const caveats = [];
  if (files.length === 0) caveats.push("No brand files were found under input/brand.");
  if (assetFiles.length > 0) caveats.push("Image and deck assets were inventoried but not color-sampled by this deterministic extractor.");
  if (colors.length === 0) caveats.push("No hex colors were observed in text-based brand files.");
  if (typography.length === 0) caveats.push("No font-family declarations or explicit font lines were observed.");

  const contract = {
    version: 1,
    source: {
      type: "observed_brand_inputs",
      references
    },
    observed: {
      colors,
      typography,
      assets: assetFiles.map((file) => ({
        path: path.relative(projectDir, file),
        type: path.extname(file).slice(1).toLowerCase()
      }))
    },
    interpretation: {
      dominant_color: colors[0]?.hex ?? null,
      accent_color: colors[1]?.hex ?? colors[0]?.hex ?? null,
      heading_font: typography[0]?.family ?? null,
      body_font: typography[1]?.family ?? typography[0]?.family ?? null,
      caveats
    }
  };

  const outputPath = path.join(workDir, "brand-contract.json");
  await writeFile(outputPath, JSON.stringify(contract, null, 2) + "\n");

  if (writeDesignContract) {
    await writeFile(path.join(workDir, "design-contract.json"), JSON.stringify(toDesignContract(contract), null, 2) + "\n");
  }

  console.log(`brand contract written: ${path.relative(repoRoot, outputPath)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function listFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(full);
      if (entry.isFile()) return [full];
      return [];
    }));
    return nested.flat();
  } catch {
    return [];
  }
}

function extractHexColors(content) {
  return [...content.matchAll(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi)]
    .map((match) => expandHex(match[0]).toUpperCase());
}

function extractFonts(content) {
  const fonts = [];
  for (const match of content.matchAll(/font-family\s*:\s*([^;\n}]+)/gi)) {
    fonts.push(cleanFont(match[1]));
  }
  for (const match of content.matchAll(/\b(?:heading|body|font)\s*:\s*([A-Za-z][A-Za-z0-9 "',.-]+)/gi)) {
    fonts.push(cleanFont(match[1]));
  }
  return fonts.filter(Boolean);
}

function cleanFont(value) {
  return String(value)
    .split(",")[0]
    .replace(/["']/g, "")
    .trim();
}

function expandHex(hex) {
  const value = hex.replace("#", "");
  if (value.length === 3) {
    return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
  }
  return `#${value}`;
}

function toDesignContract(brand) {
  const accent = brand.interpretation.accent_color ?? "#176B87";
  const secondary = brand.interpretation.dominant_color ?? "#2F7D5A";
  const heading = brand.interpretation.heading_font
    ? `${brand.interpretation.heading_font}, Aptos, Helvetica Neue, Arial, sans-serif`
    : "Aptos, Helvetica Neue, Arial, sans-serif";
  const body = brand.interpretation.body_font
    ? `${brand.interpretation.body_font}, Aptos, Helvetica Neue, Arial, sans-serif`
    : "Aptos, Helvetica Neue, Arial, sans-serif";
  return {
    version: 1,
    source: {
      type: "brand_contract",
      references: brand.source.references
    },
    direction: {
      personality: "brand-derived professional",
      audience_fit: "Use observed brand signals while preserving slide readability.",
      density: "balanced",
      depth: "borders_only",
      grid: "strict"
    },
    tokens: {
      colors: {
        background: "#FBFCFD",
        surface: "#FFFFFF",
        text: "#172026",
        muted: "#5E6B73",
        accent,
        secondary_accent: secondary,
        border: "#D9E1E6"
      },
      typography: {
        heading,
        body,
        mono: "SF Mono, Cascadia Code, Consolas, monospace",
        scale: ["16px", "20px", "24px", "32px", "48px", "64px"]
      },
      spacing: {
        base: "4px",
        scale: ["8px", "12px", "16px", "20px", "24px", "32px", "64px", "80px"]
      },
      radius: ["8px"],
      shadow: []
    },
    patterns: {
      title_slide: "Brand-accented title with restrained supporting text.",
      section_slide: "Sparse section slide with one brand accent.",
      comparison_slide: "Two balanced panels with semantic labels.",
      table_slide: "Readable table with thin dividers.",
      code_slide: "High-contrast code block with short caption.",
      architecture_slide: "Few nodes, large labels, brand accent only for focus."
    },
    rules: {
      avoid: ["invented brand colors", "low contrast brand-on-brand text", "decorative logo clutter"],
      must_preserve: ["observed brand colors only", "source caveats", "readable slide hierarchy"],
      accessibility: ["normal text contrast >= 4.5:1", "large text contrast >= 3:1", "no color-only comparisons"]
    },
    decisions: [
      {
        decision: "Create a conservative design contract from observed brand inputs.",
        rationale: "The extractor can observe text-based colors and fonts but does not infer unobserved brand rules.",
        date: new Date().toISOString().slice(0, 10)
      }
    ]
  };
}
