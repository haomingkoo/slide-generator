import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function resolveEffectiveThemePath(repoRoot, projectDir, deck) {
  const baseThemePath = path.join(repoRoot, "renderers", "marp", "themes", `${deck.theme}.css`);
  const baseCss = await readFile(baseThemePath, "utf8");
  const designContractPath = path.join(projectDir, "work", "design-contract.json");

  try {
    const contract = JSON.parse(await readFile(designContractPath, "utf8"));
    const overrideCss = contractToCss(contract);
    if (!overrideCss) return baseThemePath;
    const deckDir = path.join(projectDir, "deck");
    await mkdir(deckDir, { recursive: true });
    const effectiveThemePath = path.join(deckDir, "effective-theme.css");
    await writeFile(effectiveThemePath, `${baseCss}\n\n/* design-contract overrides */\n${overrideCss}\n`);
    return effectiveThemePath;
  } catch (error) {
    if (error.code === "ENOENT") return baseThemePath;
    throw error;
  }
}

function contractToCss(contract) {
  const colors = contract?.tokens?.colors ?? {};
  const typography = contract?.tokens?.typography ?? {};
  const spacing = contract?.tokens?.spacing ?? {};
  const radius = contract?.tokens?.radius ?? [];
  const vars = [];

  addVar(vars, "--bg", colors.background);
  addVar(vars, "--paper", colors.surface);
  addVar(vars, "--panel", colors.surface);
  addVar(vars, "--panel-2", colors.surface);
  addVar(vars, "--ink", colors.text);
  addVar(vars, "--muted", colors.muted);
  addVar(vars, "--line", colors.border);
  addVar(vars, "--accent", colors.accent);
  addVar(vars, "--accent-2", colors.secondary_accent);
  addVar(vars, "--ok", colors.secondary_accent);
  addVar(vars, "--warn", colors.accent);
  addVar(vars, "--risk", colors.risk);

  const rules = [];
  if (vars.length > 0) {
    rules.push(`:root {\n${vars.map((item) => `  ${item}`).join("\n")}\n}`);
  }
  if (isCssValue(typography.body)) {
    rules.push(`section, p, li, table { font-family: ${typography.body}; }`);
  }
  if (isCssValue(typography.heading)) {
    rules.push(`h1, h2, h3, blockquote { font-family: ${typography.heading}; }`);
  }
  if (isCssValue(typography.mono)) {
    rules.push(`pre, code { font-family: ${typography.mono}; }`);
  }
  if (isCssValue(spacing.base)) {
    rules.push(`section { --contract-spacing-base: ${spacing.base}; }`);
  }
  if (Array.isArray(radius) && isCssValue(radius[0])) {
    rules.push(`.panel, pre, .flow-diagram, .flow-node { border-radius: ${radius[0]}; }`);
  }
  return rules.join("\n\n");
}

function addVar(vars, name, value) {
  if (!isCssValue(value)) return;
  vars.push(`${name}: ${value};`);
}

function isCssValue(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !/[{};]/.test(trimmed);
}
