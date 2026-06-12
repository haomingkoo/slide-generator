import { copyFile, mkdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2];
const force = process.argv.includes("--force");
const theme = readOption("--theme") || "clean-surgical-light";

if (!target) {
  console.error("Usage: node scripts/create-deck-artifacts.mjs <project-dir> [--theme clean-surgical-light|warm-editorial-light|dark-runtime] [--force]");
  process.exit(2);
}

const projectDir = path.resolve(target);
const workDir = path.join(projectDir, "work");
const inputDir = path.join(projectDir, "input");

try {
  await assertProjectDir(projectDir);

  await mkdir(path.join(inputDir, "sources"), { recursive: true });
  await mkdir(path.join(inputDir, "brand"), { recursive: true });
  await mkdir(path.join(inputDir, "codebase"), { recursive: true });
  await mkdir(path.join(inputDir, "data"), { recursive: true });
  await mkdir(workDir, { recursive: true });
  await mkdir(path.join(projectDir, "deck"), { recursive: true });
  await mkdir(path.join(projectDir, "qa"), { recursive: true });

  const briefPath = path.join(inputDir, "brief.md");
  await writeIfMissing(briefPath, starterBrief());
  const brief = await readFile(briefPath, "utf8");
  const title = inferTitle(brief);
  const deckGoal = inferGoal(brief, title);
  const today = new Date().toISOString().slice(0, 10);

  await writeIfMissing(path.join(workDir, "intake-brief.md"), intakeBrief({ title, deckGoal, today }));
  await writeIfMissing(path.join(workDir, "deck-plan.md"), deckPlan({ title, deckGoal, today }));
  await writeIfMissing(path.join(workDir, "source-map.md"), sourceMap({ today }));
  await writeIfMissing(path.join(workDir, "claim-ledger.json"), JSON.stringify(claimLedger({ title }), null, 2) + "\n");
  await writeIfMissing(path.join(workDir, "audience-model.json"), JSON.stringify(audienceModel({ title }), null, 2) + "\n");
  await writeIfMissing(path.join(workDir, "story-spine.json"), JSON.stringify(storySpine({ title }), null, 2) + "\n");
  await writeIfMissing(path.join(workDir, "slide-sorter.md"), slideSorter({ title }) + "\n");
  await writeIfMissing(path.join(workDir, "content-priority.md"), contentPriority({ title }) + "\n");
  await writeIfMissing(path.join(workDir, "visual-aid-plan.json"), JSON.stringify(visualAidPlan(), null, 2) + "\n");
  await copyDesignContract(theme, today);
  await writeIfMissing(path.join(workDir, "quality-rubric.json"), JSON.stringify(qualityRubric({ deckGoal }), null, 2) + "\n");
  await writeIfMissing(path.join(workDir, "slide-specs.json"), JSON.stringify(slideSpecs({ title, theme }), null, 2) + "\n");
  await writeIfMissing(path.join(workDir, "review-log.json"), JSON.stringify(reviewLog({ deckGoal, today }), null, 2) + "\n");

  console.log(`starter artifacts created for ${path.relative(repoRoot, projectDir) || projectDir}`);
  console.log("Next: complete work/deck-plan.md, then replace starter assumptions with sourced claims before treating factual slides as final.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function assertProjectDir(candidate) {
  if (!isInside(repoRoot, candidate) || candidate === repoRoot) {
    throw new Error(`project-dir must be inside this repository and not the repository root: ${candidate}`);
  }

  const existingAncestor = await nearestExistingAncestor(candidate);
  const realRepoRoot = await realpath(repoRoot);
  const realAncestor = await realpath(existingAncestor);
  if (!isInside(realRepoRoot, realAncestor) && realAncestor !== realRepoRoot) {
    throw new Error(`project-dir resolves outside this repository through an existing parent: ${candidate}`);
  }
}

async function nearestExistingAncestor(candidate) {
  let current = candidate;
  while (current && current !== path.dirname(current)) {
    try {
      await stat(current);
      return current;
    } catch {
      current = path.dirname(current);
    }
  }
  return current;
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function writeIfMissing(filePath, content) {
  if (!force && await exists(filePath)) return;
  await writeFile(filePath, content);
}

async function copyDesignContract(themeName, today) {
  const source = path.join(repoRoot, "templates", "design-contracts", `${themeName}.json`);
  const destination = path.join(workDir, "design-contract.json");
  if (!force && await exists(destination)) return;
  if (await exists(source)) {
    await copyFile(source, destination);
    return;
  }
  const fallback = designContract({ themeName, today });
  await writeFile(destination, JSON.stringify(fallback, null, 2) + "\n");
}

function starterBrief() {
  return `# Deck Brief

Topic: Replace this with the deck topic.
Audience: Replace this with the primary audience.
Goal: Replace this with what the audience should understand, decide, believe, or do.
Slide count: Replace this with the target count or talk length.
Research mode: source_only
Output: HTML draft first, PPTX/PDF after QA.
Style: clean, clear, source-grounded.

Must include:
- Replace with required points.

Must avoid:
- Unsupported claims.
- Generic filler.
- Hidden assumptions.
`;
}

function intakeBrief({ title, deckGoal, today }) {
  return `# Intake Brief

Date: ${today}
Deck title: ${title}

deck_goal: ${deckGoal}
audience_shift: Replace this with the audience shift after reading the sources.
success_criteria: Replace this with how the deck will be judged.

constraints:
- research_mode: source_only
- output: HTML draft first, PPTX/PDF only after QA
- accuracy_bar: factual claims need claim IDs

assumptions:
- This file was created by \`scripts/create-deck-artifacts.mjs\`.
- Starter artifacts are scaffolding only until an agent replaces assumptions with sourced evidence.

open_questions:
- What source files should be treated as authoritative?
- Who is the primary audience and decision maker?
- What slide count or talk length should the final deck target?
`;
}

function deckPlan({ title, deckGoal, today }) {
  return `# Deck Plan

Date: ${today}
Deck title: ${title}

## Contract

- deck_job: Replace with pitch, teaching, executive decision, product demo, research brief, or proposal.
- audience: Replace with the named audience and decision maker.
- presenter: Replace with who will speak.
- target_next_action: Replace with the action the deck should earn.
- talk_length: Replace with talk length or async-reading target.
- output_format: HTML draft first, exports only after QA.

## Promise

${deckGoal}

## Audience Shift

- from: Replace with what the audience believes, doubts, or does now.
- to: Replace with what they should believe, understand, decide, or do after the deck.

## Proof Spine

1. What is the concrete problem or opportunity?
2. What evidence proves it is real?
3. What options exist?
4. What is the recommended path?
5. What should happen next, by whom, and when?

## Research Plan

| Need | Source target | Proof bar | Status |
|---|---|---|---|
| Market or context | User files, official sources, current web checks if allowed | Named source and date-sensitive caveat | TODO |
| Costs or numbers | Vendor pages, quotes, benchmarks, model assumptions | Source plus calculation method | TODO |
| Risks or legality | Official authority pages or qualified expert quote | Source, caveat, and launch implication | TODO |
| User demand | Interview notes, signups, payments, usage logs | Named segment and success signal | TODO |

## Slide Logic

| Slide | Job | Audience question | Proof object | Belongs in main deck because |
|---|---|---|---|---|
| 1 | Hook | Why should I care? | Concrete promise | It frames the deck. |
| 2 | Recommendation | What should we do? | Decision gate | It gives the answer early. |
| 3 | Evidence | Why believe this? | Claim-ledger backed exhibit | It earns trust. |
| 4 | Action | What happens next? | Owner, timing, output | It turns the deck into work. |

## Design Direction

Choose one before rendering:

- clean-light: safest for consulting, source-heavy decks and executive review.
- warm-editorial-light: better for community, culture, education and founder proposals.
- dark-runtime: use only when the setting or content really benefits from a dark technical mood.

Record the chosen theme in \`work/design-contract.json\`.

## QA Plan

- Title-only slide sorter reads as a coherent story.
- Every factual slide claim has a claim ID.
- Dense material moves to appendix or a table.
- Browser QA checks desktop, laptop and mobile widths.
- Speaker notes are humanized after the source audit.

## Open Questions

- What is the strongest objection this deck must answer?
- What decision should the audience make immediately after viewing?
- Which details belong in appendix rather than the live story?
`;
}

function sourceMap({ today }) {
  return `# Source Map

Date: ${today}

Status: starter scaffold.

Sources reviewed:
- TODO: list files under \`input/sources/\`, \`input/data/\`, \`input/brand/\`, or \`input/codebase/\`.

Source caveats:
- No factual claims should be presented as final until this file names the source and the claim ledger cites it.
`;
}

function claimLedger({ title }) {
  return {
    claims: [
      {
        claim_id: "claim_001",
        claim: `The starter deck for ${title} was generated from local scaffolding and still needs source review before factual use.`,
        type: "assumption",
        source: {
          path: "scripts/create-deck-artifacts.mjs",
          note: "Generated scaffold claim so validators can run before source review."
        },
        evidence: "The generator creates starter artifacts and prints that assumptions must be replaced with sourced claims.",
        confidence: "high",
        allowed_slide_use: ["starter caveat"]
      }
    ]
  };
}

function audienceModel({ title }) {
  return {
    segments: [
      {
        id: "primary_audience",
        role: "Replace with primary audience for " + title,
        decision_power: "unknown",
        current_knowledge: ["Unknown until intake is completed."],
        stakes: ["Needs a clear, accurate deck without unsupported claims."],
        success_criteria: ["Understands the deck goal and knows what to do next."],
        likely_questions: [
          {
            id: "q_evidence",
            question: "What evidence supports the most important claims?",
            priority: "high"
          }
        ],
        objections: [
          {
            id: "objection_proof",
            objection: "This may sound unproven until evidence is shown.",
            severity: "high"
          }
        ],
        jargon: {
          allowed: [],
          define_on_first_use: ["claim ledger", "source audit"],
          avoid: ["generic AI hype"]
        }
      }
    ],
    audience_pov_critique: {
      what_they_care_about: "A clear answer to the deck goal.",
      what_will_feel_unproven: "Any claim not linked to the claim ledger.",
      where_deck_sounds_like_us_not_them: "Any slide that describes the process instead of the audience outcome.",
      required_reframe: "Replace process-first language with audience-first outcomes during review."
    }
  };
}

function storySpine({ title }) {
  return {
    audience_shift: {
      from: "Unsure what the deck is asking them to understand or decide.",
      to: "Understands the core message and knows the next step."
    },
    throughline: `${title} should move from why this matters to what changes and what action follows.`,
    beats: [
      {
        id: "beat_open",
        role: "hook",
        slide_ids: ["slide_01"],
        transition: "Open with the outcome, not the process.",
        audience_question_ids: ["q_evidence"]
      },
      {
        id: "beat_change",
        role: "insight",
        slide_ids: ["slide_02"],
        transition: "Explain the change in simple language.",
        handles_objection_ids: ["objection_proof"]
      },
      {
        id: "beat_close",
        role: "close",
        slide_ids: ["slide_03"],
        transition: "Close with the next action."
      }
    ]
  };
}

function slideSorter({ title }) {
  return `# Slide Sorter

1. ${title}
2. The clearest version of the idea
3. Next step
`;
}

function contentPriority({ title }) {
  return `# Content Priority

main_deck_budget:
- talk_length_minutes: unknown
- target_main_slides: 3
- backup_slide_budget: 0
- timing_assumption: Starter scaffold uses three short slides until intake defines the real talk length.

selection_principles:
- Keep slides that directly support the deck goal.
- Move detailed evidence into backup when it is useful for Q&A but not needed for the main story.
- Drop unsupported claims instead of hiding them in small text.

main_deck:
1. [keep] ${title}
   - reason: Establish the topic and draft caveat.
   - audience_question_ids: []
   - claim_ids: []
   - visual_aid: none
2. [keep] The clearest version of the idea
   - reason: Explain the scaffold-to-final gap.
   - audience_question_ids: ["q_evidence"]
   - claim_ids: ["claim_001"]
   - visual_aid: comparison
3. [keep] Next step
   - reason: Close with source review as the immediate action.
   - audience_question_ids: []
   - claim_ids: []
   - visual_aid: quote

backup_or_appendix:
- none yet

dropped_or_deferred:
- [defer] Any factual claim not yet in the claim ledger.
  - reason: Starter artifacts must not invent evidence.
`;
}

function visualAidPlan() {
  return {
    visual_aids: [
      {
        slide_id: "slide_01",
        type: "none",
        purpose: "Opening frame only."
      },
      {
        slide_id: "slide_02",
        type: "comparison",
        purpose: "Show the key change without a dense paragraph."
      },
      {
        slide_id: "slide_03",
        type: "quote",
        purpose: "End with a short memorable action."
      }
    ]
  };
}

function slideSpecs({ title, theme: themeName }) {
  return {
    deck: {
      title,
      theme: themeName,
      size: "16:9",
      paginate: true
    },
    slides: [
      {
        slide_id: "slide_01",
        slide_job: "hook",
        layout: "title",
        eyebrow: "Draft",
        title,
        subtitle: "Starter deck scaffold. Replace with sourced content before presenting.",
        claim_ids: [],
        unsupported_claims: [],
        no_claims_reason: "Opening frame and explicit draft caveat.",
        visual_aid: {
          type: "none",
          purpose: "Set context without adding unsourced proof."
        },
        speaker_notes: {
          key_message: "This is a starter scaffold, not a final sourced deck.",
          talk_track: ["State the deck goal.", "Name the source review still required."],
          timing_seconds: 25
        }
      },
      {
        slide_id: "slide_02",
        slide_job: "insight",
        layout: "comparison",
        title: "Replace placeholders with sourced evidence",
        left: {
          title: "Starter",
          body: ["Assumptions are visible.", "Claims are not final.", "Review is still required."]
        },
        right: {
          title: "Final",
          body: ["Claims map to sources.", "Slides answer audience questions.", "QA passes before export."]
        },
        claim_ids: ["claim_001"],
        claim_use: "starter caveat",
        unsupported_claims: [],
        visual_aid: {
          type: "comparison",
          purpose: "Make the scaffold-to-final gap visible.",
          validation: {
            expected: "Two panels remain legible and balanced.",
            fallback: "Use a static two-bullet explanation if the comparison crowds.",
            browser_check_required: true
          }
        },
        speaker_notes: {
          key_message: "The generator creates a safe starting point, not fake certainty.",
          talk_track: ["Explain what the scaffold did.", "Explain what the agent must replace."],
          timing_seconds: 60,
          claim_ids: ["claim_001"]
        }
      },
      {
        slide_id: "slide_03",
        slide_job: "close",
        layout: "quote",
        title: "Next step",
        quote: "Replace assumptions with evidence before polishing the deck.",
        claim_ids: [],
        unsupported_claims: [],
        no_claims_reason: "Closing instruction rather than factual support.",
        visual_aid: {
          type: "quote",
          purpose: "Close with a clear operating instruction."
        },
        speaker_notes: {
          key_message: "The next step is source review.",
          talk_track: ["Do not treat the scaffold as final.", "Use the claim ledger as the accuracy spine."],
          timing_seconds: 30
        }
      }
    ]
  };
}

function designContract({ themeName, today }) {
  return {
    version: 1,
    source: { type: "generated_fallback", references: ["scripts/create-deck-artifacts.mjs"] },
    direction: {
      personality: themeName,
      audience_fit: "General professional review.",
      density: "balanced",
      depth: "borders_only",
      grid: "strict"
    },
    tokens: {
      colors: {
        background: "#fbfcfd",
        surface: "#ffffff",
        text: "#172026",
        muted: "#5e6b73",
        accent: "#176b87",
        secondary_accent: "#2f7d5a",
        border: "#d9e1e6"
      },
      typography: {
        heading: "Aptos, Avenir Next, Helvetica Neue, Arial, sans-serif",
        body: "Aptos, Avenir Next, Helvetica Neue, Arial, sans-serif",
        mono: "SF Mono, Cascadia Code, Consolas, monospace",
        scale: ["16px", "20px", "24px", "32px", "48px", "64px"]
      },
      spacing: { base: "4px", scale: ["8px", "12px", "16px", "20px", "24px", "32px", "64px"] },
      radius: ["8px"],
      shadow: []
    },
    patterns: {
      title_slide: "Large left-aligned title with short subtitle.",
      section_slide: "Sparse section marker.",
      comparison_slide: "Two balanced panels.",
      table_slide: "Thin dividers and low density.",
      code_slide: "Readable code block with caption.",
      architecture_slide: "Few nodes, large labels."
    },
    rules: {
      avoid: ["generic AI filler", "unsupported proof", "tiny text"],
      must_preserve: ["source caveats", "clear hierarchy", "left-aligned body text"],
      accessibility: ["normal text contrast >= 4.5:1", "large text contrast >= 3:1"]
    },
    decisions: [
      {
        decision: "Use a conservative generated fallback design contract.",
        rationale: "No approved theme file was found for the requested theme.",
        date: today
      }
    ]
  };
}

function qualityRubric({ deckGoal }) {
  return {
    version: 1,
    deck_mode: "custom",
    target: {
      overall_score: 85,
      minimum_slide_score: 75,
      max_repair_iterations: 3,
      stop_condition: "ready_for_human_review or honestly blocked on evidence"
    },
    hard_gates: [
      {
        id: "source_grounding",
        type: "validator",
        command: "npm run lint:claim-refs -- <project>",
        requirement: "Every factual slide claim must resolve to the claim ledger."
      },
      {
        id: "browser_qa",
        type: "browser_qa",
        command: "npm run qa:browser -- <project>",
        requirement: "Rendered HTML has no overflow, clipping, or contrast blockers."
      },
      {
        id: "human_review",
        type: "human_review",
        requirement: "A reviewer has checked audience clarity, visual hierarchy, and overclaim risk."
      }
    ],
    dimensions: [
      {
        id: "audience_fit",
        label: "Audience fit",
        weight: 15,
        question: "Does the deck speak to what this audience cares about?",
        pass_criteria: ["Audience and decision context are explicit.", "Likely objections are handled.", "Jargon is defined or removed."],
        repair_guidance: "Rewrite from the audience's point of view before changing visuals."
      },
      {
        id: "story_flow",
        label: "Story flow",
        weight: 15,
        question: "Do the slide titles form a coherent argument?",
        pass_criteria: ["The opening names the benefit.", "Each slide earns its place.", "The close names the next action."],
        repair_guidance: "Fix the slide sorter and story spine before editing individual slides."
      },
      {
        id: "evidence_strength",
        label: "Evidence strength",
        weight: 20,
        question: "Are important claims supported at the required proof bar?",
        pass_criteria: ["Factual claims have claim IDs.", "Evidence gaps are caveated.", "Weak proof is moved to backup or removed."],
        repair_guidance: "Add sources, reduce claim strength, or move unsupported detail out of the main deck."
      },
      {
        id: "visual_explanation",
        label: "Visual explanation",
        weight: 15,
        question: "Do visuals explain, prove, compare, or guide a demo?",
        pass_criteria: ["Visuals perform a clear job.", "Tables and diagrams are readable.", "Hard ideas are not buried in paragraphs."],
        repair_guidance: "Change the visual structure before adding decoration."
      },
      {
        id: "design_polish",
        label: "Design polish",
        weight: 15,
        question: "Does the rendered deck feel intentional and non-generic?",
        pass_criteria: ["Hierarchy is clear.", "Spacing follows the design contract.", "No generic AI filler patterns dominate."],
        repair_guidance: "Repair hierarchy, spacing, density, and theme consistency one slide type at a time."
      },
      {
        id: "delivery_readiness",
        label: "Delivery readiness",
        weight: 10,
        question: "Can a presenter deliver this naturally within the time limit?",
        pass_criteria: ["Speaker notes are speakable.", "Transitions are clear.", "Timing roughly matches the deck length."],
        repair_guidance: "Humanize notes without adding claims, then rerun claim-reference checks."
      },
      {
        id: "qa_readiness",
        label: "Q&A readiness",
        weight: 10,
        question: "Can the presenter answer the questions this deck naturally raises?",
        pass_criteria: ["Likely questions are represented.", "Backup needs are clear.", "Limitations are not hidden."],
        repair_guidance: "Move secondary proof into backup and write direct answers for high-priority questions."
      }
    ],
    role_reviews: {
      researcher: `Check whether sources are sufficient for: ${deckGoal}`,
      story_strategist: "Check the story spine, content priority, and slide sorter before scoring visuals.",
      designer: "Review screenshots against the design contract, not personal taste alone.",
      critic: "Review from the audience point of view and identify the smallest repairs that improve the deck."
    }
  };
}

function reviewLog({ deckGoal, today }) {
  return {
    deck_goal: deckGoal,
    sessions: [
      {
        date: today,
        summary: "Starter review log created so recurring issues have a place to live.",
        slide_reviews: [
          {
            slide_id: "slide_01",
            decision: "story_edit",
            note: "Replace starter framing after source review.",
            repair_target: "intake-brief.md"
          }
        ],
        recurring_issues: ["Do not present generated assumptions as facts."],
        new_rules: ["Replace starter claims before final render."]
      }
    ]
  };
}

function inferTitle(brief) {
  const topicLine = brief.split(/\r?\n/).find((line) => /^topic\s*:/i.test(line));
  const topic = topicLine?.split(":").slice(1).join(":").trim();
  if (topic && !/^replace this/i.test(topic)) return topic;
  const heading = brief.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading && heading !== "Deck Brief" ? heading : "Untitled Deck";
}

function inferGoal(brief, title) {
  const goalLine = brief.split(/\r?\n/).find((line) => /^goal\s*:/i.test(line));
  const goal = goalLine?.split(":").slice(1).join(":").trim();
  if (goal && !/^replace this/i.test(goal)) return goal;
  return `Create a clear, source-grounded deck about ${title}.`;
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

async function exists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}
