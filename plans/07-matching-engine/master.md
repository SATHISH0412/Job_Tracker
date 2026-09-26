# Plan: Matching Engine

**Plan ID:** `07-matching-engine`
**Phase:** Future — V4b
**Version target:** V4
**Status:** NOT_STARTED
**Depends on:** `06-resume-and-job-analysis`
**Source:** `ORIGINAL_PLAN.md` section 20 (Future Job Matching), section 30 (Job ↔ Resume Matching Engine), section 31 (Match Probability), section 25 Principle 5 (Replaceable Providers)

---

## Goal

Score how well a resume matches a job using deterministic, inspectable
rules plus optional semantic similarity, and present the result as a
transparent system estimate — never a guarantee, and never a number
invented by a language model.

## Global Acceptance Criteria

- [ ] Match score and per-category breakdown render as specified in
      section 31
- [ ] Weights are configurable, not hard-coded
- [ ] The engine is deterministic: the same resume and job always produce
      the same score
- [ ] Every category's contribution is inspectable and explainable
- [ ] The UI labels the score a system-generated estimate, never a
      probability of getting the job
- [ ] Missing data is scored explicitly rather than treated as a zero or
      silently ignored
- [ ] An LLM never directly produces the final score

## Out of Scope (for this plan)

- No application preparation, drafting, or submission — that is `08`/`09`.
- No auto-apply threshold or decision engine — that is `08`, task 8.1.
- No job recommendation or ranking across many jobs at scale.
- No model training or fine-tuning.

---

## Task 7.1 — Configurable scoring weights

**Depends on:** 6.4, 6.2

### Goal

Define the scoring categories and make their weights configuration, not
code.

### Requirements

- Categories per section 30: required skills (40%), preferred skills
  (10%), experience (20%), education (5%), location (10%), semantic
  similarity (15%). These are **defaults**, not fixed values.
- Weights live in one typed configuration module with validation that they
  sum to 1.0 (or are normalised at load time — pick one and document it).
- Weights must be overridable per user or per call without editing source.
- Changing a weight must not require touching scoring code.
- Record the chosen defaults and the normalisation rule in this plan's
  `state.md`.

### Acceptance Criteria

- [ ] Weights are defined in one configuration module
- [ ] Invalid weight configuration fails loudly at load time
- [ ] Weights can be overridden without a code change
- [ ] Defaults match section 30 and are documented

### Out of Scope

- An admin UI for tuning weights.
- Automatic weight learning.

### Technical Notes

- **Open/Closed:** a new scoring category should be a new entry in the
  config plus a scorer module, not an edit to the aggregation function.
- Validate weights at startup, not at score time — a bad config should
  crash the process, not quietly produce nonsense scores.

### Relevant Files

- `job-agent/lib/matching/weights.ts`, `job-agent/lib/matching/config.ts`

---

## Task 7.2 — Deterministic scoring rules

**Depends on:** 7.1

### Goal

Score the non-semantic categories with transparent, testable rules.

### Requirements

- Implement scorers for required skills, preferred skills, experience,
  education, and location. Each is a pure function with no I/O, no
  provider, and no React.
- Reuse the canonical skill vocabulary and the normalisation from
  `06-resume-and-job-analysis` task 6.2. Do not introduce a second
  normalisation path.
- Handle missing data explicitly: decide and record whether "job lists no
  education requirement" scores full, neutral, or zero, and apply the
  choice consistently.
- Partial credit is allowed but must be deterministic and documented.
- Each scorer returns its own sub-score **and** the reasons behind it, so
  the UI can explain the result.
- Unit tests for every scorer covering empty, partial, and full-match cases.

### Acceptance Criteria

- [ ] Each of the five deterministic categories has a tested pure scorer
- [ ] Every scorer returns a sub-score plus human-readable reasons
- [ ] Missing-data behaviour is defined, consistent, and documented
- [ ] Identical input always yields an identical sub-score
- [ ] Scorers import the shared skill vocabulary, not a local copy

### Out of Scope

- Semantic/embedding similarity (task 7.3).
- Any LLM call inside a scorer.

### Technical Notes

- "Never fabricate" applies to scores too: a category with no data must
  report that, not display a confident number.
- The reasons array is what makes the score explainable in `11`'s audit
  log. Build it now even though nothing consumes it yet.

### Relevant Files

- `job-agent/lib/matching/scorers/**`, `job-agent/lib/skills.ts`

---

## Task 7.3 — Semantic similarity scoring

**Depends on:** 7.2

### Goal

Add an optional semantic category that captures meaning the keyword
matchers miss.

### Requirements

- Implement the section 30 semantic similarity category behind an
  abstraction (an interface), so the provider is replaceable per
  Principle 5.
- Record the concrete provider, its cost, and its privacy implications in
  this plan's `state.md`. Resume text is sent to a third party — obtain
  explicit user consent first, and provide a deterministic fallback when
  consent is absent or the provider is unavailable.
- The fallback must be a real, documented strategy (e.g. reweight the
  deterministic categories), not a silent zero.
- Cache embeddings so repeated comparisons are not re-billed.
- Never let the provider output the final score — it contributes one
  weighted category and nothing more.

### Acceptance Criteria

- [ ] Semantic scoring sits behind a swappable interface
- [ ] A deterministic fallback exists and is used without consent or on
      provider failure
- [ ] Consent is requested before any resume text leaves the machine
- [ ] Embeddings are cached
- [ ] The provider contributes exactly one weighted category

### Out of Scope

- Fine-tuning embeddings on the user's own data.
- Multi-provider comparison tooling.

### Technical Notes

- This is the first plan where the project depends on an external AI
  provider. Principle 5 (replaceable providers) and Principle 4 (privacy)
  both apply — a provider chosen inline with `fetch` calls is a rewrite
  later.
- Provider failure must degrade to the deterministic score, never to a
  crash or a fabricated number.

### Relevant Files

- `job-agent/lib/matching/semantic/**`, `job-agent/lib/providers/**`

---

## Task 7.4 — Match score aggregation and explanation

**Depends on:** 7.2, 7.3

### Goal

Combine the category scores into one weighted, inspectable result.

### Requirements

- Aggregate using the weights from task 7.1 into a single score.
- Produce a full explanation object: total score, every category's
  sub-score, its weight, its weighted contribution, and its reasons.
- Return the explanation alongside the score from one function — never
  compute a score in one place and the breakdown in another.
- Round consistently and document the scale (0–100).
- Persist the score **with its explanation and the weight configuration
  used**, so a historical score stays interpretable after weights change.
- If any category is unavailable, the returned result must say which.

### Acceptance Criteria

- [ ] Total score equals the sum of the weighted contributions
- [ ] The explanation names every category, its weight, and its reasons
- [ ] The weight configuration used is stored with the score
- [ ] Unavailable categories are explicitly reported
- [ ] The scale and rounding rule are documented

### Out of Scope

- Storing historical scores for trend analysis.
- Comparing two jobs' scores.

### Technical Notes

- Storing the weights alongside the score is essential: a score whose
  inputs have drifted is worse than no score, because it looks authoritative.
- One function returns both score and explanation — two code paths will
  eventually disagree.

### Relevant Files

- `job-agent/lib/matching/aggregate.ts`, `job-agent/types/matching.ts`

---

## Task 7.5 — Match score UI

**Depends on:** 7.4

### Goal

Render the score and per-category breakdown as specified in section 31.

### Requirements

- Show the total score prominently, the per-category breakdown with
  sub-scores and weights, and the reasons behind each category.
- Label it explicitly as a **system-generated match estimate**. Never
  present it as a probability of receiving an offer, a percentage match
  to LinkedIn's own scoring, or a guarantee.
- Show which categories had no data instead of a confident number.
- State which inputs produced the score (which resume version, which job)
  and when.
- Offer a link to the underlying resume and job so the user can check the
  extraction.
- Responsive per `02-search-ui` task 2.7.

### Acceptance Criteria

- [ ] Match score and per-category breakdown render as in section 31
- [ ] The estimate is clearly labelled as system-generated, with no
      guarantee or offer-probability language anywhere
- [ ] Categories with no data are visibly marked
- [ ] The score names the resume version and job it came from
- [ ] The user can reach the source resume and job from the score view

### Out of Scope

- A historical score chart.
- Score-based ranking of many jobs.

### Technical Notes

- The labelling requirement is a hard rule from the original plan, not a
  style preference. Review copy for implied certainty before shipping.
- Render the explanation from the stored object; never recompute
  sub-scores in the component.

### Relevant Files

- `job-agent/app/**`, `job-agent/components/**`,
  `job-agent/types/matching.ts`
