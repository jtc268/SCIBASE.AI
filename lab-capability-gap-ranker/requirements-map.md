# Requirements Map

Issue #16 describes an AI-Powered Research Assistant Suite with auto peer-review reports, reproducibility checks, and a research gap finder. This slice focuses specifically on the research gap finder requirement.

| Issue area | Coverage in this module |
| --- | --- |
| Research Gap Finder | Builds a ranked opportunity feed from opportunity packets and lab profile data. |
| Under-studied intersections | Scores multi-topic opportunities and boosts cross-domain gaps with low replication. |
| Frequently cited unresolved questions | Uses unresolved-question mentions and citation velocity as evidence-strength signals. |
| Topic clusters with high activity but low replication | Combines topic activity, replication attempts, negative-result count, and saturation into evidence and novelty scores. |
| Negative results or limitations | Negative-result count contributes to evidence strength for open directions. |
| User interests | Matches opportunity topics to researcher interests. |
| Project history | Matches opportunities against prior project topics. |
| Lab capabilities | Gates opportunities against methods, instruments, datasets, model systems, budget, time, ethics approval, and biosafety review. |
| Strategic decisions for labs | Emits start, partner, watchlist, or hold lanes with first tasks for each idea. |

## Non-overlap

This is not another broad assistant suite, peer-review generator, reproducibility checker, citation reconciler, limitations disclosure assistant, benchmark leakage audit, study power assistant, image integrity assistant, prompt safety guard, or negative-result replication planner. It focuses on capability-aware research opportunity ranking.
