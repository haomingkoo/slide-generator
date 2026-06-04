import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export async function fileFingerprint(filePath, repoRoot = null) {
  const [buffer, info] = await Promise.all([
    readFile(filePath),
    stat(filePath)
  ]);
  return {
    path: repoRoot ? path.relative(repoRoot, filePath) : filePath,
    hash_kind: filePath.endsWith(".html") ? "normalized_sha256" : "sha256",
    sha256: createHash("sha256").update(stableFingerprintContent(filePath, buffer)).digest("hex"),
    bytes: info.size,
    mtime_ms: Math.trunc(info.mtimeMs)
  };
}

export function fingerprintsMatch(left, right) {
  return Boolean(left?.sha256 && right?.sha256 && left.sha256 === right.sha256);
}

function stableFingerprintContent(filePath, buffer) {
  if (!filePath.endsWith(".html")) return buffer;
  const html = buffer.toString("utf8");
  if (!html.includes("data-marpit-svg")) return buffer;
  // Marp emits random per-render theme IDs. Normalize only those IDs so
  // freshness checks detect content changes instead of renderer noise.
  return html
    .replace(/data-theme="?[a-z0-9]{24,80}"?/g, "data-theme=\"__marp_theme_id__\"")
    .replace(/--theme:[a-z0-9]{24,80};/g, "--theme:__marp_theme_id__;");
}
