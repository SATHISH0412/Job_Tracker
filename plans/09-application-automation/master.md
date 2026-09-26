# Plan: Application Automation

**Plan ID:** `09-application-automation`
**Phase:** Future — V5b / V7
**Version target:** V7
**Status:** NOT_STARTED
**Depends on:** `08-ai-application-preparation` (stable and reviewed)
**Source:** `ORIGINAL_PLAN.md` section 22 (Future Application Automation), section 35 (Application Automation), sections 47–48 (Application Limits, Duplicate Detection), section 50 (Failure Recovery), section 25 Principle 3

---

## Goal

Submit a prepared application through a browser automation worker, under
explicit user review, with hard limits, duplicate protection, and honest
failure reporting.

## Global Acceptance Criteria

- [ ] No submission occurs without explicit user confirmation, unless the
      user has explicitly enabled auto-submit with every section 32 gate
      active
- [ ] Duplicate applications are correctly blocked
- [ ] Failures are recorded and never reported as success
- [ ] The daily application limit is enforced
- [ ] CAPTCHA, MFA/2FA, and anti-automation controls are never bypassed —
      encountering one results in `MANUAL_REVIEW`
- [ ] Every submission is auditable: inputs, decision, confirmation,
      outcome

## Out of Scope (for this plan)

- **Never bypass CAPTCHA, MFA/2FA, bot detection, rate limits, or any
  security control.** This is a hard, non-negotiable rule.
- No LinkedIn credential storage beyond what the user explicitly configures
  through a permitted route; no credential logging, ever.
- No status detection from email — that is `10-tracking-and-email`.
- No unsupervised operation. This plan does not run without the control
  panel's switches being explicitly enabled.

---

## Task 9.1 — Browser automation worker

**Depends on:** 8.6

### Goal

Build the Playwright-based worker that performs a prepared application.

### Requirements

- A worker that executes the prepared steps: navigate, fill fields from the
  approved draft mapping, attach the selected resume, and reach the final
  submit step.
- The worker stops before the final submit and hands control back for
  confirmation, unless auto-submit is explicitly enabled with all gates
  active.
- Run in an isolated browser context per application; clean up on
  completion, failure, or timeout.
- Apply conservative, configurable timeouts. Never retry indefinitely.
- Detect and abort on CAPTCHA, MFA/2FA, or bot-detection challenges —
  escalate to `MANUAL_REVIEW` with the reason. Do not attempt to solve or
  circumvent them under any circumstance.
- Isolate all Playwright usage in this plan's own module tree so its
  footprint is auditable.

### Acceptance Criteria

- [ ] The worker reaches the final submit step without submitting
- [ ] Submission occurs only after confirmation, or with auto-submit
      explicitly enabled and all gates active
- [ ] A CAPTCHA or MFA challenge results in `MANUAL_REVIEW`, never an
      attempt to bypass it
- [ ] Contexts are cleaned up on success, failure, and timeout
- [ ] Timeouts are finite and configurable

### Out of Scope

- The limit, duplicate, and recovery logic (tasks 9.2–9.4).
- Status detection from email.

### Technical Notes

- Treat "stop before submit" as the default and "submit" as the exception
  that must be argued for in code review.
- Playwright is the highest-risk dependency this project will add. Keep it
  isolated, and keep credentials out of logs and out of the repo.

### Relevant Files

- `job-agent/lib/automation/worker/**`, `job-agent/lib/automation/worker.ts`

---

## Task 9.2 — Application limits

**Depends on:** 9.1

### Goal

Enforce a hard cap on applications per day.

### Requirements

- Configurable maximum applications per day, per section 47.
- The cap is checked **before** starting an application, and re-checked at
  submit time.
- The counter is persistent (survives restart) and scoped to a defined
  window — decide and record the window semantics (rolling vs calendar day)
  in this plan's `state.md`.
- When the cap is reached, queue or stop cleanly with a clear user-facing
  reason. Never exceed the cap because of a race or a retry.
- A cap cannot be raised by the automation itself.

### Acceptance Criteria

- [ ] The daily limit is enforced before and at submit time
- [ ] The counter survives an application restart
- [ ] Concurrency cannot breach the cap
- [ ] Reaching the cap stops cleanly with an explained reason
- [ ] Window semantics are documented

### Out of Scope

- Per-site or per-company sub-limits (decide whether to add; do not assume).

### Technical Notes

- Check-then-act across a process boundary is a race. Use an atomic
  increment or a database constraint, not a read-then-write.
- The limit is a safety mechanism for the user's account as much as for
  politeness; treat a breach as a bug, not a tuning issue.

### Relevant Files

- `job-agent/lib/automation/limits.ts`

---

## Task 9.3 — Duplicate detection

**Depends on:** 9.1

### Goal

Block a second application to a job that has already been applied to.

### Requirements

- Detect duplicates across multiple signals per section 48: LinkedIn job
  id, external id, canonical URL, and a content fingerprint
  (company + normalised title + normalised location).
- All available signals are checked; the decision and the matching signal
  are recorded.
- Deduplication runs **before** any browser work, so a duplicate costs
  nothing.
- The fingerprint strategy reuses the uniqueness key designed in
  `05-job-persistence` task 5.4.
- A genuine near-duplicate (same company, different posting id) should be
  flagged for the user, not silently allowed or silently blocked.

### Acceptance Criteria

- [ ] Duplicate applications are correctly blocked
- [ ] Detection happens before any browser work begins
- [ ] The matched signal is recorded for every block
- [ ] The fingerprint strategy is shared with `05`, not reimplemented
- [ ] Near-duplicates are surfaced to the user, not auto-decided

### Out of Scope

- Cross-user deduplication (single-user tool).
- Deduplicating job *descriptions* before saving (that is `06`).

### Technical Notes

- Normalise before fingerprinting: "Sr. Software Engineer" and "Senior
  Software Engineer" are the same job, and a naive fingerprint misses it.
- Reuse `05`'s unique key or the two will disagree about what a duplicate
  is.

### Relevant Files

- `job-agent/lib/automation/dedupe.ts`, `job-agent/lib/db.ts`

---

## Task 9.4 — Failure handling and recovery

**Depends on:** 9.2, 9.3

### Goal

Ensure no failure is ever reported as a success.

### Requirements

- Classify failures per section 50: transient (retryable with backoff),
  terminal, and blocked-by-challenge.
- On any failure, set status to `MANUAL_REVIEW` and record the reason.
  Never set `APPLIED` unless the submission was positively confirmed.
- A retry must re-run duplicate detection and the limit check, never resume
  mid-submit.
- Persist the outcome so a crash mid-application does not leave a job stuck
  in an ambiguous state; a stale in-flight record must be reconcilable.
- A submission whose outcome is unknown is reported as unknown — not as
  success and not as failure.
- Record the failure class, the attempt count, and the last error in a form
  safe to display to the user.

### Acceptance Criteria

- [ ] Failures are recorded and never silently reported as success
- [ ] Every failure resolves to `MANUAL_REVIEW` with a recorded reason
- [ ] Retries re-run duplicate detection and the limit check
- [ ] A crash mid-application leaves a reconcilable record
- [ ] An unknown outcome is reported as unknown
- [ ] Transient failures retry with bounded backoff

### Out of Scope

- A general retry framework for other plans.
- User-facing error analytics.

### Technical Notes

- The dangerous bug in this task is a default branch that marks a job
  applied. Write the success path explicitly and make every other path
  land in `MANUAL_REVIEW`.
- "Unknown" is a legitimate terminal state. Collapsing it into either
  success or failure is a lie in the user's tracker.

### Relevant Files

- `job-agent/lib/automation/failure.ts`, `job-agent/lib/automation/worker/**`

---

## Task 9.5 — User review and confirmation flow

**Depends on:** 9.4

### Goal

Put a human in the loop for every submission.

### Requirements

- Present the prepared application for review: decision, resume, every
      draft answer, and the job — before any submission.
- Require an explicit, deliberate confirmation action to submit. A default
  or pre-ticked control does not count as confirmation.
- Support auto-submit only when the user has explicitly enabled it, all
      section 32 gates are active, and the score is above threshold. Make
      the enabling action clearly consequential.
- Show the current daily usage against the cap.
- Every confirmation records who/what confirmed, when, and what was
      submitted.
- An unreviewed draft can never be submitted by the auto path.

### Acceptance Criteria

- [ ] A submission never happens without explicit user confirmation, unless
      auto-submit is explicitly enabled with all gates active
- [ ] Confirmation cannot be satisfied by a default or pre-ticked state
- [ ] The review shows every draft that will be submitted
- [ ] Confirmation is recorded with timestamp and payload
- [ ] Daily usage against the cap is visible

### Out of Scope

- Bulk confirmation of many applications at once.
- Unattended operation without any human in the loop.

### Technical Notes

- This task is Principle 3 (User Control) made concrete. If the review
  screen can be skipped, the principle is decorative.
- Make the auto-submit toggle hard to enable accidentally and easy to
  disable.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`,
  `job-agent/lib/automation/confirm.ts`
