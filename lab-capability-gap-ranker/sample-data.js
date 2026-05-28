const neuroLabPacket = {
  id: "feed-neuro-lab-2026-q2",
  profile: {
    researcher: "NeuroMethods Lab",
    interests: ["single-cell RNA-seq", "Alzheimer's", "microglia", "spatial transcriptomics"],
    projectHistoryTopics: ["neuroinflammation", "single-cell RNA-seq", "mouse models"],
    preferredMethods: ["single-cell RNA-seq", "spatial transcriptomics", "Bayesian modeling"]
  },
  lab: {
    name: "NeuroMethods Core",
    methods: ["single-cell RNA-seq", "spatial transcriptomics", "Bayesian modeling", "mouse behavior"],
    instruments: ["10x Chromium", "Visium", "confocal microscope"],
    datasets: ["internal AD cohort", "public AMP-AD"],
    modelSystems: ["mouse models", "human postmortem tissue"],
    availableBudgetCents: 8500000,
    availableMonths: 8,
    ethicsApproval: true,
    biosafetyReview: true
  },
  opportunities: [
    {
      id: "gap-microglia-spatial-ad",
      title: "Microglia state transition map in Alzheimer's spatial niches",
      topics: ["single-cell RNA-seq", "Alzheimer's", "microglia", "spatial transcriptomics"],
      methods: ["single-cell RNA-seq", "spatial transcriptomics", "Bayesian modeling"],
      requiredInstruments: ["10x Chromium", "Visium"],
      requiredDatasets: ["internal AD cohort", "public AMP-AD"],
      modelSystems: ["human postmortem tissue"],
      estimatedCostCents: 6200000,
      estimatedMonths: 6,
      requiresEthicsApproval: true,
      requiresBiosafetyReview: false,
      signals: {
        unresolvedQuestionMentions: 9,
        negativeResultCount: 2,
        replicationAttempts: 1,
        citationVelocity: 8,
        topicActivity: 16,
        topicSaturation: 4,
        novelty: 68
      }
    },
    {
      id: "gap-ultra-high-field-imaging",
      title: "Ultra-high-field imaging biomarkers for early dementia",
      topics: ["Alzheimer's", "imaging biomarkers", "human cohorts"],
      methods: ["7T MRI", "Bayesian modeling"],
      requiredInstruments: ["7T MRI"],
      requiredDatasets: ["internal AD cohort"],
      modelSystems: ["human cohorts"],
      estimatedCostCents: 14500000,
      estimatedMonths: 14,
      requiresEthicsApproval: true,
      requiresBiosafetyReview: false,
      signals: {
        unresolvedQuestionMentions: 7,
        negativeResultCount: 1,
        replicationAttempts: 3,
        citationVelocity: 9,
        topicActivity: 20,
        topicSaturation: 7,
        novelty: 50
      }
    },
    {
      id: "gap-crispr-microglia-screen",
      title: "CRISPR perturbation screen for microglia inflammatory states",
      topics: ["microglia", "CRISPR", "neuroinflammation"],
      methods: ["CRISPR screen", "single-cell RNA-seq"],
      requiredInstruments: ["10x Chromium", "flow cytometer"],
      requiredDatasets: ["internal AD cohort"],
      modelSystems: ["mouse models"],
      estimatedCostCents: 7800000,
      estimatedMonths: 9,
      requiresEthicsApproval: false,
      requiresBiosafetyReview: true,
      signals: {
        unresolvedQuestionMentions: 8,
        negativeResultCount: 4,
        replicationAttempts: 0,
        citationVelocity: 6,
        topicActivity: 12,
        topicSaturation: 5,
        novelty: 72
      }
    }
  ]
};

const climateLabPacket = {
  id: "feed-climate-lab-2026-q2",
  profile: {
    researcher: "Regional Climate AI Lab",
    interests: ["flood forecasting", "remote sensing", "Bayesian modeling"],
    projectHistoryTopics: ["watershed models", "sensor calibration", "remote sensing"],
    preferredMethods: ["Bayesian modeling", "geospatial ML", "hydrology simulation"]
  },
  lab: {
    name: "Climate Data Studio",
    methods: ["Bayesian modeling", "geospatial ML", "hydrology simulation", "remote sensing"],
    instruments: ["GPU workstation", "river sensor network"],
    datasets: ["NOAA rainfall", "Sentinel-2", "regional gauge archive"],
    modelSystems: ["watersheds"],
    availableBudgetCents: 2200000,
    availableMonths: 4,
    ethicsApproval: false,
    biosafetyReview: false
  },
  opportunities: [
    {
      id: "gap-sensor-scarce-floods",
      title: "Flood nowcasting for sensor-scarce watersheds",
      topics: ["flood forecasting", "remote sensing", "watersheds"],
      methods: ["Bayesian modeling", "geospatial ML", "hydrology simulation"],
      requiredInstruments: ["GPU workstation", "river sensor network"],
      requiredDatasets: ["NOAA rainfall", "Sentinel-2", "regional gauge archive"],
      modelSystems: ["watersheds"],
      estimatedCostCents: 1800000,
      estimatedMonths: 3,
      requiresEthicsApproval: false,
      requiresBiosafetyReview: false,
      signals: {
        unresolvedQuestionMentions: 6,
        negativeResultCount: 3,
        replicationAttempts: 1,
        citationVelocity: 7,
        topicActivity: 14,
        topicSaturation: 4,
        novelty: 63
      }
    },
    {
      id: "gap-household-survey-warning",
      title: "Household warning response study for flood alerts",
      topics: ["flood forecasting", "social science", "survey research"],
      methods: ["survey research", "causal inference"],
      requiredInstruments: [],
      requiredDatasets: ["regional gauge archive"],
      modelSystems: ["households"],
      estimatedCostCents: 2600000,
      estimatedMonths: 7,
      requiresEthicsApproval: true,
      requiresBiosafetyReview: false,
      signals: {
        unresolvedQuestionMentions: 5,
        negativeResultCount: 0,
        replicationAttempts: 0,
        citationVelocity: 3,
        topicActivity: 8,
        topicSaturation: 3,
        novelty: 58
      }
    }
  ]
};

module.exports = {
  climateLabPacket,
  neuroLabPacket
};
