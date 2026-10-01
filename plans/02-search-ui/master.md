# Plan: Search UI

**Plan ID:** `02-search-ui`
**Phase:** Phase 1 — Search UI
**Version target:** V1
**Status:** NOT_STARTED
**Depends on:** `01-project-setup`
**Source:** `ORIGINAL_PLAN.md` sections 8 (Frontend Design), 9 (Search Form), 10 (Search Validation), 12 (Loading State), 13 (Empty State), 14 (Error Handling), 16 (Responsive Design)

---

## Goal

Build the complete search interface: the shared header, the six-field
search form with its exact option lists, client-side validation, the
loading / error / empty state trio, and a responsive pass that works from
320px to desktop.

## Global Acceptance Criteria

- [ ] All six filters render with the exact option values from section 9
- [ ] Form state is typed via `types/job.ts` and fully controlled
- [ ] An empty or whitespace-only search shows an inline message and does
      not submit
- [ ] The submit button is disabled with a visible indicator while a
      search is in flight, and re-enables on both success and error
- [ ] Every error case in section 14 maps to one concise user-facing
      message with no stack trace, key, or internal detail
- [ ] Empty-state copy never implies individual job records were fetched
      when only a search URL exists
- [ ] No horizontal scrolling or overlap at 320px, 768px, 1024px, 1440px
- [ ] `npm run lint` and the typecheck command pass

## Out of Scope (for this plan)

- No LinkedIn URL building or API calls — that is `03-linkedin-search`.
- No auth gate, no database, no saved jobs.
- No custom date pickers, comboboxes, or multi-select widgets; native
  `<select>` elements only.

---

## Task 2.1 — Header component

**Depends on:** 1.5

### Goal

Build the shared header shown on every page, per the navigation mockup in
section 8.

### Requirements

- Show the app name. Use the name agreed in `04-private-access-and-handoff`
  task 4.4 or, until then, `JobFinder` as in the section 8 mockup.
- Nav items: `Search` (active), `Jobs`, `Saved`, `Settings`.
- `Saved` and `Settings` are future functionality — render them visibly
  disabled/greyed with `aria-disabled` and no navigation, or omit them.
  Pick one approach and apply it consistently.
- Reserve a `Profile` slot on the right; a static placeholder is enough.
- Responsive: collapses sensibly on mobile (section 16) — a wrapping row
  or a simple disclosure, not a JS-driven mega-menu.

### Acceptance Criteria

- [x] `components/Header.tsx` exists and is rendered from `app/layout.tsx`
- [x] `JobFinder` and the `Search` nav item are visible on every page
- [x] Future-only items cannot be activated and are visually distinguished
- [x] Header reflows without horizontal scroll at 320px
- [x] Header is a Server Component (no `"use client"`)

### Out of Scope

- No real profile menu or auth logic — that is `04`.
- No active-route highlighting logic beyond a static `aria-current` on
  `Search`.

### Technical Notes

- Keeping the header server-rendered avoids shipping a JS bundle for
  static text. Put interactivity in a leaf component if it is ever needed.
- `aria-current="page"` is the accessible way to mark the active item.

### Relevant Files

- `job-agent/components/Header.tsx`, `job-agent/app/layout.tsx`

---

## Task 2.2 — Search form component

**Depends on:** 2.1

### Goal

Build the primary job search form described in section 9.

### Requirements

- Six fields, in this order: Keywords (free text, required), Location
  (free text), Experience Level (select), Work arrangement / Remote
  (select), Job Type (select), Date Posted (select).
- Use these exact option lists, verbatim from section 9:
  - Experience: `Any`, `Internship`, `Entry level`, `Associate`,
    `Mid-Senior`, `Director`, `Executive`
  - Work arrangement: `Any`, `Remote`, `Hybrid`, `On-site`
  - Job type: `Any`, `Full-time`, `Part-time`, `Contract`, `Internship`,
    `Temporary`
  - Date posted: `Any time`, `Past 24 hours`, `Past week`, `Past month`
- A `Search Jobs` submit button.
- Fully controlled inputs: value + `onChange` per field, one state object
  typed as `JobSearchFilters` from `types/job.ts`.
- Every field has a `<label htmlFor>` tied to its `id`; errors are wired
  via `aria-describedby` and `aria-invalid`.
- `SearchFilters.tsx` holds the four select fields; `SearchForm.tsx` owns
  the form, the text inputs, and the submit handler.
- Client component (`"use client"`) — interactivity is required.

### Acceptance Criteria

- [x] All six fields render with the exact option values from section 9
- [x] Form state is controlled and typed via `types/job.ts`
- [x] Submitting calls the parent's search handler with current filter
      values and does not do a native form POST/navigation
- [x] Every field has an associated label and is keyboard reachable
- [x] Option lists are imported from `types/job.ts`, not redeclared
- [x] `'use client'` appears in exactly the files that need it

### Out of Scope

- Validation logic (task 2.3), loading/disabled button state (task 2.4),
  error rendering (task 2.5), empty state (task 2.6).

### Technical Notes

- **DRY:** the option arrays live in `types/job.ts` as the single source of
  truth. `SearchFilters` maps over them; it must not `switch` on a filter
  name to pick options (that violates Liskov Substitution and is the most
  likely place for this plan to go wrong).
- Keep `SearchFilters` generic: it receives the filter value and an
  `onChange` per field, not the whole state object (Interface
  Segregation).
- The submit handler receives already-normalised filters; it does not
  encode anything itself.

### Relevant Files

- `job-agent/components/SearchForm.tsx`, `job-agent/components/SearchFilters.tsx`,
  `job-agent/types/job.ts`, `job-agent/app/page.tsx`

---

## Task 2.3 — Search form validation

**Depends on:** 2.2

### Goal

Implement the client-side validation rules from section 10 in a single
reusable module.

### Requirements

- Put every rule in `lib/validation.ts` as a pure function — no React, no
  DOM. It must be importable from a route handler unchanged.
- Trim whitespace from all text inputs before validating.
- Reject a completely empty search: at least one of keywords or location
  must be non-empty after trimming.
- Reject select values that are not in the known option lists (defence
  against a tampered `<select>` value).
- Return structured errors (`{ field, message }[]`) rather than a single
  string, so the form can place each message next to its field.
- Message copy matches the tone of section 10's examples, e.g.
  `Please enter a job title or keyword.`
- The form renders messages inline and blocks submission while any error
  exists.

### Acceptance Criteria

- [x] An empty search shows a clear validation message and does not submit
- [x] Whitespace-only input is treated as empty
- [x] An out-of-list select value is rejected
- [x] Each error renders next to its field and is announced accessibly
- [x] `lib/validation.ts` has no React/DOM imports
- [x] Message strings are defined once, not duplicated in the component

### Out of Scope

- Server-side re-validation — that is `03-linkedin-search` task 3.3, which
  calls this same module.
- Regex-based keyword sanitisation beyond trimming.

### Technical Notes

- This module is the DRY keystone for validation: the API route must reuse
  it rather than reimplementing rules. Design the return type for reuse
  from both sides.
- "At least keywords or location" is an **OR**, not an AND — the section 10
  example shows a single friendly message, not two field errors.

### Relevant Files

- `job-agent/lib/validation.ts`, `job-agent/components/SearchForm.tsx`

---

## Task 2.4 — Loading state

**Depends on:** 2.2

### Goal

Implement the loading UI from section 12 while a search request is in
flight.

### Requirements

- Show the section 12 copy: `Searching LinkedIn...` with a spinner and
  `Preparing your search...`.
- Disable the `Search Jobs` button for the duration of the request to
  prevent duplicate submissions; keep it focusable but `aria-disabled`
  with an accessible "searching" label.
- Clear the loading state on **both** success and error — including on
  request throw and on unmount.
- The spinner respects `prefers-reduced-motion`.

### Acceptance Criteria

- [ ] Button is disabled and shows a loading indicator while pending
- [ ] Loading state clears on success, on error, and on thrown exceptions
- [ ] The section 12 copy appears verbatim
- [ ] Rapid double-click cannot produce two requests

### Out of Scope

- Skeleton loaders for results, progress percentages, or cancellation.

### Technical Notes

- Clear loading in a `finally` block, not only on the success path —
  forgetting this is the classic bug here.
- Guard against state updates after unmount if the component can unmount
  mid-request.

### Relevant Files

- `job-agent/components/SearchForm.tsx`

---

## Task 2.5 — Error handling UI

**Depends on:** 2.3, 2.4

### Goal

Implement user-facing error handling per section 14.

### Requirements

- Handle these cases with one concise message each: invalid search input,
  network failure, LinkedIn unavailable, unsupported filter, API rate
  limit, authentication failure, server error.
- Map each case to a stable error `code` returned by the API; the UI
  switches on the code, never on raw message text.
- Section 14 example copy: `Unable to create the LinkedIn search.` /
  `Please check your filters and try again.`
- Never render or log: API keys, stack traces, database credentials,
  server configuration, sensitive logs, or raw server response bodies.
- Render errors in an `role="alert"` region that clears on the next
  successful search.

### Acceptance Criteria

- [ ] A simulated network failure shows a friendly message, not a raw
      error or stack trace
- [ ] No sensitive information reaches the browser console or the UI
- [ ] Each documented error case has its own message
- [ ] Errors clear when a subsequent search succeeds
- [ ] Error copy is defined once and reused, not inlined per component

### Out of Scope

- Retry buttons with backoff, toast libraries, or error-reporting services.
- Logging to an external service.

### Technical Notes

- **Security:** log a correlation id server-side if needed, but show the
  user only the friendly message. Never `console.error` the raw response
  in a client component.
- Validation errors (task 2.3) and request errors (this task) are different
  channels: field-level inline vs a single alert region. Don't conflate them.

### Relevant Files

- `job-agent/components/SearchForm.tsx`, `job-agent/components/JobResults.tsx`,
  `job-agent/lib/errors.ts`

---

## Task 2.6 — Empty state

**Depends on:** 2.5

### Goal

Implement the empty-state UI from section 13.

### Requirements

- When there is no result data, render the section 13 copy verbatim:
  `No jobs found` followed by `Try changing:` and the bullet list —
  keywords, location, experience level, date posted.
- If the implementation only produces a LinkedIn search URL (no individual
  job records), say so plainly: the UI must explain the search will open
  on LinkedIn, and must not imply job data was retrieved.
- Provide a way back to the form with the previous filters intact.
- Distinguish "LinkedIn will open in a new tab" from "we found 0 jobs" —
  they are different messages and must not share copy.

### Acceptance Criteria

- [ ] Empty state renders the exact guidance from section 13
- [ ] Copy never falsely implies individual job records were fetched
- [ ] The user can retry with filters preserved
- [ ] The two empty conditions produce visibly different messages

### Out of Scope

- The `JobResults` / `JobCard` list itself — that is `03-linkedin-search`
  task 3.4.

### Technical Notes

- The "no data" condition in V1 is normal, not exceptional — a V1 search
  always ends in a URL, never a job list. Design the copy accordingly.

### Relevant Files

- `job-agent/components/EmptyState.tsx`

---

## Task 2.7 — Responsive layout pass

**Depends on:** 2.2, 2.6

### Goal

Ensure the whole search experience works on desktop, laptop, tablet, and
mobile per section 16.

### Requirements

- Verify and adjust the form, filters, and results at 320px, 768px, 1024px,
  and 1440px.
- Mobile: single column, fields stacked in the section 16 order —
  Keywords, Location, Experience, then the rest, then the submit button,
  then Results.
- Header collapses sensibly on mobile (shares task 2.1's approach).
- Tap targets are at least 44×44px on touch; selects and inputs use
  appropriate font sizes so iOS does not zoom on focus.
- Use Tailwind responsive utilities, not custom media queries.

### Acceptance Criteria

- [ ] No horizontal scrolling or overlapping elements at 320px, 768px,
      1024px, 1440px
- [ ] Mobile field order matches the section 16 mockup
- [ ] Tap targets are ≥44px on touch viewports
- [ ] No custom `@media` blocks were introduced in component CSS
- [ ] The form remains usable with a 200% browser zoom

### Out of Scope

- Native app shells, offline support, print stylesheets.
- Dark mode or theme switching.

### Technical Notes

- Fix layout by adjusting the component that overflows, not by adding
  `overflow-hidden` to a parent — that hides the bug rather than fixing it.
- Reuse the container from task 1.5 so page padding stays consistent across
  breakpoints.

### Relevant Files

- `job-agent/components/*.tsx`, `job-agent/app/layout.tsx`,
  `job-agent/app/globals.css`
