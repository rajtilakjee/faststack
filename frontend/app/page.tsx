import { BackendHealthSection } from "@/components/backend-health-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <header className="max-w-3xl text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Starter template
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          FastStack
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          FastAPI + uv backend and Next.js frontend with versioned routes,
          environment-based configuration, and a live health check.
        </p>
      </header>
      <BackendHealthSection />
    </div>
  );
}
