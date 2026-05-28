# Negative Result and Replication Assistant Report

This deterministic report routes manuscript claims before AI peer-review output is shown.

## Balanced VX-11 neurocognition manuscript

- Lane: ready
- Average confidence: 79
- Findings: high 0, medium 0, low 0
- Audit digest: e869867d63560d5ae0354e4009145bcb808b98ec924698d0eb715d2e8dfea0bd

### Claim C1

- Text: VX-11 improves maze recall in aged mice under the high-dose protocol.
- Confidence: 79
- Support: 2; negative/null: 1; independent replications: 1

## Overbroad VX-11 neurodegeneration manuscript

- Lane: hold
- Average confidence: 0
- Findings: high 4, medium 2, low 1
- Audit digest: fc4a35985284f15e2fc29647fda5b54a71b510c668030e141d5097622232aa46

### Claim C1

- Text: VX-11 broadly improves memory across neurodegenerative disease models.
- Confidence: 0
- Support: 1; negative/null: 2; independent replications: 0
- HIGH uncited-negative-results: Negative or null evidence exists but is not cited or addressed. Action: Add limitation language and cite the negative or null results.
- HIGH overbroad-positive-claim: Broad claim conflicts with negative or failed-replication evidence. Action: Narrow the claim to the supported population, method, or setting.
- HIGH replication-debt: No positive independent replication supports this claim. Action: Create a replication task before promoting the claim as settled.
- MEDIUM raw-data-missing: No supporting evidence packet exposes raw data for rerun checks. Action: Request raw data or downgrade the claim to exploratory language.
- MEDIUM analysis-code-missing: No supporting evidence packet includes analysis code. Action: Attach analysis scripts or notebook exports before peer-review release.
- LOW dependency-lock-missing: Supporting evidence lacks an environment or dependency lock. Action: Capture package versions and runtime metadata.
- HIGH protocol-not-preregistered: Confirmatory claim is not backed by preregistered evidence. Action: Route to reviewer hold or relabel as hypothesis-generating.

### Research Gap Prompts

- high: Design an independent replication for: VX-11 broadly improves memory across neurodegenerative disease models.

## Rare disease biomarker replication gap packet

- Lane: review
- Average confidence: 61
- Findings: high 0, medium 1, low 1
- Audit digest: 5b838168c2e50d03bee611bf1025ebeaf0b39f562e3ce8a85b0697610c1207c0

### Claim C1

- Text: Plasma marker QL-7 is promising but needs external replication in pediatric cohorts.
- Confidence: 61
- Support: 1; negative/null: 0; independent replications: 0
- MEDIUM replication-debt: No positive independent replication supports this claim. Action: Create a replication task before promoting the claim as settled.
- LOW dependency-lock-missing: Supporting evidence lacks an environment or dependency lock. Action: Capture package versions and runtime metadata.

