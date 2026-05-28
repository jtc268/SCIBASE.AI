# Challenge Outcome Verification Guard

This module adds a focused post-award outcome verification slice for the Scientific Bounty System.

The guard runs after a sponsor has selected a winning bounty submission and before the platform releases final payout, outcome bonuses, or unrestricted solver IP. It evaluates deterministic synthetic packets for:

- Outcome target pass/fail status against threshold and tolerance rules
- Frozen evidence artifact linkage and SHA-256 manifest quality
- Independent replication requirements
- Safety or adverse-event attestations
- Sponsor acceptance records
- Escrow sufficiency for final and bonus payouts
- Solver IP release policy tied to funded settlement
- Required sponsor, winner, and arbitrator notifications
- Verification window timing

The output is a reviewer-ready packet with a payout lane, release/hold amounts, findings, remediation actions, and a stable audit digest.

## Commands

```bash
npm test
npm run demo
npm run video
npm run check
```

## Demo Artifacts

Running `npm run demo` writes deterministic JSON, Markdown, and SVG artifacts under `reports/`.

Running `npm run video` writes `reports/demo.mp4`, a short H.264 demo video for bounty review.

## Privacy And Safety

All examples use synthetic data only. The module does not call external services, read credentials, send network requests, or include private sponsor or solver data.
