# Plan: Resume and Job Analysis

**Plan ID:** `06-resume-and-job-analysis`
**Phase:** Future — V3 (resume) / V4a (job analysis)
**Version target:** V3 and V4a
**Status:** NOT_STARTED
**Depends on:** `05-job-persistence`
**Source:** `ORIGINAL_PLAN.md` section 18 (Future Resume Architecture), section 24 Phase 6, section 28.1 (Job Description Extraction), section 29 (Resume Analysis)

---

## Goal

Turn two messy unstructured documents — the user's resume and a job
description — into validated structured JSON that the matching engine can
consume deterministically.

## Global Acceptance Criteria

- [ ] A PDF/DOCX resume uploads, parses, and previews as structured data
- [ ] Multiple resume versions can be stored, listed, and selected
- [ ] The structured resume shape matches section 29
- [ ] A job description parses into the structured job shape from
      section 28.1, including all required fields
- [ ] Both extractions are schema-validated; malformed input fails loudly
- [ ] Resume content is never sent to a third party without explicit,
      informed consent
- [ ] Uploaded files are validated for type and size before processing

## Out of Scope (for this plan)

- No matching or scoring — that is `07-matching-engine`.
- No application preparation or drafting — that is `08`.
- No scraping job descriptions from LinkedIn. Extraction operates on text
  the user supplies or that a permitted integration returns.
- No OCR for image-only PDFs in the first pass (document as a limitation).

---

## Task 6.1 — Resume upload and storage

**Depends on:** 5.1

### Goal

Accept resume files safely and store them for parsing.

### Requirements

- Accept PDF and DOCX. Reject other types server-side by inspecting the
  file, not by trusting the browser-supplied MIME type or extension.
- Enforce a size limit and validate the real magic bytes.
- Store the file outside the web root with a generated, non-guessable
  name; never serve uploads as static files.
- Support multiple resume versions per user, each with a label and an
  active/default flag.
- Record uploads in the database (id, label, original filename, stored
  path, mime type, size, created_at, is_default).
- Delete the stored file when the row is deleted — no orphans.

### Acceptance Criteria

- [ ] PDF and DOCX upload successfully
- [ ] A disallowed type, a renamed executable, and an oversized file are
      all rejected server-side
- [ ] Stored files are not reachable by direct URL
- [ ] Multiple versions can be stored, labelled, and set as default
- [ ] Deleting a version removes both the row and the file

### Out of Scope

- Parsing (task 6.2), the preview UI (task 6.3), resume selection for
  applications (`08`).

### Technical Notes

- Filename handling is the main risk: never interpolate a user-supplied
  filename into a path. Generate the stored name.
- Principle 4 (Privacy): a resume is the most sensitive data this project
  will ever hold. Encrypt at rest if the storage location makes that
  practical, and document the decision.

### Relevant Files

- `job-agent/lib/**`, `job-agent/app/api/**`, `job-agent/migrations/**`

---

## Task 6.2 — Resume parsing

**Depends on:** 6.1

### Goal

Extract text from an uploaded resume and parse it into structured data.

### Requirements

- Extract text from PDF and DOCX in a plain server-side module, with no
  React or provider dependency.
- Parse into the section 29 structured shape: contact details, summary,
  skills (normalised), work experience (title, company, start/end dates,
  responsibilities, achievements), education, projects, certifications.
- Normalise skill names against a single canonical skill vocabulary stored
  in one module — matching in `07` depends on this being consistent.
- Preserve the raw extracted text alongside the structured form so parsing
  can be re-run without re-uploading.
- Validate the parsed structure against a schema. If extraction fails or
  the file is image-only, fail loudly and tell the user — do not return an
  empty structure that looks like a resume with no skills.
- Record which parser produced the output and when, so a parser upgrade
  can be re-run over stored resumes.

### Acceptance Criteria

- [ ] A text-based PDF and a DOCX both parse into the section 29 shape
- [ ] Every required section is present or explicitly marked absent
- [ ] An image-only or corrupt file fails with a clear message, not an
      empty result
- [ ] Skill names are normalised against the shared vocabulary
- [ ] Raw text is retained for re-parsing
- [ ] The parser module has no React or provider imports

### Out of Scope

- AI/LLM-based extraction (decide and record whether a provider is needed
  for unstructured sections; if used, it requires explicit user consent
  and a replaceable provider per Principle 5).
- Formatting, styling, or rendering the original document.

### Technical Notes

- Deterministic parsing first; reach for a model only for genuinely
  unstructured prose, and make the provider swappable (Principle 5).
- Version the parse output. Silent re-parsing on upgrade is how users lose
  manual corrections.
- Parsing is slow and CPU-bound — keep it off the request path and record
  the decision in `state.md`.

### Relevant Files

- `job-agent/lib/resume/**`, `job-agent/lib/skills.ts`,
  `job-agent/types/resume.ts`

---

## Task 6.3 — Resume preview and version management

**Depends on:** 6.2

### Goal

Let the user see what was extracted and manage versions.

### Requirements

- A resume list showing every version: label, filename, upload date,
  default flag, parse status.
- A structured preview rendering the parsed sections, clearly separating
  what was extracted from what the user supplied.
- Allow editing extracted fields — the user's correction must win over the
  parser, and the original parse must be retained for comparison.
- Allow re-running the parser on a stored resume, and deleting a version.
- Show a parse warning when extraction looks incomplete, without blocking
  use.
- Set a default version; exactly one version is default at a time.

### Acceptance Criteria

- [ ] The user can see a structured preview of each uploaded resume
- [ ] Extracted fields can be corrected and the corrections persist
- [ ] Re-parsing is available and does not discard manual edits silently
- [ ] Exactly one version is default at any time
- [ ] Parse failures are visible rather than hidden

### Out of Scope

- Resume tailoring or rewriting.
- Exporting the structured resume.

### Technical Notes

- Manual edits winning over parser output is a data-model decision: store
  parsed and user-corrected values as distinct layers, not one mutable blob.
- Do not overwrite the parse result on edit — otherwise re-running the
  parser becomes destructive.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`, `job-agent/types/resume.ts`

---

## Task 6.4 — Job description extraction

**Depends on:** 6.1

### Goal

Obtain a job description through a permitted route and structure it.

### Requirements

- Accept a job description as pasted text or a URL to a permitted
  integration. **No scraping and no browser automation** in this task.
- Extract the section 28.1 structured job shape: title, company, location,
  employment type, experience level, salary, required skills, preferred
  skills, education, responsibilities, work arrangement, application URL,
  job ID, source.
- Keep the source text alongside the structured output, with the `source`
  field recording where it came from and when.
- Validate against a schema. Missing optional fields are omitted, never
  guessed.
- Do not invent a salary, company, or job ID. Absent means absent.

### Acceptance Criteria

- [ ] A pasted job description parses into the section 28.1 shape
- [ ] All required fields are extracted or explicitly marked absent
- [ ] `source` and fetch/extract timestamp are recorded
- [ ] No field is ever fabricated
- [ ] Schema validation rejects a malformed extraction

### Out of Scope

- Fetching descriptions from LinkedIn by URL — that requires a permitted
  integration and is deliberately excluded.
- Deduplicating jobs across sources (the key strategy arrives in `09`).

### Technical Notes

- This task defines the input contract for `07-matching-engine`. Get the
  shape right here; changing it later invalidates every stored match score.
- Persist the structured job only if it came from a permitted source; keep
  provenance explicit.

### Relevant Files

- `job-agent/lib/jobs/**`, `job-agent/types/job.ts`

---

## Task 6.5 — Job description analysis view

**Depends on:** 6.4

### Goal

Show the user the structured job so they can correct it before matching.

### Requirements

- Display the extracted job fields in a readable, editable view.
- Distinguish extracted fields from user-corrected fields.
- Show which fields were absent rather than hiding the gap.
- Provide a "use this job for matching" action that hands the structured
  job to `07-matching-engine`.
- Never display this view in a way that implies LinkedIn data was
  retrieved automatically — state the actual source.

### Acceptance Criteria

- [ ] The structured job is visible and editable
- [ ] Absent fields are shown as absent, not silently empty
- [ ] The source of the data is displayed
- [ ] The job can be passed to the matching engine

### Out of Scope

- Match scores (that is `07`).
- Saving the job to the saved-jobs list (that is `05`, task 5.4).

### Technical Notes

- Keep the honesty rule from V1 intact: label the data source, never imply
  data was fetched when it was pasted.
- This view is the user's last chance to fix bad extraction before it
  poisons a match score.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`, `job-agent/types/job.ts`
