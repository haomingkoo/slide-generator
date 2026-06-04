import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const args = parseArgs(process.argv.slice(2));
const evalRoot = path.resolve(args._[0] ?? "evals/source-backed/hackathon-rubric-eval");
const baselineDir = resolveRunDir(evalRoot, args.baseline ?? "baseline-one-shot");
const candidateDir = resolveRunDir(evalRoot, args.candidate ?? ".");
const minDelta = Number.parseInt(args["min-delta"] ?? "10", 10);

if (!Number.isInteger(minDelta) || minDelta < 0 || minDelta > 100) {
  console.error("--min-delta must be an integer between 0 and 100");
  process.exit(2);
}

try {
  await Promise.all([stat(evalRoot), stat(baselineDir), stat(candidateDir)]);
  const baseline = await scoreRun("one_shot_baseline", baselineDir);
  const candidate = await scoreRun("skill_workflow", candidateDir);
  const delta = candidate.score - baseline.score;
  const verdict = candidate.hard_gates.status === "pass" &&
    baseline.hard_gates.status === "pass" &&
    delta >= minDelta
    ? "skill_workflow_wins_fixture"
    : "inconclusive_or_regression";

  const report = {
    version: 1,
    eval_id: "hackathon_rubric_eval",
    generated_at: new Date().toISOString(),
    method: {
      baseline: "Frozen one-shot-style baseline converted into the artifact contract for renderability.",
      candidate: "Artifact-first slide-generator skill workflow output.",
      min_delta: minDelta,
      scoring_scope: "Deterministic proxy signals only: hard gates, claim traceability, rubric fit, demo proof, browser QA, timing, visual diversity, and review-loop evidence."
    },
    caveats: [
      "This is one source-backed fixture, not universal proof that every skill run beats every one-shot prompt.",
      "The proxy score is not a human taste score and does not prove a deck is excellent.",
      "The scorer does not yet measure visual composition quality such as vertical balance, focal point strength, or dead space.",
      "External source URLs and claim references are checked for traceability here; semantic source support still needs a source-audit artifact with evidence anchors."
    ],
    baseline,
    candidate,
    delta,
    verdict
  };

  const reportPath = path.join(evalRoot, "qa", "ab-eval-report.json");
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`A/B eval report written: ${path.relative(repoRoot, reportPath)}`);
  console.log(`baseline=${baseline.score} candidate=${candidate.score} delta=${delta} verdict=${verdict}`);

  if (baseline.hard_gates.status !== "pass" || candidate.hard_gates.status !== "pass") {
    throw new Error("A/B eval requires both baseline and candidate hard gates to pass");
  }
  if (delta < minDelta) {
    throw new Error(`skill workflow did not beat baseline by required delta ${minDelta}; delta=${delta}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function scoreRun(label, projectDir) {
  const [slideSpecs, claimLedger, audienceModel, storySpine, reviewLog, browserQa] = await Promise.all([
    readJson(path.join(projectDir, "work", "slide-specs.json")),
    readJson(path.join(projectDir, "work", "claim-ledger.json")),
    readJson(path.join(projectDir, "work", "audience-model.json")),
    readJson(path.join(projectDir, "work", "story-spine.json")),
    readJson(path.join(projectDir, "work", "review-log.json")),
    readJson(path.join(projectDir, "qa", "browser-qa.json"))
  ]);

  const hardGates = runWorkflowStatus(projectDir);
  const slides = slideSpecs.slides ?? slideSpecs.deck?.slides ?? [];
  const claims = claimLedger.claims ?? claimLedger;
  const facts = computeFacts({ slides, claims, audienceModel, storySpine, reviewLog, browserQa });
  const metrics = [
    scoreHardGates(hardGates),
    scoreSourceIntegrity(facts),
    scoreJudgingFit(facts),
    scoreDemoProof(facts),
    scoreDeliveryAndVisuals(facts)
  ];
  const score = metrics.reduce((sum, metric) => sum + metric.points, 0);

  return {
    label,
    project: path.relative(repoRoot, projectDir),
    score,
    hard_gates: {
      status: hardGates.status,
      next_step: hardGates.next_step
    },
    facts,
    metrics
  };
}

function scoreHardGates(statusReport) {
  const pass = statusReport.status === "pass";
  return {
    id: "hard_gates",
    weight: 20,
    points: pass ? 20 : 0,
    rationale: pass
      ? "All render/QA/workflow checks pass for this project."
      : `Workflow status is ${statusReport.status}.`
  };
}

function scoreSourceIntegrity(facts) {
  const checks = [
    [facts.unsupportedClaimCount === 0, 4, "no unsupported slide claims"],
    [facts.slidesWithoutClaimIds === 0, 4, "all slides are claim-bound or explicitly claim-free"],
    [facts.referencedClaimCount >= 4, 4, "multiple claims are used across the deck"],
    [facts.externalSourceUrlCount >= 4, 4, "external source claims include URLs"],
    [facts.inferenceClaimCount >= 1, 4, "synthesis is labeled as inference rather than external fact"]
  ];
  return pointMetric("source_integrity", 20, checks);
}

function scoreJudgingFit(facts) {
  const checks = [
    [facts.jobs.includes("rubric_alignment"), 6, "dedicated rubric-alignment slide exists"],
    [facts.rubricMentionSlides >= 3, 4, "rubric/judging language appears across the story, not on one slide only"],
    [facts.highPriorityQuestions >= 3, 4, "likely high-priority judge questions are modeled"],
    [facts.highSeverityObjections >= 1, 3, "high-severity audience objections are recorded"],
    [facts.beatsHandlingObjections >= 2, 3, "story beats explicitly handle objections"]
  ];
  return pointMetric("judging_fit", 20, checks);
}

function scoreDemoProof(facts) {
  const checks = [
    [facts.jobs.includes("demo_plan") || facts.jobs.includes("working_proof"), 5, "demo plan or working-proof slide exists"],
    [facts.jobs.includes("technical_depth"), 5, "technical-depth proof slide exists"],
    [facts.visualTypes.includes("architecture") || facts.visualTypes.includes("interactive_demo"), 4, "demo/proof path is made visual"],
    [facts.fallbackMentionSlides >= 2, 3, "fallback guidance appears on multiple slides"],
    [facts.visualsWithBrowserValidation >= 3, 3, "important visuals require browser validation"]
  ];
  return pointMetric("demo_proof", 20, checks);
}

function scoreDeliveryAndVisuals(facts) {
  const timingPoints = facts.totalTimingSeconds <= 180
    ? 4
    : facts.totalTimingSeconds <= 240
      ? 2
      : 0;
  const checks = [
    [facts.browserQaPass, 4, "browser QA passed"],
    [facts.qaDensityWarnings === 0, 4, "browser QA reports no density warnings"],
    [timingPoints > 0, timingPoints, `talk track is ${facts.totalTimingSeconds}s for a 180s brief`, 4],
    [facts.visualEditReviews >= 1, 4, "manual visual repair/review is logged"],
    [facts.nonNoneVisualTypeCount >= 4, 4, "visual aid mix has enough variety"]
  ];
  return pointMetric("delivery_visual_quality", 20, checks);
}

function pointMetric(id, weight, checks) {
  const normalized = checks.map(([condition, points, label, maxPoints = points]) => ({
    condition,
    points,
    label,
    max_points: maxPoints
  }));
  const passed = normalized
    .filter((item) => item.condition && item.points === item.max_points)
    .map(({ label, points }) => ({ label, points }));
  const partial = normalized
    .filter((item) => item.condition && item.points > 0 && item.points < item.max_points)
    .map(({ label, points, max_points: maxPoints }) => ({ label, points, max_points: maxPoints }));
  const missed = normalized
    .filter((item) => !item.condition)
    .map(({ label, max_points: points }) => ({ label, points }));
  return {
    id,
    weight,
    points: passed.reduce((sum, item) => sum + item.points, 0) + partial.reduce((sum, item) => sum + item.points, 0),
    passed,
    partial,
    missed
  };
}

function computeFacts({ slides, claims, audienceModel, storySpine, reviewLog, browserQa }) {
  const slideTexts = slides.map((slide) => collectText(slide).join(" ").toLowerCase());
  const referencedClaims = new Set(slides.flatMap((slide) => slide.claim_ids ?? []));
  const visualTypes = new Set(slides.map((slide) => slide.visual_aid?.type).filter(Boolean));
  visualTypes.delete("none");
  const jobs = new Set(slides.map((slide) => slide.slide_job));
  const qaSlideReports = (browserQa.viewports ?? []).flatMap((viewport) => viewport.slide_reports ?? []);
  const densityWarnings = qaSlideReports.reduce((sum, slide) => sum + (slide.density?.warnings?.length ?? 0), 0);
  const reviewSessions = reviewLog.sessions ?? [];
  const slideReviews = reviewSessions.flatMap((session) => session.slide_reviews ?? []);
  const segments = audienceModel.segments ?? [];
  const likelyQuestions = segments.flatMap((segment) => segment.likely_questions ?? []);
  const objections = segments.flatMap((segment) => segment.objections ?? []);
  const beats = storySpine.beats ?? [];

  return {
    slideCount: slides.length,
    totalTimingSeconds: slides.reduce((sum, slide) => sum + (slide.speaker_notes?.timing_seconds ?? 0), 0),
    unsupportedClaimCount: slides.reduce((sum, slide) => sum + (slide.unsupported_claims?.length ?? 0), 0),
    slidesWithoutClaimIds: slides.filter((slide) => (slide.claim_ids ?? []).length === 0 && !slide.no_claims_reason).length,
    referencedClaimCount: referencedClaims.size,
    externalSourceUrlCount: claims.filter((claim) => claim.type === "external_source" && Boolean(claim.source?.url)).length,
    inferenceClaimCount: claims.filter((claim) => claim.type === "inference").length,
    jobs: [...jobs].sort(),
    rubricMentionSlides: slideTexts.filter((text) => /rubric|judg|criteria|score/i.test(text)).length,
    fallbackMentionSlides: slideTexts.filter((text) => /\bfallback|backup|recording|screenshot|logs?\b/i.test(text)).length,
    visualTypes: [...visualTypes].sort(),
    nonNoneVisualTypeCount: visualTypes.size,
    visualsWithBrowserValidation: slides.filter((slide) => slide.visual_aid?.validation?.browser_check_required === true).length,
    browserQaPass: browserQa.status === "pass",
    qaDensityWarnings: densityWarnings,
    visualEditReviews: slideReviews.filter((review) => review.decision === "visual_edit").length,
    highPriorityQuestions: likelyQuestions.filter((question) => question.priority === "high").length,
    highSeverityObjections: objections.filter((objection) => objection.severity === "high").length,
    beatsHandlingObjections: beats.filter((beat) => (beat.handles_objection_ids ?? []).length > 0).length
  };
}

function runWorkflowStatus(projectDir) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts", "deck-workflow-status.mjs"), projectDir, "--agentic"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const parsed = parseJsonOutput(result.stdout);
  if (result.status !== 0) {
    return parsed ?? {
      status: "fail",
      next_step: result.stderr.trim() || "deck-workflow-status failed"
    };
  }
  return parsed;
}

function parseJsonOutput(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function collectText(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => collectText(item));
  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !["claim_ids", "unsupported_claims"].includes(key))
      .flatMap(([, child]) => collectText(child));
  }
  return [];
}

function resolveRunDir(root, value) {
  if (value === ".") return root;
  return path.resolve(root, value);
}

function parseArgs(values) {
  const parsed = { _: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) {
      parsed._.push(value);
      continue;
    }
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
