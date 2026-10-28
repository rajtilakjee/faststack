import type { HealthResponse } from "@/lib/api";

type BackendHealthProps = {
  health: HealthResponse | null;
  loading?: boolean;
};

export function BackendHealth({ health, loading = false }: BackendHealthProps) {
  const isHealthy = health?.status === "ok";
  const statusLabel = loading ? "Checking…" : isHealthy ? "Connected" : "Unavailable";
  const indicatorClass = loading
    ? "bg-amber-400 animate-pulse"
    : isHealthy
      ? "bg-emerald-500"
      : "bg-red-500";

  return (
    <section
      className="w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      aria-live="polite"
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Backend health
      </h2>
      <div className="mt-3 flex items-center gap-3">
        <span
          className={`inline-block h-3 w-3 rounded-full ${indicatorClass}`}
          aria-hidden
        />
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {statusLabel}
        </p>
      </div>
      {loading ? null : health ? (
        <p className="mt-2 font-mono text-sm text-zinc-600 dark:text-zinc-400">
          {health.service} — status: {health.status}
        </p>
      ) : (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Start the API with{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-900">
            uv run fastapi dev app/main.py
          </code>{" "}
          in <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-900">backend/</code>.
        </p>
      )}
    </section>
  );
}
