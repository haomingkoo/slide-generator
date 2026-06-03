import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2];
const ledgerArg = process.argv[3];
const FACTUAL_TEXT_RE = /(\d|%|\$|\b(?:faster|slower|higher|lower|increase|decrease|reduces?|improves?|removes?|requires?|enables?|supports?|uses?|sends?|calls?|stores?|current|latest|best|first|most|least|benchmark|measured|published|validated|verified|proves?)\b)/i;
const CLAIM_FREE_LAYOUTS = new Set(["title", "section", "quote"]);

if (!target) {
  console.error("Usage: node scripts/lint-claim-refs.mjs <project-dir|slide-specs.json> [claim-ledger.json]");
  process.exit(2);
}

try {
  const { slideSpecsPath, ledgerPath } = await resolvePaths(target, ledgerArg);
  const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
  const slideSpecs = JSON.parse(await readFile(slideSpecsPath, "utf8"));
  const claimsById = new Map(extractClaims(ledger).map((claim) => [claim.claim_id, claim]));
  lintSlides(extractSlides(slideSpecs), claimsById, slideSpecsPath);
  console.log(`claim refs valid: ${slideSpecsPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function resolvePaths(targetPath, ledgerPathArg) {
  const resolved = path.resolve(targetPath);
  const info = await stat(resolved);
  if (info.isDirectory()) {
    return {
      slideSpecsPath: path.join(resolved, "work", "slide-specs.json"),
      ledgerPath: ledgerPathArg ? path.resolve(ledgerPathArg) : path.join(resolved, "work", "claim-ledger.json")
    };
  }
  return {
    slideSpecsPath: resolved,
    ledgerPath: ledgerPathArg ? path.resolve(ledgerPathArg) : path.join(path.dirname(resolved), "claim-ledger.json")
  };
}

function extractClaims(ledger) {
  if (Array.isArray(ledger)) return ledger;
  if (Array.isArray(ledger?.claims)) return ledger.claims;
  throw new Error("claim ledger must be an array or an object with a claims array");
}

function extractSlides(slideSpecs) {
  if (Array.isArray(slideSpecs)) return slideSpecs;
  if (Array.isArray(slideSpecs?.slides)) return slideSpecs.slides;
  if (Array.isArray(slideSpecs?.deck?.slides)) return slideSpecs.deck.slides;
  throw new Error("slide specs must be an array, an object with slides, or an object with deck.slides");
}

function lintSlides(slides, claimsById, slideSpecsPath) {
  if (slides.length === 0) {
    throw new Error(`${slideSpecsPath}: slide specs must contain at least one slide`);
  }

  for (const [index, slide] of slides.entries()) {
    const label = slide?.slide_id ?? slide?.id ?? `slide at index ${index}`;
    if (!slide || typeof slide !== "object" || Array.isArray(slide)) {
      throw new Error(`${slideSpecsPath}: ${label} must be an object`);
    }
    if (!Array.isArray(slide.claim_ids)) {
      throw new Error(`${slideSpecsPath}: ${label} must include claim_ids array`);
    }
    if (!Array.isArray(slide.unsupported_claims)) {
      throw new Error(`${slideSpecsPath}: ${label} must include unsupported_claims array`);
    }
    if (slide.unsupported_claims.length > 0) {
      throw new Error(`${slideSpecsPath}: ${label} has unsupported_claims: ${slide.unsupported_claims.join("; ")}`);
    }
    if (slide.claim_ids.length === 0) {
      if (looksFactual(slide)) {
        throw new Error(`${slideSpecsPath}: ${label} has factual-looking text but no claim_ids`);
      }
      if (slide.layout && !CLAIM_FREE_LAYOUTS.has(slide.layout)) {
        throw new Error(`${slideSpecsPath}: ${label} uses ${slide.layout} layout without claim_ids; add claim IDs or use title/section/quote for claim-free framing`);
      }
      if (typeof slide.no_claims_reason !== "string" || slide.no_claims_reason.trim().length === 0) {
        throw new Error(`${slideSpecsPath}: ${label} has no claim_ids and must include no_claims_reason`);
      }
    } else if (!hasClaimUse(slide)) {
      throw new Error(`${slideSpecsPath}: ${label} references claims and must include claim_use or claim_uses`);
    }
    for (const claimId of slide.claim_ids) {
      if (typeof claimId !== "string" || !claimsById.has(claimId)) {
        throw new Error(`${slideSpecsPath}: ${label} references unknown claim_id ${claimId}`);
      }
      validateClaimUse(slide, claimsById.get(claimId), claimId, label, slideSpecsPath);
    }
  }
}

function hasClaimUse(slide) {
  if (typeof slide.claim_use === "string" && slide.claim_use.trim().length > 0) return true;
  return slide.claim_uses && typeof slide.claim_uses === "object" && !Array.isArray(slide.claim_uses);
}

function validateClaimUse(slide, claim, claimId, slideLabel, slideSpecsPath) {
  const use = typeof slide.claim_use === "string" ? slide.claim_use : slide.claim_uses?.[claimId];
  if (typeof use !== "string" || use.trim().length === 0) {
    throw new Error(`${slideSpecsPath}: ${slideLabel} must declare a use for ${claimId}`);
  }
  if (Array.isArray(claim.allowed_slide_use) && !claim.allowed_slide_use.includes(use)) {
    throw new Error(`${slideSpecsPath}: ${slideLabel} uses ${claimId} as "${use}", not allowed by ledger`);
  }
}

function looksFactual(slide) {
  return collectText(slide)
    .filter((item) => item.key !== "no_claims_reason")
    .some(({ value }) => FACTUAL_TEXT_RE.test(value));
}

function collectText(value, key = "") {
  if (typeof value === "string") {
    if (["slide_id", "id", "claim_use"].includes(key)) return [];
    return [{ key, value }];
  }
  if (Array.isArray(value)) {
    if (["claim_ids", "unsupported_claims"].includes(key)) return [];
    return value.flatMap((item) => collectText(item, key));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([childKey, childValue]) => collectText(childValue, childKey));
  }
  return [];
}
