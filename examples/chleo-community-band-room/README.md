# Chleo Lee Community Band Room Proposal

Static HTML proposal deck for a Singapore community band room. It is designed as a pitch and action plan for Chleo Lee: why the room matters, how to validate demand, where to find early users, how to scout a legal site, what to buy first, what to quote, what it may cost, and how to move over 90 days.

The deck uses a fixed 16:9 presenter stage with keyboard navigation, overview mode, speaker notes and touch/wheel navigation. On mobile, the same stage scales to the phone width so the slide design stays intact instead of becoming a broken scroll page.

What this example demonstrates:

- Source-backed proposal flow for a real-world business idea.
- Clear artifact trail: brief, claim ledger, story spine, slide specs, QA notes and repair plan.
- Human review repairs: better copy, practical steps, inline peer labels, balanced whitespace, footer clearance, mobile scaling and presenter mode.
- A publishable static HTML deck that can be hosted directly from GitHub Pages.

## How This Teaches Non-Slop Slide Making

Read this as a feedback loop, not just a finished deck:

- `work/intake-brief.md` defines the audience shift, assumptions and open questions before slides are written.
- `work/slide-sorter.md` proves the deck works as a title-only argument.
- `work/claim-ledger.json` separates sourced facts from inferences and limits where claims may be used.
- `qa/slides-generator-feedback.md` records what failed in the first draft and what rules changed.
- `qa/qa-report.md` shows how the deck was repaired, browser-tested and left with explicit accuracy limits.

Market pricing, rents, equipment prices and regulations are date-sensitive. Recheck those claims before reusing this proposal for a real lease or purchase decision.

Open locally:

```bash
open deck/index.html
```

Serve locally for browser testing:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/examples/chleo-community-band-room/deck/` from the repo root, or `http://127.0.0.1:4173/deck/` from this example folder.

Publish options:

- GitHub Pages: publish the `slide-generator` repo from `main` and open `examples/chleo-community-band-room/`. This example's `index.html` redirects to `deck/`.
- Netlify or Vercel: drag-and-drop or connect the repository as a static site.
- Cloudflare Pages: connect a Git repository or upload the built static files.
- Any static host: upload `index.html`, `deck.html`, `work/` and `qa/`.

Validation used:

```bash
node scripts/validate-claim-ledger.mjs examples/chleo-community-band-room
node scripts/validate-design-contract.mjs examples/chleo-community-band-room
node scripts/validate-slide-specs.mjs examples/chleo-community-band-room
```

Browser QA summary: see `qa/qa-report.md`.

The proposal is source-backed, but legal feasibility is site-specific. Before signing a lease or starting renovation, confirm the exact operating model and address with the relevant authorities, landlord and a Qualified Person where needed. Public showcases are treated as a later phase, not a launch assumption.
