import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";
import { getCurrentUserServer } from "@/lib/auth-server";

async function LoginPageContent() {
  const user = await getCurrentUserServer();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-zinc-500">Loading form…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <p className="text-zinc-500">Loading…</p>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
