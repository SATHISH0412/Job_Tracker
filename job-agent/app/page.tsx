export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">JobFinder</h1>
      <p className="mt-2 text-zinc-600">
        Private LinkedIn job search. The search form arrives in{" "}
        <code className="font-mono text-[0.9em]">02-search-ui</code>.
      </p>
    </main>
  );
}
