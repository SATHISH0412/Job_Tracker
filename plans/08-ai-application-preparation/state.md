# State: AI Application Preparation

**Plan ID:** `08-ai-application-preparation`

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
| 8.1 | Auto-apply threshold with safety gates | NOT_STARTED | — |
| 8.2 | Decision engine | NOT_STARTED | — |
| 8.3 | Resume selection | NOT_STARTED | — |
| 8.4 | Application question extraction | NOT_STARTED | — |
| 8.5 | Answer drafting | NOT_STARTED | — |
| 8.6 | Dry-run mode | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **Default match threshold (task 8.1):** value and rationale.
- **Safety gate list (task 8.1):** enumerated, with confirmation that none
  is individually bypassable.
- **Resume selection weights (task 8.3):** reuse `07`'s, or differ (and
  why).
- **Extraction provider (task 8.4):** deterministic default plus the
  optional swappable provider.
- **Real-submission path identifier (task 8.6):** the symbol the
  reachability test asserts is unreachable in dry run.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `07-matching-engine` must be DONE first.

## Notes

- **Nothing in this plan submits anything.** The plan ends at a rehearsal.
  `09-application-automation` is a separate, deliberately gated plan.
- Principle 3 (User Control): prepare and assist, never blindly submit.
- Principle 5 (Replaceable Providers): every AI call in this plan sits
  behind an interface.
