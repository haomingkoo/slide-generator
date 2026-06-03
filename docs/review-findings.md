# Slides-Generator Review Findings

Consolidated critique of the pre-implementation direction. Produced by a multi-agent review pass (6 readers → 13 dimension critics → one adversarial skeptic per finding → synthesis: 67 findings, 66 survived verification) and reconciled against (a) facts verified directly on disk and (b) Codex's `deck-operations.md` change that landed mid-review.

---

## Follow-Up Status

This review is intentionally preserved as the critique as it landed, but several items have since been actioned.

- `deck-operations.md` has been moved into `skills/slide-generator/references/deck-operations.md`, linked from `SKILL.md`, mirrored into `.agents/skills/slide-generator` and `.claude/skills/slide-generator`, and covered by `scripts/validate-project.mjs`.
- One-shot intake/defaulting is now specified in `skills/slide-generator/references/intake-and-one-shot.md`.
- `scripts/validate-claim-ledger.mjs` and `scripts/lint-claim-refs.mjs` now provide the first deterministic claim checks and are exercised by `npm test` against a small fixture.
- `scripts/validate-arch-map.mjs` now checks architecture node/edge evidence, edge endpoints, boundary references, and file/line ranges against the reviewed codebase.
- `tests/validator-negative.mjs` mutation-tests the validators against expected failures, including factual-looking slides without claim IDs and architecture evidence escaping the codebase root.
- `.gitignore` now ignores local Playwright dumps, root scratch renders, and generated project work/deck/export/QA folders.
- Mirror drift errors in `scripts/validate-project.mjs` now name the actual compared directories.

Still open: code-snippet evidence resolution, rendered HTML evals, brand observation tooling, browser contrast/overflow scripts, and full source claim-vs-evidence semantic audit.

---

## 0. Reconciliation (read first)

**Verified directly on disk (high confidence):**

- The only executable is `scripts/validate-project.mjs` (102 lines): it checks file existence, 3-way skill-mirror byte-equality, and that `evals.json` has ≥3 well-formed entries. It never parses a claim ledger, slide spec, or architecture map. `npm test` green = "scaffold present," not "pipeline works."
- Mirror-check error messages hardcode `.agents skill` at `validate-project.mjs:92,98`, so a `.claude` drift reports a misleading name.
- Stray artifacts at repo root: `redflag-slide-01.png` (277KB), `redflag-slide-01-1440.png` (397KB), `.playwright-mcp/*.yml`. No `.gitignore`; not a git repo — these will be committed verbatim on first `git init`.
- `source-grounding.md:5` says the ledger "should" be referenced while the Audit Pass ends in a hard "Fail" (`:36`); `SKILL.md:33`/README say "must." Strictness is asserted in prose, unenforced in code.
- Artifact lists genuinely differ across `AGENTS.md`, `SKILL.md`, `docs/workflow.md`, `docs/architecture.md`, and the brief (different names *and* different sets).

**Changed by Codex mid-review (so some review findings are now stale/softened):**

- New `docs/deck-operations.md` adds an existing-deck operation library (proofread, simplify, exec summary, audience adaptation, translate, action titles, agenda, website→deck, brief→deck, speaker notes), each with a context scope. This **substantially addresses the "every task triggers the full pipeline" overbuild concern** and the lightweight-edit-path gap. Down-weight any finding to that effect.
- It **partially** addresses intake momentum (blind spot 12 / issue #9): "Brief To Deck" says "ask for missing audience or decision context if it materially changes the deck." Still no batch-and-default protocol, so the finding mostly stands.
- It **adds new drift** (see issue #15): the file is `docs/`-only — not mirrored into the skill, not referenced by `SKILL.md`, not in the validator's `requiredFiles`. `SKILL.md` got a condensed `## Common Operations` list that already diverges (omits the two build ops). Token-scope guidance now lives in three places.

**One thing the brief itself got wrong:** the "40–80 slide deck" target is invented — the repo never states it (I echoed it earlier; it's not grounded). Cost scales with **corpus size + iteration count**, not slide count. Memory claims should be framed that way.

---

## 1. Verdict

The core thesis is right: **artifact-first deck generation with a claim ledger as the accuracy spine is a sound, differentiated bet.** Decomposing into typed intermediate artifacts so a repair touches one slide instead of regenerating the deck is the correct shape for both quality and token cost, and it is unusually well-specified for a pre-code repo — the repair-routing table (`references/workflow.md`), the memory budget modes (`memory-management.md`), the codebase-review schema (`codebase-review.md`), and now `deck-operations.md` are genuinely specification-grade.

The core risk is equally clear: **every "hard gate" in the repo is enforced by the same LLM that produced the artifact, with zero deterministic backing.** `no-hallucination-policy.md:3` calls accuracy "a hard gate" and `AGENTS.md:95` forbids "prompt-only quality control," yet nothing executable parses a ledger, slide spec, or architecture map. The audit is a model self-grading a ledger it wrote — a confabulating model satisfies it by making slide and ledger consistent with *each other* rather than with reality.

Two framing corrections to the brief: (a) "overbuild" is mostly overstated — `SKILL.md`'s Default Flow is already leaner than `docs/workflow.md`'s 11-artifact list, the doc says "should," and `deck-operations.md` now adds explicit lightweight paths; the real problem is **doc inconsistency**, not an overbuilt pipeline. (b) Several "unbounded loop" worries are softened because the QA gates (`quality-rubric.md:45-51`) are objective and convergent. The genuine, repeatedly-confirmed gap is the **missing deterministic layer.**

---

## 2. Top issues, prioritized

1. **[HIGH] No deterministic enforcement of the accuracy gate.** Ledger, claim_id cross-refs, and architecture-map evidence are validated only by LLM self-audit. This is the marquee feature and it currently can't fail a build. Fix: three small project-scoped Node scripts (§4), run at deck-generation time, not folded into the scaffold validator. Files: `validate-project.mjs`, `source-grounding.md`, `no-hallucination-policy.md`.

2. **[HIGH] Architecture-map `evidence` is a self-attested label nothing resolves.** A node/edge can cite `app/worker.py:42` for a file/line that doesn't exist and pass every check, defeating "diagrams from evidence, not prose." Fix: path-existence + line-in-range check against the analyzed repo root. File: `codebase-review.md:30-55`.

3. **[HIGH] The entire render/export half of the pipeline is untested.** All three evals stop at "deck plan"; nothing renders or exports, so "will PPTX work?" / "does HTML hit 90%?" are unanswerable. Fix: add **one** HTML render-and-export eval whose expected output includes a rendered artifact + passing browser screenshot QA; defer PPTX evals until a tool exists. Files: `evals/evals.json`, `tests/cases/`.

4. **[HIGH] Brand extraction is asserted with no method.** "Extract colors/typography" with no sampling instruction means an LLM with no pixel access pattern-matches a category-typical palette and emits hex it never observed — brand-identity hallucination, where the brand color is a *fact about the user's company*. Fix: 4–5 lines in `brand-system.md` requiring values to come from an actual observation (render page / read CSS / sample the rendered slide), routed into the existing `evidence[]`, with "guess from the brand name" named a violation. File: `brand-system.md:9-42`.

5. **[MEDIUM] Audit step 1 "extract factual statements" never defines "factual."** Anything the model declines to call factual silently bypasses the whole gate (a punchy title can be deemed "framing"). Fix: 3–4 lines defining factual operationally (any number, comparison, capability/causal claim, named-entity behavior, superlative; titles and labels count) + "when unsure, treat as factual." File: `source-grounding.md:30-36`.

6. **[MEDIUM] The audit trusts the ledger as ground truth — no claim-vs-evidence comparison.** It checks slide-vs-`claim`, never `claim`-vs-`evidence`, missing paraphrase drift, source-contradiction, aggregation/unit errors, stale "SOTA" claims — the *distortion* class, more common than fabrication. Fix: one audit step between current 3 and 4 ("compare each claim against its ledger evidence; fail if the slide says more than, or different from, the evidence") + 2–3 distortion failure conditions. Files: `source-grounding.md`, `no-hallucination-policy.md`.

7. **[MEDIUM] Title-strength check compares against claim *text*, not claim *type* — `inference`/`assumption` launders into an asserted title.** A claim tagged `inference` but phrased assertively passes "no stronger than the claim" verbatim as a headline. Fix (closes two defects): retarget audit step 3 to compare against `evidence` *and* forbid `inference`/`assumption` claims as unqualified titles without a visible hedge. `type` is already loaded by claim_id. File: `source-grounding.md:34`.

8. **[MEDIUM] No spine to refuse/downgrade an "impressive but unsupported" *user* request.** Every rule targets agent slips; nothing covers the user demanding "put 10× faster on the title" — where the model caves to please. Fix: a 4–5 line "User-Requested Claims" section ("a user request does not create evidence…") wired into intake so it fires up front, not just at the post-hoc audit. Files: `no-hallucination-policy.md`, `references/workflow.md:4-13`.

9. **[MEDIUM, partially addressed by Codex] No bounded intake-defaulting strategy.** Intake lists which questions to ask but not whether to block, batch, or default when unanswered. `deck-operations.md` "Brief To Deck" now nudges toward asking only when it materially changes the deck, but there's still no batch-and-proceed protocol. Fix: "ask all material questions in one batch; if unanswered, proceed on explicit defaults, record each as an `assumption` in `intake-brief.md`, surface at the slide-sorter checkpoint." Files: `references/workflow.md:4-13`, `SKILL.md` step 1.

10. **[MEDIUM] No chunked strategy for the one unavoidable whole-corpus pass** (building the ledger from a large PDF/codebase). The four memory modes assume the artifacts already exist; the up-front read that *creates* them — the most expensive op — has no budget. Fix: a fifth "Corpus-Intake Mode" mandating per-section/per-module summarize-then-discard + one line capping `pdf-ingestion.md`'s uncapped "render pages to images." File: `memory-management.md`.

11. **[MEDIUM] Humanizer runs *after* the source audit and is never re-audited** — it can smuggle in an unsupported claim or drop a caveat. `SKILL.md` step 10 humanizes; step 9 was the audit. Fix (one load-bearing line): append to step 10 "…then re-run the source audit over edited notes; any new factual statement must map to an existing claim_id or be removed." File: `SKILL.md:21`.

12. **[MEDIUM] No deterministic visual check; contrast and overflow** — the two machine-checkable, highest-failure-rate properties — have no threshold. "Browser screenshot QA passes" is a gate defined nowhere as a procedure. Fix: 3–4 DOM-computable thresholds under QA Gates (contrast ≥4.5:1 body / 3:1 large per WCAG AA; `scrollWidth/Height ≤ clientWidth/Height`; min body font-size; ~45 char/line). File: `quality-rubric.md:45-51`.

13. **[LOW, do it] Hygiene.** `rm` the two `redflag-slide-*.png` and the `.playwright-mcp/` dumps; add `.gitignore` (`node_modules/`, `.playwright-mcp/`, `projects/*/{work,deck,exports,qa}/`, `/redflag-slide-*.png`) before first `git init`.

14. **[LOW] Mirror validator misnames `.claude` drift.** `assertMirroredSkill` hardcodes "agents" at `validate-project.mjs:92,98`; `repoDir`/`sourceDir` are in scope but never interpolated. Two-line fix.

15. **[LOW–MEDIUM, NEW — from Codex's change] `deck-operations.md` repeats the repo's anti-pattern and adds drift.** It's `docs/`-only: not in the three skill mirrors, not referenced by `SKILL.md`, not in the validator's `requiredFiles` (so the green `npm test` says nothing about it), and `SKILL.md`'s new condensed `## Common Operations` list already diverges (omits website→deck and brief→deck). Token-scope guidance now lives in three files. Fix (surgical): move to `skills/slide-generator/references/deck-operations.md`, sync both mirrors, add it to `requiredFiles` + a phrase check, and replace SKILL.md's duplicated list with a one-line reference pointer.

**Doc-consistency cluster [LOW, batch into one pass]:** first-artifact naming (`intake-brief.md` vs `input/brief.md`); render-gate stated four ways (sorter-only / sorter+ledger / "don't jump from notes" / README's 5-artifact); `audience-model.json` dropped from `SKILL.md` but mandated by three other files; `source-grounding.md:5` "should" vs `SKILL.md:33` "must"; three docs disagree on which skill dir is "active." Standardize in place; phrase the render-gate as a *floor that points to the full sequence*, not a 2-artifact ceiling. (Note: README was re-touched by Codex, so its exact line numbers may have shifted — re-check before editing.)

---

## 3. Answers to the 15 blind spots

1. **Artifact weight.** Right for iterated/large decks, unjustified-as-written for one-shot small decks — don't kill it; most artifacts double as inputs to the always-on audit/QA loops and write cost is negligible. Reframe README from obligation to "checkpoint when a phase output will be re-read." (Codex's `deck-operations.md` already moves this direction.)
2. **Mandatory vs optional.** Core always: `intake-brief`, `claim-ledger`, `slide-sorter`, `slide-specs`. Conditional (produce when earned): `source-map`, `audience-model`, `codebase-review`+`architecture-map`, `theme-options`, `visual-aid-plan`, `story-spine`, `brand-contract`. Encode with the existing "when X exists" pattern, no new tiering vocabulary.
3. **Ledger strictness.** Strict on paper, unenforced in fact. Tighten the lone "should" (`source-grounding.md:5`) to "must" and add the referential-integrity check (§4) so a bad claim_id fails a build, not a vibe.
4. **Memory realism.** Optimizes the cheap part (slide-local repair); silent on the two real blow-ups: the up-front whole-corpus read, and a whole-deck screenshot sweep. Add Corpus-Intake Mode + "never re-screenshot the whole deck for a single-slide repair." Cost scales with corpus + iterations, not slide count.
5. **Architecture truth.** Weakest accuracy track: `evidence` is unverified and never reconciled with the ledger. Fix: (a) path/line resolution; (b) require each node/edge to carry a ledger `claim_id` or a verified inline evidence/inference label.
6. **HTML vs PPTX.** HTML-first is unambiguously the MVP (only path with named QA tooling, most expressive, sidesteps OOXML). Make `html_artifact` the explicit default. Defer PPTX-from-scratch; v1 PPTX = template-editing a user-supplied `.pptx` only.
7. **Objective visual quality.** Currently 100% taste. Make contrast and overflow checkable thresholds in the browser-QA step; leave story/whitespace human-judged — don't fake-objectify the rest.
8. **First scripts.** Ledger schema validator → claim_id cross-ref linter → architecture-map evidence resolver (see §4).
9. **Brand from thin input.** The dimension's central hole. Require observed values, define "weak assets" by observable triggers (single slide / URL-only / <2 observed colors / no observed font), route into the existing two-proposal + title-preview path, add "values were inferred not observed" to the Theme Preview trigger.
10. **Missing source-audit failure modes.** Add paraphrase drift / source-contradiction (highest value, via claim-vs-evidence), aggregation/unit error, stale-temporal claim, edge-direction mismatch, bidirectional speaker-note divergence.
11. **Conflicting sources.** Generalize the benchmark-caveat rule to any conflict: one failure condition (two sources disagree, slide presents one as settled) + one repair rule (show both attributed, or pick one and say why in `evidence`) + a claim-vs-claim step + a source-`kind` strength ordering (measured_local > codebase > paper > vendor). No schema change. (`tests/cases/pdf-parser-comparison.md` already partly seeds this.)
12. **Clarifying-questions momentum.** Genuinely unresolved (partially nudged by `deck-operations.md`). Batch once, never block, default-and-mark-as-assumption, surface at the sorter gate. See issue #9.
13. **Impressive-but-unsupported.** No refusal protocol; add the "User-Requested Claims" spine at intake. See issue #8.
14. **Visual-aid overuse.** The trigger set qualifies nearly every slide with no opposing force — strong restraint on *theme*, zero on visual-aid *quantity*. Add a removal test ("no slide carries a visual aid that doesn't change what the audience understands") + a "a slide may have none" line to `visual-aid-catalog.md`.
15. **Natural-not-vague notes.** Three competing goals, no precedence, and the rule lives in a doc the skill never loads. Add `references/humanizer.md` with explicit precedence (accuracy > natural > concise) + remove/preserve lists + the one-line re-audit (issue #11).

---

## 4. Build-first deterministic scripts

Ship as **project-scoped sibling scripts run at the source-audit step** (skip cleanly if the artifact is absent so scaffold `npm test` stays green). Extract enums (`type`, `confidence`) and the banned-phrase list into one shared `scripts/spec-constants.mjs` in the same commit as the first consumer, so validators and prose can't drift.

1. **`validate-claim-ledger.mjs`** — highest leverage, schema fully specified. Asserts array shape; all 7 required keys present/non-empty; `type ∈ {user_file,codebase,external_source,inference,assumption}`; `confidence ∈ {high,medium,low}`; `claim_id` unique; `source` non-empty; `external_source` has non-empty `source.url`.
2. **`lint-claim-refs.mjs`** — referential integrity (what LLMs are worst at). Every `claim_ids` entry in every slide-spec resolves to a ledger id; any non-empty `unsupported_claims` fails (operationalizes the undefined "Fail"); every slide-spec carries the keys at all. Depends on #1.
3. **`validate-arch-map.mjs`** — closes the diagram-truth hole. Parse each `evidence` as `path` / `path:line` / `path:start-end`, assert the file exists relative to the analyzed repo root and any line is in range. Same for `code-snippets.json`.
4. **`text-audit.mjs`** — cheapest quality win; banned-phrase match + word-cap on titles + duplicate-title flag. **Blocked on a defined `slide-specs.json` schema — write that schema first.**
5. **`brand-contract` enum check** — trivial; assert `layout.density/radius/grid` are in their enumerated sets.

Wire the two **DOM checks** (contrast, overflow) into browser-QA as executable assertions. Fix the mirror error messages while in `validate-project.mjs`.

---

## 5. MVP recommendation

**Non-negotiable core (always):** `intake-brief.md` (assumption-marked unanswered fields) · `claim-ledger.json` · `slide-sorter.md` · `slide-specs.json` · rendered HTML deck + screenshots.

**Conditional (when earned):** `codebase-review`+`architecture-map`+`code-snippets` (code exists) · `source-map` (multiple sources) · `audience-model` (unfamiliar/contested audience) · `theme-options` (taste unclear) · `visual-aid-plan`+`story-spine` (longer/argument-heavy) · `brand-contract` (brand assets exist).

**Cut for v1:** PPTX-from-scratch (keep template-editing only; HTML→PDF is the export path) · the manager + 5-specialist architecture in `AGENTS.md` (ship the single linear skill that's actually specified everywhere else; the on-disk reality is one skill) · eval-viewer / baseline-harness dirs / observability MCP (build after one eval goes green).

**Output:** default `html_artifact`; `deck/` render, `qa/` screenshots, `exports/` on request. **Pin a concrete slide canvas** (1280×720 or 1920×1080, 16:9, via CSS vars) — "stable dimensions" with no number makes screenshots non-comparable and PDF pagination unpredictable.

---

## 6. How to prove it beats one-shot

Run each case **with the skill** (full pipeline) and **without** (one-shot "make me a deck from these sources"), both over the **same committed corpus** — the evals reference material that isn't in the repo (`files: []`), so commit small inputs under `tests/cases/<case>/source/` first or nothing runs.

**Metrics (reuse the no-hallucination gate as the accuracy bar):**
- **Unsupported-claim count** (run §4 checks over both): skill ≤ baseline, target 0 claims without a valid `claim_id`.
- **Human-repair proxy:** slides a reviewer marks "needs rework." Skill strictly < baseline — this is the side of the token tradeoff the thesis rests on and currently measures nowhere.
- **Token-overhead cap:** skill ≤ N× baseline (artifact-first spends more up front; the eval must show it buys fewer repairs).
- **Pass rule:** skill wins iff the accuracy gate passes, repair-proxy strictly improves, and overhead stays under the cap.

**Cases:** (1) source-only teaching deck (DPO, 10 slides) — claim traceability; (2) decision deck from one source (PDF-parser, 8) — measured-vs-published + conflict handling; (3) codebase architecture deck (7) — diagram evidence-grounding, built from a *committed* small codebase so `architecture-map.json` paths resolve. Add (4) repair-one-crowded-slide — directly proves the slide-local memory thesis; and one large-corpus case with a slide-local repair that asserts the full corpus was *not* re-read.

---

## 7. One thing to change before writing code

**Write `validate-claim-ledger.mjs` + `lint-claim-refs.mjs` and run them over one real generated project before building anything else.** The entire value proposition is "accurate, hallucination-free decks via a claim ledger," and that gate is currently a model grading itself against a ledger it authored — exactly the "prompt-only quality control" `AGENTS.md:95` forbids. These two ~40-line scripts convert the most load-bearing promise from "the model checks" to "the build fails," depend only on the two already-stable JSON shapes, and writing them forces you to settle the schemas the prose leaves ambiguous. Everything else — renderer, MCPs, PPTX, specialists — improves inputs to a pipeline that can't yet tell whether its output is correct.
