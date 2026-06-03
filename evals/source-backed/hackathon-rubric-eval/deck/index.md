---
marp: true
theme: dark-runtime
paginate: true
size: 16:9
title: "Build The Demo Judges Can Score"
---

<!-- _class: title -->

<!-- slide_id: slide_01 -->

<!-- _paginate: skip -->

<p class="eyebrow">Hackathon demo deck</p>

# Judges cannot score what they cannot verify

<p class="subtitle">Build the pitch around the proof they can inspect in the room.</p>

<!--
Key message: The deck is about making proof easy to judge, not showing every feature.
Talk track:
- Start by naming the practical pressure: judges have limited time.
- Explain that the team should design for scoring and recall.
- Avoid saying this format guarantees a win.
Avoid saying: This is the only way to win a hackathon.
Timing: 25s
Claims: claim_005
-->

---

<!-- _class: table -->

<!-- slide_id: slide_02 -->

## Rubric first, story second

| Judging lens | Main-deck job | Backup proof |
| --- | --- | --- |
| Idea quality | Problem and user benefit | Research notes |
| Implementation | Working demo path | Architecture details |
| Potential impact | Why it matters now | Use cases or adoption |
| Event process | Follow the judging flow | Submission checklist |

<!--
Key message: The rubric is the first content filter.
Talk track:
- Devpost and MLH both point to judging as an explicit process.
- Do not copy this table blindly; replace it with the event rubric.
- Use backup for evidence judges may ask for but do not need in the main story.
Delivery cues: Point to the left column first, then the deck job.
Timing: 40s
Claims: claim_001, claim_002
-->

---

<!-- _class: comparison -->

<!-- slide_id: slide_03 -->

## Prune by score movement, not effort spent

<div class="comparison">
<div class="panel panel-was">
<h3>Main deck</h3>
<ul>
<li>Problem and benefit</li>
<li>Working path</li>
<li>Hard proof</li>
<li>Next ask</li>
</ul>
</div>
<div class="panel panel-is">
<h3>Backup</h3>
<ul>
<li>Full architecture</li>
<li>Extra edge cases</li>
<li>Dataset details</li>
<li>Future roadmap</li>
</ul>
</div>
</div>

<!--
Key message: Time is a constraint; backup is a feature, not a failure.
Talk track:
- Connect short-pitch discipline to the goal of earning the next conversation.
- Tell builders to keep proof available without crowding the main story.
- Use the one-slide-per-minute rule as a planning default, not a law.
Timing: 35s
Claims: claim_003, claim_005
-->

---

<!-- _class: architecture -->

<!-- slide_id: slide_04 -->

## Make the demo route reliable

- Show the route before the live action.
- Keep a screenshot, recording, or logs ready if runtime fails.

<div class="flow-diagram">
<div class="flow-node">Problem</div>
<div class="flow-arrow">→</div>
<div class="flow-node">Input</div>
<div class="flow-arrow">→</div>
<div class="flow-node">System action</div>
<div class="flow-arrow">→</div>
<div class="flow-node">Visible result</div>
<div class="flow-arrow">→</div>
<div class="flow-node">Fallback proof</div>

</div>

<!--
Key message: A calm demo plan makes the team look more credible.
Talk track:
- Name the demo route before clicking anything live.
- Explain what judges should watch for.
- If the live path breaks, switch to the fallback proof without apologizing for too long.
Timing: 45s
Claims: claim_002, claim_006
-->

---

<!-- _class: table -->

<!-- slide_id: slide_05 -->

## Prove the hard part

| If asked | Show | Do not fake |
| --- | --- | --- |
| Does it work? | Logs or demo output | Invented metrics |
| Why is it hard? | Architecture choice | Buzzword stack |
| Can it scale? | Known bottleneck | Unmeasured claims |
| What failed? | Limitation and next test | Perfect story |

<!--
Key message: Technical depth is strongest when it is specific, honest, and inspectable.
Talk track:
- Explain that technical slides should answer judge questions.
- Invite teams to show limitations instead of hiding them.
- Project-specific accuracy, speed, cost, and latency need real measurements.
Avoid saying: Our model is best unless you have a measured source.
Timing: 45s
Claims: claim_004, claim_006
-->

---

<!-- _class: quote -->

<!-- slide_id: slide_06 -->

<blockquote>We solve this problem, for this user, with this working proof, and this is the next step.</blockquote>

<p class="quote-title">End with the sentence judges can retell</p>

<!--
Key message: The final review should ask whether the idea is clear, credible, and worth the next action.
Talk track:
- Use the sentence as a rehearsal test.
- If the team cannot fill one slot honestly, the idea or evidence needs work.
- Move extra technical material to Q&A and backup.
Delivery cues: Pause before the quoted sentence.
Timing: 30s
Claims: claim_003, claim_004, claim_005
-->