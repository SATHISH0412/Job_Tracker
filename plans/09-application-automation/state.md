# State: Application Automation

**Plan ID:** `09-application-automation`

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
| 9.1 | Browser automation worker | NOT_STARTED | — |
| 9.2 | Application limits | NOT_STARTED | — |
| 9.3 | Duplicate detection | NOT_STARTED | — |
| 9.4 | Failure handling and recovery | NOT_STARTED | — |
| 9.5 | User review and confirmation flow | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **Daily limit value and window semantics (task 9.2):** rolling vs
  calendar day; default maximum.
- **Sub-limits (task 9.2):** per-site or per-company, yes or no.
- **Credential handling (task 9.1):** how the worker authenticates without
  storing or logging credentials in the repo.
- **Retry bounds (task 9.4):** attempts and backoff for transient failures.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `08-ai-application-preparation` must be DONE, stable, and
reviewed by the user first. This is the highest-risk plan in the roadmap.

## Notes

- **Non-negotiable:** never bypass CAPTCHA, MFA/2FA, bot detection, or any
  other security control. Encountering one must escalate to
  `MANUAL_REVIEW`.
- **Non-negotiable:** never report a failure, or an unknown outcome, as a
  success.
- Playwright is the highest-risk dependency this project will add. Keep it
  isolated in this plan's module tree.
