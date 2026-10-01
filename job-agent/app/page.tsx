"use client";

import SearchForm from "@/components/SearchForm";
import type { JobSearchFilters } from "@/types/job";

export default function Home() {
  const handleSearch = (filters: JobSearchFilters) => {
    // Search handler called with current filter values.
    // In 03-linkedin-search, this delegates to /api/linkedin/search.
    void filters;
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

        <SearchForm onSearch={handleSearch} />
      </div>
    </main>
  );
}
