# Lab Capability Gap Ranker

This module adds a focused Research Gap Finder slice for the AI-Powered Research Assistant Suite.

It turns a broad corpus-derived list of research opportunities into a lab-specific feed by ranking ideas against:

- Researcher interests
- Project history
- Preferred methods
- Lab methods, instruments, datasets, and model systems
- Budget and planning window
- Ethics and biosafety readiness
- Evidence strength from unresolved questions, negative results, citation velocity, and replication debt
- Novelty and topic saturation

The output is a deterministic feed with `start-next`, `partner-before-start`, `watchlist`, and `hold` lanes, plus first tasks that make each opportunity actionable.

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

All examples use synthetic data only. The module does not call external services, read credentials, send network requests, or include private researcher or lab data.
