export default function Home() {
  return (
    <main className="app-container flex flex-1 flex-col justify-center py-16">
      <h1 className="text-3xl font-semibold tracking-tight">JobFinder</h1>
      <p className="mt-2 text-foreground/60">
        Private LinkedIn job search. The search form arrives in{" "}
        <code className="font-mono text-[0.9em]">02-search-ui</code>.
      </p>
    </main>
  );
}
