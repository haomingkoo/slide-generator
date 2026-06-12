import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];

try {
  const registry = await readRegistry();
  const projects = target ? [path.resolve(target)] : await findDeckProjects();
  const projectReports = [];
  for (const projectDir of projects) {
    const report = await readProjectLessons(projectDir);
    if (report) projectReports.push(report);
  }

  const output = {
    registry: {
      total: registry.length,
      by_status: countBy(registry, "status"),
      proposed: registry.filter((row) => row.status === "proposed").map(publicRegistryRow),
      next: nextRegistryAction(registry)
    },
    projects: projectReports,
    shared_memory: {
      path: "/Users/koohaoming/.agent-memory/lessons/slides-generator.md",
      use: "Cross-agent lessons for Codex and Claude; keep private memory out of committed repo files."
    }
  };

  console.log(JSON.stringify(output, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function readRegistry() {
  const filePath = path.join(repoRoot, "docs", "heuristic-registry.md");
  const text = await readFile(filePath, "utf8");
  return text
    .split("\n")
    .filter((line) => line.startsWith("| H"))
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 6)
    .map(([id, source_feedback, reusable_rule, runtime_target, coverage, status]) => ({
      id,
      source_feedback,
      reusable_rule,
      runtime_target,
      coverage,
      status
    }));
}

async function findDeckProjects() {
  const roots = ["examples", "projects", "evals"];
  const found = [];
  for (const root of roots) {
    const rootDir = path.join(repoRoot, root);
    if (!await exists(rootDir)) continue;
    found.push(...await findReviewLogs(rootDir));
  }
  return found;
}

async function findReviewLogs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (await exists(path.join(fullPath, "work", "review-log.json"))) {
      found.push(fullPath);
      continue;
    }
    found.push(...await findReviewLogs(fullPath));
  }
  return found;
}

async function readProjectLessons(projectDir) {
  const reviewPath = path.join(projectDir, "work", "review-log.json");
  if (!await exists(reviewPath)) return null;
  const review = JSON.parse(await readFile(reviewPath, "utf8"));
  const sessions = Array.isArray(review.sessions) ? review.sessions : [];
  const recurring = sessions.flatMap((session) => session.recurring_issues || []);
  const newRules = sessions.flatMap((session) => session.new_rules || []);
  return {
    project: path.relative(repoRoot, projectDir),
    sessions: sessions.length,
    recurring_issues: unique(recurring),
    new_rules: unique(newRules)
  };
}

function nextRegistryAction(registry) {
  const proposed = registry.find((row) => row.status === "proposed");
  if (proposed) {
    return `Promote ${proposed.id}: choose docs, skill guidance, validator, template, example or eval coverage.`;
  }
  const absorbed = registry.find((row) => row.status === "absorbed");
  if (absorbed) {
    return `Test ${absorbed.id}: add validator, browser QA, eval, or committed example coverage.`;
  }
  return "No proposed or absorbed registry rows need immediate promotion.";
}

function publicRegistryRow(row) {
  return {
    id: row.id,
    reusable_rule: row.reusable_rule,
    runtime_target: row.runtime_target
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function unique(items) {
  return [...new Set(items)].sort();
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
