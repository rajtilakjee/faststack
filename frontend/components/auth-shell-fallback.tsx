export function AuthShellFallback({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-zinc-200 bg-white/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-5xl text-sm text-zinc-500">Loading…</div>
      </header>
      {children}
    </>
  );
}
