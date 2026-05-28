const balancedPacket = {
  id: "balanced-neuro-vx11",
  title: "Balanced VX-11 neurocognition manuscript",
  claims: [
    {
      id: "C1",
      text: "VX-11 improves maze recall in aged mice under the high-dose protocol.",
      topics: ["vx-11", "maze-recall", "aged-mice"],
      scope: "narrow",
      tone: "qualified",
      citedEvidenceIds: ["E1", "E2", "E3"],
      addressedLimitations: ["E3"],
      requiresPreregistration: true
    }
  ],
  evidenceLedger: [
    {
      id: "E1",
      topics: ["vx-11", "maze-recall", "aged-mice"],
      result: "positive",
      method: "registered mouse maze assay",
      independentReplication: false,
      rawData: true,
      analysisCode: true,
      dependencyLock: true,
      preregistered: true
    },
    {
      id: "E2",
      topics: ["vx-11", "maze-recall", "aged-mice"],
      result: "replication",
      method: "external lab maze replication",
      independentReplication: true,
      rawData: true,
      analysisCode: true,
      dependencyLock: true,
      preregistered: true
    },
    {
      id: "E3",
      topics: ["vx-11", "maze-recall", "young-mice"],
      result: "null",
      method: "young cohort follow-up",
      independentReplication: false,
      rawData: true,
      analysisCode: true,
      dependencyLock: true,
      preregistered: true
    }
  ]
};

const riskyPacket = {
  id: "overclaim-neuro-vx11",
  title: "Overbroad VX-11 neurodegeneration manuscript",
  claims: [
    {
      id: "C1",
      text: "VX-11 broadly improves memory across neurodegenerative disease models.",
      topics: ["vx-11", "memory", "neurodegeneration"],
      scope: "broad",
      tone: "conclusive",
      citedEvidenceIds: ["E1"],
      addressedLimitations: [],
      requiresPreregistration: true
    }
  ],
  evidenceLedger: [
    {
      id: "E1",
      topics: ["vx-11", "memory", "neurodegeneration"],
      result: "positive",
      method: "single-lab open-label pilot",
      independentReplication: false,
      rawData: false,
      analysisCode: false,
      dependencyLock: false,
      preregistered: false
    },
    {
      id: "E2",
      topics: ["vx-11", "memory", "neurodegeneration"],
      result: "failed-replication",
      method: "external blinded replication",
      independentReplication: true,
      rawData: true,
      analysisCode: true,
      dependencyLock: true,
      preregistered: true
    },
    {
      id: "E3",
      topics: ["vx-11", "memory", "neurodegeneration"],
      result: "negative",
      method: "larger late-stage cohort",
      independentReplication: true,
      rawData: true,
      analysisCode: true,
      dependencyLock: true,
      preregistered: true
    }
  ]
};

const gapPacket = {
  id: "rare-disease-replication-gap",
  title: "Rare disease biomarker replication gap packet",
  claims: [
    {
      id: "C1",
      text: "Plasma marker QL-7 is promising but needs external replication in pediatric cohorts.",
      topics: ["ql-7", "rare-disease", "pediatric"],
      scope: "narrow",
      tone: "exploratory",
      citedEvidenceIds: ["E1", "E2"],
      addressedLimitations: ["E2"],
      requiresPreregistration: false
    }
  ],
  evidenceLedger: [
    {
      id: "E1",
      topics: ["ql-7", "rare-disease", "pediatric"],
      result: "positive",
      method: "retrospective plasma panel",
      independentReplication: false,
      rawData: true,
      analysisCode: true,
      dependencyLock: false,
      preregistered: false
    },
    {
      id: "E2",
      topics: ["ql-7", "rare-disease", "pediatric"],
      result: "mixed",
      method: "small external feasibility cohort",
      independentReplication: true,
      rawData: true,
      analysisCode: false,
      dependencyLock: false,
      preregistered: false
    }
  ]
};

module.exports = {
  balancedPacket,
  riskyPacket,
  gapPacket
};
