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
    sha256: createHash("sha256").update(buffer).digest("hex"),
    bytes: info.size,
    mtime_ms: Math.trunc(info.mtimeMs)
  };
}

export function fingerprintsMatch(left, right) {
  return Boolean(left?.sha256 && right?.sha256 && left.sha256 === right.sha256);
}
