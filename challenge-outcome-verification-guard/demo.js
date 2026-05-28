const fs = require("fs");
const path = require("path");
const { evaluateChallengeOutcome, renderMarkdownReport } = require("./index");
const {
  conditionalMaterialsChallenge,
  readyClimateChallenge,
  riskyBiomarkerChallenge
} = require("./sample-data");

const root = __dirname;
const reports = path.join(root, "reports");
fs.mkdirSync(reports, { recursive: true });

const packets = [
  readyClimateChallenge,
  riskyBiomarkerChallenge,
  conditionalMaterialsChallenge
].map(evaluateChallengeOutcome);

for (const packet of packets) {
  fs.writeFileSync(path.join(reports, `${packet.challengeId}.json`), `${JSON.stringify(packet, null, 2)}\n`);
}

fs.writeFileSync(path.join(reports, "outcome-verification-report.md"), renderMarkdownReport(packets));

const released = packets.reduce((sum, packet) => sum + packet.decision.releaseCents, 0);
const held = packets.reduce((sum, packet) => sum + packet.decision.holdCents, 0);
const critical = packets.reduce((sum, packet) => sum + packet.summary.findingCounts.critical, 0);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#0f172a"/>
  <rect x="52" y="54" width="856" height="432" rx="8" fill="#f8fafc"/>
  <text x="88" y="112" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#0f172a">Challenge Outcome Verification Guard</text>
  <text x="88" y="160" font-family="Arial, sans-serif" font-size="20" fill="#334155">Post-award checks before final payout, bonus release, or IP handoff.</text>
  <g transform="translate(88 215)">
    <rect width="220" height="112" rx="6" fill="#dcfce7"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#166534">${released / 100}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#166534">USD releasable</text>
  </g>
  <g transform="translate(370 215)">
    <rect width="220" height="112" rx="6" fill="#fee2e2"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#991b1b">${held / 100}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#991b1b">USD held</text>
  </g>
  <g transform="translate(652 215)">
    <rect width="220" height="112" rx="6" fill="#e0f2fe"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#075985">${critical}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#075985">critical gates</text>
  </g>
  <text x="88" y="400" font-family="Arial, sans-serif" font-size="20" fill="#334155">Synthetic data only. No external services, live users, credentials, or private challenge data.</text>
</svg>`;
fs.writeFileSync(path.join(reports, "summary.svg"), svg);

console.log(`Wrote ${packets.length} outcome packets to ${reports}`);
