# State: Autonomous Agent

**Plan ID:** `11-autonomous-agent`

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
| 11.1 | Control panel | NOT_STARTED | — |
| 11.2 | Unified safety gate enforcement | NOT_STARTED | — |
| 11.3 | Confidence-based automation | NOT_STARTED | — |
| 11.4 | Observability and audit log | NOT_STARTED | — |
| 11.5 | End-to-end autonomous loop | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **Automation scheduling windows (task 11.1):** whether to add.
- **Signal combination method and failure mode (task 11.3):** the
  documented method from section 49.
- **Audit retention/sampling policy (task 11.4):** bounded volume without
  ever dropping a real action.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. Every prior plan must be DONE and stable in production
first. This is the final plan.

## Notes

- This plan composes; it must not add new automation capability. A gap
  discovered here is logged as a gap, not built here.
- Every ambiguity in the autonomous loop must resolve to **stopped**, never
  allowed.
- Enable and verify each mode in sequence: dry-run → no-submit →
  confirm-first → auto-submit. Never skip a step.
