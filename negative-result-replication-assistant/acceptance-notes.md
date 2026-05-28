# Acceptance Notes

## Distinct Scope

This slice focuses specifically on negative results, failed replications, and replication debt. It is distinct from existing issue #16 slices such as structured abstract consistency, Bayesian prior sensitivity, external validity, randomization/blinding, literature freshness, image integrity, assay controls, and broad assistant demos.

## Local Validation

Run:

```bash
npm test
npm run demo
npm run video
npm run check
```

Expected results:

- Tests pass with ready/review/hold lane assertions.
- Demo writes deterministic JSON, Markdown, and SVG artifacts under `reports/`.
- Video generation writes `reports/demo.mp4`.

## Reviewer-Facing Artifacts

- `reports/balanced-neuro-vx11.json`
- `reports/overclaim-neuro-vx11.json`
- `reports/rare-disease-replication-gap.json`
- `reports/negative-result-replication-report.md`
- `reports/summary.svg`
- `reports/demo.mp4`

## Claim

The PR body includes `/claim #16` so Algora can attach the bounty claim.
