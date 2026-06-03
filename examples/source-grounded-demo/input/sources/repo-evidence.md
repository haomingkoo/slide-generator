# Repo Evidence Notes

These notes point to existing repo files and are used by the demo deck claim ledger.

## README Core Idea

`README.md` describes the safer flow as:

`sources -> evidence -> story -> visual aids -> render -> critique -> audit -> QA -> export`

It also states that every phase writes an artifact to disk so a later repair does not need to reread every source file.

## README No-Hallucination Rule

`README.md` says every factual slide claim must appear in `claim-ledger.json`.

## README Long-Running Agent Reliability

`README.md` says durable state lives under `projects/<name>/work/`, including intake, source map, claim ledger, audience model, story spine, slide sorter, visual aid plan, design contract, and slide specs.

## Browser QA Script

`scripts/browser-qa-marp.mjs` checks rendered slide count, presenter notes, presenter controls, overflow, out-of-bounds elements, contrast, keyboard navigation, screenshots, and motion/interaction primitives.

## README Output Modes

`README.md` says PPTX export is the current PowerPoint and Google Slides handoff path, and native Google Slides API generation is planned rather than claimed today.

## Agentic Execution

`docs/agentic-execution.md` states that the repo is not yet a fully automated server-side agent runner and does not currently include LangGraph, Deep Agents, Temporal, a queue, or hosted orchestration.

## Engineering Standard

`README.md` says the repo should not hide weak work behind polished output and names rules against hidden fallbacks, unexplained hardcoded choices, hand-waving slides, fake evidence, silent downgrade, and overclaiming.
