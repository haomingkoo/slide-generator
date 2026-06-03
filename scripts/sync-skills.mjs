import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(repoRoot, "skills", "slide-generator");
const targets = [
  path.join(repoRoot, ".agents", "skills", "slide-generator"),
  path.join(repoRoot, ".claude", "skills", "slide-generator")
];
const checkOnly = process.argv.includes("--check");

try {
  await stat(sourceDir);

  if (checkOnly) {
    for (const target of targets) {
      await assertMirror(sourceDir, target);
    }
    console.log("Skill mirrors are in sync.");
    process.exit(0);
  }

  for (const target of targets) {
    await rm(target, { recursive: true, force: true });
    await mkdir(target, { recursive: true });
    await cp(sourceDir, target, { recursive: true });
    console.log(`Synced ${relative(sourceDir)} -> ${relative(target)}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function assertMirror(source, target) {
  const sourceFiles = await listFiles(source);
  const targetFiles = await listFiles(target);
  const sourceSet = new Set(sourceFiles);
  const targetSet = new Set(targetFiles);

  for (const file of sourceFiles) {
    if (!targetSet.has(file)) throw new Error(`${relative(target)} is missing ${file}`);
    const [left, right] = await Promise.all([
      readFile(path.join(source, file), "utf8"),
      readFile(path.join(target, file), "utf8")
    ]);
    if (left !== right) throw new Error(`${relative(target)} is out of sync at ${file}`);
  }

  for (const file of targetFiles) {
    if (!sourceSet.has(file)) throw new Error(`${relative(target)} has extra file ${file}`);
  }
}

async function listFiles(root, prefix = "") {
  const entries = await readdir(path.join(root, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const item = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(root, item));
    } else if (entry.isFile()) {
      files.push(item);
    }
  }
  return files.sort();
}

function relative(target) {
  return path.relative(repoRoot, target);
}
