const fs = require("fs");
const path = require("path");
const { analyzeResearchPacket, renderMarkdownReport } = require("./index");
const { balancedPacket, riskyPacket, gapPacket } = require("./sample-data");

const root = __dirname;
const reports = path.join(root, "reports");
fs.mkdirSync(reports, { recursive: true });

const analyses = [balancedPacket, riskyPacket, gapPacket].map(analyzeResearchPacket);
for (const analysis of analyses) {
  fs.writeFileSync(
    path.join(reports, `${analysis.packetId}.json`),
    `${JSON.stringify(analysis, null, 2)}\n`
  );
}

fs.writeFileSync(path.join(reports, "negative-result-replication-report.md"), renderMarkdownReport(analyses));

const lanes = analyses.map((analysis) => analysis.summary.lane);
const highCount = analyses.reduce((sum, analysis) => sum + analysis.summary.findingCounts.high, 0);
const promptCount = analyses.reduce((sum, analysis) => sum + analysis.researchGapPrompts.length, 0);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#111827"/>
  <rect x="52" y="54" width="856" height="432" rx="8" fill="#f9fafb"/>
  <text x="88" y="112" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">Negative Result and Replication Assistant</text>
  <text x="88" y="160" font-family="Arial, sans-serif" font-size="20" fill="#374151">Routes claims before AI peer-review output is shown.</text>
  <g transform="translate(88 215)">
    <rect width="220" height="112" rx="6" fill="#dcfce7"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#166534">${lanes.filter((lane) => lane === "ready").length}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#166534">ready packets</text>
  </g>
  <g transform="translate(370 215)">
    <rect width="220" height="112" rx="6" fill="#fee2e2"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#991b1b">${highCount}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#991b1b">high-risk findings</text>
  </g>
  <g transform="translate(652 215)">
    <rect width="220" height="112" rx="6" fill="#e0f2fe"/>
    <text x="24" y="46" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#075985">${promptCount}</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="18" fill="#075985">gap prompts</text>
  </g>
  <text x="88" y="400" font-family="Arial, sans-serif" font-size="20" fill="#374151">Synthetic data only. No external services, live users, credentials, or private research data.</text>
</svg>`;
fs.writeFileSync(path.join(reports, "summary.svg"), svg);

console.log(`Wrote ${analyses.length} analysis packets to ${reports}`);
