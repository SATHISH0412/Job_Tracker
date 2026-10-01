"use client";

import { useState } from "react";
import SearchFilters from "@/components/SearchFilters";
import {
  validateSearchFilters,
  type ValidationError,
  type ValidationField,
} from "@/lib/validation";
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
}

/**
 * Primary job search form.
 *
 * Implements the six search fields described in ORIGINAL_PLAN.md section 9:
 * Keywords, Location, Experience Level, Remote, Job Type, Date Posted.
 * Form state is fully controlled and validated via lib/validation.ts.
 */
export default function SearchForm({
  initialFilters,
  onSearch,
  isLoading = false,
}: SearchFormProps) {
  const [filters, setFilters] = useState<JobSearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [errors, setErrors] = useState<readonly ValidationError[]>([]);

  const getFieldError = (field: ValidationField): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  };

  const clearFieldError = (field: ValidationField) => {
    setErrors((prev) => prev.filter((err) => err.field !== field));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateSearchFilters(filters);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    onSearch?.(result.sanitizedFilters ?? filters);
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
          disabled={isLoading}
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
          disabled={isLoading}
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
        disabled={isLoading}
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
          disabled={isLoading}
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Search Jobs
        </button>
      </div>
    </form>
  );
}
