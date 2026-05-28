const assert = require("assert");
const { evaluateChallengeOutcome, targetStatus } = require("./index");
const {
  conditionalMaterialsChallenge,
  readyClimateChallenge,
  riskyBiomarkerChallenge
} = require("./sample-data");

const lowerTarget = targetStatus({
  direction: "lower-is-better",
  threshold: 10,
  observed: 10.4,
  tolerancePct: 5,
  evidenceArtifactId: "artifact"
});
assert.equal(lowerTarget.passed, true);

const higherTarget = targetStatus({
  direction: "higher-is-better",
  threshold: 0.8,
  observed: 0.77,
  tolerancePct: 2,
  evidenceArtifactId: "artifact"
});
assert.equal(higherTarget.passed, false);
assert.equal(higherTarget.reason, "metric-drift");

const ready = evaluateChallengeOutcome(readyClimateChallenge);
assert.equal(ready.decision.lane, "release-final-and-bonus");
assert.equal(ready.decision.releaseCents, 10000000);
assert.equal(ready.findings.length, 0);
assert.equal(ready.summary.passedTargets, 2);
assert.match(ready.auditDigest, /^[a-f0-9]{64}$/);

const risky = evaluateChallengeOutcome(riskyBiomarkerChallenge);
assert.equal(risky.decision.lane, "block-final-payout");
assert.equal(risky.decision.releaseCents, 0);
assert(risky.findings.some((finding) => finding.code === "unresolved-safety-event"));
assert(risky.findings.some((finding) => finding.code === "escrow-underfunded"));
assert(risky.findings.some((finding) => finding.code === "ip-released-before-funded-settlement"));
assert(risky.summary.findingCounts.critical >= 2);

const conditional = evaluateChallengeOutcome(conditionalMaterialsChallenge);
assert.equal(conditional.decision.lane, "release-final-with-conditions");
assert.equal(conditional.decision.releaseCents, 4000000);
assert.equal(conditional.decision.holdCents, 1000000);
assert(conditional.findings.some((finding) => finding.code === "award-notice-incomplete"));

const cloneA = evaluateChallengeOutcome(readyClimateChallenge);
const cloneB = evaluateChallengeOutcome(readyClimateChallenge);
assert.equal(cloneA.auditDigest, cloneB.auditDigest);

console.log("challenge-outcome-verification-guard: all tests passed");
