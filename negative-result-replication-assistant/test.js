const assert = require("assert");
const { analyzeResearchPacket, digest } = require("./index");
const { balancedPacket, riskyPacket, gapPacket } = require("./sample-data");

const balanced = analyzeResearchPacket(balancedPacket);
assert.strictEqual(balanced.summary.lane, "ready");
assert.strictEqual(balanced.summary.findingCounts.high, 0);
assert.ok(balanced.claimResults[0].independentReplicationCount >= 1);

const risky = analyzeResearchPacket(riskyPacket);
assert.strictEqual(risky.summary.lane, "hold");
assert.ok(risky.summary.findingCounts.high >= 3);
assert.ok(risky.summary.reviewerActions.some((action) => action.code === "uncited-negative-results"));
assert.ok(risky.summary.reviewerActions.some((action) => action.code === "overbroad-positive-claim"));
assert.ok(risky.researchGapPrompts.some((prompt) => prompt.priority === "high"));

const gap = analyzeResearchPacket(gapPacket);
assert.strictEqual(gap.summary.lane, "review");
assert.ok(gap.summary.reviewerActions.some((action) => action.code === "replication-debt"));
assert.ok(gap.summary.reviewerActions.some((action) => action.code === "dependency-lock-missing"));

const digestA = digest({ packet: riskyPacket, result: risky });
const digestB = digest({ result: risky, packet: riskyPacket });
assert.strictEqual(digestA, digestB);

console.log("negative-result-replication-assistant: all tests passed");
