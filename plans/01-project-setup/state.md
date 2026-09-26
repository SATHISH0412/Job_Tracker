# State: Project Setup

**Plan ID:** `01-project-setup`

## Current Status

IN_PROGRESS

<!--
Allowed values: NOT_STARTED | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE
Update this value every time work starts, stalls, or finishes on this plan.
The plan is DONE only when every task below is DONE.
-->

## Task Status

| # | Task | Status | Completed |
|---|---|---|---|
| 1.1 | Scaffold the Next.js application | DONE | 2026-09-26 |
| 1.2 | Establish the folder structure | DONE | 2026-09-26 |
| 1.3 | Environment variable configuration | NOT_STARTED | — |
| 1.4 | Git repository setup | NOT_STARTED | — |
| 1.5 | Base app layout and global styling | NOT_STARTED | — |

## Last Updated

2026-09-26

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| 2026-09-26 | 1.4 | Ran task 1.4 (git repo init) before task 1.1 (scaffold), and before the other 1.x tasks | User explicitly asked for the repository to be initialised against `SATHISH0412/Job_Tracker` immediately. The repo must exist for any commit, so it was pulled forward. Task 1.4 stays in this plan and its remaining acceptance criteria are still verified when the work resumes. | user |
| 2026-09-26 | 1.1 | No `job-agent/tailwind.config.ts` — Tailwind v4 is CSS-first | `create-next-app@latest` installed Tailwind v4, which configures entirely in `app/globals.css` via `@import "tailwindcss"` and `@theme`. There is no config file to create. The plan's Technical Notes for task 1.1 anticipated exactly this and required documenting which approach is in use. | pending user confirmation |
| 2026-09-26 | 1.1 | Added a `typecheck` script (`tsc --noEmit`) to `package.json` | The plan's Global Acceptance Criteria require "the typecheck command" to pass, but `create-next-app` defines no such script. Added it so the criterion is verifiable. | pending user confirmation |
| 2026-09-26 | 1.1 | `job-agent/AGENTS.md` and `job-agent/CLAUDE.md` exist (scaffold-generated, not in the plan's file list) | `create-next-app` v16 generates these. `AGENTS.md` is re-written automatically by `next dev` and instructs agents to read `node_modules/next/dist/docs/` because Next 16 has breaking changes. Kept rather than deleted, since deleting only re-creates it. `CLAUDE.md` is a one-line `@AGENTS.md` pointer. Flagged because opencode auto-loads the nested `job-agent/AGENTS.md` alongside the project-root `AGENTS.md`. | pending user confirmation |
| 2026-09-26 | 1.1 | Added `job-agent/run.bat` (not in the plan's file list) | User asked for a batch file to run the project. It checks Node is on PATH, runs `npm install` when `node_modules` is missing, then starts the dev server. No new dependency, no build/deploy logic. | user |
| 2026-09-26 | 1.1 | Wrote a run-focused `job-agent/README.md` earlier than task 4.4 | User asked for a README alongside `run.bat`. It covers only what task 1.1 requires (prerequisites, install, run, all commands, Tailwind v4 note) and states explicitly that complete documentation is task 4.4's job. Task 4.4 must expand it, not assume it is done. | user |
| 2026-09-26 | 1.1 | Ran `npm run build` although the task's Out of Scope says "No production build verification beyond `npm run dev`" | Not optional: `LayoutProps<"/">` in the generated `app/layout.tsx` is a Next 16 type emitted into `.next/types` by a build, so `npm run typecheck` fails with TS2304 until a build has run once. Recorded so the extra step is not mistaken for scope creep. | pending user confirmation |
| 2026-09-26 | 1.2 | `types/job.ts` also declares `Job` and `SearchResult`, which task 1.2's own criteria do not name | Task 1.2's AC only names `JobSearchFilters` and the filter option types, but `03-linkedin-search` task 3.4 requires `JobResults`/`JobCard` to be "typed against a shared `Job`/`SearchResult` type from `types/job.ts`", and 1.2 is the only task that touches that file before then. Declaring them here is the DRY-correct place and avoids `03` reopening a setup file. `jobs` is a `readonly Job[]` that is legitimately empty in V1 — V1 returns a URL, not records. | pending user confirmation |
| 2026-09-26 | 1.2 | Placeholder shells render `null` and `lib/*.ts` placeholders `throw` | Task 1.2 asks for "an empty, correctly typed shell — no `any`, no stubbed fake data, no dead code" and forbids directories outside §7. Returning `null` is the only way to satisfy all three: a rendering component cannot be genuinely useful yet, and returning fabricated markup would be fake data. The `lib` placeholders throw rather than return a dummy value, matching the project's "fail loudly" rule. Each file names the plan/task that owns it. | pending user confirmation |

## Progress Log

- 2026-09-26: Initialised the git repository in `Documents/project/job/`
  (task 1.4 pulled forward by user request) — origin set to
  `SATHISH0412/Job_Tracker.git`, `dev` created as the integration branch,
  `.gitignore` added, and the parent `C:\Users\lenovo` repo told to ignore
  this directory.
- 2026-09-26: Started task 1.1 — created plan branch
  `feature/01-project-setup/scaffold-app` from `dev` and began scaffolding
  the Next.js app.
- 2026-09-26: Task 1.1 DONE. Scaffolded `job-agent/` with
  `create-next-app@latest` (App Router, TypeScript, Tailwind, ESLint, no
  `src/`, alias `@/*`) → next 16.3.6, react 19.2.8, tailwindcss v4. Replaced
  the default landing page with a placeholder, set the title, deleted the
  unused boilerplate SVGs, added a `typecheck` script, a run-focused
  `README.md`, and `run.bat` (user request). Verified: dev server 200,
  `npm run build` clean, `npm run typecheck` clean, `npm run lint` clean,
  and Tailwind classes present in the built CSS.
- 2026-09-26: Started task 1.2 — creating the `ORIGINAL_PLAN.md` §7 folder
  tree. `types/job.ts` is the substantive deliverable (it is the DRY source
  of truth for every filter option list and the `JobSearchFilters` shape);
  the other files are typed empty shells pointing at   the plan that owns them.
- 2026-09-26: Task 1.2 DONE. Created the full §7 tree — `app/jobs/page.tsx`,
  `app/api/linkedin/search/route.ts`, six components, three lib modules,
  `types/job.ts`, and `public/.gitkeep`. `types/job.ts` is the real content:
  the four option arrays as `as const` with the filter types derived from
  them, plus `JobSearchFilters`, `Job`, `SearchResult`. Placeholders render
  `null`; lib/route shells `throw`. Documented the tree in `README.md`.
  Verified: build shows 4 routes, `/` and `/jobs` return 200, lint and
  typecheck clean.


## Blockers

- none

## Next Action

Start task 1.3: create `job-agent/.env.local` (gitignored) and
`job-agent/.env.example` (committed, all values empty) covering
`DATABASE_URL`, `LINKEDIN_API_KEY`, `GEMINI_API_KEY`, and the rest of
`ORIGINAL_PLAN.md` §15, plus a single shared module for reading them.

## Notes

- Machine-verified baseline: Node v24.11.0, npm 11.2.0, git 2.47.1.
- Tailwind is **v4 and CSS-first** — there is no `tailwind.config.ts`.
  `app/globals.css` holds `@import "tailwindcss"` and `@theme`. Later plans
  that reference a Tailwind config file must be read as referring to the
  CSS-first setup. Task 1.5 owns the final `globals.css`.
- The npm script names are fixed now: `dev`, `build`, `start`, `lint`,
  `typecheck`. `typecheck` is `tsc --noEmit`.
- `npm run typecheck` only passes **after** a build or dev run has generated
  `.next/types`. `LayoutProps<"/">` in `app/layout.tsx` is a Next 16
  generated type. On a clean clone, run `npm run build` first.
- `job-agent/public/` is empty and therefore not tracked by git. Task 1.2
  must add a `.gitkeep` or the folder disappears on a fresh clone.
- `gh` CLI is **not installed** on this machine. Per `AGENTS.md` §5a this
  means branches get pushed but PRs are created manually by the user until
  `gh` is installed.
- Git identity is resolved and working: `SATHISH0412` /
  `sathishksv0412@gmail.com` (global config). The earlier placeholder came
  from a local override in the unrelated `C:\Users\lenovo` repo, which no
  longer applies now that this project has its own repo.
- Task 1.4 was pulled forward (see Deviation Log). Its remaining criteria —
  the initial commit, both branches pushed, and the ignore checks — are
  still to be verified in this plan.
- Remote `main` does not exist yet. `dev` was pushed first, so GitHub's
  default branch is very likely `dev`, not `main`. Task 1.4 must create and
  push `main`, or the user must set the default branch to `main` by hand.
- 4 of the 7 deviation-log rows above are marked "pending user
  confirmation" — those are the ones this agent decided, not the user.
- `03-linkedin-search` task 3.3 lists `job-agent/lib/errors.ts` among its
  relevant files, but `lib/errors.ts` is **not** in `ORIGINAL_PLAN.md` §7 and
  task 1.2 forbids extra directories/files, so it was not created. Plan 03
  owns the decision: add it with a Deviation Log entry, or drop the mention.
- The placeholder shells in `components/` and `lib/` currently take no
  parameters. They declare the intended contract in their JSDoc instead,
  because an unused parameter is an ESLint warning and suppressing warnings
  is not allowed. Whoever implements each one adds the real signature.

