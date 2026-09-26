# Plan: Autonomous Agent

**Plan ID:** `11-autonomous-agent`
**Phase:** Future — V9 / V10
**Version target:** V9
**Status:** NOT_STARTED
**Depends on:** `10-tracking-and-email` (and transitively every prior plan)
**Source:** `ORIGINAL_PLAN.md` section 45 (Complete Autonomous Architecture), section 46 (Autonomous Agent Control Panel), section 49 (Confidence-Based Automation), section 51 (Observability and Audit Logs), section 53 (Final Product Vision)

---

## Goal

Wire every prior plan into one end-to-end loop under a single control
panel, where every automated action is explainable, every safety gate is
enforced together, and the user can stop everything at once.

## Global Acceptance Criteria

- [ ] Every automated action is explainable via the audit log, answering
      every question in section 51
- [ ] All safety gates from earlier plans are enforced **together** and
      are not individually bypassable
- [ ] The control panel exposes every switch from section 46
- [ ] A single "stop everything" control halts all autonomous activity
- [ ] No automated path can reach submission while any gate is closed
- [ ] The user can inspect why any single decision was made, from the UI

## Out of Scope (for this plan)

- No new automation capability. This plan composes existing ones.
- No change to any safety gate's semantics — only composition and
  visibility.
- No unattended operation with the control panel disabled. If the panel
  cannot be reached, the safe state is *stopped*.
- No multi-user support.

---

## Task 11.1 — Control panel

**Depends on**: 10.3, 8.1, 9.2

### Goal

Build the single surface where every autonomous behaviour is switched on
and off.

### Requirements

- Expose every section 46 control: auto-apply on/off, minimum match score,
  max applications per day, require-confirmation toggle, email tracking
  on/off, and notifications.
- Every switch shows its current effective value, including values that
  came from configuration rather than the UI.
- A prominent, always-available "stop all automation" control that halts
  in-flight and future activity immediately.
- Changing a switch takes effect on the next cycle and is recorded as an
  event with the previous value.
- Validation prevents nonsensical combinations (e.g. auto-apply on while
  require-confirmation is off **and** the score threshold is unset).
- The panel must be reachable without any automated action having occurred.

### Acceptance Criteria

- [ ] Every section 46 control is present and functional
- [ ] Effective values are shown, not just local UI state
- [ ] "Stop all automation" halts activity immediately
- [ ] Every switch change is recorded with its previous value
- [ ] Invalid combinations are prevented with an explanation

### Out of Scope

- Per-job or per-company overrides of the global limits.
- Scheduling automation windows (decide and record whether to add).

### Technical Notes

- The panel is the user's only lever on autonomy. It must be reachable and
  legible at a glance, especially the stop control.
- Read effective values from the gate module (task 8.1), not from a
  separate config read, or the panel will lie.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`,
  `job-agent/lib/automation/gates.ts`

---

## Task 11.2 — Unified safety gate enforcement

**Depends on**: 11.1, 9.2, 9.3

### Goal

Make it structurally impossible for any automated path to act while a
gate is closed.

### Requirements

- Every autonomous action — prepare, submit, or status update — passes
  through one gate-evaluating chokepoint. No component, route, or worker
  may reach the action without it.
- All gates are evaluated together, per section 49's multi-signal approach
      and section 32's safety gates. Passing one is never sufficient.
- A closed gate blocks the action and records which gate blocked it.
- Write a test asserting that no submission path exists that bypasses the
  chokepoint.
- If the gate configuration cannot be loaded, the safe state is *stopped*,
  never *allowed*.

### Acceptance Criteria

- [ ] All safety gates are enforced together and are not individually
      bypassable
- [ ] A test asserts no submission path bypasses the chokepoint
- [ ] Every block records the specific gate that blocked it
- [ ] An unloadable configuration resolves to stopped, not allowed
- [ ] Every autonomous action type is covered by the chokepoint

### Out of Scope

- Changing what any individual gate means.
- Per-gate exceptions.

### Technical Notes

- This is the structural answer to "can any path skip the checks?" — one
  chokepoint, verified by a test that enumerates entry points.
- Fail closed. Every ambiguity in this project resolves to stopped.

### Relevant Files

- `job-agent/lib/automation/gates.ts`, `job-agent/lib/automation/**`

---

## Task 11.3 — Confidence-based automation

**Depends on**: 11.2, 10.6, 7.4

### Goal

Combine multiple independent signals into one automation decision, per
section 49 — never a single threshold.

### Requirements

- Combine at minimum: match score, email classification confidence,
  duplicate-check result, limit headroom, and historical outcome for
  similar roles.
- Signals combine through a documented, inspectable method with a defined
  failure mode. Record the method and its rationale in this plan's
  `state.md`.
- Every contributing signal is reported with the final decision, so a
  decision can be reconstructed.
- A missing signal reduces confidence; it never silently counts as a pass.
- The combined decision still routes through the chokepoint from task
  11.2.

### Acceptance Criteria

- [ ] Multiple independent signals contribute to every automated decision
- [ ] No single threshold alone can authorise an action
- [ ] Every contributing signal is reported alongside the decision
- [ ] A missing signal reduces confidence rather than defaulting to pass
- [ ] The combination method and failure mode are documented

### Out of Scope

- Model-based weighting learned from outcomes.
- Per-user tuning of the signal combination.

### Technical Notes

- A single threshold is exactly the failure section 49 warns about: it
  cannot tell a confident match from a confident mistake.
- Report signals even when the decision is obvious — the audit log is the
  product, not a debug feature.

### Relevant Files

- `job-agent/lib/automation/confidence.ts`

---

## Task 11.4 — Observability and audit log

**Depends on**: 11.3, 10.2

### Goal

Make every automated action answerable after the fact, per section 51.

### Requirements

- Log every automated action with: what was attempted, which gates were
  evaluated and their results, which signals contributed, the decision,
  the outcome, and the resulting timeline event.
- The log must answer every question section 51 lists, including why a job
  was skipped, why a submission happened, and why a status changed.
- Logs are append-only and contain no secrets, tokens, credentials, or raw
  provider payloads.
- Provide a searchable audit view in the UI, filterable by application,
  decision, and time range.
- The log survives restarts and is stored with the same retention as the
  application timeline.
- Log volume must be bounded — define and record a retention or sampling
  policy that never drops gate evaluations for real actions.

### Acceptance Criteria

- [ ] Every automated action is explainable via the audit log
- [ ] Every question in section 51 can be answered from the log
- [ ] The log contains no secrets, tokens, or raw provider payloads
- [ ] The audit view is searchable by application, decision, and time
- [ ] The log survives restarts
- [ ] The retention/sampling policy is documented and never drops real
      actions

### Out of Scope

- External observability services, metrics backends, or alerting
  infrastructure.
- Log export.

### Technical Notes

- Log the gate evaluations, not just the decision. "Why was this allowed?"
  is unanswerable from a decision alone.
- If the log ever needs a secret to be useful, that is a design failure —
  log a reference instead.

### Relevant Files

- `job-agent/lib/audit/**`, `job-agent/app/**`,
  `job-agent/components/**`

---

## Task 11.5 — End-to-end autonomous loop

**Depends on**: 11.4

### Goal

Connect the full loop — search, match, decide, prepare, submit, track,
update — and prove it works with the safety gates enforced.

### Requirements

- Compose the existing plans into one flow. Add no new capability; if the
  flow needs something that does not exist, log it as a gap rather than
      building it here.
- Run the loop in dry-run mode first and verify the report matches the
  expected decisions.
- Then run with submission disabled, then with confirmation required, and
  only then consider auto-submit — each step separately verified.
- Verify the stop control halts the loop at each stage.
- Verify the audit log explains every action the loop took.
- Record the end-to-end verification results, including any stage that
  could not be verified and why.

### Acceptance Criteria

- [ ] The complete loop runs end to end using existing capabilities only
- [ ] The loop is verified in dry-run, no-submit, and confirm-first modes
- [ ] The stop control halts the loop at every stage
- [ ] The audit log explains every action taken
- [ ] Verification results are recorded, including unverified stages

### Out of Scope

- Unattended overnight operation.
- Scaling to many applications per day.
- Any change to an earlier plan's behaviour.

### Technical Notes

- Enable each mode in sequence and verify it before enabling the next.
  Jumping straight to auto-submit skips the only evidence that the gates
  work.
- If a stage cannot be verified, say so plainly. An unverified autonomous
  loop is the highest-risk state this project can reach.

### Relevant Files

- `job-agent/lib/automation/**`, `job-agent/lib/audit/**`
