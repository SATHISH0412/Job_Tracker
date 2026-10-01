# Instructions for opencode — Personal LinkedIn Job Finder

You are building **Personal LinkedIn Job Finder**, a private Next.js app.
This file is your entry point. Read it fully before doing anything else.

## Tool Permissions and Execution Rules

1. **Scope:** All tool actions and terminal commands must strictly operate within this project's directory only. Do not touch anything outside.
2. **Auto-Approve:** Allow routine build, lint, typecheck, test, and local workspace file editing tools without prompting for interactive confirmation.
3. **Explicit Approval:** ONLY ask for explicit user confirmation before running `git commit` and `git push`. Show the commit summary and message before requesting approval.
4. **Auto-Persist Permissions:** Whenever I grant permission for a new project command, persist it into the local project settings file so you don't prompt for it again.

## 0. Reference material

- `plans/ORIGINAL_PLAN.md` — the full original product plan (source of truth
  for *what* to build). Every plan file below cites specific sections of
  this document. When a plan file references "section N", it means section
  N of `plans/ORIGINAL_PLAN.md`. **Never edit this file** — it is the
  historical source, not a working document.
- `plans/INDEX.md` — the authoritative **build order** with dependencies.
- `plans/PROJECT_STATE.md` — the single rolled-up status board across every
  plan. Keep it in sync (see §4 below).
- `plans/<plan-id>/master.md` — one per plan. The unchanging spec: goal,
  global and per-task acceptance criteria, out-of-scope items, technical
  notes, relevant files. Each plan contains **multiple numbered tasks**,
  each with its own goal, requirements, acceptance criteria, out-of-scope,
  technical notes, and relevant files. **Never edit a master.md while
  implementing** — if the spec seems wrong, stop and flag it to the user
  instead of silently reinterpreting it. Deviations go in the Deviation Log
  (see §3), not in the master.
- `plans/<plan-id>/state.md` — one per plan. The living record of progress:
  a per-task status table, a deviation log, and a progress log. **You
  update this file constantly** (see §3).

## 1. Project identity

- App name: `job-agent`
- Project root: `Documents/project/job/` (this directory, where `plans/` and
  `AGENTS.md` live). The Next.js app itself goes in a `job-agent/`
  subfolder — see `plans/01-project-setup/master.md` task 1.2.
- Git remote (source of truth for this project's history):
  `https://github.com/SATHISH0412/Job_Tracker.git` (public, currently
  empty). Branches: `main` is protected and only receives merges from
  `dev`; `dev` is the integration branch that every feature PR targets
  (see §5a).
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS
- V1 goal: a private, single-user LinkedIn job **search** tool (build a
  search URL from filters and open it on LinkedIn). No auto-apply, no
  scraping, no database required for V1.
- V1 is plans `01`–`04`. Everything beyond V1 (persistence, resume parsing,
  AI matching, email integration, autonomous auto-apply) is plans `05`–`11`
  and is deliberately deferred. Do not build ahead of the current plan
  unless explicitly instructed.
- **Deployment is not part of the plan set.** V1 ends at "ready to deploy":
  a successful production build plus documented deployment inputs. Never
  deploy the app, connect a hosting account, or set up CI/CD.

## 2. Workflow — repeat for every task

1. Open `plans/INDEX.md` and find the **first plan that is not DONE and
   whose dependencies are all DONE**.
2. Within that plan, find the **first task in the Task Status table that is
   not DONE** and whose own `Depends on` is satisfied. Do not start a task
   that depends on an unfinished one.
3. Read that task's section in `plans/<id>/master.md` in full, plus the
   plan's Global Acceptance Criteria and Out of Scope.
4. Set the task's row in the plan's `state.md` Task Status table to
   `IN_PROGRESS` and append a dated Progress Log entry **before** writing
   code.
5. Implement exactly what the task describes — nothing from its Out of
   Scope, nothing from a later task or plan.
6. Verify every item in the task's Acceptance Criteria. Do not mark a task
   DONE with unchecked criteria.
7. Update the plan's `state.md`:
   - Set the task's status to `DONE` (or `BLOCKED` / `IN_REVIEW` if you
     cannot finish — explain why under **Blockers**).
   - Append a dated Progress Log entry summarizing what changed.
   - Tick that task's acceptance-criteria checkboxes in `master.md`.
   - Set the **plan** status to `DONE` only when every task is DONE;
     otherwise set it to `IN_PROGRESS`.
8. Update `plans/INDEX.md` (tick the plan only when the whole plan is DONE)
   and `plans/PROJECT_STATE.md` (row status plus the `done/total` task
   count).
9. Move to the next task per the plan's Task Status table.

Never skip ahead in the index, and never start a plan or task whose
dependencies aren't DONE yet — dependencies exist because later work
assumes earlier files, types, and routes already exist.

**Deviations:** if implementation requires anything the master.md does not
describe, you MUST add a row to the plan's Deviation Log (§3) *before* doing
the work, and surface it to the user. Never silently reinterpret a spec.

## 3. State file conventions (`state.md`)

Each `state.md` uses this status vocabulary — use these exact strings:

```
NOT_STARTED | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE
```

**Task Status table** — one row per task, with its own status and
completion date. This is the primary progress record:

```
| # | Task | Status | Completed |
|---|---|---|---|
| 1.1 | Scaffold the Next.js application | IN_PROGRESS | — |
```

**Deviation Log** — any departure from `master.md` is recorded here
*before* it is implemented, with the date, task, what deviated, why, and
who approved it. An unlogged deviation is a process failure:

```
| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| 2026-09-26 | 3.1 | ... | ... | user |
```

**Progress Log** — append one line every time you touch a plan:

```
- 2026-09-26: <what you did, in one line>
```

Some plans also carry extra tables filled in by specific tasks (verified
mappings, decisions, data inventories, success-criteria evidence). Fill them
in when the owning task runs — do not pre-fill them with guesses.

If you get blocked (missing decision, ambiguous spec, external dependency
unavailable), set the task's status to `BLOCKED`, describe the blocker under
**Blockers**, and stop working on that task — surface the blocker to the
user rather than guessing.

## 4. `plans/PROJECT_STATE.md`

This is the single glance-able rollup of every plan's status. After
finishing (or blocking on) any task, update that plan's row — both the
status and the `done/total` task count. Keep the **V1 boundary** and
**Open items** sections current.

## 5. Hard rules (do not violate)

- Follow the exact folder/file structure given in each task's
  "Relevant Files" list and in `plans/ORIGINAL_PLAN.md` section 7.
- Never hard-code secrets; only read them from environment variables
  (see `01-project-setup` task 1.3).
- Never fabricate job data — if only a LinkedIn search URL can be
  generated (no individual job records), the UI must say so honestly
  (see `02-search-ui` task 2.6 and `03-linkedin-search` task 3.4).
- Never deploy the app, connect a hosting account, or set up CI/CD.
  Deployment is not in the plan set.
- Do not implement anything from plans `05`–`11` while V1 (plans
  `01`–`04`) is not fully DONE.
- Do not implement browser automation, auto-apply, CAPTCHA/MFA bypass, or
  email account access at any point without the user explicitly
  restarting planning for that specific plan — these are the highest-risk
  parts of the long-term vision (`09-application-automation`,
  `10-tracking-and-email`, `11-autonomous-agent`).
- Never bypass CAPTCHA, MFA/2FA, bot detection, or any other security
  control. Encountering one must escalate to `MANUAL_REVIEW`.
- Never report a failure, or an unknown outcome, as a success.
- Never request, store, or log an email password. OAuth only.
- When a future plan is about to start, re-read its `master.md` in full —
  each future plan's scope may have narrowed since it was written.

## 5a. Git rules

The remote for this project is
`https://github.com/SATHISH0412/Job_Tracker.git` (see §1).
`01-project-setup` task 1.4 owns the actual repo initialization, but these
rules apply any time git is used — including for the `plans/` documentation.


- **The git repo root must be this project directory**
  (`Documents/project/job/`), not `C:\Users\lenovo`. The home directory
  currently holds an unrelated `Expense-Tracker` repo; never commit this
  project into it, and never add a remote to it. If `git rev-parse
  --show-toplevel` does not print this project directory, stop and tell
  the user before running any write git command.
- Remote name: `origin` → `https://github.com/SATHISH0412/Job_Tracker.git`.
  Do not add extra remotes or change the URL.

### Branching model (mandatory)

- **`main` is protected — never commit to it.** No direct pushes, no
  direct edits while `main` is checked out. `main` only ever receives
  merges from `dev`.
- **`dev` is the integration branch.** Every plan PR targets `dev`.
  It is also protected: no direct commits to `dev` either — it is only
  updated by merging plan PRs.
- **One plan = one branch = one PR.** The branch is created when the
  plan's first task starts, and the PR is opened when the plan's last
  task is `DONE`. All of that plan's task commits land on that single
  branch.
- Branch name: `feature/<plan-id>-<slug>`
  - `<plan-id>` — the plan folder id, e.g. `01-project-setup`,
    `02-search-ui`.
  - `<slug>` — a short kebab-case description of the plan's work,
    e.g. `feature/01-project-setup/scaffold-app`.
- Never mix two plans on one branch. If work from another plan is
  needed, finish and merge the current plan's PR first.
- Create the branch from an up-to-date `dev`:
  `git fetch origin && git checkout dev && git pull && git checkout -b feature/<plan-id>-<slug>`

### Per-task commits (explicit approval required before commit and push)

Each task produces **one commit** on the plan's branch. When a task's row
in the plan's `state.md` Task Status table is set to `DONE`:

1. `git checkout feature/<plan-id>-<slug>` (create it from `dev` first if
   this is the plan's first task).
2. Stage only that task's files, including the plan's `master.md` /
   `state.md` updates. On the plan's **last** task, also include its
   `plans/INDEX.md` checkbox and its `plans/PROJECT_STATE.md` row, plus
   `AGENTS.md` if it changed.
3. Formulate the commit message with the task id in brackets, e.g.
   `[01-project-setup 1.2] add section 7 folder skeleton`.
4. **Ask the user for explicit confirmation before running `git commit` and `git push`**,
   displaying the staged file summary and the commit message.
5. Once confirmed, run `git commit` and `git push` to the plan branch.

### Plan completion (automatic — no confirmation needed)

Once the plan's **last** task is `DONE`, in addition to that task's
commit:

1. `git fetch origin && git checkout dev && git pull` — do **not** rebase
   or merge the plan branch; leave it as-is for review.
2. Open the single PR into `dev` with `gh pr create --base dev
   --head feature/<plan-id>-<slug>`. Title = the plan name from
   `master.md`. Body must state: the plan id, the tasks it delivered, the
   acceptance criteria from `master.md` now met (including the plan's
   Global Acceptance Criteria), and anything left unfinished.
3. Report the PR URL to the user. Do **not** merge the PR yourself and
   do **not** delete the branch — the user reviews and merges.
4. Update `plans/PROJECT_STATE.md` with the PR URL for that plan.

This is the one carve-out to the "never commit unless asked" rule below:
finishing a task implies committing it, and finishing a plan implies
opening its PR. Everything else (amendments, force pushes, merges,
`--no-verify`, history rewrites, `main`/`dev` writes) still requires an
explicit ask.

### Other git rules

- **Never commit, amend, push, or create a PR/branch outside the
  per-task / per-plan workflow above unless the user explicitly asks in
  that turn.** Preparing work and leaving it uncommitted is otherwise the

  default.
- Never `git push` to `main` or `dev`, never `git merge` into either, and
  never create a PR from one feature branch into another.
- Identity is the user's to set (`git config user.name` / `user.email`
  are currently placeholders — "Your Name" / "you@example.com"). If they
  are still placeholders when a commit is needed, ask the user to set
  them — do not guess or set them yourself.
- `.gitignore` must always cover `node_modules/`, `.next/`,
  `.env*.local`, and `*.tsbuildinfo`. Never stage `.env.local` or any
  file under `plans/` that contains a secret (none should).
- Commit messages: imperative, one line, prefixed with the plan and task
  id in brackets when the commit implements a plan task, e.g.
  `[02-search-ui 2.2] add keyword and location inputs`.
  Plans-only commits: `docs: mark 06-resume-and-job-analysis DONE`.
- `AGENTS.md` and `plans/` are tracked in git — commit them alongside the
  code they describe.
- Before any commit, run `git status` and `git diff` and stage only the
  intended paths. Never use `git add -A` from the home directory.
- If `gh` is not installed/authenticated, complete steps 1-4, then stop
  and tell the user to create the PR manually (or install `gh`) instead
  of guessing at alternatives.

## 5b. Coding standards

These apply to every line of code written for this project, in every
feature. They are as binding as the feature's master.md.

### SOLID

- **S — Single Responsibility:** one file/component/function = one job. If
  a component both renders the search form *and* builds the LinkedIn URL,
  that's two jobs — split them. Route handlers only validate + delegate.
- **O — Open/Closed:** extend behaviour by adding new code, never by
  editing existing logic. Adding a new experience level to the LinkedIn
  param builder must be a new entry in the mapping table, not a rewrite of
  the builder.
- **L — Liskov Substitution:** a component/function typed as a generic
  filter or field renderer must work for every concrete filter passed to
  it. Never special-case a subtype inside a shared renderer.
- **I — Interface Segregation:** keep props narrow. A component that
  renders one form field should not receive the whole search-state
  object; pass only the fields it uses.
- **D — Dependency Inversion:** depend on abstractions. Pure logic
  (URL building, encoding, validation) must live in plain TS modules
  importable without React or Next.js, so it can be unit-tested and
  reused by both server and client code. No `import` of a concrete
  provider inside logic modules.

### DRY

- Never copy-paste logic. If a block appears twice, extract it to a
  shared function/component/util — even for two occurrences.
- **Single source of truth** for anything repeated across features: filter
  option lists, env var names, LinkedIn param mappings, validation
  messages, Tailwind class combos. Define once, import everywhere.
- Validation and search-param building are the highest DRY-risk areas
  (`02`, `03`, `17`); if a rule is needed in more than one place, it
  belongs in one shared module.

### General standards

- **TypeScript strict mode**, no `any`. If a type is genuinely unknown,
  use `unknown` and narrow it. Export types from a single source rather
  than redeclaring shapes per component.
- **Functional React, hooks only** — no classes. Server Components by
  default; add `"use client"` only where interactivity requires it, and
  keep client components as small and leaf-level as possible.
- **Naming:** components/files in `PascalCase` (matching the folder
  structure from `01-project-setup` task 1.2), functions/vars in
  `camelCase`, constants in `UPPER_SNAKE_CASE`. Files named after their
  default export.
- **No speculative abstraction** — don't build a generic
  `<DynamicFormRenderer/>` for one form. DRY means extract *duplication*,
  not *possibility*. Two real consumers justify a shared abstraction; one
  does not.
- **Explicit over implicit**, especially in the LinkedIn integration: name
  the param being built (`postedTimeFilter`, not `pt`), and fail loudly
  on invalid input rather than silently producing a wrong URL.
- **Security basics always:** validate/sanitize all user input
  server-side, never render user input as raw HTML, keep secrets in env
  vars only, and never log them.
- **Comments:** code should be self-explanatory. Add a comment only when
  the *why* is non-obvious (a LinkedIn quirk, a workaround). No
  commented-out code, no restating what the line does.
- **Follow the existing conventions** of the file you're editing
  (import style, naming, structure) over your personal preference.
- **Verify before reporting done:** run the project's lint and typecheck
  commands if they exist. If either fails, fix it before marking a
  feature DONE. Never suppress an error just to make it go away unless
  you flag it to the user.
- Match the plan's file/folder structure exactly
  (`01-project-setup` task 1.2 / `ORIGINAL_PLAN.md` section 7). Don't
  invent new directories.

## 6. When you're done with V1

Confirm every checkbox in `plans/01-project-setup/master.md` through
`plans/04-private-access-and-handoff/master.md` is checked, and every item
in `plans/ORIGINAL_PLAN.md` section 26 ("V1 Success Criteria") is true.
Then stop and report completion — do not automatically continue into
the future phases.

