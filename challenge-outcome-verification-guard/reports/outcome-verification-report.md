# Challenge Outcome Verification Guard

Post-award outcome checks before final scientific bounty payout, bonus release, or unrestricted IP handoff.

## Regional Flood Forecast Outcome Holdback
- Challenge: challenge-climate-forecast-holdback
- Sponsor: Climate Resilience Fund
- Solver team: RiverCast Lab
- Lane: release-final-and-bonus
- Release cents: 10000000
- Hold cents: 0
- Findings: 0
- Audit digest: 32fd27fffeaf4199d4a1dbc87465a4f9036d9ae834bd1e576ecdb4e2f57a8768

## Single-cell Biomarker Outcome Validation
- Challenge: challenge-biomarker-field-validation
- Sponsor: Oncology Translational Consortium
- Solver team: Atlas Omics
- Lane: block-final-payout
- Release cents: 0
- Hold cents: 5000000
- Findings: 13
- Audit digest: 48c6b7099388cf0a791247f8912fc4c3e62d59d19a7ba3ca15d4342eb076b4ce

| Severity | Code | Action |
| --- | --- | --- |
| high | outcome-metric-drift | Hold the final or bonus tranche until sponsor and arbitrator review the metric drift. |
| high | independent-replication-missing | Require independent replication or release only non-contingent base funds. |
| high | outcome-metric-drift | Hold the final or bonus tranche until sponsor and arbitrator review the metric drift. |
| high | independent-replication-missing | Require independent replication or release only non-contingent base funds. |
| medium | late-artifact-unjustified | Add reviewer-visible exception notes or exclude it from payout evidence. |
| critical | unresolved-safety-event | Block final payout and public release until safety review is closed. |
| high | safety-attestation-missing | Hold outcome-based funds until a signed safety attestation is attached. |
| high | sponsor-acceptance-missing | Route to arbitration or request sponsor signoff before releasing holdback funds. |
| critical | escrow-underfunded | Require sponsor top-up before releasing solver IP or final funds. |
| critical | ip-released-before-funded-settlement | Reinstate redactions and route the award to arbitration. |
| medium | ip-release-policy-unclear | Clarify IP release terms before sponsor receives unrestricted artifacts. |
| medium | award-notice-incomplete | Notify missing parties before final payout release. |
| medium | verification-window-expired | Ask the sponsor and arbitrator to approve the late verification packet. |

## Battery Separator Durability Bonus Review
- Challenge: challenge-battery-materials-holdback
- Sponsor: Grid Storage Coalition
- Solver team: Polymer Bench
- Lane: release-final-with-conditions
- Release cents: 4000000
- Hold cents: 1000000
- Findings: 1
- Audit digest: 3c6bdb29dcb12c16bef84c0f0a7e4d0e8c8781f33212b19bfcc4158736e2f0f7

| Severity | Code | Action |
| --- | --- | --- |
| medium | award-notice-incomplete | Notify missing parties before final payout release. |
