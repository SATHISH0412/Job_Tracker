# State: Job Persistence

**Plan ID:** `05-job-persistence`

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
| 5.1 | Database connection and migration setup | NOT_STARTED | — |
| 5.2 | Search history schema and storage | NOT_STARTED | — |
| 5.3 | Search history display and re-run | NOT_STARTED | — |
| 5.4 | Saved jobs schema and API | NOT_STARTED | — |
| 5.5 | Saved jobs page | NOT_STARTED | — |
| 5.6 | Data deletion and privacy review | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **ORM / query layer chosen (task 5.1):**
- **Saved-job data source (task 5.4):** V1 produces search URLs only, so
  decide whether saving is user-pasted data or waits for a permitted
  integration.
- **History retention rule (task 5.2):**
- **Duplicate-consecutive-search policy (task 5.2):**

## Data inventory (task 5.6)

| Table | Column | Purpose | Retention |
|---|---|---|---|
| — | — | — | — |

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `04-private-access-and-handoff` must be DONE and V1 reported
complete first.

## Notes

- This is the first plan with a database dependency. Its ORM/query choice
  constrains `06`, `08`, and `10` — decide deliberately in task 5.1.
