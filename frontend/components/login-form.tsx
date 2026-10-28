"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthFormCard } from "@/components/auth-form-card";
import { useAuth } from "@/components/auth-provider";
import { AuthRequestError, loginClient } from "@/lib/auth";
import { validateAuthForm } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateAuthForm({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const user = await loginClient(email.trim(), password);
      setUser(user);
      const next = searchParams.get("next") ?? "/dashboard";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof AuthRequestError ? err.message : "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormCard
      title="Log in"
      description="Access your account with the email and password you registered."
      footer={
        <>
          No account yet?{" "}
          <Link href="/register" className="font-medium text-zinc-900 dark:text-zinc-100">
            Register
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthFormCard>
  );
}
