import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { validateSlideSpecs } from "./validate-slide-specs.mjs";

const templateDir = path.resolve("templates", "marp");

try {
  const entries = await readdir(templateDir, { withFileTypes: true });
  const templateFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(templateDir, entry.name))
    .sort();

  if (templateFiles.length === 0) {
    throw new Error("templates/marp must include at least one JSON template");
  }

  for (const file of templateFiles) {
    const template = JSON.parse(await readFile(file, "utf8"));
    validateSlideSpecs(template, file);
  }

  console.log(`slide templates valid: ${templateFiles.length}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
