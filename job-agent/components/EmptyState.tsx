export type EmptyStateType = "no-results" | "linkedin-handoff";

export interface EmptyStateProps {
  readonly type?: EmptyStateType;
  readonly searchUrl?: string;
  readonly onModifyFilters?: () => void;
}

/**
 * Empty state component implementing ORIGINAL_PLAN.md section 13.
 *
 * Visibly distinguishes two conditions:
 * 1. "no-results": When zero records match the criteria, renders section 13 copy verbatim:
 *    "No jobs found", "Try changing:", and the four filter bullets.
 * 2. "linkedin-handoff": When a search URL is generated (standard V1 behavior),
 *    plainly explains that the search will open on LinkedIn without falsely implying
 *    individual job records were fetched or stored locally.
 */
export default function EmptyState({
  type = "no-results",
  searchUrl,
  onModifyFilters,
}: EmptyStateProps) {
  if (type === "linkedin-handoff") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-foreground/15 bg-background p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-foreground/70">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          Search LinkedIn
        </h3>

        <p className="mt-2 max-w-md text-sm text-foreground/70">
          Your LinkedIn search URL has been prepared. This application does not
          retrieve or store individual job records — your search will open directly
          on LinkedIn in a new tab.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {searchUrl && (
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              Open on LinkedIn
            </a>
          )}

          {onModifyFilters && (
            <button
              type="button"
              onClick={onModifyFilters}
              className="inline-flex h-11 items-center justify-center rounded-md border border-foreground/20 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              Modify filters
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default "no-results" empty state with verbatim section 13 copy
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-foreground/15 bg-background p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-foreground/70">
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        No jobs found
      </h3>

      <div className="mt-4 text-left">
        <p className="text-sm font-medium text-foreground/80">Try changing:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/70">
          <li>keywords</li>
          <li>location</li>
          <li>experience level</li>
          <li>date posted</li>
        </ul>
      </div>

      {onModifyFilters && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onModifyFilters}
            className="inline-flex h-11 items-center justify-center rounded-md border border-foreground/20 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Modify filters
          </button>
        </div>
      )}
    </div>
  );
}
