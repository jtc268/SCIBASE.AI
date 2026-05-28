# Acceptance Notes

The guard is intended to be reviewed as a self-contained module for issue #16.

## Scenarios

- `feed-neuro-lab-2026-q2` ranks a spatial microglia Alzheimer's opportunity as `start-next` because the lab has the required methods, instruments, datasets, ethics state, budget, and time.
- The same neuro packet holds or routes harder opportunities to partners when 7T MRI, flow cytometry, time, or budget are missing.
- `feed-climate-lab-2026-q2` ranks sensor-scarce flood nowcasting as actionable and holds a household survey study because required social-science methods, ethics approval, time, and budget are missing.

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
