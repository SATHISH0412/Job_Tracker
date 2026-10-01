# Plan: LinkedIn Search Integration

**Plan ID:** `03-linkedin-search`
**Phase:** Phase 2 — LinkedIn Search Integration
**Version target:** V1
**Status:** NOT_STARTED
**Depends on:** `02-search-ui`
**Source:** `ORIGINAL_PLAN.md` sections 5 (LinkedIn Search Strategy), 6 (High-Level Architecture), 10 (Search Validation), 11 (Job Result Design), 15 (Security → URL safety)

---

## Goal

Turn validated filters into a correct, safely encoded LinkedIn search URL,
expose it through a server-side API route, and present the result honestly
in the UI — all without scraping, without an official API, and without
ever implying that individual job records were retrieved when only a
search URL was produced.

## Global Acceptance Criteria

- [ ] `lib/linkedin.ts` maps every filter to its LinkedIn parameter and
      returns a parameter object; it has no React or Next.js imports
- [ ] The generated URL opens on LinkedIn and returns results matching
      every filter that was set
- [ ] `Any` options are omitted from the URL entirely, not sent as a value
- [ ] Special characters, spaces, symbols, and non-ASCII in keywords and
      location produce a valid URL
- [ ] The API route re-validates server-side and returns 4xx with a
      structured `{ code, message }` error and never a stack trace
- [ ] UI copy never claims job records were retrieved when only a URL exists
- [ ] Every documented filter combination in section 9 produces a valid URL
- [ ] `npm run lint` and the typecheck command pass

## Out of Scope (for this plan)

- **No scraping, no browser automation, no LinkedIn credential handling.**
  V1 builds a URL and hands the user to LinkedIn in their own browser.
- No official LinkedIn API integration (permitted integrations come later,
  per section 5's closing note).
- No database writes — search history is `05-job-persistence`.
- No job detail view, no pagination of results, no caching.

---

## Multi-Agent Parallel Execution Strategy

Plan 03 is decomposed into two concurrent, non-overlapping development tracks
that run in parallel using multiple specialized subagents, converging at the
final integration task:

- **Track A (Backend & Logic Agent):**
  - Task 3.1: Parameter builder in `lib/linkedin.ts` (pure mapping logic)
  - Task 3.2: URL encoding and safety assertions in `lib/linkedin.ts`
  - Task 3.3: Route handler in `app/api/linkedin/search/route.ts` and `lib/search.ts`
  - *Files owned exclusively:* `lib/linkedin.ts`, `lib/search.ts`, `app/api/linkedin/search/route.ts`

- **Track B (Frontend & Results UI Agent):**
  - Task 3.4: Results list and card display in `components/JobResults.tsx` and `components/JobCard.tsx`
  - Task 3.5: Accessible LinkedIn navigation links and error fallbacks
  - *Files owned exclusively:* `components/JobResults.tsx`, `components/JobCard.tsx`
  - *Dependencies:* Depends only on Plan 02 (`types/job.ts` and `EmptyState.tsx`), completely independent of Track A.

- **Integration & Verification (Lead Agent):**
  - Task 3.6: Mounts API route and Results UI onto `app/page.tsx`, executes filter combination test suites, and verifies real LinkedIn mappings.
  - *Dependencies:* Depends on both Track A (3.3) and Track B (3.5).

---

## Task 3.1 — LinkedIn search parameter builder

**Depends on:** 2.3

### Goal

Implement the pure logic that turns validated filters into LinkedIn search
parameters, per section 5.

### Requirements

- `lib/linkedin.ts` exports a pure function taking a validated
  `JobSearchFilters` object and returning a parameter record.
- Plain TypeScript only: no React, no Next.js imports, no `fetch`, no
  `process.env`, no DOM. It must be unit-testable in isolation.
- Base search endpoint: `https://www.linkedin.com/jobs/search/`.
- Map each filter to its LinkedIn parameter. **Verify every mapping
  against a real LinkedIn search URL before shipping it** — LinkedIn's
  public query parameters are not a contract and do change. Record the
  verified source URL for each mapping in the code as a short comment.
- Expected mapping shape (verify, do not trust):

  | Filter | Parameter | Values |
  |---|---|---|
  | Keywords | `keywords` | free text |
  | Location | `location` | free text |
  | Experience | `f_E` | `1` Internship, `2` Entry level, `3` Associate, `4` Mid-Senior, `5` Director, `6` Executive |
  | Work arrangement | `f_WT` | `1` On-site, `2` Remote, `3` Hybrid |
  | Job type | `f_JT` | `C` Full-time, `P` Part-time, `J` Contract, `I` Internship, `T` Temporary |
  | Date posted | `f_TPR` | `r86400` Past 24 hours, `r604800` Past week, `r2592000` Past month |

- Omit the parameter entirely when the filter is `Any` / `Any time`. Do not
  send `f_E=0` or an empty string.
- Name the mapping constants in full (`EXPERIENCE_PARAM`, `postedTimeFilter`
  style) rather than scattering literal strings — "explicit over implicit"
  for the LinkedIn layer.
- Throw a named error for any filter value not in the known option list.
  Fail loudly; never silently emit a wrong URL.

### Acceptance Criteria

- [ ] `lib/linkedin.ts` exports a function that takes validated filters
      and returns a parameter object
- [ ] Every filter in `types/job.ts` has a mapping or is deliberately
      omitted
- [ ] `Any` options are omitted, not sent as empty/`0` values
- [ ] An unknown filter value throws a named error rather than passing
      through
- [ ] The file imports nothing from React or Next.js
- [ ] Each mapping has a comment recording the verified LinkedIn source URL
- [ ] Manual testing covers every filter value listed in section 9

### Out of Scope

- Building the final URL string (task 3.2).
- Any network call, scraping, or API client.

### Technical Notes

- **DRY:** the mapping tables are the second-highest duplication risk in the
  project after validation. Define them once in `lib/linkedin.ts` (or
  `types/job.ts` for the option lists) and import them everywhere.
- **Open/Closed:** adding a new experience level must be a new entry in
  the mapping table, not a new `if` branch in the builder.
- If a filter maps to no parameter, that is a legitimate outcome — return
  nothing for it rather than inventing a parameter.

### Relevant Files

- `job-agent/lib/linkedin.ts`, `job-agent/types/job.ts`

---

## Task 3.2 — Search URL encoding and safety

**Depends on:** 3.1

### Goal

Safely assemble the final LinkedIn search URL per sections 10 and 15
("URL safety").

### Requirements

- A separate exported function in `lib/linkedin.ts` takes the parameter
  object and returns the full URL string. Keep it distinct from task 3.1's
  mapper so each has one job.
- Build with `URL` and `URLSearchParams` rather than string concatenation,
  so encoding is handled by the platform.
- Only ever build URLs from the validated parameter object — raw user
  input must never reach the URL builder.
- Guard against malformed output: assert the result parses as a `URL`, its
  origin is exactly `www.linkedin.com`, and the path is `/jobs/search/`.
  Throw a named error otherwise.
- Deterministic parameter ordering so the same filters always produce the
  same URL (makes testing and caching possible).
- Reject control characters and newlines in keywords/location.

### Acceptance Criteria

- [ ] Spaces, symbols, and non-ASCII in keywords/location produce a valid URL
- [ ] No unvalidated input reaches the URL builder
- [ ] A non-LinkedIn or unparseable URL causes a named error, not a
      returned bad link
- [ ] Identical filters always produce a byte-identical URL
- [ ] Round-tripping the URL yields the original keyword and location values

### Out of Scope

- URL shortening, redirect wrappers, or third-party link tracking.
- Sanitising HTML — there is no HTML in V1.

### Technical Notes

- **Security:** `encodeURIComponent` alone is not enough if you then
  concatenate. `URLSearchParams` is the correct tool; use it.
- The origin assertion is a genuine defence: if a future edit ever lets a
  caller pass a base URL, this is what stops the app from generating a
  phishing-shaped link.

### Relevant Files

- `job-agent/lib/linkedin.ts`, `job-agent/lib/validation.ts`

---

## Task 3.3 — Search API route

**Depends on:** 2.3, 3.2

### Goal

Implement the Next.js route handler that receives search requests, per
section 6.

### Requirements

- Implement `app/api/linkedin/search/route.ts` accepting `POST` with a
  JSON filter body. Support `GET` with query params only if it adds no
  extra code path.
- **Re-validate all input server-side** using the same
  `lib/validation.ts` module the client uses (section 15). Do not trust
  client validation.
- `lib/search.ts` orchestrates: parse → validate → build params → build
  URL. It contains no Next.js-specific code beyond what a route handler
  needs, so it stays testable.
- Return a structured success response containing the search URL and the
  normalised filters that produced it.
- Return a structured error response: HTTP 4xx with
  `{ code, message }` where `code` is one of the stable codes task 2.5
  switches on. Never include a stack trace, secret, or internal message.
- Reject oversized bodies; do not echo the raw request body back.
- The route handler validates and delegates only — no URL-building logic
  inline in `route.ts`.

### Acceptance Criteria

- [ ] `POST` with valid filters returns a correct LinkedIn search URL
- [ ] Invalid input returns 4xx with a friendly structured error, never a
      stack trace
- [ ] No secret or internal error detail appears in any response body
- [ ] The handler contains no URL-building or validation logic of its own
- [ ] Server-side validation reuses `lib/validation.ts`
- [ ] The response echoes the *normalised* filters, not the raw input

### Out of Scope

- Rate limiting, caching, CORS configuration, or API keys.
- Database writes — search history is `05-job-persistence`.

### Technical Notes

- **DRY:** importing the client's validation module is the requirement. If
  it needs to change to work here, change the shared module — do not fork
  it.
- An unhandled throw in a route handler leaks a stack trace in development
  and a generic 500 in production; catch explicitly and map to a code.
- Log server-side with a correlation id if you need to debug a failure —
  the client only ever sees the friendly message.

### Relevant Files

- `job-agent/app/api/linkedin/search/route.ts`, `job-agent/lib/search.ts`,
  `job-agent/lib/validation.ts`, `job-agent/lib/errors.ts`

---

## Task 3.4 — Job results display

**Depends on:** 02-search-ui (Tasks 2.2, 2.6) — runs concurrently with Track A (Tasks 3.1–3.3)

### Goal

Build the results list and card UI per section 11.

### Requirements

- `JobResults` renders a list of `JobCard`s, or delegates to `EmptyState`
  (task 2.6) when there is no data.
- `JobCard` matches the section 11 card layout: title, company,
  `Location · Work arrangement`, job type · experience level, a recency
  line, and the action button.
- `JobCard` renders only fields that actually exist on its input. Missing
  fields are omitted, never defaulted to invented values.
- When only a search URL is available, the action is labelled
  `Search LinkedIn` — not `Open on LinkedIn` with a job count, and never
  anything implying retrieved records.
- A `Search Again` control returns the user to the form with filters
  preserved.
- Since V1 produces a URL and no records, the default rendered state is the
  "ready to open on LinkedIn" card, not a job list. Say this in the UI.

### Acceptance Criteria

- [ ] Card layout matches the section 11 mockup
- [ ] Copy never overstates what data was actually retrieved
- [ ] The `Search LinkedIn` label is used when only a URL is available
- [ ] `Search Again` returns to the form with filters intact
- [ ] No fabricated placeholder job data exists anywhere in the code
- [ ] `JobResults` and `JobCard` are typed against a shared `Job`/
        `SearchResult` type from `types/job.ts`

### Out of Scope

- The `Save` button beyond a disabled placeholder — real saving is `05`.
- Job detail pages, pagination, sorting, or filtering the result list.

### Technical Notes

- **Honesty is an acceptance criterion, not a nicety.** The plan's hard
  rule: never fabricate job data. If only a URL can be produced, the UI
  must say so.
- Design `JobCard` against an optional-field type from the start so
  adding real records later (`05`, `06`) requires no rewrite — this is the
  Open/Closed principle applied to data shapes.

### Relevant Files

- `job-agent/components/JobResults.tsx`, `job-agent/components/JobCard.tsx`,
  `job-agent/components/EmptyState.tsx`, `job-agent/types/job.ts`

---

## Task 3.5 — Open on LinkedIn action

**Depends on:** 3.4

### Goal

Wire up the primary call-to-action that opens the generated LinkedIn
search in a new tab.

### Requirements

- The `Search LinkedIn` button opens the generated URL in a new tab.
- Open with `rel="noopener noreferrer"` and `target="_blank"`.
- The `href` must be the URL produced by the server, and must be
  re-validated as a `www.linkedin.com` URL before rendering — do not trust
  a URL that arrived from anywhere else.
- If URL generation failed, show the error state (task 2.5) instead of a
  broken or empty link.
- Disable the action while a search is in flight.
- Use a real `<a>` for navigation, not a click handler on a `div` — it
  must be keyboard- and middle-click accessible.

### Acceptance Criteria

- [ ] Clicking the button opens the correct LinkedIn search URL in a new tab
- [ ] Failure to generate a URL shows the error state instead of a broken link
- [ ] A non-LinkedIn URL in the response is rejected before rendering
- [ ] The link has `target="_blank"` and `rel="noopener noreferrer"`
- [ ] The action is keyboard reachable and announces its destination

### Out of Scope

- Opening in a popup window, in-app LinkedIn embedding, or a custom
  in-app browser view.
- Multiple tabs or a results carousel.

### Technical Notes

- A `window.open` in an onClick is blocked by popup blockers when it is not
  directly user-initiated; a plain anchor with `target="_blank"` is both
  simpler and more accessible.
- The client-side origin check mirrors task 3.2's server-side one. Defence
  in depth, and cheap.

### Relevant Files

- `job-agent/components/JobCard.tsx`, `job-agent/components/JobResults.tsx`

---

## Task 3.6 — Filter combination testing

**Depends on:** 3.3, 3.5 (integrates Track A and Track B)

### Goal

Verify the full search flow across realistic filter combinations and edge
cases before V1 is called done.

### Requirements

- Test the section 2 example combination: `Software Engineer` / `Chennai` /
  `Entry level` / `Remote` / `Past week` (plus `Full-time`).
- Test edge cases:
  - keywords only, location only
  - every filter set to `Any` / `Any time`
  - unusual characters in keywords: `C++`, `C#`, `.NET`, `Node.js`,
    `Sales & Marketing`, `100% Remote`, emoji, non-ASCII
    (`Développeur`, ` Chennai `), a very long string (200+ chars)
  - leading/trailing and repeated internal whitespace
- For every case, assert: the generated URL is valid, encodes the input
  correctly, opens on LinkedIn, and returns results consistent with the
  filters.
- Assert the empty-search case is rejected with a friendly message and
  never reaches the URL builder.
- If a test runner is not part of the scaffold, at minimum add a repeatable
  manual checklist; prefer a real runner if one is already available.
- Record every verified filter → parameter mapping in the plan's state file
  so a future LinkedIn change is detectable.

### Acceptance Criteria

- [ ] Every documented example filter combination produces a valid, correct
      LinkedIn URL
- [ ] Edge cases neither crash the form nor the API route
- [ ] Special-character keywords round-trip correctly through the URL
- [ ] All-`Any` filters produce a bare, valid search URL
- [ ] The verified mapping table is recorded in this plan's `state.md`
- [ ] Results found are verified to actually respect the filters, not just
      produce a well-formed URL

### Out of Scope

- Automated end-to-end browser tests against LinkedIn (that is browser
  automation — prohibited without a deliberate re-scope).
- Load or performance testing.

### Technical Notes

- The most valuable check is the last one: a valid URL that LinkedIn
  ignores a filter on is a silent failure. Open the URL and confirm the
  filters took effect.
- "Unsupported filter" from section 14 should be raised here if LinkedIn
  rejects any mapping — do not paper over it.
- Keep a written record of the verified mappings; LinkedIn changing them
  silently is the expected long-term failure mode.

### Relevant Files

- `job-agent/lib/linkedin.ts`, `job-agent/lib/validation.ts`,
  `job-agent/app/api/linkedin/search/route.ts`
