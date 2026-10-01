# Project Agent Configuration & Tool Permissions

@AGENTS.md

## Tool Permissions and Execution Rules

1. **Scope:** All tool actions and terminal commands must strictly operate within this project's directory (`Documents/project/job/`) only. Do not touch anything outside.
2. **Auto-Approve:** Allow routine build, lint, typecheck, test, and local workspace file editing tools without prompting for interactive confirmation.
3. **Explicit Approval:** ONLY ask for explicit user confirmation before running `git commit` and `git push`. Show the commit summary and message before requesting approval.
4. **Auto-Persist Permissions:** Whenever I grant permission for a new project command, persist it into the local project settings file so you don't prompt for it again.
