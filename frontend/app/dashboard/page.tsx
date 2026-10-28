import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUserServer } from "@/lib/auth-server";

function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <p className="text-zinc-500">Loading dashboard…</p>
    </div>
  );
}

async function DashboardContent() {
  const user = await getCurrentUserServer();
  if (user === null) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Protected page
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          You are signed in. This route redirects anonymous visitors to the login
          page.
        </p>
      </div>
      <dl className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-zinc-500">Email</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Role</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{user.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">User ID</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{user.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Active</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
              {user.is_active ? "Yes" : "No"}
            </dd>
          </div>
        </div>
      </dl>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
      >
        ← Back to home
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
