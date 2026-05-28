const VALID_HASH_A = "a".repeat(64);
const VALID_HASH_B = "b".repeat(64);
const VALID_HASH_C = "c".repeat(64);
const VALID_HASH_D = "d".repeat(64);
const VALID_HASH_E = "e".repeat(64);

const readyClimateChallenge = {
  id: "challenge-climate-forecast-holdback",
  title: "Regional Flood Forecast Outcome Holdback",
  sponsor: "Climate Resilience Fund",
  solverTeam: "RiverCast Lab",
  requiresIndependentReplication: true,
  requiresSafetyAttestation: false,
  verificationWindow: {
    startedAt: "2026-04-01",
    completedAt: "2026-04-24",
    maxDays: 45
  },
  outcomeTargets: [
    {
      id: "mae-forecast",
      label: "Mean absolute error over holdout watersheds",
      direction: "lower-is-better",
      threshold: 12.5,
      observed: 11.8,
      tolerancePct: 5,
      evidenceArtifactId: "forecast-holdout-notebook",
      independentReplication: true
    },
    {
      id: "alert-recall",
      label: "Flood alert recall at local threshold",
      direction: "higher-is-better",
      threshold: 0.82,
      observed: 0.86,
      tolerancePct: 2,
      evidenceArtifactId: "field-alert-audit",
      independentReplication: true
    }
  ],
  evidenceArtifacts: [
    {
      id: "forecast-holdout-notebook",
      sha256: VALID_HASH_A,
      generatedAfterDeadline: false
    },
    {
      id: "field-alert-audit",
      sha256: VALID_HASH_B,
      generatedAfterDeadline: false
    }
  ],
  safetyReview: {
    attested: true,
    adverseEvents: []
  },
  sponsorAcceptance: {
    signed: true,
    signerRole: "program-director",
    acceptedAt: "2026-04-25"
  },
  escrow: {
    fundedCents: 18000000,
    alreadyPaidCents: 8000000,
    reserveCents: 0
  },
  payoutSchedule: {
    baseCents: 0,
    finalCents: 7000000,
    bonusCents: 3000000
  },
  ipRelease: {
    releaseOnPayout: true,
    releaseState: "redacted-until-paid"
  },
  notifications: [
    { role: "sponsor", sentAt: "2026-04-25T12:00:00Z" },
    { role: "winner", sentAt: "2026-04-25T12:03:00Z" },
    { role: "arbitrator", sentAt: "2026-04-25T12:05:00Z" }
  ]
};

const riskyBiomarkerChallenge = {
  id: "challenge-biomarker-field-validation",
  title: "Single-cell Biomarker Outcome Validation",
  sponsor: "Oncology Translational Consortium",
  solverTeam: "Atlas Omics",
  requiresIndependentReplication: true,
  requiresSafetyAttestation: true,
  verificationWindow: {
    startedAt: "2026-02-01",
    completedAt: "2026-04-20",
    maxDays: 60
  },
  outcomeTargets: [
    {
      id: "auc-external-cohort",
      label: "AUC on sponsor external cohort",
      direction: "higher-is-better",
      threshold: 0.88,
      observed: 0.79,
      tolerancePct: 1,
      evidenceArtifactId: "external-cohort-eval",
      independentReplication: false
    },
    {
      id: "false-positive-rate",
      label: "False positive rate after locked threshold",
      direction: "lower-is-better",
      threshold: 0.08,
      observed: 0.14,
      tolerancePct: 5,
      evidenceArtifactId: "external-cohort-eval",
      independentReplication: false
    }
  ],
  evidenceArtifacts: [
    {
      id: "external-cohort-eval",
      sha256: VALID_HASH_C,
      generatedAfterDeadline: true
    }
  ],
  safetyReview: {
    attested: false,
    adverseEvents: [
      { id: "ae-review-17", status: "open" }
    ]
  },
  sponsorAcceptance: {
    signed: false
  },
  escrow: {
    fundedCents: 6000000,
    alreadyPaidCents: 4500000,
    reserveCents: 500000
  },
  payoutSchedule: {
    baseCents: 0,
    finalCents: 3000000,
    bonusCents: 2000000
  },
  ipRelease: {
    releaseOnPayout: false,
    releaseState: "released"
  },
  notifications: [
    { role: "sponsor", sentAt: "2026-04-21T12:00:00Z" }
  ]
};

const conditionalMaterialsChallenge = {
  id: "challenge-battery-materials-holdback",
  title: "Battery Separator Durability Bonus Review",
  sponsor: "Grid Storage Coalition",
  solverTeam: "Polymer Bench",
  requiresIndependentReplication: false,
  requiresSafetyAttestation: true,
  verificationWindow: {
    startedAt: "2026-03-01",
    completedAt: "2026-03-30",
    maxDays: 45
  },
  outcomeTargets: [
    {
      id: "cycle-retention",
      label: "Capacity retention after accelerated cycles",
      direction: "higher-is-better",
      threshold: 0.9,
      observed: 0.91,
      tolerancePct: 0,
      evidenceArtifactId: "cycle-lab-report",
      independentReplication: false
    }
  ],
  evidenceArtifacts: [
    {
      id: "cycle-lab-report",
      sha256: VALID_HASH_D,
      generatedAfterDeadline: false
    },
    {
      id: "bonus-manufacturing-note",
      sha256: VALID_HASH_E,
      generatedAfterDeadline: true,
      exceptionJustification: "Supplier batch certificate arrived after deadline but is not used for primary metric."
    }
  ],
  safetyReview: {
    attested: true,
    adverseEvents: []
  },
  sponsorAcceptance: {
    signed: true,
    signerRole: "technical-lead",
    acceptedAt: "2026-04-01"
  },
  escrow: {
    fundedCents: 12000000,
    alreadyPaidCents: 6000000,
    reserveCents: 1000000
  },
  payoutSchedule: {
    baseCents: 0,
    finalCents: 4000000,
    bonusCents: 1000000
  },
  ipRelease: {
    releaseOnPayout: true,
    releaseState: "redacted-until-paid"
  },
  notifications: [
    { role: "sponsor", sentAt: "2026-04-01T16:00:00Z" },
    { role: "winner", sentAt: "2026-04-01T16:02:00Z" }
  ]
};

module.exports = {
  conditionalMaterialsChallenge,
  readyClimateChallenge,
  riskyBiomarkerChallenge
};
