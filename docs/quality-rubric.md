# Deck Quality Rubric

Use this rubric during critique and QA.

## Story

- Slide titles tell a coherent story when read alone.
- Each slide has one job.
- Adjacent slides do not repeat the same point.
- The deck has a visible arc: hook, problem, insight, proof, implication, action.
- The ending tells the audience what to remember or do.

## Accuracy

- Every factual claim maps to a claim ID.
- Every chart maps to source data.
- Every architecture diagram maps to code or source evidence.
- Inferences and assumptions are labeled.
- Caveats appear where the evidence requires them.

## Visual Explanation

- The main visual proves the slide title.
- Hard ideas use a visual aid, not a paragraph.
- Before/after and was/is comparisons are explicit when change is the point.
- Architecture slides split context, runtime flow, error paths, and trust boundaries.
- Code snippets are short and explain why the code matters.

## Design

- Theme matches audience and setting. Dark mode is not a default.
- Layout uses a visible grid.
- Labels are readable on a laptop and projector.
- Color has semantic meaning.
- Whitespace is used to create confidence, not emptiness.
- The deck avoids generic SaaS cards, decorative blobs, and fake stock polish.

## Speaker Support

- Speaker notes sound natural when read aloud.
- Notes include transitions and cues, not only paragraphs.
- Notes do not introduce unsupported claims.
- The deck can be delivered within the target time.

## QA Gates

- Text audit passes.
- Source audit passes.
- Deterministic claim checks pass: `validate-claim-ledger.mjs` and `lint-claim-refs.mjs`.
- Architecture evidence check passes when an architecture map exists: `validate-arch-map.mjs`.
- Browser screenshot QA passes.
- Export smoke test passes for the requested output format.

Browser QA should include machine-checkable basics where possible:

- no text overflow (`scrollWidth <= clientWidth` and `scrollHeight <= clientHeight` for checked containers),
- body text contrast is at least 4.5:1 and large text/icon contrast is at least 3:1,
- minimum readable body font is 18px for projected slides unless the slide is explicitly appendix/detail,
- dense lines stay near 45 characters or fewer when meant to be read live.
