import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RegisterForm } from "@/components/register-form";
import { getCurrentUserServer } from "@/lib/auth-server";

async function RegisterPageContent() {
  const user = await getCurrentUserServer();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <RegisterForm />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <p className="text-zinc-500">Loading…</p>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
