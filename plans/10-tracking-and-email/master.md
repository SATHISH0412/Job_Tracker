# Plan: Application Tracking and Email

**Plan ID:** `10-tracking-and-email`
**Phase:** Future — V5c/V9 (tracking) / V8 (email)
**Version target:** V5 and V8
**Status:** NOT_STARTED
**Depends on:** `09-application-automation` (tracking) and `08-ai-application-preparation` (email may start earlier if scoped to status only)
**Source:** `ORIGINAL_PLAN.md` section 21 (Future Application Tracker), section 36 (Application Database), section 37 (Email Integration), sections 38–41 (Email Monitoring, Matching, Classification, Status Updates), section 42 (Application Timeline), sections 43–44 (Email Privacy, Sync Architecture)

---

## Goal

Keep an accurate, auditable record of every application, and let the user
opt in to email-based status detection so the tracker updates itself —
without ever asking for an email password.

## Global Acceptance Criteria

- [ ] Every application has an accurate status and a complete event timeline
- [ ] Status transitions are recorded as events, never mutated in place
- [ ] Email integration is OAuth-only; no email password is ever requested,
      stored, or logged
- [ ] Only least-privilege email scopes are requested
- [ ] Email sync is resumable via a stored cursor and never reprocesses
- [ ] Classification carries a confidence score and only high-confidence
      matches update status automatically
- [ ] Every classification and status change is logged to the timeline,
      automatic or not
- [ ] Email tokens are encrypted at rest
- [ ] The user can disconnect and delete everything, per section 43

## Out of Scope (for this plan)

- No auto-submission (that is `09`).
- No reading or storing email body content beyond what classification
  strictly requires.
- No contacts, calendar, or mail-sending functionality.
- No multi-provider email support in the first pass.

---

## Task 10.1 — Applications schema and status pipeline

**Depends on:** 5.1, 9.4

### Goal

Persist every application and define its lifecycle.

### Requirements

- `applications` table per section 36, plus an `application_events` table
  for the timeline. Status is derived from events, not stored as the only
  source of truth.
- Status pipeline per section 21: `Saved` → `Preparing` → `Ready for
  Review` → `Applied` → `Assessment` → `Interview` → `Offer`, plus
  `Rejected`, `Withdrawn`, and `No Response`.
- Model the pipeline as an explicit state machine with legal transitions
  defined in one module. An illegal transition is rejected, not silently
  applied.
- Every transition writes an event with a timestamp, the source
  (user / automation / email), and the confidence where applicable.
- Foreign keys to the saved job, the resume version used, and the match
  score at submission time — so history stays interpretable after the
  resume or weights change.

### Acceptance Criteria

- [ ] `applications` and `application_events` tables exist per section 36
- [ ] The status pipeline is an explicit state machine in one module
- [ ] Illegal transitions are rejected
- [ ] Every transition writes an event with source and timestamp
- [ ] The application links to the exact resume version and match score
      used

### Out of Scope

- Reporting, analytics, or a dashboard (that is task 10.3).
- Status inference from email (that is task 10.6).

### Technical Notes

- Deriving status from events is what makes the timeline trustworthy and
  makes `11`'s audit log possible.
- Snapshot the match score rather than joining to a mutable row; a score
  that changes after the fact makes past decisions unexplainable.

### Relevant Files

- `job-agent/migrations/**`, `job-agent/lib/applications/state-machine.ts`

---

## Task 10.2 — Application timeline

**Depends on**: 10.1

### Goal

Record and expose every event in an application's life.

### Requirements

- Write an event for every meaningful transition, submission attempt,
  failure, retry, duplicate block, and manual edit.
- Events are append-only. Corrections are new events, never edits or
  deletes of history.
- Each event stores: type, timestamp, source, actor, confidence where
  relevant, and a user-safe message.
- Expose the timeline ordered chronologically with no internal detail
  (stack traces, credentials, raw provider payloads).
- Persist enough to answer section 51's audit questions from day one.

### Acceptance Criteria

- [ ] Every meaningful action produces an event
- [ ] Events are append-only; corrections are additive
- [ ] Events contain no secrets or raw internal payloads
- [ ] The timeline is returned in chronological order

### Out of Scope

- Event retention or pruning policy (decide and record; default is
  indefinite for a single-user tool).
- Timeline export.

### Technical Notes

- Append-only is the whole point. An editable history cannot answer "what
  happened" after a bug.
- Write events in the same transaction as the state change, or a crash
  leaves the two inconsistent.

### Relevant Files

- `job-agent/lib/applications/events.ts`, `job-agent/lib/db.ts`

---

## Task 10.3 — Application tracking dashboard

**Depends on**: 10.2, 9.5

### Goal

Give the user a clear view of every application and its status.

### Requirements

- A dashboard listing applications with title, company, status, and last
  update, filterable by status.
- A detail view per application showing the full timeline from task 10.2.
- Status badges match the pipeline; terminal states (Rejected, Withdrawn,
  Offer) are visually distinct from active ones.
- Actions available where legal per the state machine: mark withdrawn,
  reopen, add a note. No action that the state machine forbids.
- Responsive per `02-search-ui` task 2.7.
- Never show a status that was not actually recorded.

### Acceptance Criteria

- [ ] Every application appears with an accurate status and last update
- [ ] The dashboard is filterable by status
- [ ] The detail view shows the complete chronological timeline
- [ ] Only state-machine-legal actions are offered
- [ ] No status is displayed that is not backed by a recorded event

### Out of Scope

- Charts, statistics, or conversion analytics.
- Bulk status edits.

### Technical Notes

- The state machine from task 10.1 is the single source of truth for which
  actions are legal. Derive the UI's action list from it rather than
  hard-coding buttons.
- "Never show an unrecorded status" is the same honesty rule that governs
  V1's UI copy.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`,
  `job-agent/lib/applications/**`

---

## Task 10.4 — Email OAuth connection

**Depends on**: 10.1

### Goal

Connect the user's mailbox via OAuth, requesting the least privilege
possible.

### Requirements

- OAuth only. **Never request, store, or log an email password.** If a
  provider offers app passwords, do not use them.
- Request only read-only, narrowly scoped access. Do not request send,
  delete, or modify scopes. Record the exact scopes requested and the
  justification for each in this plan's `state.md`.
- Store access and refresh tokens encrypted at rest, in server-only
  modules. Never return a token to the client.
- Implement token refresh and handle revocation or expiry gracefully.
- The user can disconnect at any time, which deletes the stored tokens.
- Show the connection state in the UI, including which mailbox is
  connected.

### Acceptance Criteria

- [ ] Connection is OAuth-only; no password is ever requested
- [ ] Only least-privilege read scopes are requested, and each is justified
      in `state.md`
- [ ] Tokens are encrypted at rest and never reach the client
- [ ] Disconnecting deletes the stored tokens
- [ ] Revoked or expired credentials degrade cleanly

### Out of Scope

- Multiple connected mailboxes.
- Any email sending capability.

### Technical Notes

- Section 43 (Email Privacy) is mandatory, not advisory. Read it before
  implementing.
- Principle 5: keep the provider behind an interface so a second provider
  is an addition, not a rewrite.

### Relevant Files

- `job-agent/lib/email/oauth.ts`, `job-agent/lib/email/**`,
  `job-agent/lib/env.ts`, `job-agent/migrations/**`

---

## Task 10.5 — Email sync worker

**Depends on**: 10.4

### Goal

Fetch new mail incrementally and exactly once.

### Requirements

- Poll or subscribe per section 44, with a stored cursor (or last-seen
  message id / timestamp) so nothing is reprocessed on restart.
- Store raw email metadata needed for classification. Do not retain full
  bodies longer than classification requires.
- Process idempotently: re-processing the same message must be a no-op.
- Back off on provider errors and rate limits; never hammer the API.
- Record sync runs and cursor position so a gap is detectable.
- Deleting the connection stops the worker cleanly.

### Acceptance Criteria

- [ ] Sync resumes from a stored cursor without reprocessing
- [ ] Re-processing a message is a no-op
- [ ] Errors back off rather than retrying in a tight loop
- [ ] Every sync run and its cursor position are recorded
- [ ] Disconnecting stops the worker

### Out of Scope

- Push notifications for new mail.
- Mailbox search UI.

### Technical Notes

- Idempotency is the requirement; at-least-once delivery from the provider
  is the reality. Make the processing side safe to repeat.
- Rate limits from email providers are easy to hit and expensive to
  ignore; back off deliberately.

### Relevant Files

- `job-agent/lib/email/sync.ts`, `job-agent/lib/email/**`

---

## Task 10.6 — Email classification and application matching

**Depends on**: 10.5, 10.1

### Goal

Turn emails into confident, correct status updates.

### Requirements

- Classify each relevant email per section 40: `APPLICATION_RECEIVED`,
  `INTERVIEW_REQUESTED`, `ASSESSMENT_REQUESTED`, `REJECTED`, `OFFER`,
  `WITHDRAWAL_CONFIRMED`, `UNKNOWN`, with a confidence score.
- Match the email to an application using the section 39 signals:
  company, title, job id, sender domain, and canonical URL. Define and
  record the precedence order in this plan's `state.md`.
- Deterministic, explainable rules take precedence over model-based
  classification. A model may be used only behind a swappable interface
  (Principle 5) and only as a tie-breaker.
- An ambiguous match resolves to no automatic update and surfaces for user
  review. Never guess between two applications.
- Every classification, matched or not, is logged.

### Acceptance Criteria

- [ ] Email classification meets the confidence bar in sections 39–40
- [ ] Matching uses the documented signal precedence
- [ ] Ambiguous matches produce no automatic update and are surfaced
- [ ] Every classification is logged, matched or not
- [ ] Deterministic rules outrank model output

### Out of Scope

- Reading attachments.
- Replying to emails.

### Technical Notes

- False-positive status updates are worse than missed ones — they corrupt
  the tracker the user relies on. Default to surfacing for review.
- A model must never be the only thing standing between an email and a
  status change.

### Relevant Files

- `job-agent/lib/email/classify.ts`, `job-agent/lib/email/match.ts`

---

## Task 10.7 — Automatic status updates with thresholds

**Depends on**: 10.6

### Goal

Apply high-confidence classifications as status updates, and log everything
else.

### Requirements

- Only classifications above a configurable confidence threshold update
  status automatically. Record the default threshold and its rationale.
- Below the threshold: create a timeline event marked "needs review" and
  surface it in the UI. Do not change status.
- Status changes go through the state machine from task 10.1. An email may
  not force an illegal transition.
- Every automatic update records the source email reference, the
  classification, the confidence, and the matched signals.
- The user can override any automatic update, and the override is itself an
  event.
- Disabling email tracking leaves existing statuses intact.

### Acceptance Criteria

- [ ] Only above-threshold classifications update status automatically
- [ ] Below-threshold classifications are logged and surfaced, not applied
- [ ] Email updates respect the state machine
- [ ] Every automatic update records its evidence
- [ ] User overrides are possible and recorded as events

### Out of Scope

- Bulk re-classification of historical mail.
- Confidence threshold tuning by ML.

### Technical Notes

- Reversible by design: if the threshold proves too low in practice, the
  user can turn it up and every affected change is still auditable.
- Keep the evidence attached. An unexplained status change is worse than
  no update at all.

### Relevant Files

- `job-agent/lib/email/apply.ts`, `job-agent/lib/applications/state-machine.ts`

---

## Task 10.8 — Email privacy compliance review

**Depends on**: 10.7

### Goal

Verify the implementation honours section 43 before it touches real mail.

### Requirements

- Re-read section 43 and verify every stated requirement against the
  implementation. Record the verification in this plan's `state.md`.
- Confirm: no password ever requested, stored, or logged; least-privilege
  scopes only; tokens encrypted at rest and never sent to the client;
  disconnect deletes everything; no email content retained beyond need.
- Confirm no email-derived data leaks into client bundles or logs.
- Document what email metadata *is* stored and for how long.
- Get explicit user sign-off before enabling sync against a real mailbox.

### Acceptance Criteria

- [ ] Every section 43 requirement is verified and recorded
- [ ] No password handling exists anywhere in the codebase
- [ ] Stored email metadata is documented with retention
- [ ] Nothing email-derived leaks to the client or logs
- [ ] The user has explicitly signed off before real-mailbox sync

### Out of Scope

- A legal review.
- A security audit beyond the stated checks.

### Technical Notes

- Section 43 is the plan's defining constraint. If a requirement cannot be
  met, stop and report it — do not ship a partial compliance story.
- This is a private single-user tool, so proportionality matters, but
  Principle 4 is not optional.

### Relevant Files

- `job-agent/lib/email/**`, `plans/10-tracking-and-email/state.md`
