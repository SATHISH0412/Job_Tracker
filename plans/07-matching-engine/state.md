# State: Matching Engine

**Plan ID:** `07-matching-engine`

## Current Status

NOT_STARTED

<!--
Allowed values: NOT_STARTED | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE
Update this value every time work starts, stalls, or finishes on this plan.
The plan is DONE only when every task below is DONE.
-->

## Task Status

| # | Task | Status | Completed |
|---|---|---|---|
| 7.1 | Configurable scoring weights | NOT_STARTED | — |
| 7.2 | Deterministic scoring rules | NOT_STARTED | — |
| 7.3 | Semantic similarity scoring | NOT_STARTED | — |
| 7.4 | Match score aggregation and explanation | NOT_STARTED | — |
| 7.5 | Match score UI | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **Weight normalisation rule (task 7.1):** must sum to 1.0, or normalised
  at load time.
- **Weight overrides (task 7.1):** per-user, per-call, or config file only.
- **Missing-data scoring policy (task 7.2):** for required skills,
  experience, education, and location.
- **Semantic provider (task 7.3):** provider name, cost, privacy impact,
  consent flow, deterministic fallback strategy.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `06-resume-and-job-analysis` must be DONE first.

## Notes

- Section 30 default weights: required skills 40%, preferred 10%,
  experience 20%, education 5%, location 10%, semantic 15%.
- Hard rule: an LLM must never produce the final score. It may contribute
  the semantic category and nothing else.
- Hard rule: the score is a system-generated estimate, never a guarantee
  or an offer probability.
