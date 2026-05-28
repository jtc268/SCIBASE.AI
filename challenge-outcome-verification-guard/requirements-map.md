# Requirements Map

Issue #18 describes a Scientific Bounty System with challenge posting, submission workspaces, arbitration, reward distribution, payout routing, and IP management. This slice covers the post-award outcome verification step before final funds or solver IP are released.

| Issue area | Coverage in this module |
| --- | --- |
| Evaluation criteria and scoring rubric | Outcome targets define direction, threshold, tolerance, observed result, and evidence artifact linkage. |
| Timeline and milestone deadlines | Verification windows flag late outcome packets that need arbitrator approval. |
| Prize amount and payout schedule | Base, final, and bonus cents are evaluated against release and hold decisions. |
| Submission package builder | Evidence artifacts use frozen identifiers and SHA-256 manifest checks before payout evidence is accepted. |
| Audit logs for reproducibility | Every packet emits a stable SHA-256 audit digest from normalized findings and target results. |
| Multi-phase challenges | Base, final, and bonus payout tranches are handled separately. |
| Automated checklists for deliverables | Findings classify metric drift, missing evidence, replication gaps, safety blockers, escrow gaps, and notice gaps. |
| Third-party reviewers or peer validators | Independent replication requirements block outcome-dependent release when missing. |
| Escrowed prize funds | Escrow sufficiency is checked before final or bonus release. |
| Partial payments and honorable mentions | The lane can release base or final funds while holding outcome bonus funds. |
| Payout routing | Release and hold cents are explicit in the decision packet. |
| IP management options | Solver IP release is guarded until funded payout is available and release terms are clear. |

## Non-overlap

This is not a broad bounty marketplace, intake, rubric readiness, workspace privacy, data-room access, reviewer workload, scoring, appeals, anti-collusion, escrow ledger, payout eligibility, amendment-control, benchmark leakage, evidence freeze, cancellation/no-award, embargo, or reproducibility-environment module. It focuses on post-award outcome verification and holdback release.
