"use client";

import type { SearchResult } from "@/types/job";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";

export interface JobResultsProps {
  readonly result?: SearchResult | null;
  readonly onSearchAgain?: () => void;
  readonly isLoading?: boolean;
}

/**
 * Results container displaying search outcome.
 *
 * Implements ORIGINAL_PLAN.md section 11 & 13 and Plan 03 tasks 3.4 & 3.5.
 * Honesty rule: In V1, no individual job records are retrieved; the UI clearly
 * states that a verified LinkedIn search URL has been generated and provides
 * a "Search LinkedIn" action, along with a "Search Again" control to edit filters.
 */
export default function JobResults({
  result,
  onSearchAgain,
  isLoading = false,
}: JobResultsProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-slate-200 bg-white"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4" />
        <p className="text-base font-medium text-slate-900">Searching LinkedIn...</p>
        <p className="text-sm text-slate-500 mt-1">Preparing your search...</p>
      </div>
    );
  }

  if (!result || (!result.searchUrl && (!result.jobs || result.jobs.length === 0))) {
    return (
      <EmptyState
        type="no-results"
        onModifyFilters={onSearchAgain}
      />
    );
  }

  const hasRecords = Array.isArray(result.jobs) && result.jobs.length > 0;
  const { appliedFilters, searchUrl } = result;

  return (
    <section aria-label="Search Results" className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {hasRecords ? "Job Matches" : "LinkedIn Search Ready"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {hasRecords
              ? `Showing ${result.jobs.length} retrieved position${result.jobs.length === 1 ? "" : "s"}.`
              : "A direct LinkedIn search URL has been prepared with your filters."}
          </p>
        </div>

        {onSearchAgain && (
          <button
            type="button"
            onClick={onSearchAgain}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ← Search Again
          </button>
        )}
      </div>

      {/* Applied Filters Summary */}
      {appliedFilters && (
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Applied Filters:
          </span>
          <div className="flex flex-wrap gap-2 text-xs text-slate-700">
            {appliedFilters.keywords && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Keywords:</span> {appliedFilters.keywords}
              </span>
            )}
            {appliedFilters.location && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Location:</span> {appliedFilters.location}
              </span>
            )}
            {appliedFilters.experienceLevel && appliedFilters.experienceLevel !== "Any" && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Experience:</span> {appliedFilters.experienceLevel}
              </span>
            )}
            {appliedFilters.workArrangement && appliedFilters.workArrangement !== "Any" && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Arrangement:</span> {appliedFilters.workArrangement}
              </span>
            )}
            {appliedFilters.jobType && appliedFilters.jobType !== "Any" && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Type:</span> {appliedFilters.jobType}
              </span>
            )}
            {appliedFilters.datePosted && appliedFilters.datePosted !== "Any time" && (
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                <span className="font-medium text-slate-500">Date Posted:</span> {appliedFilters.datePosted}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Content */}
      {hasRecords ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.jobs.map((job, idx) => (
            <JobCard
              key={job.id ?? `job-${idx}`}
              job={job}
              searchUrl={searchUrl}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Honest V1 Search Card */}
          <JobCard
            isSearchCard={true}
            searchUrl={searchUrl}
            title={appliedFilters?.keywords || "LinkedIn Search"}
            location={appliedFilters?.location}
            workArrangement={appliedFilters?.workArrangement}
            jobType={appliedFilters?.jobType}
            experienceLevel={appliedFilters?.experienceLevel}
          />

          <p className="text-xs text-slate-500 italic text-center">
            Note: This application prepares verified LinkedIn searches and does not scrape or store private job listings.
          </p>
        </div>
      )}
    </section>
  );
}
