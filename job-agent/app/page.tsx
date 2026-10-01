"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import JobResults from "@/components/JobResults";
import type { JobSearchFilters, SearchResult } from "@/types/job";
import type { SearchErrorCode } from "@/lib/errors";

export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [activeFilters, setActiveFilters] = useState<JobSearchFilters | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SearchErrorCode | null>(null);

  const handleSearch = async (filters: JobSearchFilters) => {
    setIsLoading(true);
    setError(null);
    setActiveFilters(filters);

    try {
      const response = await fetch("/api/linkedin/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const code: SearchErrorCode = errorData?.code ?? "SERVER_ERROR";
        setError(code);
        return;
      }

      const searchResult: SearchResult = await response.json();
      setResult(searchResult);
    } catch {
      setError("NETWORK_FAILURE");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="app-container py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Search LinkedIn Jobs
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Find jobs on LinkedIn matching your exact criteria.
          </p>
        </header>

        {result ? (
          <JobResults
            result={result}
            onSearchAgain={handleSearchAgain}
            isLoading={isLoading}
          />
        ) : (
          <SearchForm
            initialFilters={activeFilters}
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
            onClearError={() => setError(null)}
          />
        )}
      </div>
    </main>
  );
}
