/**
 * Search results page.
 *
 * Placeholder from 01-project-setup task 1.2, given the shared container in
 * task 1.5. The real results view arrives with 03-linkedin-search task 3.4.
 */
export default function JobsPage() {
  return (
    <main className="app-container flex flex-1 flex-col justify-center py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Search results</h1>
      <p className="mt-2 text-foreground/60">
        Nothing here yet. Results are built in{" "}
        <code className="font-mono text-[0.9em]">03-linkedin-search</code>.
      </p>
    </main>
  );
}
