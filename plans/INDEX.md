# Plan Index — build order

This is the authoritative execution order for opencode. Work top to bottom.
Do not start a plan until every plan listed in its `Depends on` field is
DONE.

Each plan contains multiple tasks. A plan is DONE only when **every** task
in its `state.md` Task Status table is DONE.

## V1 — build these

- [ ] `01-project-setup` — **Project Setup** (V1) — depends on: none
  - 1.1 Scaffold the Next.js application
  - 1.2 Establish the folder structure
  - 1.3 Environment variable configuration
  - 1.4 Git repository setup
  - 1.5 Base app layout and global styling
- [ ] `02-search-ui` — **Search UI** (V1) — depends on: 01-project-setup
  - 2.1 Header component
  - 2.2 Search form component
  - 2.3 Search form validation
  - 2.4 Loading state
  - 2.5 Error handling UI
  - 2.6 Empty state
  - 2.7 Responsive layout pass
- [ ] `03-linkedin-search` — **LinkedIn Search Integration** (V1) — depends on: 02-search-ui
  - 3.1 LinkedIn search parameter builder
  - 3.2 Search URL encoding and safety
  - 3.3 Search API route
  - 3.4 Job results display
  - 3.5 Open on LinkedIn action
  - 3.6 Filter combination testing
- [ ] `04-private-access-and-handoff` — **Private Access and Handoff** (V1) — depends on: 01-project-setup (tasks 4.2–4.5 also require 03-linkedin-search)
  - 4.1 Choose and record the access-control approach
  - 4.2 Implement the private access layer
  - 4.3 Verify secret hygiene
  - 4.4 Project documentation
  - 4.5 Verify V1 success criteria and hand off

**V1 is complete when `01`–`04` are all DONE and every item in
`ORIGINAL_PLAN.md` section 26 is verified true.** Stop there and report
completion — do not continue into the future plans.

## Future plans — do not start until V1 is DONE and reported

- [ ] `05-job-persistence` — **Job Persistence** (V1.1 / V2) — depends on: 04-private-access-and-handoff
  - 5.1 Database connection and migration setup
  - 5.2 Search history schema and storage
  - 5.3 Search history display and re-run
  - 5.4 Saved jobs schema and API
  - 5.5 Saved jobs page
  - 5.6 Data deletion and privacy review
- [ ] `06-resume-and-job-analysis` — **Resume and Job Analysis** (V3 / V4a) — depends on: 05-job-persistence
  - 6.1 Resume upload and storage
  - 6.2 Resume parsing
  - 6.3 Resume preview and version management
  - 6.4 Job description extraction
  - 6.5 Job description analysis view
- [ ] `07-matching-engine` — **Matching Engine** (V4b) — depends on: 06-resume-and-job-analysis
  - 7.1 Configurable scoring weights
  - 7.2 Deterministic scoring rules
  - 7.3 Semantic similarity scoring
  - 7.4 Match score aggregation and explanation
  - 7.5 Match score UI
- [ ] `08-ai-application-preparation` — **AI Application Preparation** (V4c / V5a) — depends on: 07-matching-engine
  - 8.1 Auto-apply threshold with safety gates
  - 8.2 Decision engine
  - 8.3 Resume selection
  - 8.4 Application question extraction
  - 8.5 Answer drafting
  - 8.6 Dry-run mode
- [ ] `09-application-automation` — **Application Automation** (V5b / V7) — depends on: 08-ai-application-preparation (stable and reviewed)
  - 9.1 Browser automation worker
  - 9.2 Application limits
  - 9.3 Duplicate detection
  - 9.4 Failure handling and recovery
  - 9.5 User review and confirmation flow
- [ ] `10-tracking-and-email` — **Application Tracking and Email** (V5c/V9 / V8) — depends on: 09-application-automation
  - 10.1 Applications schema and status pipeline
  - 10.2 Application timeline
  - 10.3 Application tracking dashboard
  - 10.4 Email OAuth connection
  - 10.5 Email sync worker
  - 10.6 Email classification and application matching
  - 10.7 Automatic status updates with thresholds
  - 10.8 Email privacy compliance review
- [ ] `11-autonomous-agent` — **Autonomous Agent** (V9 / V10) — depends on: 10-tracking-and-email
  - 11.1 Control panel
  - 11.2 Unified safety gate enforcement
  - 11.3 Confidence-based automation
  - 11.4 Observability and audit log
  - 11.5 End-to-end autonomous loop

## Removed from the plan set

- **Vercel deployment** — removed by user decision. V1 ends at "ready to
  deploy": a successful production build plus documented deployment
  inputs. Nothing in the plan set deploys the app.
