# Requirements Map

Issue #16 asks for an AI-powered research assistant suite with auto peer review, reproducibility checking, and research gap discovery. This PR implements a focused negative-result and replication-debt review slice.

## Auto Peer Review Reports

- Flags claims that ignore negative, null, or failed-replication evidence.
- Flags overbroad claims when the evidence only supports a narrow population or setting.
- Emits reviewer actions for claim narrowing, limitation language, and evidence linking.
- Produces Markdown and JSON reviewer packets in `reports/`.

## Reproducibility Checker

- Checks for raw data availability.
- Checks for analysis code availability.
- Checks for dependency-lock/runtime evidence.
- Checks preregistration evidence for confirmatory claims.
- Emits stable audit digests for reviewer traceability.

## Research Gap Finder

- Converts replication debt and unaddressed negative evidence into priority research-gap prompts.
- Suggests methods from the evidence ledger so replication tasks are grounded in the packet.
- Separates high-priority contradiction gaps from medium-priority missing-replication gaps.

## Safety and Scope

- Synthetic data only.
- No external network calls.
- No credentials, private research files, live user data, or third-party APIs.
- Dependency-free Node implementation with local tests and generated demo artifacts.
