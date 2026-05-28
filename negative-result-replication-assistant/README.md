# Negative Result and Replication Assistant

This is a self-contained AI Research Assistant Suite slice for issue #16. It reviews manuscript claim packets before AI peer-review output is shown and routes overbroad claims when negative results, failed replications, or missing reproducibility artifacts are present.

The module uses synthetic data only. It does not call external services, store credentials, or inspect private research files.

## What It Checks

- Whether positive claims cite or address relevant null, negative, or failed-replication evidence
- Whether broad claims are contradicted by negative evidence
- Whether a claim has positive independent replication support
- Whether raw data, analysis code, dependency locks, and preregistration evidence are present
- Which uncertainty pockets should become research-gap prompts

## Run

```bash
npm test
npm run demo
npm run video
```

Generated artifacts are written to `reports/`.

## Review Lanes

- `ready`: no high or medium findings
- `review`: medium reproducibility or replication debt remains
- `hold`: high-risk overclaim, uncited negative result, unsupported claim, or missing preregistration for confirmatory claims

## Files

- `index.js`: deterministic analyzer and markdown renderer
- `sample-data.js`: synthetic balanced, risky, and gap packets
- `test.js`: dependency-free regression checks
- `demo.js`: JSON, Markdown, and SVG report generation
- `make-demo-video.py`: short MP4 demo generator
- `requirements-map.md`: issue requirement mapping
- `acceptance-notes.md`: validation and review notes
