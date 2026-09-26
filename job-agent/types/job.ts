/**
 * Single source of truth for job-search filter shapes and option lists.
 *
 * Every option array below is declared exactly once, and each filter type is
 * derived from its array, so a new option is a one-line addition here and is
 * picked up by every consumer automatically. Components, validation, and the
 * LinkedIn param builder import from this file — they never redeclare these
 * shapes or re-list these values.
 *
 * Option values come from `plans/ORIGINAL_PLAN.md` section 9.
 */

export const EXPERIENCE_LEVEL_OPTIONS = [
  "Any",
  "Internship",
  "Entry level",
  "Associate",
  "Mid-Senior",
  "Director",
  "Executive",
] as const;

export const WORK_ARRANGEMENT_OPTIONS = [
  "Any",
  "Remote",
  "Hybrid",
  "On-site",
] as const;

export const JOB_TYPE_OPTIONS = [
  "Any",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
] as const;

export const DATE_POSTED_OPTIONS = [
  "Any time",
  "Past 24 hours",
  "Past week",
  "Past month",
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVEL_OPTIONS)[number];
export type WorkArrangement = (typeof WORK_ARRANGEMENT_OPTIONS)[number];
export type JobType = (typeof JOB_TYPE_OPTIONS)[number];
export type DatePosted = (typeof DATE_POSTED_OPTIONS)[number];

export interface JobSearchFilters {
  readonly keywords: string;
  readonly location: string;
  readonly experienceLevel: ExperienceLevel;
  readonly workArrangement: WorkArrangement;
  readonly jobType: JobType;
  readonly datePosted: DatePosted;
}

/**
 * A single job record.
 *
 * V1 never retrieves these — it produces a LinkedIn search URL and lets the
 * user open LinkedIn. Every field is optional so the shape stays valid when
 * it is empty, and so later plans that do persist real records
 * (`05-job-persistence`, `06-resume-and-job-analysis`) can populate it
 * without reshaping this type.
 */
export interface Job {
  readonly id?: string;
  readonly title?: string;
  readonly company?: string;
  readonly location?: string;
  readonly url?: string;
  readonly postedAt?: string;
  readonly isRemote?: boolean;
}

/**
 * The outcome of one search.
 *
 * `searchUrl` is the honest minimum: it is always present. `jobs` is empty
 * whenever no records were retrieved, which is the normal V1 case. The UI
 * must read `searchUrl` as the primary result and must not imply that
 * `jobs` is a complete list of matches.
 */
export interface SearchResult {
  readonly searchUrl: string;
  readonly appliedFilters: JobSearchFilters;
  readonly jobs: readonly Job[];
}
