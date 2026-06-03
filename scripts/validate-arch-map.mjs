import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
const codeRootArg = process.argv[3];
if (!target) {
  console.error("Usage: node scripts/validate-arch-map.mjs <project-dir|architecture-map.json> [code-root]");
  process.exit(2);
}

try {
  const { archPath, codeRoot } = await resolvePaths(target, codeRootArg);
  const archMap = JSON.parse(await readFile(archPath, "utf8"));
  const resolvedCodeRoot = await realpath(codeRoot);
  await validateArchMap(archMap, archPath, resolvedCodeRoot);
  console.log(`architecture map valid: ${archPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolvePaths(targetPath, codeRootPath) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  if (info.isDirectory()) {
    return {
      archPath: path.join(resolved, "work", "architecture-map.json"),
      codeRoot: codeRootPath ? path.resolve(codeRootPath) : path.join(resolved, "input", "codebase")
    };
  }
  return {
    archPath: resolved,
    codeRoot: codeRootPath ? path.resolve(codeRootPath) : process.cwd()
  };
}

async function validateArchMap(archMap, archPath, codeRoot) {
  const nodes = requiredArray(archMap.nodes, `${archPath}: nodes`);
  const edges = requiredArray(archMap.edges, `${archPath}: edges`);
  const nodeIds = new Set();

  for (const [index, node] of nodes.entries()) {
    const label = node?.id ?? `node at index ${index}`;
    requireString(node?.id, `${archPath}: ${label} is missing id`);
    requireString(node?.label, `${archPath}: ${label} is missing label`);
    if (nodeIds.has(node.id)) throw new Error(`${archPath}: duplicate node id ${node.id}`);
    nodeIds.add(node.id);
    await validateEvidence(node.evidence, `${archPath}: node ${node.id}`, codeRoot);
  }

  for (const [index, edge] of edges.entries()) {
    const label = `${edge?.from ?? "?"}->${edge?.to ?? "?"}`;
    requireString(edge?.from, `${archPath}: edge at index ${index} is missing from`);
    requireString(edge?.to, `${archPath}: edge at index ${index} is missing to`);
    if (!nodeIds.has(edge.from)) throw new Error(`${archPath}: edge ${label} references unknown from node`);
    if (!nodeIds.has(edge.to)) throw new Error(`${archPath}: edge ${label} references unknown to node`);
    await validateEvidence(edge.evidence, `${archPath}: edge ${label}`, codeRoot);
  }

  if (archMap.boundaries !== undefined) {
    for (const boundary of requiredArray(archMap.boundaries, `${archPath}: boundaries`)) {
      if (boundary.contains !== undefined) {
        for (const nodeId of requiredArray(boundary.contains, `${archPath}: boundary ${boundary.id ?? "unknown"} contains`)) {
          if (!nodeIds.has(nodeId)) {
            throw new Error(`${archPath}: boundary ${boundary.id ?? "unknown"} contains unknown node ${nodeId}`);
          }
        }
      }
    }
  }
}

function requiredArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value;
}

function requireString(value, message) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(message);
}

async function validateEvidence(evidence, label, codeRoot) {
  const refs = normalizeEvidence(evidence);
  if (refs.length === 0) throw new Error(`${label} has no evidence`);
  for (const ref of refs) {
    if (isExplicitInference(ref) || isUrl(ref)) continue;
    const parsed = parsePathReference(ref);
    if (!parsed) throw new Error(`${label} has unparseable evidence reference ${ref}`);
    if (path.isAbsolute(parsed.file)) {
      throw new Error(`${label} evidence ${ref} must be relative to the reviewed codebase`);
    }
    const filePath = path.resolve(codeRoot, parsed.file);
    const resolvedFilePath = await realpath(filePath);
    if (!isWithinDirectory(resolvedFilePath, codeRoot)) {
      throw new Error(`${label} evidence ${ref} points outside the reviewed codebase`);
    }
    if (parsed.startLine !== null) {
      const lineCount = countLines(await readFile(resolvedFilePath, "utf8"));
      if (parsed.startLine < 1 || parsed.endLine < parsed.startLine || parsed.endLine > lineCount) {
        throw new Error(`${label} evidence ${ref} has line range outside ${parsed.file}`);
      }
    }
  }
}

function normalizeEvidence(evidence) {
  if (typeof evidence === "string" && evidence.trim()) return [evidence.trim()];
  if (Array.isArray(evidence)) return evidence.flatMap(normalizeEvidence);
  if (evidence && typeof evidence === "object") {
    if (typeof evidence.path === "string") {
      const line = evidence.line ?? evidence.lines;
      return [line ? `${evidence.path}:${line}` : evidence.path];
    }
    if (typeof evidence.ref === "string") return [evidence.ref];
    if (typeof evidence.url === "string") return [evidence.url];
    if (typeof evidence.inference === "string") return [`inference:${evidence.inference}`];
  }
  return [];
}

function isExplicitInference(ref) {
  return /^(inference|assumption):\s*\S/i.test(ref);
}

function isUrl(ref) {
  return /^https?:\/\//.test(ref);
}

function parsePathReference(ref) {
  const match = ref.match(/^(.+?)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;
  return {
    file: match[1],
    startLine: match[2] ? Number(match[2]) : null,
    endLine: match[3] ? Number(match[3]) : match[2] ? Number(match[2]) : null
  };
}

function isWithinDirectory(filePath, directory) {
  return filePath === directory || filePath.startsWith(directory + path.sep);
}

function countLines(content) {
  if (content.length === 0) return 0;
  const lines = content.split(/\r?\n/);
  if (content.endsWith("\n") || content.endsWith("\r")) lines.pop();
  return lines.length;
}
