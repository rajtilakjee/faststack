"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";

export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          FastStack
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {loading ? (
            <span className="text-zinc-500">Loading…</span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Dashboard
              </Link>
              <span className="hidden text-zinc-500 sm:inline">{user.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
