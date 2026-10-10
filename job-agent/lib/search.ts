import { validateSearchFilters } from "@/lib/validation";
import {
  buildLinkedInSearchParams,
  buildLinkedInSearchUrl,
  InvalidFilterValueError,
  MalformedLinkedInUrlError,
} from "@/lib/linkedin";
import {
  SEARCH_ERROR_CODES,
  getErrorMessage,
  type SearchErrorCode,
} from "@/lib/errors";
import type { JobSearchFilters, SearchResult } from "@/types/job";

/**
 * Structured search error carrying a stable application error code.
 */
export class SearchError extends Error {
  readonly code: SearchErrorCode;

  constructor(code: SearchErrorCode, message?: string) {
    super(message ?? getErrorMessage(code).message);
    this.name = "SearchError";
    this.code = code;
  }
}

/**
 * Orchestrates one search: validate input → build params → assemble safe URL.
 *
 * Plain TypeScript module containing no Next.js- or DOM-specific imports,
 * allowing isolated unit testing and clean reuse.
 *
 * Implements ORIGINAL_PLAN.md section 6 and Plan 03 task 3.3.
 */
export function runSearch(rawInput: unknown): SearchResult {
  // 1. Ensure input is an object
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput)) {
    throw new SearchError(
      SEARCH_ERROR_CODES.INVALID_INPUT,
      "Request body must be a valid JSON object."
    );
  }

  // 2. Validate and sanitize server-side using shared validation rules
  const validation = validateSearchFilters(rawInput as Partial<JobSearchFilters>);
  if (!validation.isValid || !validation.sanitizedFilters) {
    const primaryMessage =
      validation.errors[0]?.message ??
      getErrorMessage(SEARCH_ERROR_CODES.INVALID_INPUT).message;
    throw new SearchError(SEARCH_ERROR_CODES.INVALID_INPUT, primaryMessage);
  }

  try {
    // 3. Map sanitized filters to LinkedIn query parameters
    const searchParams = buildLinkedInSearchParams(validation.sanitizedFilters);

    // 4. Safely assemble the deterministic LinkedIn search URL
    const searchUrl = buildLinkedInSearchUrl(searchParams);

    // 5. Return structured result (V1 provides search URL with empty jobs list)
    return {
      searchUrl,
      appliedFilters: validation.sanitizedFilters,
      jobs: [],
    };
  } catch (err: unknown) {
    if (err instanceof InvalidFilterValueError) {
      throw new SearchError(SEARCH_ERROR_CODES.UNSUPPORTED_FILTER, err.message);
    }
    if (err instanceof MalformedLinkedInUrlError) {
      throw new SearchError(SEARCH_ERROR_CODES.INVALID_INPUT, err.message);
    }
    if (err instanceof SearchError) {
      throw err;
    }
    throw new SearchError(SEARCH_ERROR_CODES.SERVER_ERROR);
  }
}
