# Plan: Project Setup

**Plan ID:** `01-project-setup`
**Phase:** Phase 0 — Project Setup
**Version target:** V1
**Status:** DONE
**Depends on:** none
**Source:** `ORIGINAL_PLAN.md` sections 4 (Technology Stack), 7 (Application Architecture), 15 (Security → Secrets), 23 (Deployment Plan → Development)

---

## Goal

Produce a running, correctly configured Next.js foundation that every later
plan builds on: a scaffolded App Router app with strict TypeScript and
Tailwind, the folder structure from section 7, environment-variable wiring
that keeps secrets server-side, a git repository pointed at the project
remote, and a root layout that owns global styling.

## Global Acceptance Criteria

- [x] `job-agent/` exists and `npm run dev` serves the app locally
- [x] `tsconfig.json` has `strict: true` and no `any` in committed source
- [x] Tailwind renders a test class correctly
- [x] The folder tree matches `ORIGINAL_PLAN.md` section 7 exactly
- [x] `.env.local` is gitignored; `.env.example` is committed with empty values
- [x] The git repo root is `Documents/project/job/` and `origin` points at
      `https://github.com/SATHISH0412/Job_Tracker.git`
- [x] `npm run lint` and the typecheck command both pass
- [x] `app/layout.tsx` renders children in a consistent shell with global
      CSS imported once

### Verification evidence (2026-09-26, plan close-out)

Re-verified all eight at once rather than relying on the per-task runs:

- Dev server: `GET /` → 200, `GET /jobs` → 200.
- `npm run lint` → 0 problems. `npm run typecheck` (`tsc --noEmit`) → 0 errors.
- `tsconfig.json` contains `"strict": true` (1 match).
- No `any` in committed source — searched `app/`, `components/`, `lib/`,
  `types/` for `:\s*any\b`, `<any>`, `as any`, `any[]` → zero hits.
- Tailwind: the compiled stylesheet contains `.app-container` and the six
  test classes from task 1.1 (`.max-w-3xl`, `.text-3xl`, `.font-semibold`,
  `.tracking-tight`, `.text-zinc-600`, `.mx-auto`).
- Folder tree and env criteria verified per task — see the evidence blocks
  under tasks 1.2, 1.3 and 1.4.
- `globals.css` is imported exactly once across all source, in
  `app/layout.tsx`.

## Out of Scope (for this plan)

- No search UI, filters, or LinkedIn logic — that is `02-search-ui` and
  `03-linkedin-search`.
- No auth gate — that is `04-private-access-and-handoff`.
- No database, no Docker, no deployment/hosting configuration.

---

## Task 1.1 — Scaffold the Next.js application

**Depends on:** none

### Goal

Create the `job-agent` Next.js app with the App Router, TypeScript, and
Tailwind CSS pre-configured.

### Requirements

- Scaffold with `create-next-app` using the App Router (never the Pages
  Router), TypeScript, and Tailwind CSS.
- App name/directory: `job-agent`, created at `Documents/project/job/job-agent/`.
- Accept the prompts for ESLint and `src/` directory: use the plan's
  layout — code at the top level of `job-agent/` (no `src/`), ESLint on.
- Import alias `@/*` mapped to the project root.
- Record the resolved Node version and package manager in `README.md`.

### Acceptance Criteria

- [x] `job-agent/package.json` exists with `next`, `react`, `react-dom`,
      `typescript`, and `tailwindcss` as dependencies/devDependencies
- [x] `npm run dev` starts without error and serves a page
- [x] `next.config.ts` is present
- [x] The default `create-next-app` landing page markup is replaced with a
      placeholder home page (title + one line of text) — no demo boilerplate
- [x] Node version and package manager are recorded in `README.md`

### Verification evidence (2026-09-26)

- `npm run dev` → `✓ Ready in 1077ms`; `GET http://localhost:3000` → `200`,
  body contains `JobFinder`.
- `npm run build` → `✓ Compiled successfully`, 2 routes prerendered.
- `npm run typecheck` → clean. `npm run lint` → clean.
- `tsconfig.json` has `"strict": true`.
- Tailwind check: the built stylesheet
  `.next/static/chunks/3c_aai6vq8w9n.css` (10,523 bytes) contains
  `.max-w-3xl`, `.text-3xl`, `.font-semibold`, `.tracking-tight`,
  `.text-zinc-600`, `.mx-auto`.
- Installed: next 16.3.6, react 19.2.8, react-dom 19.2.8,
  typescript ^5, tailwindcss ^4, eslint ^9.


### Out of Scope

- No custom components, no styling beyond the Tailwind import.
- No production build verification beyond `npm run dev`.

### Technical Notes

- Node v24.11.0 / npm 11.2.0 are the versions verified on this machine.
  State them explicitly in `README.md` so a mismatch is diagnosable.
- The Tailwind major version installed by `create-next-app` determines
  whether config lives in `tailwind.config.ts` or is CSS-first. Document
  which one is in use; later plans reference the config file by name.

### Relevant Files

- `job-agent/package.json`
- `job-agent/tsconfig.json`
- `job-agent/next.config.ts`
- `job-agent/app/layout.tsx`
- `job-agent/app/page.tsx`
- `job-agent/README.md`

---

## Task 1.2 — Establish the folder structure

**Depends on:** 1.1

### Goal

Create the exact folder tree from `ORIGINAL_PLAN.md` section 7 so every
later plan has an obvious home for its files.

### Requirements

- Create, verbatim from section 7:
  - `app/page.tsx`, `app/layout.tsx`
  - `app/jobs/page.tsx`
  - `app/api/linkedin/search/route.ts`
  - `components/{SearchForm,SearchFilters,JobResults,JobCard,EmptyState,Header}.tsx`
  - `lib/{linkedin,validation,search}.ts`
  - `types/job.ts`
  - `public/`
- Every folder must contain a real starter file or a `.gitkeep` so the
  structure is visible in git.
- Placeholder files export an empty, correctly typed shell — no `any`, no
  stubbed fake data, no dead code.
- Document the tree in `README.md` with a one-line purpose per folder.

### Acceptance Criteria

- [x] The tree matches section 7 — no extra directories, none missing
- [x] Every folder has at least one tracked file
- [x] `types/job.ts` declares the shared `JobSearchFilters` type and the
      filter option types (the single source of truth consumed by
      `02-search-ui` and `03-linkedin-search`)
- [x] The structure is documented in `README.md`

### Verification evidence (2026-09-26)

- File counts per folder: `app/` 6, `app/jobs/` 1, `app/api/` 1,
  `app/api/linkedin/` 1, `app/api/linkedin/search/` 1, `components/` 6,
  `lib/` 3, `types/` 1, `public/` 1 (`.gitkeep`). No folder is empty.
- `types/job.ts` exports `EXPERIENCE_LEVEL_OPTIONS`,
  `WORK_ARRANGEMENT_OPTIONS`, `JOB_TYPE_OPTIONS`, `DATE_POSTED_OPTIONS`
  (all `as const`), the four filter types **derived** from those arrays via
  `typeof X[number]`, plus `JobSearchFilters`, `Job`, and `SearchResult`.
  Option values match `ORIGINAL_PLAN.md` §9 exactly.
- `npm run build` → 4 routes: `/` and `/jobs` static,
  `/api/linkedin/search` dynamic, `/_not-found`.
- Dev server: `/` → 200, `/jobs` → 200, `GET /api/linkedin/search` → 405
  (only `POST` is exported), `POST` → 500 (the shell throws by design rather
  than returning a fake success).
- `npm run lint` → 0 errors, 0 warnings. `npm run typecheck` → clean.
- `README.md` contains the §7 tree with a one-line purpose per folder plus a
  section on `types/job.ts` being the source of truth.
- `lib/errors.ts`, referenced by `03-linkedin-search` task 3.3's file list,
  is **not** in the §7 tree and was therefore deliberately **not** created.
  Plan 03 must either add it with a Deviation Log entry or drop the
  reference.

### Out of Scope

- No component behaviour, no styling, no route handlers with real logic.
- Do not add directories beyond section 7 without a Deviation Log entry.

### Technical Notes

- `types/job.ts` is the DRY keystone for the whole project: every option
  list and filter type is declared there once and imported everywhere
  else. Do not redeclare these shapes in components.
- `app/api/linkedin/search/route.ts` is created here as an empty handler
  shell; `03-linkedin-search` task 3.3 implements it.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/*.tsx`, `job-agent/lib/*.ts`,
  `job-agent/types/job.ts`, `job-agent/README.md`

---

## Task 1.3 — Environment variable configuration

**Depends on:** 1.1

### Goal

Set up environment-variable handling so no secret is ever hard-coded or
shipped to the client.

### Requirements

- Create `job-agent/.env.local` (gitignored) and `job-agent/.env.example`
  (committed, every value empty).
- Reserve these variable names for future needs, per section 15:
  `DATABASE_URL`, `LINKEDIN_API_KEY`, `GEMINI_API_KEY`,
  `OPENROUTER_API_KEY`, `AUTH_SECRET`.
- Each name in `.env.example` gets a `#` comment describing its purpose
  and whether it is server-only.
- Centralise env access in one module (e.g. `lib/env.ts`) that reads
  `process.env` and throws a named error when a required variable is
  missing. No other file may touch `process.env` directly.
- Document in `README.md` how to create `.env.local` from `.env.example`.

### Acceptance Criteria

- [x] `.env.local` is listed in `.gitignore` and is not tracked by git
- [x] `.env.example` lists all five reserved names with empty values
- [x] `lib/env.ts` is the only module reading `process.env`
- [x] No secret value appears in any committed file
- [x] README documents the env setup steps

### Verification evidence (2026-09-26)

- `git check-ignore -v job-agent/.env.local` → matched by
  `job-agent/.gitignore:34:.env*`. `git add -n job-agent` lists
  `.env.example` but **not** `.env.local`.
- The default Next.js `.gitignore` shipped `.env*`, which also swallowed
  `.env.example`. Added `!.env.example` (line 36) so the template is
  committed while the real file stays ignored. Without this the criterion
  "`.env.example` lists all five names" would have been unmeetable.
- `.env.example` contains all five names with empty values and a `#` comment
  each stating purpose and server-only status. A grep for
  `^\s*[A-Z_]+=.+` returns nothing — no non-empty value anywhere.
- `Get-ChildItem -Recurse *.ts,*.tsx app,components,lib,types | Select-String
  'process\.env'` → only `lib/env.ts` (line 2 doc comment, line 52 the read).
- `lib/env.ts` exports `MissingEnvironmentVariableError`,
  `readEnvironmentVariable` (empty/whitespace treated as unset),
  `requireEnvironmentVariable` (throws the named error), and
  `isEnvironmentVariableName`.
- `npm run build` → 4 routes, unchanged. `npm run lint` → 0 problems.
  `npm run typecheck` → clean.
- **Not verified by execution:** no V1 code path calls `lib/env.ts`, so it is
  covered by types and build only. Its first real caller is
  `04-private-access-and-handoff`.

### Out of Scope

- No real API keys — none are functionally required for V1 search.
- No validation library; a small typed accessor is enough.

### Technical Notes

- Reserving the names now avoids rework when persistence (`05`) and AI
  (`08`) land. V1 code must not depend on any of them being set.

### Relevant Files

- `job-agent/.env.local`, `job-agent/.env.example`, `job-agent/.gitignore`,
  `job-agent/lib/env.ts`, `job-agent/README.md`

---

## Task 1.4 — Git repository setup

**Depends on:** 1.1, 1.3

### Goal

Put the project under version control with the correct remote and a
Next.js-appropriate `.gitignore`.

### Requirements

- The git repo root is `Documents/project/job/` — **not** `C:\Users\lenovo`,
  which holds an unrelated repository. Verify with
  `git rev-parse --show-toplevel` before any write command.
- `origin` → `https://github.com/SATHISH0412/Job_Tracker.git`. No other
  remotes.
- Branches: `main` (protected, receives merges from `dev` only) and `dev`
  (integration branch, receives feature PRs only).
- `.gitignore` covers `node_modules/`, `.next/`, `.env*.local`,
  `*.tsbuildinfo`, plus the usual Next.js/editor noise.
- `.env.local` and `node_modules/` are verified untracked.
- `AGENTS.md` and `plans/` are tracked.

### Acceptance Criteria

- [x] `git rev-parse --show-toplevel` prints `Documents/project/job`
- [x] `git remote -v` shows only `origin` → the Job_Tracker URL
- [x] Both `main` and `dev` branches exist
- [x] `git status` is clean after the initial commit
- [x] `git check-ignore node_modules .next .env.local` matches all three
- [x] No file matching `*.env.local` is tracked

### Verification evidence (2026-09-26)

- `git rev-parse --show-toplevel` → `C:/Users/lenovo/Documents/project/job`.
- `git remote -v` → only `origin`, fetch and push both
  `https://github.com/SATHISH0412/Job_Tracker.git`.
- `git branch -a` → local `dev`, `main`,
  `feature/01-project-setup/scaffold-app`; remotes `origin/dev`,
  `origin/main`, `origin/feature/01-project-setup/scaffold-app`.
- `main` was created with `git branch main dev` and pushed with
  `git push -u origin main` — it was **never checked out**, so no commit was
  authored on it. Both `main` and `dev` are at `8f4b37d`.
- `git status --short` → empty, branch in sync with its upstream.
- `git check-ignore -v` → `node_modules` matched by `/node_modules`,
  `.next` by `/.next/`, `.env.local` by `.env*`.
- `git ls-files | Select-String env.local` → no match.
- `AGENTS.md` tracked; 25 files under `plans/` tracked.
- **Requires a manual follow-up on GitHub:** the default branch is probably
  `dev` (it was pushed first), and neither `main` nor `dev` has protection
  rules yet. See the Open items in `plans/PROJECT_STATE.md`.

### Out of Scope

- No tagging, no releases, no CI workflows.
- No pushing to `main` — ever (see `AGENTS.md` §5a).

### Technical Notes

- A pristine `git init` inside an existing repo is not possible; if the
  project directory is already tracked by an unrelated repository, stop and
  raise it as a Blocker rather than committing into the wrong history.
- The first push must target `dev`, not `main`, to respect the branching
  model in `AGENTS.md` §5a.

### Relevant Files

- `.git/`, `.gitignore`

---

## Task 1.5 — Base app layout and global styling

**Depends on:** 1.2

### Goal

Build the root layout and global styling shell that every page will use.

### Requirements

- Implement `app/layout.tsx` with the HTML shell, metadata (title,
  description), and global CSS import.
- Import `globals.css` exactly once, in the layout.
- Apply Tailwind's base/reset styles globally.
- Add one shared top-level container (max width + padding) as an exported
  class or component so every page reuses it rather than re-declaring
  padding.
- Set `lang="en"` on `<html>`.

### Acceptance Criteria

- [x] `app/layout.tsx` renders `{children}` inside a consistent shell
- [x] Global CSS is imported once, only in the layout
- [x] Page title and basic meta tags are set
- [x] The container is defined once and reused, not copy-pasted per page
- [x] `app/jobs/page.tsx` renders inside the same shell

### Verification evidence (2026-09-26)

- The shared container is a Tailwind v4 `@utility app-container` in
  `app/globals.css`, not a React component. The built stylesheet
  `.next/static/chunks/2gohp_aqualu2.css` contains exactly
  `.app-container{width:100%;max-width:48rem;margin-inline:auto;padding-inline:1.5rem}`.
- Both pages use it: `GET /` → 200 and `GET /jobs` → 200, both bodies contain
  `app-container`, both render `<html lang="en">` and `<title>JobFinder</title>`.
- `Select-String 'globals.css'` across `app/`, `components/`, `lib/`,
  `types/` → one hit, `app/layout.tsx:3`. Imported exactly once.
- `Select-String 'max-w-|px-6'` across `app/**/*.tsx` → no hits, so the
  container's max-width and padding are not re-declared per page. The
  copy-pasted `max-w-3xl px-6` from task 1.1's placeholder is gone.
- Layout stays a Server Component — no `"use client"` anywhere in `app/`.
- `npm run build` → 4 routes. `npm run lint` → 0 problems.
  `npm run typecheck` → clean.
- No header, navigation, or theming was added (out of scope for 1.5).

### Out of Scope

- No header/navigation — that is `02-search-ui` task 2.1.
- No theming, dark mode, or font optimisation beyond the default.

### Technical Notes

- Layout stays a Server Component. Do not add `"use client"` here; it
  would force every consumer to re-render on state change.
- If the shared container becomes a class-composition problem, extract a
  single `Container` component rather than duplicating class strings.

### Relevant Files

- `job-agent/app/layout.tsx`, `job-agent/app/globals.css`
