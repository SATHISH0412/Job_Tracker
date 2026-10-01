import {
  EXPERIENCE_LEVEL_OPTIONS,
  WORK_ARRANGEMENT_OPTIONS,
  JOB_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  type JobSearchFilters,
  type ExperienceLevel,
  type WorkArrangement,
  type JobType,
  type DatePosted,
} from "@/types/job";

export const VALIDATION_MESSAGES = {
  EMPTY_SEARCH: "Please enter a job title or keyword.",
  INVALID_EXPERIENCE_LEVEL: "Invalid experience level selected.",
  INVALID_WORK_ARRANGEMENT: "Invalid work arrangement selected.",
  INVALID_JOB_TYPE: "Invalid job type selected.",
  INVALID_DATE_POSTED: "Invalid date posted filter selected.",
} as const;

export type ValidationField = keyof JobSearchFilters;

export interface ValidationError {
  readonly field: ValidationField;
  readonly message: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly sanitizedFilters?: JobSearchFilters;
}

/**
 * Validates search filters according to ORIGINAL_PLAN.md section 10.
 *
 * Rules:
 * 1. Trim whitespace from text inputs.
 * 2. Reject completely empty searches (both keywords and location empty after trimming).
 * 3. Validate that select values belong to known option lists.
 *
 * Framework-free pure function with no React or DOM imports, reusable on client and server.
 */
export function validateSearchFilters(
  filters: Partial<JobSearchFilters> | null | undefined
): ValidationResult {
  const errors: ValidationError[] = [];

  const rawKeywords = filters?.keywords ?? "";
  const rawLocation = filters?.location ?? "";
  const keywords = typeof rawKeywords === "string" ? rawKeywords.trim() : "";
  const location = typeof rawLocation === "string" ? rawLocation.trim() : "";

  // Reject completely empty searches: at least keywords or location must be non-empty.
  if (keywords.length === 0 && location.length === 0) {
    errors.push({
      field: "keywords",
      message: VALIDATION_MESSAGES.EMPTY_SEARCH,
    });
  }

  // Validate known option lists
  const experienceLevel = filters?.experienceLevel ?? "Any";
  if (
    !EXPERIENCE_LEVEL_OPTIONS.includes(
      experienceLevel as (typeof EXPERIENCE_LEVEL_OPTIONS)[number]
    )
  ) {
    errors.push({
      field: "experienceLevel",
      message: VALIDATION_MESSAGES.INVALID_EXPERIENCE_LEVEL,
    });
  }

  const workArrangement = filters?.workArrangement ?? "Any";
  if (
    !WORK_ARRANGEMENT_OPTIONS.includes(
      workArrangement as (typeof WORK_ARRANGEMENT_OPTIONS)[number]
    )
  ) {
    errors.push({
      field: "workArrangement",
      message: VALIDATION_MESSAGES.INVALID_WORK_ARRANGEMENT,
    });
  }

  const jobType = filters?.jobType ?? "Any";
  if (!JOB_TYPE_OPTIONS.includes(jobType as (typeof JOB_TYPE_OPTIONS)[number])) {
    errors.push({
      field: "jobType",
      message: VALIDATION_MESSAGES.INVALID_JOB_TYPE,
    });
  }

  const datePosted = filters?.datePosted ?? "Any time";
  if (
    !DATE_POSTED_OPTIONS.includes(
      datePosted as (typeof DATE_POSTED_OPTIONS)[number]
    )
  ) {
    errors.push({
      field: "datePosted",
      message: VALIDATION_MESSAGES.INVALID_DATE_POSTED,
    });
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedFilters: {
      keywords,
      location,
      experienceLevel: experienceLevel as ExperienceLevel,
      workArrangement: workArrangement as WorkArrangement,
      jobType: jobType as JobType,
      datePosted: datePosted as DatePosted,
    },
  };
}
