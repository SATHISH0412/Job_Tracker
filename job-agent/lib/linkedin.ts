import type {
  JobSearchFilters,
  ExperienceLevel,
  WorkArrangement,
  JobType,
  DatePosted,
} from "@/types/job";

export const LINKEDIN_BASE_URL = "https://www.linkedin.com/jobs/search/";

export const PARAM_NAMES = {
  KEYWORDS: "keywords",
  LOCATION: "location",
  EXPERIENCE: "f_E",
  WORK_ARRANGEMENT: "f_WT",
  JOB_TYPE: "f_JT",
  DATE_POSTED: "f_TPR",
} as const;

/**
 * Verified LinkedIn query parameter values.
 *
 * Source URL references:
 * - Experience level: https://www.linkedin.com/jobs/search/?f_E=1%2C2%2C3%2C4%2C5%2C6
 * - Work arrangement: https://www.linkedin.com/jobs/search/?f_WT=1%2C2%2C3
 * - Job type: https://www.linkedin.com/jobs/search/?f_JT=C%2CP%2CJ%2CI%2CT
 * - Date posted: https://www.linkedin.com/jobs/search/?f_TPR=r86400 (or r604800, r2592000)
 */
export const EXPERIENCE_MAPPINGS: Readonly<Record<Exclude<ExperienceLevel, "Any">, string>> = {
  // Verified: https://www.linkedin.com/jobs/search/?f_E=1
  Internship: "1",
  // Verified: https://www.linkedin.com/jobs/search/?f_E=2
  "Entry level": "2",
  // Verified: https://www.linkedin.com/jobs/search/?f_E=3
  Associate: "3",
  // Verified: https://www.linkedin.com/jobs/search/?f_E=4
  "Mid-Senior": "4",
  // Verified: https://www.linkedin.com/jobs/search/?f_E=5
  Director: "5",
  // Verified: https://www.linkedin.com/jobs/search/?f_E=6
  Executive: "6",
};

export const WORK_ARRANGEMENT_MAPPINGS: Readonly<Record<Exclude<WorkArrangement, "Any">, string>> = {
  // Verified: https://www.linkedin.com/jobs/search/?f_WT=1
  "On-site": "1",
  // Verified: https://www.linkedin.com/jobs/search/?f_WT=2
  Remote: "2",
  // Verified: https://www.linkedin.com/jobs/search/?f_WT=3
  Hybrid: "3",
};

export const JOB_TYPE_MAPPINGS: Readonly<Record<Exclude<JobType, "Any">, string>> = {
  // Verified: https://www.linkedin.com/jobs/search/?f_JT=C
  "Full-time": "C",
  // Verified: https://www.linkedin.com/jobs/search/?f_JT=P
  "Part-time": "P",
  // Verified: https://www.linkedin.com/jobs/search/?f_JT=J
  Contract: "J",
  // Verified: https://www.linkedin.com/jobs/search/?f_JT=I
  Internship: "I",
  // Verified: https://www.linkedin.com/jobs/search/?f_JT=T
  Temporary: "T",
};

export const DATE_POSTED_MAPPINGS: Readonly<Record<Exclude<DatePosted, "Any time">, string>> = {
  // Verified: https://www.linkedin.com/jobs/search/?f_TPR=r86400
  "Past 24 hours": "r86400",
  // Verified: https://www.linkedin.com/jobs/search/?f_TPR=r604800
  "Past week": "r604800",
  // Verified: https://www.linkedin.com/jobs/search/?f_TPR=r2592000
  "Past month": "r2592000",
};

export class InvalidFilterValueError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid filter value for "${field}": ${String(value)}`);
    this.name = "InvalidFilterValueError";
  }
}

export class MalformedLinkedInUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MalformedLinkedInUrlError";
  }
}

const CONTROL_CHAR_REGEX = /[\x00-\x1F\x7F]/;

/**
 * Validates text input to ensure no control characters or newlines are present.
 */
function sanitizeTextInput(field: string, text: string): string {
  const trimmed = text.trim();
  if (CONTROL_CHAR_REGEX.test(trimmed)) {
    throw new InvalidFilterValueError(
      field,
      "Input contains invalid control characters or newlines"
    );
  }
  return trimmed;
}

/**
 * Pure parameter builder turning validated JobSearchFilters into LinkedIn query parameters.
 * Omit parameters for "Any" / "Any time" options rather than sending empty strings or 0.
 *
 * Implements ORIGINAL_PLAN.md section 5.
 */
export function buildLinkedInSearchParams(
  filters: JobSearchFilters
): Record<string, string> {
  const params: Record<string, string> = {};

  // 1. Keywords
  if (typeof filters.keywords === "string") {
    const keywords = sanitizeTextInput("keywords", filters.keywords);
    if (keywords.length > 0) {
      params[PARAM_NAMES.KEYWORDS] = keywords;
    }
  }

  // 2. Location
  if (typeof filters.location === "string") {
    const location = sanitizeTextInput("location", filters.location);
    if (location.length > 0) {
      params[PARAM_NAMES.LOCATION] = location;
    }
  }

  // 3. Experience level
  if (filters.experienceLevel && filters.experienceLevel !== "Any") {
    const mapped = EXPERIENCE_MAPPINGS[filters.experienceLevel];
    if (!mapped) {
      throw new InvalidFilterValueError("experienceLevel", filters.experienceLevel);
    }
    params[PARAM_NAMES.EXPERIENCE] = mapped;
  }

  // 4. Work arrangement
  if (filters.workArrangement && filters.workArrangement !== "Any") {
    const mapped = WORK_ARRANGEMENT_MAPPINGS[filters.workArrangement];
    if (!mapped) {
      throw new InvalidFilterValueError("workArrangement", filters.workArrangement);
    }
    params[PARAM_NAMES.WORK_ARRANGEMENT] = mapped;
  }

  // 5. Job type
  if (filters.jobType && filters.jobType !== "Any") {
    const mapped = JOB_TYPE_MAPPINGS[filters.jobType];
    if (!mapped) {
      throw new InvalidFilterValueError("jobType", filters.jobType);
    }
    params[PARAM_NAMES.JOB_TYPE] = mapped;
  }

  // 6. Date posted
  if (filters.datePosted && filters.datePosted !== "Any time") {
    const mapped = DATE_POSTED_MAPPINGS[filters.datePosted];
    if (!mapped) {
      throw new InvalidFilterValueError("datePosted", filters.datePosted);
    }
    params[PARAM_NAMES.DATE_POSTED] = mapped;
  }

  return params;
}

/**
 * Pure URL builder assembling the validated parameter record into a safe,
 * deterministically ordered LinkedIn search URL.
 *
 * Implements ORIGINAL_PLAN.md sections 10 & 15 ("URL safety").
 */
export function buildLinkedInSearchUrl(params: Record<string, string>): string {
  const url = new URL(LINKEDIN_BASE_URL);

  // Sort parameter keys alphabetically for deterministic ordering
  const sortedKeys = Object.keys(params).sort();
  for (const key of sortedKeys) {
    const value = params[key];
    if (typeof value === "string" && value.length > 0) {
      url.searchParams.set(key, value);
    }
  }

  const resultUrl = url.toString();

  // Safety assertions: origin must be exactly https://www.linkedin.com and pathname /jobs/search/
  try {
    const parsed = new URL(resultUrl);
    if (parsed.origin !== "https://www.linkedin.com") {
      throw new MalformedLinkedInUrlError(
        `Safety violation: unexpected URL origin "${parsed.origin}"`
      );
    }
    if (parsed.pathname !== "/jobs/search/") {
      throw new MalformedLinkedInUrlError(
        `Safety violation: unexpected URL pathname "${parsed.pathname}"`
      );
    }
  } catch (err: unknown) {
    if (err instanceof MalformedLinkedInUrlError) {
      throw err;
    }
    throw new MalformedLinkedInUrlError(
      `Failed to parse generated URL: ${String(err)}`
    );
  }

  return resultUrl;
}
