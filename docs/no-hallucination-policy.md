# No Hallucination Policy

Accuracy is a hard gate. A deck may be beautiful and still fail if it invents facts.

## Claim Types

Every factual claim must be tagged:

- `user_file`: directly supported by uploaded/source material.
- `codebase`: directly supported by local code.
- `external_source`: supported by cited research.
- `inference`: reasoned from evidence, but not directly stated.
- `assumption`: useful framing that needs user confirmation.

## Claim Ledger Fields

```json
{
  "claim_id": "claim_001",
  "claim": "DPO removes the need for a separate reward model.",
  "type": "external_source",
  "source": {
    "kind": "paper",
    "title": "Direct Preference Optimization",
    "url": "https://arxiv.org/abs/2305.18290"
  },
  "evidence": "The paper derives the DPO objective from preference data without fitting a reward model.",
  "confidence": "high",
  "allowed_slide_use": ["method comparison", "mechanism explanation"]
}
```

## Failure Conditions

Fail source audit when:

- a number has no source,
- a quote has no source,
- a chart has no data source,
- a diagram node or edge is not supported by source, code, or an explicit inference label,
- a code snippet is not from the codebase,
- a benchmark mixes sources without a caveat,
- a generated image implies a real event, customer, product, or result that did not happen,
- a slide title states a stronger conclusion than the evidence supports.

## User-Requested Claims

A user request does not create evidence. If the user asks for a punchy claim such as "10x faster," "best," "proven," or "industry-leading," map it to evidence before using it.

If evidence is missing, downgrade the claim, label it as an assumption, or ask for a source. Do this during intake when possible, not only after the deck is rendered.

If the deck goal depends on information the provided sources do not contain, record the evidence gap. Search only when the source policy allows it. Otherwise ask the user for sources or keep the claim out of the main deck.

## Evidence Distortion

The deck also fails when a claim is traceable but distorted. Common failures:

- paraphrasing beyond what the source says,
- mixing units or time periods,
- omitting a caveat that changes meaning,
- turning an inference into a fact,
- presenting one source as settled when sources conflict.

## Repair Rules

When a claim fails:

1. Remove it if it is not necessary.
2. Soften it if it is an inference.
3. Ask for confirmation if it is an assumption.
4. Add a source only if research mode permits it.
5. Keep the caveat visible when evidence is directional or pre-measurement.

Do not hide uncertainty in speaker notes while presenting certainty on the slide.
