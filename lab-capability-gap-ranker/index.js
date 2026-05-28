const crypto = require("crypto");

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

function setOf(values) {
  return new Set(asArray(values).map(normalize).filter(Boolean));
}

function overlap(left, right) {
  const rightSet = setOf(right);
  return asArray(left).filter((item) => rightSet.has(normalize(item)));
}

function missing(required, available) {
  const availableSet = setOf(available);
  return asArray(required).filter((item) => !availableSet.has(normalize(item)));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function evidenceStrength(opportunity) {
  const signals = opportunity.signals || {};
  const unresolved = Number(signals.unresolvedQuestionMentions || 0);
  const negative = Number(signals.negativeResultCount || 0);
  const replication = Number(signals.replicationAttempts || 0);
  const citationVelocity = Number(signals.citationVelocity || 0);
  const activity = Number(signals.topicActivity || 0);
  return clamp(unresolved * 4 + negative * 6 + citationVelocity * 2 + activity - replication * 5, 0, 100);
}

function noveltyScore(opportunity) {
  const signals = opportunity.signals || {};
  const saturation = Number(signals.topicSaturation || 0);
  const crossDomain = asArray(opportunity.topics).length > 2 ? 12 : 0;
  const lowReplicationBoost = Number(signals.replicationAttempts || 0) <= 1 ? 15 : 0;
  return clamp(Number(signals.novelty || 0) + crossDomain + lowReplicationBoost - saturation * 3, 0, 100);
}

function profileFit(profile, opportunity) {
  const interestHits = overlap(opportunity.topics, profile.interests);
  const historyHits = overlap(opportunity.topics, profile.projectHistoryTopics);
  const methodHits = overlap(opportunity.methods, profile.preferredMethods);
  return {
    interestHits,
    historyHits,
    methodHits,
    score: clamp(interestHits.length * 14 + historyHits.length * 8 + methodHits.length * 6, 0, 100)
  };
}

function capabilityFit(lab, opportunity) {
  const missingMethods = missing(opportunity.methods, lab.methods);
  const missingInstruments = missing(opportunity.requiredInstruments, lab.instruments);
  const missingDatasets = missing(opportunity.requiredDatasets, lab.datasets);
  const missingModelSystems = missing(opportunity.modelSystems, lab.modelSystems);
  const methodHits = overlap(opportunity.methods, lab.methods);
  const instrumentHits = overlap(opportunity.requiredInstruments, lab.instruments);
  const datasetHits = overlap(opportunity.requiredDatasets, lab.datasets);
  const modelHits = overlap(opportunity.modelSystems, lab.modelSystems);

  const requiredCount =
    asArray(opportunity.methods).length +
    asArray(opportunity.requiredInstruments).length +
    asArray(opportunity.requiredDatasets).length +
    asArray(opportunity.modelSystems).length;
  const hitCount = methodHits.length + instrumentHits.length + datasetHits.length + modelHits.length;
  const base = requiredCount === 0 ? 100 : Math.round((hitCount / requiredCount) * 100);

  return {
    missingMethods,
    missingInstruments,
    missingDatasets,
    missingModelSystems,
    methodHits,
    instrumentHits,
    datasetHits,
    modelHits,
    score: base
  };
}

function feasibility(lab, opportunity) {
  const cost = Number(opportunity.estimatedCostCents || 0);
  const budget = Number(lab.availableBudgetCents || 0);
  const months = Number(opportunity.estimatedMonths || 0);
  const availableMonths = Number(lab.availableMonths || 0);
  const costFit = budget <= 0 ? false : cost <= budget;
  const timeFit = availableMonths <= 0 ? false : months <= availableMonths;
  const ethicsFit = !opportunity.requiresEthicsApproval || lab.ethicsApproval === true;
  const safetyFit = !opportunity.requiresBiosafetyReview || lab.biosafetyReview === true;
  const score = [costFit, timeFit, ethicsFit, safetyFit].filter(Boolean).length * 25;
  return { costFit, timeFit, ethicsFit, safetyFit, score };
}

function finding(code, severity, message, action, details = {}) {
  return { code, severity, message, action, ...details };
}

function buildFindings(capability, feasibilityResult, opportunity) {
  const findings = [];
  if (capability.missingMethods.length > 0) {
    findings.push(
      finding(
        "method-capability-gap",
        "high",
        "The lab does not currently support all required methods.",
        "Route to collaborator search or downgrade opportunity priority.",
        { missingMethods: capability.missingMethods }
      )
    );
  }
  if (capability.missingInstruments.length > 0) {
    findings.push(
      finding(
        "instrument-gap",
        "high",
        "Required instruments are not available in the lab profile.",
        "Recommend a core facility, partner lab, or alternate study design.",
        { missingInstruments: capability.missingInstruments }
      )
    );
  }
  if (capability.missingDatasets.length > 0) {
    findings.push(
      finding(
        "dataset-access-gap",
        "medium",
        "Required datasets are not available to the lab.",
        "Create a data-access task before placing the idea in the active feed.",
        { missingDatasets: capability.missingDatasets }
      )
    );
  }
  if (!feasibilityResult.costFit) {
    findings.push(
      finding(
        "budget-exceeded",
        "high",
        "Estimated opportunity cost exceeds available lab budget.",
        "Hold until grant, consortium, or low-cost pilot funding is identified."
      )
    );
  }
  if (!feasibilityResult.timeFit) {
    findings.push(
      finding(
        "timeline-exceeded",
        "medium",
        "Estimated duration exceeds the lab planning window.",
        "Suggest a smaller pilot or move to long-range planning."
      )
    );
  }
  if (!feasibilityResult.ethicsFit) {
    findings.push(
      finding(
        "ethics-approval-missing",
        "high",
        "Human-subjects or sensitive-data approval is required but not active.",
        "Add ethics review as the first milestone before ranking this as actionable."
      )
    );
  }
  if (!feasibilityResult.safetyFit) {
    findings.push(
      finding(
        "biosafety-review-missing",
        "high",
        "Biosafety review is required but not active.",
        "Hold until biosafety review and handling protocol are attached."
      )
    );
  }
  if (Number(opportunity.signals?.topicSaturation || 0) >= 8 && Number(opportunity.signals?.novelty || 0) < 45) {
    findings.push(
      finding(
        "crowded-low-novelty-topic",
        "medium",
        "The topic is active but not clearly differentiated.",
        "Require a sharper hypothesis or unique dataset before recommending."
      )
    );
  }
  return findings;
}

function severityPenalty(findings) {
  return findings.reduce((sum, item) => {
    if (item.severity === "high") return sum + 18;
    if (item.severity === "medium") return sum + 9;
    return sum + 3;
  }, 0);
}

function laneFor(score, findings) {
  if (findings.some((item) => item.severity === "high")) {
    return score >= 65 ? "partner-before-start" : "hold";
  }
  if (findings.some((item) => item.severity === "medium")) {
    return score >= 70 ? "pilot-with-tasks" : "watchlist";
  }
  if (score >= 75) return "start-next";
  if (score >= 55) return "watchlist";
  return "hold";
}

function rankOpportunity(profile, lab, opportunity) {
  const profileMatch = profileFit(profile, opportunity);
  const capability = capabilityFit(lab, opportunity);
  const feasibilityResult = feasibility(lab, opportunity);
  const evidence = evidenceStrength(opportunity);
  const novelty = noveltyScore(opportunity);
  const findings = buildFindings(capability, feasibilityResult, opportunity);
  const rawScore =
    profileMatch.score * 0.22 +
    capability.score * 0.28 +
    feasibilityResult.score * 0.18 +
    evidence * 0.18 +
    novelty * 0.14;
  const score = Math.round(clamp(rawScore - severityPenalty(findings), 0, 100));
  return {
    id: opportunity.id,
    title: opportunity.title,
    topics: asArray(opportunity.topics),
    score,
    lane: laneFor(score, findings),
    profileMatch,
    capability,
    feasibility: feasibilityResult,
    evidenceStrength: evidence,
    noveltyScore: novelty,
    findings,
    recommendedFirstTasks: recommendedTasks(findings, opportunity)
  };
}

function recommendedTasks(findings, opportunity) {
  const tasks = [];
  for (const item of findings) {
    if (item.code === "method-capability-gap") {
      tasks.push(`Find collaborator for ${item.missingMethods.join(", ")}`);
    }
    if (item.code === "instrument-gap") {
      tasks.push(`Reserve core facility for ${item.missingInstruments.join(", ")}`);
    }
    if (item.code === "dataset-access-gap") {
      tasks.push(`Request access to ${item.missingDatasets.join(", ")}`);
    }
    if (item.code === "ethics-approval-missing") {
      tasks.push("Draft ethics review packet");
    }
    if (item.code === "biosafety-review-missing") {
      tasks.push("Attach biosafety handling protocol");
    }
    if (item.code === "budget-exceeded") {
      tasks.push("Build low-cost pilot or grant fit note");
    }
  }
  if (tasks.length === 0) {
    tasks.push(`Create one-page opportunity brief for ${opportunity.title}`);
    tasks.push("Open preregistration checklist");
  }
  return [...new Set(tasks)].slice(0, 5);
}

function buildOpportunityFeed(packet) {
  const ranked = asArray(packet.opportunities)
    .map((opportunity) => rankOpportunity(packet.profile || {}, packet.lab || {}, opportunity))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const feed = {
    packetId: packet.id,
    researcher: packet.profile?.researcher || "anonymous-researcher",
    lab: packet.lab?.name || "unknown-lab",
    generatedFrom: {
      interestCount: asArray(packet.profile?.interests).length,
      projectHistoryCount: asArray(packet.profile?.projectHistoryTopics).length,
      labMethodCount: asArray(packet.lab?.methods).length,
      opportunityCount: ranked.length
    },
    rankedOpportunities: ranked,
    summary: summarize(ranked),
    auditDigest: null
  };
  feed.auditDigest = digest({
    packetId: feed.packetId,
    rankedOpportunities: feed.rankedOpportunities.map((item) => ({
      id: item.id,
      score: item.score,
      lane: item.lane,
      findings: item.findings
    }))
  });
  return feed;
}

function summarize(ranked) {
  const lanes = ranked.reduce((acc, item) => {
    acc[item.lane] = (acc[item.lane] || 0) + 1;
    return acc;
  }, {});
  const top = ranked[0] || null;
  return {
    startNextCount: lanes["start-next"] || 0,
    partnerBeforeStartCount: lanes["partner-before-start"] || 0,
    watchlistCount: lanes.watchlist || 0,
    holdCount: lanes.hold || 0,
    topOpportunityId: top ? top.id : null,
    topScore: top ? top.score : 0
  };
}

function renderMarkdownReport(feeds) {
  const lines = [
    "# Lab Capability Gap Ranker",
    "",
    "Research opportunity feeds ranked by interests, project history, lab capabilities, feasibility, evidence strength, and novelty.",
    ""
  ];
  for (const feed of feeds) {
    lines.push(`## ${feed.researcher} / ${feed.lab}`);
    lines.push(`- Packet: ${feed.packetId}`);
    lines.push(`- Top opportunity: ${feed.summary.topOpportunityId || "none"}`);
    lines.push(`- Top score: ${feed.summary.topScore}`);
    lines.push(`- Start next: ${feed.summary.startNextCount}`);
    lines.push(`- Partner before start: ${feed.summary.partnerBeforeStartCount}`);
    lines.push(`- Watchlist: ${feed.summary.watchlistCount}`);
    lines.push(`- Hold: ${feed.summary.holdCount}`);
    lines.push(`- Audit digest: ${feed.auditDigest}`);
    lines.push("");
    lines.push("| Rank | Opportunity | Score | Lane | First task |");
    lines.push("| --- | --- | --- | --- | --- |");
    feed.rankedOpportunities.forEach((item, index) => {
      lines.push(`| ${index + 1} | ${item.title} | ${item.score} | ${item.lane} | ${item.recommendedFirstTasks[0]} |`);
    });
    lines.push("");
  }
  while (lines[lines.length - 1] === "") {
    lines.pop();
  }
  return `${lines.join("\n")}\n`;
}

module.exports = {
  buildOpportunityFeed,
  capabilityFit,
  digest,
  evidenceStrength,
  noveltyScore,
  profileFit,
  rankOpportunity,
  renderMarkdownReport,
  stableJson
};
