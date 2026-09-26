# Plan: Job Persistence

**Plan ID:** `05-job-persistence`
**Phase:** Future — V1.1 (search history) / V2 (saved jobs)
**Version target:** V1.1 and V2
**Status:** NOT_STARTED
**Depends on:** `04-private-access-and-handoff`
**Source:** `ORIGINAL_PLAN.md` section 17 (Future Database Design), section 24 Phases 4–5, section 25 Principle 4 (Privacy)

---

## Goal

Introduce the first database dependency and turn a throwaway search into
a durable record: store past searches so they can be re-run, and let the
user save jobs with notes.

## Global Acceptance Criteria

- [ ] PostgreSQL schema for `searches` and `saved_jobs` matches section 17
- [ ] Recent searches persist across sessions and across restarts
- [ ] A saved search re-runs with one click and restores every filter
- [ ] Jobs can be saved, listed, annotated, and removed
- [ ] `DATABASE_URL` is read only through `lib/env.ts` and never reaches
      the client bundle
- [ ] Migrations are versioned and reversible; no manual schema edits
- [ ] Deleting stored data is possible (privacy right, Principle 4)

## Out of Scope (for this plan)

- No user accounts or multi-tenancy — the tool is single-user, so no
  `users` table is required yet even though section 17 sketches one.
- No scraping or automated job fetching. Saving a job requires the user to
  supply or paste the data, or a permitted integration added later.
- No resume, matching, or AI of any kind — that is `06` onward.
- No data export/backup tooling beyond a documented SQL dump command.

---

## Task 5.1 — Database connection and migration setup

**Depends on:** 4.5

### Goal

Stand up PostgreSQL access with a versioned, reversible migration path.

### Requirements

- Read `DATABASE_URL` only through `lib/env.ts`; throw a named error if
  unset. No connection string in code or committed config.
- Use a migration tool consistent with the ORM or query layer chosen —
  decide and record the choice in this plan's `state.md` before starting.
- All schema changes go through migrations. No "just run this SQL" steps.
- Migrations must be reversible (a documented `down` for each).
- Keep the database client in server-only modules; never import it into a
  client component.
- Provide a documented way to run migrations locally and to reset the
  database.

### Acceptance Criteria

- [ ] A migration creates the initial schema and can be rolled back
- [ ] `DATABASE_URL` is absent from the client bundle after a production build
- [ ] No schema change was made by hand
- [ ] The tool choice and local setup steps are recorded in `state.md`

### Out of Scope

- Connection pooling infrastructure, read replicas, or a hosted database
  provisioning.
- Storing resumes or job descriptions — later plans.

### Technical Notes

- Decide ORM vs raw query layer early; the answer constrains every later
  data task in this plan and in `06`, `08`, `10`.
- This is the plan where Principle 4 (Privacy) starts applying to stored
  data: minimise what is stored and make deletion easy.

### Relevant Files

- `job-agent/lib/env.ts`, `job-agent/lib/db.ts`, `job-agent/migrations/**`

---

## Task 5.2 — Search history schema and storage

**Depends on:** 5.1

### Goal

Persist every search the user runs.

### Requirements

- `searches` table per section 17: id, the normalised filter set (or the
  generated URL), created_at, and a label.
- Store the **normalised** filters, not the raw input, so a stored search
  is always replayable.
- Write a record from the search flow without blocking or failing the user
  request if the write fails — persistence is not the primary function.
- Cap history growth (retention window or row limit) and document it.
- Index `created_at` for ordering.

### Acceptance Criteria

- [ ] Every completed search writes one `searches` row
- [ ] Stored filters round-trip back into the form unchanged
- [ ] A failed history write never breaks the search the user requested
- [ ] Retention/cap is implemented and documented
- [ ] History is ordered newest-first via an index, not a full scan

### Out of Scope

- Search analytics, tagging, or filtering history.
- De-duplicating identical consecutive searches (decide and document).

### Technical Notes

- Fire-and-forget the write, but do not silently swallow the error —
  surface it in server logs.
- Storing normalised filters is what makes task 5.3's re-run exact.

### Relevant Files

- `job-agent/migrations/**`, `job-agent/lib/search.ts`, `job-agent/lib/db.ts`

---

## Task 5.3 — Search history display and re-run

**Depends on:** 5.2

### Goal

Show recent searches and let the user re-run any of them in one click.

### Requirements

- A history list on the search page (and/or at `app/jobs/`) showing the
  most recent searches: label, the filters, and relative time.
- One click restores **every** filter and re-runs the search.
- Allow deleting an individual entry and clearing all history.
- Empty state when there is no history — distinct from the no-results
  empty state in `02-search-ui` task 2.6.
- Read history through a server component or route handler; the client
  never queries the database directly.

### Acceptance Criteria

- [ ] Recent searches persist across sessions and server restarts
- [ ] One click re-runs a saved search with all filters restored
- [ ] Entries can be deleted individually and in bulk
- [ ] The no-history state is visually distinct from the no-results state
- [ ] No database access from a client component

### Out of Scope

- Search history editing/renaming beyond an auto-generated label.
- Infinite scroll or pagination beyond a simple recent-N list.

### Technical Notes

- Two different empty states (no history vs no results) that share copy is a
  real bug risk — keep them clearly distinct.
- Fetch history server-side on render; this is a single-user tool, so
  caching complexity is not warranted.

### Relevant Files

- `job-agent/app/page.tsx`, `job-agent/app/jobs/page.tsx`,
  `job-agent/components/**`, `job-agent/lib/db.ts`

---

## Task 5.4 — Saved jobs schema and API

**Depends on:** 5.1

### Goal

Let the user save a job for later.

### Requirements

- `saved_jobs` table per section 17: id, title, company, location, the
  LinkedIn job id or canonical URL, notes, created_at, and a status.
- Uniqueness on the job identifier so saving twice updates rather than
  duplicates.
- Server-side API for create, read, update notes, and delete.
- **V1 produces search URLs, not job records.** Saving must therefore
  accept user-supplied or pasted job details, or be reachable only once a
  permitted job integration exists. Decide and record which, in
  `state.md`, before building the UI.
- Never fabricate job fields when saving — store only what is actually
  known.

### Acceptance Criteria

- [ ] A job can be saved and is retrievable later
- [ ] Saving the same job twice does not create a duplicate
- [ ] Notes can be edited
- [ ] Saved jobs can be removed
- [ ] No field is populated with invented data
- [ ] The data-source decision is recorded in `state.md`

### Out of Scope

- Automatic job fetching or enrichment.
- Tags, folders, or application status on saved jobs — that is `10`.

### Technical Notes

- The duplicate-detection approach here is the seed of the fingerprinting
  strategy required in `09-application-automation` task 9.3. Design the
  unique key to be reusable.
- Principle 4: store the minimum. If a field is not needed for matching or
  tracking, do not add it.

### Relevant Files

- `job-agent/migrations/**`, `job-agent/lib/db.ts`,
  `job-agent/app/api/**`, `job-agent/types/job.ts`

---

## Task 5.5 — Saved jobs page

**Depends on:** 5.4, 5.3

### Goal

Give saved jobs a home in the UI with working notes and removal.

### Requirements

- A Saved Jobs page listing saved jobs: title, company, location, date
  saved, notes preview.
- Open-on-LinkedIn action reusing the logic from `03-linkedin-search`
  task 3.5 — do not reimplement the link safety checks.
- Add/edit notes inline with autosave or an explicit save.
- Remove with a confirmation step (removal is not trivially recoverable).
- Respect the `Saved` nav item that `02-search-ui` task 2.1 rendered as
  disabled — enable it here and nowhere earlier.
- Empty state explaining how to save a job.

### Acceptance Criteria

- [ ] User can see saved jobs on a dedicated page
- [ ] Notes can be added and edited and persist
- [ ] A saved job can be removed after confirmation
- [ ] The `Saved` nav item is now enabled and routes correctly
- [ ] The existing URL-safety check is reused, not duplicated

### Out of Scope

- Search, sort, or filter within saved jobs beyond a simple ordering.
- Bulk operations beyond the clear-all already built in task 5.3.

### Technical Notes

- **DRY:** reuse the anchor component and origin check from `03`. Two
  copies of "is this a LinkedIn URL" logic will drift.
- Follow the responsive rules from `02-search-ui` task 2.7 for this page too.

### Relevant Files

- `job-agent/app/jobs/page.tsx`, `job-agent/components/**`,
  `job-agent/app/api/**`

---

## Task 5.6 — Data deletion and privacy review

**Depends on:** 5.5

### Goal

Honour Principle 4 (Privacy): the user can delete their data, and the
review confirms nothing excessive is retained.

### Requirements

- Document every table and column, why it exists, and how long it is kept.
- Provide a documented way to delete all stored data.
- Confirm no resume, credential, or LinkedIn session data is stored in
  this plan (it must not be — those are later plans).
- Review indexes and denormalised data for anything that duplicates
  personal information unnecessarily.
- Record the data inventory in this plan's `state.md`.

### Acceptance Criteria

- [ ] A data inventory exists listing every table, column, purpose, and
      retention rule
- [ ] Deleting all stored data is possible and documented
- [ ] No credential, session, or resume data is stored
- [ ] Retention rules from task 5.2 are enforced and documented

### Out of Scope

- GDPR-style data export tooling, anonymisation, or backup rotation.
- Multi-user deletion (no multi-user).

### Technical Notes

- This task is cheap now and expensive later. Doing it before `06`–`10`
  add tables means the privacy model is designed once, not retrofitted.

### Relevant Files

- `job-agent/migrations/**`, `plans/05-job-persistence/state.md`
