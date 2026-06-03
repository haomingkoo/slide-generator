# Content Priority

main_deck_budget:
- talk_length_minutes: 8
- target_main_slides: 8
- backup_slide_budget: 0
- timing_assumption: One main slide per minute because this is a short live demo. No appendix is included in the first example deck.

selection_principles:
- Keep the main story focused on why the workflow exists, how it works, and what is ready today.
- Include only repo-backed claims that appear in `claim-ledger.json`.
- Move future roadmap details out of the main story unless they clarify the current boundary.
- Avoid implementation depth that would distract from the trust story.

main_deck:
1. [keep] Build the deck the audience can trust
   - reason: Establishes the deck promise and tone.
   - audience_question_ids: []
   - claim_ids: []
   - visual_aid: none
2. [keep] The problem is not slide creation; it is trust
   - reason: Frames why the repo uses artifacts instead of prompt-to-deck generation.
   - audience_question_ids: ["q_trust"]
   - claim_ids: ["claim_007"]
   - visual_aid: comparison
3. [keep] The repo changes the order of work
   - reason: Shows the workflow as the core product idea.
   - audience_question_ids: ["q_process"]
   - claim_ids: ["claim_001"]
   - visual_aid: architecture flow
4. [keep] Claims are the accuracy spine
   - reason: Makes source grounding concrete.
   - audience_question_ids: ["q_accuracy"]
   - claim_ids: ["claim_002"]
   - visual_aid: table
5. [keep] Agent memory is written to files
   - reason: Explains how long-running work resumes without relying on chat memory.
   - audience_question_ids: ["q_memory"]
   - claim_ids: ["claim_003"]
   - visual_aid: table
6. [keep] Visual QA checks what actually rendered
   - reason: Shows the system is not blind after rendering.
   - audience_question_ids: ["q_visual_quality"]
   - claim_ids: ["claim_004"]
   - visual_aid: table
7. [keep] The handoff boundary stays honest
   - reason: Prevents overclaiming about PPTX, Google Slides, and automation.
   - audience_question_ids: ["q_output_boundary"]
   - claim_ids: ["claim_005", "claim_006"]
   - visual_aid: comparison
8. [keep] Trust is built slide by slide
   - reason: Closes with the operating principle.
   - audience_question_ids: []
   - claim_ids: []
   - visual_aid: quote

backup_or_appendix:
- [backup] Native editable PPTX workflow details
  - reason: Useful if the audience asks about PowerPoint template editing, but not ready enough to sit in the main story.
  - triggered_by: "Can I edit all text and charts in PowerPoint?"
  - claim_ids: ["claim_006"]
- [backup] Native Google Slides API plan
  - reason: Useful roadmap context, but currently future work.
  - triggered_by: "Can this create native Google Slides?"
  - claim_ids: ["claim_006"]

dropped_or_deferred:
- [defer] Claims about beating commercial AI presentation tools
  - reason: The demo has no comparative benchmark.
- [defer] Fully automated Deep Agents runner
  - reason: The repo documents the future runner boundary but does not implement it yet.
