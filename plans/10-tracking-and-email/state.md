# State: Application Tracking and Email

**Plan ID:** `10-tracking-and-email`

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
| 10.1 | Applications schema and status pipeline | NOT_STARTED | — |
| 10.2 | Application timeline | NOT_STARTED | — |
| 10.3 | Application tracking dashboard | NOT_STARTED | — |
| 10.4 | Email OAuth connection | NOT_STARTED | — |
| 10.5 | Email sync worker | NOT_STARTED | — |
| 10.6 | Email classification and application matching | NOT_STARTED | — |
| 10.7 | Automatic status updates with thresholds | NOT_STARTED | — |
| 10.8 | Email privacy compliance review | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **OAuth scopes requested and justification per scope (task 10.4):**
- **Provider behind the swappable interface (task 10.4):**
- **Sync mode and backoff (task 10.5):** polling interval, rate-limit
  strategy.
- **Email→application signal precedence order (task 10.6):**
- **Automatic status update confidence threshold and rationale (task 10.7):**
- **Event retention policy (task 10.2):**
- **Stored email metadata inventory and retention (task 10.8):**

## Section 43 privacy verification (task 10.8)

| Requirement | Verified | Evidence |
|---|---|---|
| No email password requested, stored, or logged | — | — |
| Least-privilege read-only scopes only | — | — |
| Tokens encrypted at rest | — | — |
| Tokens never sent to the client | — | — |
| Disconnect deletes all stored data | — | — |
| No email content retained beyond need | — | — |
| Nothing email-derived leaks to logs or client bundle | — | — |
| User sign-off before real-mailbox sync | — | — |

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `09-application-automation` must be DONE and reviewed first.

## Notes

- **Non-negotiable:** OAuth only. Never request, store, or log an email
  password.
- Section 43 is mandatory, not advisory. If a requirement cannot be met,
  stop and report it rather than shipping partial compliance.
- False-positive status updates corrupt the tracker the user relies on.
  Default to surfacing for review, not to guessing.
