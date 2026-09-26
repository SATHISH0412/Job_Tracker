# State: Project Setup

**Plan ID:** `01-project-setup`

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
| 1.1 | Scaffold the Next.js application | NOT_STARTED | — |
| 1.2 | Establish the folder structure | NOT_STARTED | — |
| 1.3 | Environment variable configuration | NOT_STARTED | — |
| 1.4 | Git repository setup | NOT_STARTED | — |
| 1.5 | Base app layout and global styling | NOT_STARTED | — |

## Last Updated

(not started yet)

## Deviation Log

Record every departure from `master.md` here **before** implementing it.
An unlogged deviation is a process failure — log it or don't do it.

| Date | Task | What deviated | Why | Approved by |
|---|---|---|---|---|
| 2026-09-26 | 1.4 | Ran task 1.4 (git repo init) before task 1.1 (scaffold), and before the other 1.x tasks | User explicitly asked for the repository to be initialised against `SATHISH0412/Job_Tracker` immediately. The repo must exist for any commit, so it was pulled forward. Task 1.4 stays in this plan and its remaining acceptance criteria are still verified when the work resumes. | user |

## Progress Log

- 2026-09-26: Initialised the git repository in `Documents/project/job/`
  (task 1.4 pulled forward by user request) — origin set to
  `SATHISH0412/Job_Tracker.git`, `dev` created as the integration branch,
  `.gitignore` added, and the parent `C:\Users\lenovo` repo told to ignore
  this directory.


## Blockers

- none

## Next Action

Start task 1.1: scaffold the Next.js app with the App Router, TypeScript,
and Tailwind CSS.

## Notes

- Machine-verified baseline: Node v24.11.0, npm 11.2.0, git 2.47.1.
- `gh` CLI is **not installed** on this machine. Per `AGENTS.md` §5a this
  means branches get pushed but PRs are created manually by the user until
  `gh` is installed.
- `git config user.name` / `user.email` are still the placeholders
  "Your Name" / "you@example.com". The user has taken ownership of setting
  these; do not set or guess them.
