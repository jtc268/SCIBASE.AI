# Acceptance Notes

The guard is intended to be reviewed as a self-contained module for issue #18.

## Scenarios

- `challenge-climate-forecast-holdback` passes all outcome, evidence, escrow, notice, and IP checks and releases final plus bonus payout.
- `challenge-biomarker-field-validation` blocks final payout because metrics drift, independent replication is missing, safety review is open, sponsor acceptance is missing, escrow is underfunded, and IP release is unsafe.
- `challenge-battery-materials-holdback` releases the final tranche but holds the bonus because a required notice is missing.

## Local validation

```bash
npm run check
```

The check command runs unit assertions, generates demo reports, and builds the H.264 MP4 demo.

## Bounty readiness

- No credentials or private data are used.
- No external API calls are made.
- Reports are deterministic and reviewer-ready.
- The module includes a requirement map and demo video artifact.
