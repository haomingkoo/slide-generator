import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const result = spawnSync(process.execPath, [
  path.join(repoRoot, "scripts", "build-deck.mjs"),
  ...process.argv.slice(2)
], {
  cwd: repoRoot,
  encoding: "utf8",
  stdio: "inherit"
});

process.exit(result.status ?? 1);
