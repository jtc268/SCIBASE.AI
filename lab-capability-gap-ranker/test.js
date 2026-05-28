const assert = require("assert");
const {
  buildOpportunityFeed,
  capabilityFit,
  evidenceStrength,
  noveltyScore,
  profileFit,
  rankOpportunity
} = require("./index");
const { climateLabPacket, neuroLabPacket } = require("./sample-data");

const perfectCapability = capabilityFit(neuroLabPacket.lab, neuroLabPacket.opportunities[0]);
assert.equal(perfectCapability.score, 100);
assert.deepEqual(perfectCapability.missingMethods, []);
assert.deepEqual(perfectCapability.missingInstruments, []);

const missingCapability = capabilityFit(neuroLabPacket.lab, neuroLabPacket.opportunities[1]);
assert(missingCapability.score < 100);
assert(missingCapability.missingMethods.includes("7T MRI"));
assert(missingCapability.missingInstruments.includes("7T MRI"));

const profile = profileFit(neuroLabPacket.profile, neuroLabPacket.opportunities[0]);
assert(profile.score > 50);
assert(profile.interestHits.includes("single-cell RNA-seq"));

assert(evidenceStrength(neuroLabPacket.opportunities[0]) > evidenceStrength(neuroLabPacket.opportunities[1]));
assert(noveltyScore(neuroLabPacket.opportunities[2]) > 70);

const topRank = rankOpportunity(neuroLabPacket.profile, neuroLabPacket.lab, neuroLabPacket.opportunities[0]);
assert.equal(topRank.lane, "start-next");
assert(topRank.score >= 75);
assert.equal(topRank.findings.length, 0);

const difficultRank = rankOpportunity(neuroLabPacket.profile, neuroLabPacket.lab, neuroLabPacket.opportunities[1]);
assert(["hold", "partner-before-start"].includes(difficultRank.lane));
assert(difficultRank.findings.some((finding) => finding.code === "instrument-gap"));
assert(difficultRank.findings.some((finding) => finding.code === "budget-exceeded"));

const climateFeed = buildOpportunityFeed(climateLabPacket);
assert.equal(climateFeed.rankedOpportunities[0].id, "gap-sensor-scarce-floods");
assert.equal(climateFeed.summary.startNextCount, 1);
assert.equal(climateFeed.summary.holdCount, 1);
assert.match(climateFeed.auditDigest, /^[a-f0-9]{64}$/);

const feedA = buildOpportunityFeed(neuroLabPacket);
const feedB = buildOpportunityFeed(neuroLabPacket);
assert.equal(feedA.auditDigest, feedB.auditDigest);

console.log("lab-capability-gap-ranker: all tests passed");
