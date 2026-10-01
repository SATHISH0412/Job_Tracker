"use client";

import { useState, useRef, useEffect } from "react";
import SearchFilters from "@/components/SearchFilters";
import {
  validateSearchFilters,
  type ValidationError,
  type ValidationField,
} from "@/lib/validation";
import {
  getErrorMessage,
  isSearchErrorCode,
  SEARCH_ERROR_CODES,
  type SearchErrorCode,
} from "@/lib/errors";
import type {
  JobSearchFilters,
  ExperienceLevel,
  WorkArrangement,
  JobType,
  DatePosted,
} from "@/types/job";

export const DEFAULT_FILTERS: JobSearchFilters = {
  keywords: "",
  location: "",
  experienceLevel: "Any",
  workArrangement: "Any",
  jobType: "Any",
  datePosted: "Any time",
};

export interface SearchFormProps {
  readonly initialFilters?: Partial<JobSearchFilters>;
  readonly onSearch?: (filters: JobSearchFilters) => void | Promise<void>;
  readonly isLoading?: boolean;
  readonly error?: SearchErrorCode | string | null;
  readonly onClearError?: () => void;
}

/**
 * Primary job search form.
 *
 * Implements the six search fields described in ORIGINAL_PLAN.md section 9:
 * Keywords, Location, Experience Level, Remote, Job Type, Date Posted.
 * Form state is fully controlled, validated via lib/validation.ts, displays
 * loading state with section 12 copy during flight, and handles errors per section 14.
 */
export default function SearchForm({
  initialFilters,
  onSearch,
  isLoading = false,
  error: externalError,
  onClearError,
}: SearchFormProps) {
  const [filters, setFilters] = useState<JobSearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [errors, setErrors] = useState<readonly ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalError, setInternalError] = useState<SearchErrorCode | null>(null);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loading = Boolean(isLoading || isSubmitting);
  const activeErrorCode = externalError ?? internalError;
  const activeErrorDetails = activeErrorCode ? getErrorMessage(activeErrorCode) : null;

  const getFieldError = (field: ValidationField): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  };

  const clearFieldError = (field: ValidationField) => {
    setErrors((prev) => prev.filter((err) => err.field !== field));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return; // Prevent duplicate submissions from rapid clicks

    const result = validateSearchFilters(filters);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    setInternalError(null);
    onClearError?.();

    if (!onSearch) return;

    try {
      setIsSubmitting(true);
      await onSearch(result.sanitizedFilters ?? filters);
      if (isMountedRef.current) {
        setInternalError(null);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        // Safe mapping - never log or render stack traces, keys, or credentials
        let code: SearchErrorCode = SEARCH_ERROR_CODES.SERVER_ERROR;
        if (
          err instanceof TypeError &&
          err.message.toLowerCase().includes("fetch")
        ) {
          code = SEARCH_ERROR_CODES.NETWORK_FAILURE;
        } else if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          isSearchErrorCode((err as { code: unknown }).code)
        ) {
          code = (err as { code: SearchErrorCode }).code;
        }
        setInternalError(code);
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError("keywords");
    setFilters((prev) => ({ ...prev, keywords: event.target.value }));
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError("keywords");
    clearFieldError("location");
    setFilters((prev) => ({ ...prev, location: event.target.value }));
  };

  const handleExperienceLevelChange = (experienceLevel: ExperienceLevel) => {
    clearFieldError("experienceLevel");
    setFilters((prev) => ({ ...prev, experienceLevel }));
  };

  const handleWorkArrangementChange = (workArrangement: WorkArrangement) => {
    clearFieldError("workArrangement");
    setFilters((prev) => ({ ...prev, workArrangement }));
  };

  const handleJobTypeChange = (jobType: JobType) => {
    clearFieldError("jobType");
    setFilters((prev) => ({ ...prev, jobType }));
  };

  const handleDatePostedChange = (datePosted: DatePosted) => {
    clearFieldError("datePosted");
    setFilters((prev) => ({ ...prev, datePosted }));
  };

  const keywordsError = getFieldError("keywords");
  const locationError = getFieldError("location");

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Section 14 Request Error Alert Region */}
      {activeErrorDetails && (
        <div
          role="alert"
          className="rounded-md border border-red-500/20 bg-red-500/5 p-4 text-sm text-foreground dark:bg-red-950/20"
        >
          <p className="font-semibold text-red-600 dark:text-red-400">
            {activeErrorDetails.title}
          </p>
          <p className="mt-1 text-xs text-foreground/80">
            {activeErrorDetails.message}
          </p>
        </div>
      )}

      {/* 1. Keywords */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="keywords"
          className="text-sm font-medium text-foreground"
        >
          Keywords <span className="text-foreground/60">(required)</span>
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          required
          disabled={loading}
          value={filters.keywords}
          aria-invalid={keywordsError ? "true" : undefined}
          aria-describedby={keywordsError ? "keywords-error" : undefined}
          onChange={handleKeywordsChange}
          placeholder="e.g. Software Engineer"
          className={`h-11 w-full rounded-md border bg-background px-3 text-base text-foreground sm:text-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            keywordsError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-foreground/20 focus:border-foreground focus:ring-foreground"
          }`}
        />
        {keywordsError && (
          <p
            id="keywords-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-400"
          >
            {keywordsError}
          </p>
        )}
      </div>

      {/* 2. Location */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="location"
          className="text-sm font-medium text-foreground"
        >
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          disabled={loading}
          value={filters.location}
          aria-invalid={locationError ? "true" : undefined}
          aria-describedby={locationError ? "location-error" : undefined}
          onChange={handleLocationChange}
          placeholder="e.g. Chennai, India, or Remote"
          className={`h-11 w-full rounded-md border bg-background px-3 text-base text-foreground sm:text-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            locationError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-foreground/20 focus:border-foreground focus:ring-foreground"
          }`}
        />
        {locationError && (
          <p
            id="location-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-400"
          >
            {locationError}
          </p>
        )}
      </div>

      {/* 3–6. Four select filters */}
      <SearchFilters
        experienceLevel={filters.experienceLevel}
        onExperienceLevelChange={handleExperienceLevelChange}
        workArrangement={filters.workArrangement}
        onWorkArrangementChange={handleWorkArrangementChange}
        jobType={filters.jobType}
        onJobTypeChange={handleJobTypeChange}
        datePosted={filters.datePosted}
        onDatePostedChange={handleDatePostedChange}
        disabled={loading}
        errors={{
          experienceLevel: getFieldError("experienceLevel"),
          workArrangement: getFieldError("workArrangement"),
          jobType: getFieldError("jobType"),
          datePosted: getFieldError("datePosted"),
        }}
      />

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading ? "true" : undefined}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching LinkedIn...</span>
            </>
          ) : (
            "Search Jobs"
          )}
        </button>
      </div>

      {/* Section 12 Loading UI Region */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-6 text-center"
        >
          <p className="text-base font-medium text-foreground">
            Searching LinkedIn...
          </p>
          <div className="flex items-center justify-center">
            <svg
              className="h-6 w-6 animate-spin motion-reduce:animate-none text-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-sm text-foreground/60">
            Preparing your search...
          </p>
        </div>
      )}
    </form>
  );
}
