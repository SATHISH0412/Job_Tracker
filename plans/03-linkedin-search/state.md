# State: LinkedIn Search Integration

**Plan ID:** `03-linkedin-search`

## Current Status

NOT_STARTED

<!--
Allowed values: NOT_STARTED | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE
Update this value every time work starts, stalls, or finishes on this plan.
The plan is DONE only when every task below is DONE.
-->

## Task Status

| # | Task | Status | Completed |
|---|---|---|---|
| 3.1 | LinkedIn search parameter builder | NOT_STARTED | — |
| 3.2 | Search URL encoding and safety | NOT_STARTED | — |
| 3.3 | Search API route | NOT_STARTED | — |
| 3.4 | Job results display | NOT_STARTED | — |
| 3.5 | Open on LinkedIn action | NOT_STARTED | — |
| 3.6 | Filter combination testing | NOT_STARTED | — |

## Last Updated

(not started yet)

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

- (empty — append a dated one-line entry here on every touch of this plan)

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
