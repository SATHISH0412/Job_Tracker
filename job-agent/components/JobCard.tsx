import type { Job } from "@/types/job";

export interface JobCardProps {
  readonly job?: Job;
  readonly searchUrl?: string;
  readonly title?: string;
  readonly company?: string;
  readonly location?: string;
  readonly workArrangement?: string;
  readonly jobType?: string;
  readonly experienceLevel?: string;
  readonly postedAt?: string;
  readonly isSearchCard?: boolean;
}

/**
 * Validates that an outgoing URL belongs strictly to LinkedIn before rendering.
 * Prevents malicious or unparseable URLs from reaching the href attribute.
 */
function isValidLinkedInUrl(urlString?: string): boolean {
  if (!urlString || typeof urlString !== "string") return false;
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "www.linkedin.com" &&
      parsed.pathname.startsWith("/jobs/")
    );
  } catch {
    return false;
  }
}

/**
 * Compact card rendering a job opportunity or ready-to-search LinkedIn action.
 *
 * Implements ORIGINAL_PLAN.md section 11 and Plan 03 tasks 3.4 & 3.5.
 * Honesty rule: missing fields are omitted, never defaulted to placeholder/invented data.
 * When only a search URL is available, action is labeled "Search LinkedIn".
 */
export default function JobCard({
  job,
  searchUrl,
  title: overrideTitle,
  company: overrideCompany,
  location: overrideLocation,
  workArrangement,
  jobType,
  experienceLevel,
  postedAt: overridePostedAt,
  isSearchCard = false,
}: JobCardProps) {
  const title = overrideTitle ?? job?.title;
  const company = overrideCompany ?? job?.company;
  const location = overrideLocation ?? job?.location;
  const postedAt = overridePostedAt ?? job?.postedAt;
  const targetUrl = searchUrl ?? job?.url;

  const hasTargetUrl = isValidLinkedInUrl(targetUrl);
  const actionLabel = isSearchCard || !job?.url ? "Search LinkedIn" : "Open on LinkedIn";

  // Location and arrangement line
  const locationParts: string[] = [];
  if (location && location.trim().length > 0) {
    locationParts.push(location.trim());
  }
  if (workArrangement && workArrangement !== "Any") {
    locationParts.push(workArrangement);
  } else if (job?.isRemote) {
    locationParts.push("Remote");
  }

  // Type and experience line
  const detailParts: string[] = [];
  if (jobType && jobType !== "Any") {
    detailParts.push(jobType);
  }
  if (experienceLevel && experienceLevel !== "Any") {
    detailParts.push(experienceLevel);
  }

  return (
    <article
      data-testid="job-card"
      className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left"
    >
      <div className="space-y-3">
        {/* Title & Company */}
        <div>
          {title ? (
            <h3 className="text-lg font-semibold text-slate-900 leading-snug">
              {title}
            </h3>
          ) : (
            <h3 className="text-lg font-semibold text-slate-900 leading-snug">
              LinkedIn Job Search
            </h3>
          )}

          {company && (
            <p className="text-sm font-medium text-slate-600 mt-0.5">{company}</p>
          )}
        </div>

        {/* Location & Work Arrangement */}
        {locationParts.length > 0 && (
          <p className="text-sm text-slate-500">
            {locationParts.join(" · ")}
          </p>
        )}

        {/* Job Type & Experience Level */}
        {detailParts.length > 0 && (
          <p className="text-xs font-medium text-slate-600 bg-slate-50 inline-block px-2.5 py-1 rounded border border-slate-100">
            {detailParts.join(" · ")}
          </p>
        )}

        {/* Recency line */}
        {postedAt && (
          <p className="text-xs text-slate-400">
            Posted {postedAt}
          </p>
        )}
      </div>

      {/* Action button */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        {hasTargetUrl && targetUrl ? (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${actionLabel} in a new tab`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>{actionLabel}</span>
            <svg
              className="w-4 h-4 text-blue-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          <span
            className="inline-flex items-center px-3 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded"
            role="status"
          >
            Invalid or missing LinkedIn URL
          </span>
        )}
      </div>
    </article>
  );
}
