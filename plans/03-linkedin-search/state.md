# State: LinkedIn Search Integration

**Plan ID:** `03-linkedin-search`

## Current Status

NOT_STARTED

<!--
Allowed values: NOT_STARTED | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE
Update this value every time work starts, stalls, or finishes on this plan.
The plan is DONE only when every task below is DONE.
-->

## Multi-Agent Parallel Execution Tracks

Tasks are divided into independent tracks with zero file overlap to enable concurrent execution via multiple subagents:

- **Track A (Backend & Logic Agent):**
  - Owns: `lib/linkedin.ts`, `lib/search.ts`, `app/api/linkedin/search/route.ts`
  - Runs: Task 3.1 → Task 3.2 → Task 3.3
- **Track B (Frontend & Results UI Agent):**
  - Owns: `components/JobResults.tsx`, `components/JobCard.tsx`
  - Runs: Task 3.4 → Task 3.5 (concurrently with Track A)
- **Track C (Integration & Testing Agent):**
  - Owns: `app/page.tsx`, verification & mapping test suite
  - Runs: Task 3.6 (merges Track A & Track B)

## Task Status

| # | Track | Task | Files Owned | Status | Completed |
|---|---|---|---|---|---|
| 3.1 | Track A (Backend) | LinkedIn search parameter builder | `lib/linkedin.ts` | NOT_STARTED | — |
| 3.2 | Track A (Backend) | Search URL encoding and safety | `lib/linkedin.ts` | NOT_STARTED | — |
| 3.3 | Track A (Backend) | Search API route | `app/api/linkedin/search/route.ts`, `lib/search.ts` | NOT_STARTED | — |
| 3.4 | Track B (Frontend) | Job results display | `components/JobResults.tsx`, `components/JobCard.tsx` | NOT_STARTED | — |
| 3.5 | Track B (Frontend) | Open on LinkedIn action | `components/JobCard.tsx`, `components/JobResults.tsx` | NOT_STARTED | — |
| 3.6 | Track C (Integration) | Filter combination testing | `app/page.tsx`, verification suite | NOT_STARTED | — |

## Last Updated

2026-10-01

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| — | — | — | — | — |

## Verified LinkedIn parameter mappings

Filled in by task 3.6. Record the exact LinkedIn source URL verified for
each mapping so a future change is detectable.

| Filter | Parameter | Value(s) | Verified against | Verified on |
|---|---|---|---|---|
| Keywords | `keywords` | free text | — | — |
| Location | `location` | free text | — | — |
| Experience | `f_E` | `1` Internship, `2` Entry level, `3` Associate, `4` Mid-Senior, `5` Director, `6` Executive | — | — |
| Work arrangement | `f_WT` | `1` On-site, `2` Remote, `3` Hybrid | — | — |
| Job type | `f_JT` | `C` Full-time, `P` Part-time, `J` Contract, `I` Internship, `T` Temporary | — | — |
| Date posted | `f_TPR` | `r86400` 24 hours, `r604800` week, `r2592000` month | — | — |

> The values above are the **expected** mapping, carried over from the
> original plan. They are unverified. Task 3.1 must confirm each one
> against a real LinkedIn search URL before it is trusted, and task 3.6
> must confirm the filters actually take effect.

## Progress Log

- 2026-10-01: Plan structured for multi-agent parallel execution. Identified
  zero-file-overlap independent tracks: Track A (Backend Logic & API: tasks 3.1,
  3.2, 3.3) and Track B (Frontend UI & Cards: tasks 3.4, 3.5), converging at
  Track C (Task 3.6 Integration & Testing). Updated master.md and state.md.

## Blockers

- none

## Next Action

Start task 3.1 once `02-search-ui` is DONE. Verify the parameter mapping
against real LinkedIn search URLs before writing the builder.

## Notes

- Hard rule for this plan: never scrape, never automate a browser, never
  handle LinkedIn credentials. V1 builds a URL and hands off to the user's
  own browser.
- The second hard rule: never fabricate job data. If only a URL is
  produced, the UI says so.
