# State: Search UI

**Plan ID:** `02-search-ui`

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
| 2.1 | Header component | NOT_STARTED | — |
| 2.2 | Search form component | NOT_STARTED | — |
| 2.3 | Search form validation | NOT_STARTED | — |
| 2.4 | Loading state | NOT_STARTED | — |
| 2.5 | Error handling UI | NOT_STARTED | — |
| 2.6 | Empty state | NOT_STARTED | — |
| 2.7 | Responsive layout pass | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Start task 2.1 (header) once `01-project-setup` is DONE.

## Notes

- Task 2.3 (`lib/validation.ts`) is the shared validation module. Task 3.3
  in `03-linkedin-search` must import it rather than reimplement rules —
  this is the single biggest DRY risk across the two plans.
- Task 2.2 requires option lists to live in `types/job.ts` only.
