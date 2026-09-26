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

## Notes

- `AGENTS.md` in this directory is generated and maintained by `next dev`.
  Do not edit or delete it — it will be recreated, and the resulting diff
  is noise. `CLAUDE.md` is a one-line pointer to it.
- Next.js 16 has breaking changes versus older versions. If you need to
  check an unfamiliar API, read the bundled docs in
  `node_modules/next/dist/docs/` before writing code.
- Environment variables are not set up yet — that is task 1.3. No secret is
  needed to run V1.
