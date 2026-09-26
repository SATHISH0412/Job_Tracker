# State: Resume and Job Analysis

**Plan ID:** `06-resume-and-job-analysis`

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
| 6.1 | Resume upload and storage | NOT_STARTED | — |
| 6.2 | Resume parsing | NOT_STARTED | — |
| 6.3 | Resume preview and version management | NOT_STARTED | — |
| 6.4 | Job description extraction | NOT_STARTED | — |
| 6.5 | Job description analysis view | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Decisions (recorded as tasks complete)

- **Parse execution model (task 6.2):** on-request vs background worker.
- **Encryption at rest for resumes (task 6.1):**
- **AI provider needed for unstructured parsing (task 6.2):** if yes,
  record the provider, the consent flow, and how it is swapped
  (Principle 5).
- **Job description input route (task 6.4):** pasted text only, or a
  permitted integration. No scraping.

## Progress Log

- (empty — append a dated one-line entry here on every touch of this plan)

## Blockers

- none

## Next Action

Do not start. `05-job-persistence` must be DONE first.

## Notes

- The resume is the most sensitive data this project will hold. Principle 4
  (Privacy) applies with full force from task 6.1 onward.
- Task 6.4's structured job shape is the contract for `07-matching-engine`.
  Changing it later invalidates every stored match score.
