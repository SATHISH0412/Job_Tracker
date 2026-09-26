# JobFinder

A private, single-user LinkedIn job **search** tool. V1 builds a LinkedIn
search URL from a filter form and hands it to your own browser — it does
not scrape, does not automate, and does not fetch individual job records.

> **Status: scaffolding.** This README is task 1.1's minimum (prerequisites
> and run commands). The complete documentation — folder structure, env var
> table, access gate, and the end-to-end explanation of how a search works —
> is written in `../plans/04-private-access-and-handoff` task 4.4.

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | v24.11.0 (verified) |
| npm | 11.2.0 (verified) |
| Git | 2.47.1 (only needed to work on the project itself) |

Node 22 or newer is required by Next.js 16.

## Install

```bash
npm install
```

Or on Windows, just double-click `run.bat` — it installs on first run.

## Run

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Stop with `Ctrl+C`.

## All commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` — no output means it passed |

Every command in this table has been run successfully on this machine.

## Stack

- Next.js 16 (App Router, `src/` **not** used — code sits at the top level)
- React 19
- TypeScript 5, `strict: true`
- Tailwind CSS **v4** — CSS-first, there is no `tailwind.config.ts`.
  Theme tokens and custom utilities are declared in `app/globals.css` via
  `@import "tailwindcss"` and `@theme`.

Import alias `@/*` maps to this directory's root.

## Environment variables

V1 needs **none** of them. The app runs with no `.env.local` at all. Copy the
template only if you later move on to persistence or AI matching:

```bash
copy .env.example .env.local   # Windows
cp .env.example .env.local     # macOS / Linux
```

Five names are reserved (`ORIGINAL_PLAN.md` section 15):

| Name | Server-only | First used by |
|---|---|---|
| `DATABASE_URL` | yes | `05-job-persistence` |
| `LINKEDIN_API_KEY` | yes | never in V1 |
| `GEMINI_API_KEY` | yes | `08-ai-matching` |
| `OPENROUTER_API_KEY` | yes | `08-ai-matching` |
| `AUTH_SECRET` | yes | `04-private-access-and-handoff` |

`.env.local` is gitignored. `.env.example` is committed and always has empty
values.

Read values **only** through `lib/env.ts` — it is the single module allowed to
touch `process.env`. It exposes `readEnvironmentVariable` (returns
`undefined`), `requireEnvironmentVariable` (throws
`MissingEnvironmentVariableError`), and a `isEnvironmentVariableName` type
guard. Nothing outside a `NEXT_PUBLIC_`-prefixed name reaches the browser, so
these values cannot leak into a client bundle. Never import `lib/env.ts` from
a Client Component.

## Project structure

Verbatim from `../plans/ORIGINAL_PLAN.md` section 7. Every folder holds a
real file or a `.gitkeep`, so the shape is visible in git.

```text
job-agent/
├── app/
│   ├── page.tsx                     Home — the search form
│   ├── layout.tsx                   HTML shell, metadata, global CSS
│   ├── jobs/
│   │   └── page.tsx                 Search results page
│   └── api/
│       └── linkedin/
│           └── search/
│               └── route.ts        POST /api/linkedin/search
├── components/
│   ├── Header.tsx                   App header
│   ├── SearchForm.tsx               The form and its submit handling
│   ├── SearchFilters.tsx            Keyword/location/dropdown inputs
│   ├── JobResults.tsx               Result list, or EmptyState
│   ├── JobCard.tsx                  One job record
│   └── EmptyState.tsx               "Nothing to show" message
├── lib/
│   ├── env.ts                       The only reader of process.env
│   ├── linkedin.ts                  Filters → LinkedIn search params
│   ├── validation.ts                Shared validation rules
│   └── search.ts                    parse → validate → params → URL
├── types/
│   └── job.ts                       Filter types, option lists, Job, SearchResult
└── public/                          Static assets served at /
```

### `types/job.ts` is the source of truth

Filter option lists and the `JobSearchFilters` shape are declared there once
and derived from each other, so a new option is a one-line change picked up by
the form, the validation, and the LinkedIn param builder simultaneously. Never
redeclare those shapes or re-list those values in a component — import them.

`Job` and `SearchResult` also live there. `Job`'s fields are all optional
because V1 retrieves no records at all; `SearchResult.searchUrl` is the honest
minimum result and `SearchResult.jobs` is empty in V1.

### `app-container` is the only page container

`app/globals.css` defines one `@utility app-container` (max-width 48rem,
centred, 1.5rem inline padding). Use `className="app-container"` on a page's
top-level element instead of writing `max-w-*` and `px-*` again. It is a
Tailwind v4 `@utility` rather than a React `Container` component so the class
stays composable with variants.

## Notes

- `AGENTS.md` in this directory is generated and maintained by `next dev`.
  Do not edit or delete it — it will be recreated, and the resulting diff
  is noise. `CLAUDE.md` is a one-line pointer to it.
- Next.js 16 has breaking changes versus older versions. If you need to
  check an unfamiliar API, read the bundled docs in
  `node_modules/next/dist/docs/` before writing code.
- Environment variables are not set up yet — that is task 1.3. No secret is
  needed to run V1.
