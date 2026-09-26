# Plan: AI Application Preparation

**Plan ID:** `08-ai-application-preparation`
**Phase:** Future — V4c / V5a
**Version target:** V4
**Status:** NOT_STARTED
**Depends on:** `07-matching-engine`
**Source:** `ORIGINAL_PLAN.md` section 32 (Automatic Application Threshold), section 33 (Auto-Apply Decision Engine), section 34 (Application Preparation), section 46 (Autonomous Agent Control Panel), section 25 Principles 3 and 5

---

## Goal

Decide whether a job should be prepared at all, choose the right resume,
draft the answers, and rehearse the whole thing in a dry run — without ever
submitting anything.

## Global Acceptance Criteria

- [ ] The decision engine returns the correct decision for every documented
      scenario
- [ ] The auto-apply threshold is configurable with all safety gates active
      and individually non-bypassable
- [ ] Resume selection, question extraction, and answer drafts are produced
      and shown to the user before anything is used
- [ ] Dry-run mode never triggers an actual submission
- [ ] Every decision is logged with the inputs that produced it
- [ ] The provider is replaceable (Principle 5) and the user can see which
      provider was used

## Out of Scope (for this plan)

- **No submission. No browser automation. No CAPTCHA or MFA handling.** This
  plan prepares; `09-application-automation` submits, and only after this
  plan is stable and reviewed.
- No email integration.
- No auto-apply being enabled by default — Principle 3 (User Control)
  requires prepare-and-assist over blind submission.

---

## Task 8.1 — Auto-apply threshold with safety gates

**Depends on:** 7.4

### Goal

Define the configurable match threshold above which a job becomes eligible
for automated handling, with every safety gate required rather than
optional.

### Requirements

- Configurable minimum match score. Default and rationale recorded in this
  plan's `state.md`.
- All section 32 safety gates enforced together and individually
  non-bypassable: minimum score, duplicate check passed, daily limit not
  exceeded, require-confirmation satisfied, email tracking decision
  available, provider available.
- A gate cannot be disabled by a single config flag. Removing a gate is a
  code change with a logged decision.
- Validate configuration at startup; an invalid or unsafe configuration
  fails loudly rather than defaulting to permissive.
- Expose the current threshold and gate states in the UI.

### Acceptance Criteria

- [ ] Threshold is configurable and validated at load time
- [ ] All safety gates are enforced and cannot be individually bypassed
- [ ] An unsafe configuration fails loudly instead of defaulting open
- [ ] Threshold and gate states are visible in the UI

### Out of Scope

- The decision engine (task 8.2), the control panel UI (`11`).

### Technical Notes

- "Fails open" is the dangerous default for a gate. Every unset or invalid
  value must resolve to *blocked*, not *allowed*.
- Keep gate definitions in one module so `11`'s audit log can enumerate them
  rather than hard-coding a list.

### Relevant Files

- `job-agent/lib/automation/threshold.ts`, `job-agent/lib/automation/gates.ts`

---

## Task 8.2 — Decision engine

**Depends on:** 8.1

### Goal

Produce a single, explainable decision for each job.

### Requirements

- Decisions per section 33: `SKIP`, `DUPLICATE`, `MANUAL_REVIEW`,
  `READY_TO_APPLY`, `AUTO_APPLY`.
- The engine is a pure function of (job, resume, match score, gate states,
  history) returning `{ decision, reasons[] }`. No I/O inside it.
- Every decision carries the ordered list of reasons that produced it.
- Documented decision table: for each decision, the exact conditions. Add a
  test per documented scenario.
- `MANUAL_REVIEW` is the fallback whenever a signal is missing,
  contradictory, or an input is unavailable — never a silent `AUTO_APPLY`.

### Acceptance Criteria

- [ ] The engine returns the correct decision for each documented scenario
- [ ] Every decision includes ordered, human-readable reasons
- [ ] The engine is a pure function with no I/O
- [ ] Missing or contradictory signals resolve to `MANUAL_REVIEW`
- [ ] One test per documented scenario, all passing

### Out of Scope

- The actual preparation steps (task 8.3), submission (`09`).

### Technical Notes

- Keep this pure and dependency-free. Its test suite is the main safety
  evidence for the whole autonomous roadmap.
- `AUTO_APPLY` should be reachable only when every gate passes
  simultaneously — verify that no single condition can produce it.

### Relevant Files

- `job-agent/lib/automation/decision.ts`, `job-agent/types/automation.ts`

---

## Task 8.3 — Resume selection

**Depends on:** 8.2, 6.3

### Goal

Choose the best resume version for a specific job.

### Requirements

- Score each stored resume version against the job using the same scorers
  from `07-matching-engine`. Do not write a second scoring implementation.
- Prefer the user's pinned/forced choice when set, and say so in the
  explanation.
- Make the selection explainable: show why each version ranked where it
  did.
- Default to a deterministic tie-break (e.g. the default version) when
  scores are equal.

### Acceptance Criteria

- [ ] Selection reuses `07`'s scorers
- [ ] A user-pinned resume always wins and is labelled as such
- [ ] The ranking is explainable
- [ ] Equal scores break deterministically

### Out of Scope

- Generating or tailoring new resume content.
- Automatic resume rewriting by a model.

### Technical Notes

- **DRY:** a second matching implementation here would silently diverge
  from `07` and produce inconsistent scores.
- Reusing scorers means reusing the same weight configuration; document if
  selection deliberately uses different weights.

### Relevant Files

- `job-agent/lib/automation/resume-selection.ts`

---

## Task 8.4 — Application question extraction

**Depends on:** 8.3

### Goal

Identify the questions and form fields an application will ask.

### Requirements

- Extract questions from the job description and any application form
  material available through a permitted route.
- Classify each question: factual (from resume), preference, eligibility,
  salary expectation, free-form motivation, or unknown.
- Mark every question that cannot be answered from known data as
  `NEEDS_USER_INPUT`. Never auto-answer an unknown question.
- Return the extracted set with its source location for traceability.
- Extraction sits behind a replaceable provider interface (Principle 5),
  with a deterministic rule-based extraction as the default.

### Acceptance Criteria

- [ ] Questions are extracted with their source location
- [ ] Each question is classified
- [ ] Unanswerable questions are marked `NEEDS_USER_INPUT`
- [ ] The provider is swappable and a rule-based default exists

### Out of Scope

- Reading a live application form — that requires browser automation
  (`09`) and is out of scope here.
- Answering the questions (task 8.5).

### Technical Notes

- A deterministic default matters here: this task is the gate before any
  form-filling, and a model hallucinating a question is a silent failure.
- Keep the source location; it is the only way to verify an extraction
  later.

### Relevant Files

- `job-agent/lib/automation/questions.ts`, `job-agent/lib/providers/**`

---

## Task 8.5 — Answer drafting

**Depends on:** 8.4

### Goal

Draft answers from the user's own data, visibly marked as drafts.

### Requirements

- Draft answers **only** from the user's stored resume and job data. Do not
  invent experience, skills, or dates.
- Every draft is labelled a draft requiring review. Unedited drafts must
  never be auto-submitted.
- For `NEEDS_USER_INPUT` questions, present an empty input instead of a
  guess.
- Record which source data each draft came from.
- The user edits drafts in place; edits are stored and preferred over
  regeneration.

### Acceptance Criteria

- [ ] Drafts are generated from stored resume/job data only
- [ ] Every draft is visibly labelled as requiring review
- [ ] `NEEDS_USER_INPUT` items stay empty rather than guessed
- [ ] Each draft cites its source data
- [ ] User edits persist and are not overwritten by re-drafting

### Out of Scope

- Tailoring or rewriting resume content.
- Any submission of the answers.

### Technical Notes

- Principle 3 (User Control): preparation assists, it does not decide.
  A draft that looks finished is the main risk here.
- Never let a regeneration silently discard a user's manual answer.

### Relevant Files

- `job-agent/lib/automation/drafting.ts`, `job-agent/app/**`,
  `job-agent/components/**`

---

## Task 8.6 — Dry-run mode

**Depends on:** 8.5

### Goal

Rehearse the full preparation flow end to end without submitting anything.

### Requirements

- Dry run executes every step of `08` and reports what *would* happen,
      including the decision, resume, drafts, and field mapping.
- Dry run is the default mode and cannot be turned off by configuration.
- The real-submission code path must not be reachable from dry run —
  assert this with a test, not a comment.
- Record a dry-run log entry per run.
- Provide a clear "this was a rehearsal, nothing was submitted" result.

### Acceptance Criteria

- [ ] Dry-run mode never triggers an actual submission
- [ ] Dry run is the default and cannot be disabled by configuration
- [ ] A test asserts the submission path is unreachable in dry run
- [ ] The dry-run report shows every step that would occur
- [ ] Each run is logged

### Out of Scope

- The submission worker itself (`09`).
- Any live form interaction.

### Technical Notes

- This task is the last line of defence before `09`. The reachability
  assertion must be a real test — a comment asserting safety is not a
  safety mechanism.
- Keep the dry-run and real paths sharing everything except the final
  submit call, so a dry run cannot diverge from reality.

### Relevant Files

- `job-agent/lib/automation/dry-run.ts`, `job-agent/lib/automation/**`
