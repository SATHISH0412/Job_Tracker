# Plan: Private Access and Handoff

**Plan ID:** `04-private-access-and-handoff`
**Phase:** Phase 3 — Private Access
**Version target:** V1
**Status:** NOT_STARTED
**Depends on:** `01-project-setup` (task 4.1 may start once the app runs; tasks 4.2–4.5 need `03-linkedin-search` complete)
**Source:** `ORIGINAL_PLAN.md` sections 15 (Security → Authentication), 23 (Deployment Plan), 26 (V1 Success Criteria)

---

## Goal

Make the app non-publicly-usable, then hand it off: document it, verify
every V1 success criterion, and leave the repository clean and ready to
run anywhere.

## Global Acceptance Criteria

- [ ] An unauthenticated visitor cannot use the search feature
- [ ] No auth secret ever reaches the browser
- [ ] `README.md` covers install, env setup, and run instructions
- [ ] Every item in `ORIGINAL_PLAN.md` section 26 is verified true
- [ ] `npm run lint` and the typecheck command pass
- [ ] The working tree is clean and pushed per `AGENTS.md` §5a

## Out of Scope (for this plan)

- No multi-user accounts, OAuth login, or user registration — explicitly out
  of scope for V1 (section 3).
- **No Vercel deployment, hosting account setup, DNS, or CI/CD.** Deployment
  was removed from the plan set by user decision; this plan ends at "ready
  to deploy".
- No database, no email, no background jobs.
- No password reset, session management UI, or rate limiting on the gate.

---

## Task 4.1 — Choose and record the access-control approach

**Depends on:** 1.5

### Goal

Decide the simplest mechanism that satisfies "single user, not publicly
usable" from section 15's Authentication subsection, and write the decision
down before implementing it.

### Requirements

- Evaluate at least: (a) a shared passcode checked server-side, (b)
  Next.js middleware gate, (c) host-level deployment protection.
- Prefer the option with the least code and the smallest blast radius. For
  a single-user private tool this is normally (a) or (b).
- Do not over-build. Section 15's "Future architecture" (User →
  Authentication → Private Dashboard) is a V2+ direction, not a V1
  requirement.
- Record the chosen approach, the two rejected options with one-line
  reasons, and the threat model it does *not* cover in this plan's
  `state.md` Notes.

### Acceptance Criteria

- [ ] The chosen approach and its rejected alternatives are recorded in
      this plan's `state.md`
- [ ] The approach needs no user accounts, no database, and no OAuth
- [ ] The residual risk is written down explicitly

### Out of Scope

- Implementing the gate (task 4.2).

### Technical Notes

- A shared passcode over plain HTTP is only as strong as the transport. Note
  that limitation rather than pretending otherwise.
- Whichever option is chosen, it must not require a secret in client code.

### Relevant Files

- `plans/04-private-access-and-handoff/state.md`

---

## Task 4.2 — Implement the private access layer

**Depends on:** 4.1

### Goal

Add the chosen access gate so the app is not publicly usable.

### Requirements

- Implement the approach recorded in task 4.1.
- Read the secret **only** from `AUTH_SECRET` via `lib/env.ts`. Never
  hard-code it, never import it into a client component.
- Compare secrets in a timing-safe way on the server.
- Reject unauthenticated requests **before** any search logic runs, so an
  anonymous visitor cannot reach the API route.
- On failure, return a generic message that does not reveal whether the
  passcode was merely wrong.
- The gate must not break `npm run dev` for the owner — document how to
  bypass it locally if the chosen mechanism would.

### Acceptance Criteria

- [ ] An unauthenticated visitor cannot use the search feature
- [ ] No auth secret is ever exposed to the browser or client bundle
- [ ] The API route rejects unauthenticated requests, not just the page
- [ ] A wrong passcode gives a generic message with no information leak
- [ ] The secret is read only through `lib/env.ts`

### Out of Scope

- Per-user sessions, logout propagation, multi-factor auth.
- Protecting static assets or the favicon beyond what the mechanism does
  inherently.

### Technical Notes

- Protecting only the page is the classic mistake here — the API route is
  directly reachable and must be gated too.
- `AUTH_SECRET` is reserved in `02`'s predecessor (task 1.3) precisely so
  this task has somewhere to read from.

### Relevant Files

- `job-agent/lib/env.ts`, `job-agent/middleware.ts`,
  `job-agent/app/api/linkedin/search/route.ts`, `job-agent/.env.example`

---

## Task 4.3 — Verify secret hygiene

**Depends on:** 4.2

### Goal

Prove that no secret, key, or internal detail is reachable from the
browser.

### Requirements

- Build for production (`npm run build`) and grep the client bundle in
  `.next/static/` for every reserved env var name and any `.env.local`
  value.
- Confirm server-only modules are not pulled into the client graph.
- Confirm no stack traces, database credentials, server config, or logs
  reach the UI or the browser console (extends task 2.5).
- Confirm `.env.local` is untracked and absent from git history.
- Record the commands used and their results in this plan's `state.md`.

### Acceptance Criteria

- [ ] No reserved env var value appears in `.next/static/`
- [ ] No `.env.local` value appears in the client bundle
- [ ] No secret is present in any git-tracked file or in history
- [ ] No stack trace or internal message reaches the UI or console
- [ ] The verification commands and results are recorded in `state.md`

### Out of Scope

- A full dependency vulnerability audit.
- Pen testing or scanner tooling beyond the grep-based checks.

### Technical Notes

- `NEXT_PUBLIC_` prefixed vars are shipped to the client by design. No
  secret may ever use that prefix — this task is where that gets proven.
- Grepping the built bundle, not the source, is the only check that
  actually proves anything.

### Relevant Files

- `job-agent/.gitignore`, `job-agent/lib/env.ts`

---

## Task 4.4 — Project documentation

**Depends on:** 4.3

### Goal

Write the README so someone else can run this without asking questions.

### Requirements

- Cover: prerequisites (Node version, package manager — recorded in task
  1.1), install, environment setup from `.env.example`, `npm run dev`,
  `npm run build`, `npm run lint`, and the typecheck command.
- Document the folder structure with a one-line purpose per folder
  (originally task 1.2's requirement, consolidated here).
- Document the env var table: name, purpose, server-only or not.
- Document the access gate from task 4.1 and how to set `AUTH_SECRET`.
- Document how a search works end to end and — honestly — that V1
  produces a **search URL**, not job records.
- Document the git workflow at a high level: `main` protected, `dev` as
  integration branch, one branch per task.
- Link to `plans/` rather than duplicating the plan content.

### Acceptance Criteria

- [ ] README covers install, env setup, and run instructions
- [ ] The folder structure and env var table are documented
- [ ] The access gate and its setup are documented
- [ ] The "search URL, not job records" limitation is stated plainly
- [ ] Every command shown in the README was actually run successfully

### Out of Scope

- API documentation generators, docs sites, or contribution guides.
- Screenshots or video walkthroughs.

### Technical Notes

- Only document commands you have run. An untested command in a README is
  worse than no command.
- This task consolidates the README obligations that tasks 1.1, 1.2, and
  1.3 also carry; those tasks may create a stub README, this task makes it
  correct and complete.

### Relevant Files

- `job-agent/README.md`

---

## Task 4.5 — Verify V1 success criteria and hand off

**Depends on:** 3.6, 4.4

### Goal

Verify every item in `ORIGINAL_PLAN.md` section 26 and confirm V1 is
genuinely complete.

### Requirements

- Copy the section 26 checklist into this plan's `state.md` and verify each
  item one by one, recording evidence (command run, page visited, filter
  tried) rather than a bare tick.
- Section 26 items: application runs locally; application is responsive;
  search form works; keyword, location, experience, remote, job-type, and
  date-posted filtering all work; inputs are validated; the LinkedIn search
  URL is generated correctly; the user can open the search on LinkedIn;
  loading states work; error states work; no secrets are exposed to the
  browser; the project is documented; the project can be deployed.
- "Can be deployed" is satisfied by proving the production build succeeds
  and the README documents deployment inputs — **not** by deploying.
- Run `npm run lint` and the typecheck command one final time.
- Confirm the git working tree is clean and all work is pushed on task
  branches per `AGENTS.md` §5a.
- Report V1 completion to the user and **stop**. Do not begin
  `05-job-persistence` or any later plan.

### Acceptance Criteria

- [ ] Every item in section 26's checklist is verified true with evidence
- [ ] `npm run build` succeeds
- [ ] Lint and typecheck pass
- [ ] The working tree is clean and pushed
- [ ] V1 completion is reported and no future plan has been started

### Out of Scope

- Actually deploying anywhere.
- Starting `05-job-persistence` or any later plan.

### Technical Notes

- "Can be deployed" is a build-and-document claim in this plan. Do not
  mark it verified on the strength of a `npm run dev` run.
- An item that cannot be verified must be reported as unverified with the
  reason, not quietly ticked.

### Relevant Files

- `job-agent/README.md`, `plans/04-private-access-and-handoff/state.md`
