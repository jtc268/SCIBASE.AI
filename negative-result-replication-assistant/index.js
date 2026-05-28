const crypto = require("crypto");

const RESULT_WEIGHT = {
  positive: 2,
  supportive: 2,
  replication: 2,
  mixed: 0,
  null: -1,
  negative: -2,
  contradictory: -2,
  "failed-replication": -3
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash("sha256").update(stableJson(value)).digest("hex");
}

function overlap(left, right) {
  const rightSet = new Set(asArray(right).map(normalize));
  return asArray(left).some((item) => rightSet.has(normalize(item)));
}

function claimEvidence(claim, evidenceLedger) {
  const claimTopics = asArray(claim.topics);
  return asArray(evidenceLedger).filter((entry) => {
    if (entry.claimIds && entry.claimIds.includes(claim.id)) return true;
    return overlap(claimTopics, entry.topics || entry.tags);
  });
}

function resultWeight(entry) {
  return RESULT_WEIGHT[normalize(entry.result)] || 0;
}

function citationIds(claim) {
  return new Set(asArray(claim.citedEvidenceIds).map(String));
}

function classifyEvidence(claim, evidence) {
  const cited = citationIds(claim);
  const supportive = [];
  const negative = [];
  const uncitedNegative = [];
  const independentReplications = [];

  for (const entry of evidence) {
    const weight = resultWeight(entry);
    if (weight > 0) supportive.push(entry);
    if (weight < 0) {
      negative.push(entry);
      if (!cited.has(String(entry.id)) && !asArray(claim.addressedLimitations).includes(entry.id)) {
        uncitedNegative.push(entry);
      }
    }
    if (entry.independentReplication && weight > 0) {
      independentReplications.push(entry);
    }
  }

  return { supportive, negative, uncitedNegative, independentReplications };
}

function reproducibilityFindings(claim, evidence) {
  const findings = [];
  const relevant = evidence.filter((entry) => resultWeight(entry) > 0);
  const hasRawData = relevant.some((entry) => entry.rawData === true);
  const hasCode = relevant.some((entry) => entry.analysisCode === true);
  const hasLock = relevant.some((entry) => entry.dependencyLock === true);
  const hasProtocol = relevant.some((entry) => entry.preregistered === true);

  if (!hasRawData) {
    findings.push({
      code: "raw-data-missing",
      severity: "medium",
      claimId: claim.id,
      message: "No supporting evidence packet exposes raw data for rerun checks.",
      action: "Request raw data or downgrade the claim to exploratory language."
    });
  }
  if (!hasCode) {
    findings.push({
      code: "analysis-code-missing",
      severity: "medium",
      claimId: claim.id,
      message: "No supporting evidence packet includes analysis code.",
      action: "Attach analysis scripts or notebook exports before peer-review release."
    });
  }
  if (!hasLock) {
    findings.push({
      code: "dependency-lock-missing",
      severity: "low",
      claimId: claim.id,
      message: "Supporting evidence lacks an environment or dependency lock.",
      action: "Capture package versions and runtime metadata."
    });
  }
  if (claim.requiresPreregistration && !hasProtocol) {
    findings.push({
      code: "protocol-not-preregistered",
      severity: "high",
      claimId: claim.id,
      message: "Confirmatory claim is not backed by preregistered evidence.",
      action: "Route to reviewer hold or relabel as hypothesis-generating."
    });
  }
  return findings;
}

function reviewClaim(claim, evidenceLedger) {
  const evidence = claimEvidence(claim, evidenceLedger);
  const classified = classifyEvidence(claim, evidence);
  const findings = [];

  if (classified.supportive.length === 0) {
    findings.push({
      code: "unsupported-claim",
      severity: "high",
      claimId: claim.id,
      message: "Claim has no matching supportive evidence in the packet.",
      action: "Block the claim until an evidence artifact is linked."
    });
  }

  if (classified.uncitedNegative.length > 0 && claim.tone !== "exploratory") {
    findings.push({
      code: "uncited-negative-results",
      severity: "high",
      claimId: claim.id,
      evidenceIds: classified.uncitedNegative.map((entry) => entry.id),
      message: "Negative or null evidence exists but is not cited or addressed.",
      action: "Add limitation language and cite the negative or null results."
    });
  }

  if (classified.negative.length > 0 && normalize(claim.scope) === "broad") {
    findings.push({
      code: "overbroad-positive-claim",
      severity: "high",
      claimId: claim.id,
      evidenceIds: classified.negative.map((entry) => entry.id),
      message: "Broad claim conflicts with negative or failed-replication evidence.",
      action: "Narrow the claim to the supported population, method, or setting."
    });
  }

  if (classified.independentReplications.length === 0 && claim.needsIndependentReplication !== false) {
    findings.push({
      code: "replication-debt",
      severity: classified.negative.length > 0 ? "high" : "medium",
      claimId: claim.id,
      message: "No positive independent replication supports this claim.",
      action: "Create a replication task before promoting the claim as settled."
    });
  }

  findings.push(...reproducibilityFindings(claim, evidence));

  const supportScore = classified.supportive.reduce((sum, entry) => sum + resultWeight(entry), 0);
  const contradictionScore = Math.abs(classified.negative.reduce((sum, entry) => sum + resultWeight(entry), 0));
  const confidence = Math.max(0, Math.min(100, 45 + supportScore * 12 - contradictionScore * 14 - findings.length * 4));

  return {
    claimId: claim.id,
    claim: claim.text,
    confidence,
    evidenceIds: evidence.map((entry) => entry.id),
    supportCount: classified.supportive.length,
    negativeCount: classified.negative.length,
    independentReplicationCount: classified.independentReplications.length,
    findings
  };
}

function buildResearchGapPrompts(claimResults, evidenceLedger) {
  const prompts = [];
  for (const result of claimResults) {
    const highRiskCodes = result.findings
      .filter((finding) => finding.severity === "high")
      .map((finding) => finding.code);
    if (highRiskCodes.includes("uncited-negative-results") || highRiskCodes.includes("replication-debt")) {
      const topicEvidence = asArray(evidenceLedger).filter((entry) => result.evidenceIds.includes(entry.id));
      const methods = [...new Set(topicEvidence.map((entry) => entry.method).filter(Boolean))];
      prompts.push({
        claimId: result.claimId,
        prompt: `Design an independent replication for: ${result.claim}`,
        rationale: "The current packet has negative/null signals or no independent positive replication.",
        suggestedMethods: methods.slice(0, 4),
        priority: highRiskCodes.includes("uncited-negative-results") ? "high" : "medium"
      });
    }
  }
  return prompts;
}

function laneFor(findings) {
  if (findings.some((finding) => finding.severity === "high")) return "hold";
  if (findings.some((finding) => finding.severity === "medium")) return "review";
  return "ready";
}

function summarize(claimResults) {
  const allFindings = claimResults.flatMap((result) => result.findings);
  const counts = allFindings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );
  const averageConfidence = claimResults.length
    ? Math.round(claimResults.reduce((sum, result) => sum + result.confidence, 0) / claimResults.length)
    : 0;

  return {
    lane: laneFor(allFindings),
    averageConfidence,
    findingCounts: counts,
    claimCount: claimResults.length,
    reviewerActions: allFindings.map((finding) => ({
      claimId: finding.claimId,
      code: finding.code,
      severity: finding.severity,
      action: finding.action
    }))
  };
}

function analyzeResearchPacket(packet) {
  const claims = asArray(packet.claims);
  const evidenceLedger = asArray(packet.evidenceLedger);
  const claimResults = claims.map((claim) => reviewClaim(claim, evidenceLedger));
  const summary = summarize(claimResults);
  const researchGapPrompts = buildResearchGapPrompts(claimResults, evidenceLedger);

  return {
    packetId: packet.id,
    title: packet.title,
    generatedAt: packet.generatedAt || "deterministic-demo",
    summary,
    claimResults,
    researchGapPrompts,
    auditDigest: digest({
      claims,
      evidenceLedger,
      summary,
      researchGapPrompts
    })
  };
}

function renderMarkdownReport(analyses) {
  const lines = [
    "# Negative Result and Replication Assistant Report",
    "",
    "This deterministic report routes manuscript claims before AI peer-review output is shown.",
    ""
  ];

  for (const analysis of analyses) {
    lines.push(`## ${analysis.title}`);
    lines.push("");
    lines.push(`- Lane: ${analysis.summary.lane}`);
    lines.push(`- Average confidence: ${analysis.summary.averageConfidence}`);
    lines.push(`- Findings: high ${analysis.summary.findingCounts.high}, medium ${analysis.summary.findingCounts.medium}, low ${analysis.summary.findingCounts.low}`);
    lines.push(`- Audit digest: ${analysis.auditDigest}`);
    lines.push("");
    for (const result of analysis.claimResults) {
      lines.push(`### Claim ${result.claimId}`);
      lines.push("");
      lines.push(`- Text: ${result.claim}`);
      lines.push(`- Confidence: ${result.confidence}`);
      lines.push(`- Support: ${result.supportCount}; negative/null: ${result.negativeCount}; independent replications: ${result.independentReplicationCount}`);
      for (const finding of result.findings) {
        lines.push(`- ${finding.severity.toUpperCase()} ${finding.code}: ${finding.message} Action: ${finding.action}`);
      }
      lines.push("");
    }
    if (analysis.researchGapPrompts.length > 0) {
      lines.push("### Research Gap Prompts");
      lines.push("");
      for (const prompt of analysis.researchGapPrompts) {
        lines.push(`- ${prompt.priority}: ${prompt.prompt}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

module.exports = {
  analyzeResearchPacket,
  renderMarkdownReport,
  stableJson,
  digest
};
