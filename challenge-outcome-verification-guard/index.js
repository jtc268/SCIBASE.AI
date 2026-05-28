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

function cents(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function daysBetween(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return null;
  return Math.round((endTime - startTime) / 86400000);
}

function finding(code, severity, message, action, details = {}) {
  return { code, severity, message, action, ...details };
}

function targetStatus(target) {
  const observed = Number(target.observed);
  const threshold = Number(target.threshold);
  const tolerance = Number(target.tolerancePct || 0) / 100;
  const direction = normalize(target.direction);
  const hasEvidence = Boolean(target.evidenceArtifactId);
  let passed = false;

  if (!Number.isFinite(observed) || !Number.isFinite(threshold)) {
    return { passed: false, driftPct: null, reason: "missing-metric" };
  }

  if (direction === "lower-is-better") {
    const allowed = threshold * (1 + tolerance);
    passed = observed <= allowed;
  } else if (direction === "higher-is-better") {
    const allowed = threshold * (1 - tolerance);
    passed = observed >= allowed;
  } else if (direction === "bounded") {
    const min = Number(target.min);
    const max = Number(target.max);
    passed = Number.isFinite(min) && Number.isFinite(max) && observed >= min && observed <= max;
  } else {
    passed = observed === threshold;
  }

  const driftPct = threshold === 0 ? 0 : Math.round(((observed - threshold) / Math.abs(threshold)) * 1000) / 10;
  if (!hasEvidence) {
    return { passed: false, driftPct, reason: "missing-evidence" };
  }
  return { passed, driftPct, reason: passed ? "passed" : "metric-drift" };
}

function evaluateTargets(targets) {
  return asArray(targets).map((target) => ({
    id: target.id,
    label: target.label,
    threshold: target.threshold,
    observed: target.observed,
    direction: target.direction,
    status: targetStatus(target),
    independentReplication: target.independentReplication === true,
    evidenceArtifactId: target.evidenceArtifactId || null
  }));
}

function evidenceIds(evidence) {
  return new Set(asArray(evidence).map((artifact) => artifact.id).filter(Boolean));
}

function evaluateEvidence(targetResults, challenge) {
  const findings = [];
  const artifactIds = evidenceIds(challenge.evidenceArtifacts);
  for (const result of targetResults) {
    if (!result.evidenceArtifactId || !artifactIds.has(result.evidenceArtifactId)) {
      findings.push(
        finding(
          "outcome-evidence-missing",
          "high",
          `Outcome target ${result.id} is not linked to a frozen evidence artifact.`,
          "Attach a frozen artifact hash before releasing outcome-based funds.",
          { targetId: result.id }
        )
      );
    }
    if (!result.status.passed) {
      findings.push(
        finding(
          "outcome-metric-drift",
          "high",
          `Outcome target ${result.id} missed its acceptance threshold.`,
          "Hold the final or bonus tranche until sponsor and arbitrator review the metric drift.",
          { targetId: result.id, driftPct: result.status.driftPct, reason: result.status.reason }
        )
      );
    }
    if (challenge.requiresIndependentReplication && !result.independentReplication) {
      findings.push(
        finding(
          "independent-replication-missing",
          "high",
          `Outcome target ${result.id} lacks independent replication evidence.`,
          "Require independent replication or release only non-contingent base funds.",
          { targetId: result.id }
        )
      );
    }
  }

  for (const artifact of asArray(challenge.evidenceArtifacts)) {
    if (!artifact.sha256 || !/^[a-f0-9]{64}$/i.test(artifact.sha256)) {
      findings.push(
        finding(
          "artifact-hash-invalid",
          "medium",
          `Evidence artifact ${artifact.id || "unknown"} does not have a valid SHA-256 hash.`,
          "Regenerate the frozen manifest before sponsor review.",
          { artifactId: artifact.id || null }
        )
      );
    }
    if (artifact.generatedAfterDeadline && !artifact.exceptionJustification) {
      findings.push(
        finding(
          "late-artifact-unjustified",
          "medium",
          `Evidence artifact ${artifact.id} was generated after the verification deadline.`,
          "Add reviewer-visible exception notes or exclude it from payout evidence.",
          { artifactId: artifact.id }
        )
      );
    }
  }
  return findings;
}

function evaluateSafetyAndAcceptance(challenge) {
  const findings = [];
  const safety = challenge.safetyReview || {};
  const acceptance = challenge.sponsorAcceptance || {};
  const unresolvedEvents = asArray(safety.adverseEvents).filter((event) => normalize(event.status) !== "resolved");

  if (unresolvedEvents.length > 0) {
    findings.push(
      finding(
        "unresolved-safety-event",
        "critical",
        "The outcome packet contains unresolved safety or adverse-event records.",
        "Block final payout and public release until safety review is closed.",
        { eventIds: unresolvedEvents.map((event) => event.id) }
      )
    );
  }
  if (challenge.requiresSafetyAttestation && safety.attested !== true) {
    findings.push(
      finding(
        "safety-attestation-missing",
        "high",
        "Required safety or ethics attestation is missing.",
        "Hold outcome-based funds until a signed safety attestation is attached."
      )
    );
  }
  if (acceptance.signed !== true) {
    findings.push(
      finding(
        "sponsor-acceptance-missing",
        "high",
        "Sponsor acceptance is missing for the post-award outcome review.",
        "Route to arbitration or request sponsor signoff before releasing holdback funds."
      )
    );
  }
  return findings;
}

function evaluateEscrowAndIp(challenge) {
  const findings = [];
  const escrow = challenge.escrow || {};
  const payout = challenge.payoutSchedule || {};
  const ip = challenge.ipRelease || {};
  const funded = cents(escrow.fundedCents);
  const alreadyPaid = cents(escrow.alreadyPaidCents);
  const finalDue = cents(payout.finalCents) + cents(payout.bonusCents);
  const reserve = cents(escrow.reserveCents);
  const available = Math.max(0, funded - alreadyPaid - reserve);

  if (available < finalDue) {
    findings.push(
      finding(
        "escrow-underfunded",
        "critical",
        "Escrow balance cannot cover the requested final and bonus outcome payout.",
        "Require sponsor top-up before releasing solver IP or final funds.",
        { availableCents: available, requiredCents: finalDue }
      )
    );
  }
  if (ip.releaseState === "released" && finalDue > 0 && available < finalDue) {
    findings.push(
      finding(
        "ip-released-before-funded-settlement",
        "critical",
        "Solver IP is marked released before funded settlement is available.",
        "Reinstate redactions and route the award to arbitration."
      )
    );
  }
  if (ip.releaseOnPayout !== true) {
    findings.push(
      finding(
        "ip-release-policy-unclear",
        "medium",
        "IP release terms do not explicitly bind transfer to payout.",
        "Clarify IP release terms before sponsor receives unrestricted artifacts."
      )
    );
  }
  return findings;
}

function evaluateNotices(challenge) {
  const findings = [];
  const requiredRoles = new Set(["sponsor", "winner", "arbitrator"]);
  for (const notice of asArray(challenge.notifications)) {
    if (notice.sentAt && requiredRoles.has(normalize(notice.role))) {
      requiredRoles.delete(normalize(notice.role));
    }
  }
  if (requiredRoles.size > 0) {
    findings.push(
      finding(
        "award-notice-incomplete",
        "medium",
        "Required outcome-review notifications have not been sent to all parties.",
        "Notify missing parties before final payout release.",
        { missingRoles: [...requiredRoles] }
      )
    );
  }

  const window = challenge.verificationWindow || {};
  const elapsed = daysBetween(window.startedAt, window.completedAt);
  if (elapsed !== null && window.maxDays && elapsed > window.maxDays) {
    findings.push(
      finding(
        "verification-window-expired",
        "medium",
        "Outcome verification exceeded the challenge window.",
        "Ask the sponsor and arbitrator to approve the late verification packet.",
        { elapsedDays: elapsed, maxDays: window.maxDays }
      )
    );
  }
  return findings;
}

function severityRank(severity) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity] || 0;
}

function payoutDecision(findings, payout) {
  const worst = findings.reduce((max, item) => Math.max(max, severityRank(item.severity)), 0);
  const baseCents = cents(payout.baseCents);
  const finalCents = cents(payout.finalCents);
  const bonusCents = cents(payout.bonusCents);

  if (worst >= severityRank("critical")) {
    return {
      lane: "block-final-payout",
      releaseCents: 0,
      holdCents: baseCents + finalCents + bonusCents,
      rationale: "Critical settlement, safety, or IP guard failed."
    };
  }
  if (worst >= severityRank("high")) {
    return {
      lane: "release-base-hold-outcome",
      releaseCents: baseCents,
      holdCents: finalCents + bonusCents,
      rationale: "Base prize can proceed, but outcome-dependent funds require remediation."
    };
  }
  if (worst >= severityRank("medium")) {
    return {
      lane: "release-final-with-conditions",
      releaseCents: baseCents + finalCents,
      holdCents: bonusCents,
      rationale: "Final prize may proceed with documented conditions; bonus stays held."
    };
  }
  return {
    lane: "release-final-and-bonus",
    releaseCents: baseCents + finalCents + bonusCents,
    holdCents: 0,
    rationale: "Outcome packet satisfies evidence, safety, escrow, notice, and IP controls."
  };
}

function summarize(findings, targetResults) {
  const counts = findings.reduce(
    (acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
  return {
    targetCount: targetResults.length,
    passedTargets: targetResults.filter((result) => result.status.passed).length,
    independentReplications: targetResults.filter((result) => result.independentReplication).length,
    findingCounts: counts
  };
}

function evaluateChallengeOutcome(challenge) {
  const targetResults = evaluateTargets(challenge.outcomeTargets);
  const findings = [
    ...evaluateEvidence(targetResults, challenge),
    ...evaluateSafetyAndAcceptance(challenge),
    ...evaluateEscrowAndIp(challenge),
    ...evaluateNotices(challenge)
  ];
  const decision = payoutDecision(findings, challenge.payoutSchedule || {});
  const packet = {
    challengeId: challenge.id,
    title: challenge.title,
    sponsor: challenge.sponsor,
    solverTeam: challenge.solverTeam,
    decision,
    summary: summarize(findings, targetResults),
    targetResults,
    findings,
    auditDigest: null
  };
  packet.auditDigest = digest({
    challengeId: packet.challengeId,
    decision: packet.decision,
    targetResults: packet.targetResults,
    findings: packet.findings
  });
  return packet;
}

function renderMarkdownReport(packets) {
  const lines = [
    "# Challenge Outcome Verification Guard",
    "",
    "Post-award outcome checks before final scientific bounty payout, bonus release, or unrestricted IP handoff.",
    ""
  ];
  for (const packet of packets) {
    lines.push(`## ${packet.title}`);
    lines.push(`- Challenge: ${packet.challengeId}`);
    lines.push(`- Sponsor: ${packet.sponsor}`);
    lines.push(`- Solver team: ${packet.solverTeam}`);
    lines.push(`- Lane: ${packet.decision.lane}`);
    lines.push(`- Release cents: ${packet.decision.releaseCents}`);
    lines.push(`- Hold cents: ${packet.decision.holdCents}`);
    lines.push(`- Findings: ${packet.findings.length}`);
    lines.push(`- Audit digest: ${packet.auditDigest}`);
    lines.push("");
    if (packet.findings.length > 0) {
      lines.push("| Severity | Code | Action |");
      lines.push("| --- | --- | --- |");
      for (const item of packet.findings) {
        lines.push(`| ${item.severity} | ${item.code} | ${item.action} |`);
      }
      lines.push("");
    }
  }
  while (lines[lines.length - 1] === "") {
    lines.pop();
  }
  return `${lines.join("\n")}\n`;
}

module.exports = {
  digest,
  evaluateChallengeOutcome,
  renderMarkdownReport,
  stableJson,
  targetStatus
};
