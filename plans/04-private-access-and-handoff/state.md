# State: Private Access and Handoff

**Plan ID:** `04-private-access-and-handoff`

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
| 4.1 | Choose and record the access-control approach | NOT_STARTED | — |
| 4.2 | Implement the private access layer | NOT_STARTED | — |
| 4.3 | Verify secret hygiene | NOT_STARTED | — |
| 4.4 | Project documentation | NOT_STARTED | — |
| 4.5 | Verify V1 success criteria and hand off | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Access-control decision (filled in by task 4.1)

- **Chosen approach:**
- **Rejected option 1 (and why):**
- **Rejected option 2 (and why):**
- **Residual risk not covered:**

## V1 success criteria (from `ORIGINAL_PLAN.md` section 26)

Filled in by task 4.5. Each item needs evidence, not just a tick.

| # | Criterion | Verified | Evidence |
|---|---|---|---|
| 1 | Application runs locally | — | — |
| 2 | Application is responsive | — | — |
| 3 | Search form works | — | — |
| 4 | Keyword filtering works | — | — |
| 5 | Location filtering works | — | — |
| 6 | Experience filtering works | — | — |
| 7 | Remote filtering works | — | — |
| 8 | Job-type filtering works | — | — |
| 9 | Date-posted filtering works | — | — |
| 10 | Inputs are validated | — | — |
| 11 | LinkedIn search URL is generated correctly | — | — |
| 12 | User can open the search on LinkedIn | — | — |
| 13 | Loading states work | — | — |
| 14 | Error states work | — | — |
| 15 | No secrets are exposed to the browser | — | — |
| 16 | Project is documented | — | — |
| 17 | Project can be deployed | — | — |

> Item 17 is satisfied by a successful production build plus documented
> deployment inputs. **Do not deploy** — deployment was removed from the
> plan set.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Start task 4.1 once `01-project-setup` is DONE. Do not begin before the
approach is recorded — implementing first and justifying later is exactly
the failure this task exists to prevent.

## Notes

- `AGENTS.md` §5a defines when commits and PRs happen automatically; do not
  create them ad hoc for this plan.
