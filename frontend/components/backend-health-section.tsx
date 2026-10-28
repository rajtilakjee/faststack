import { Suspense } from "react";

import { fetchBackendHealth } from "@/lib/api";

import { BackendHealth } from "./backend-health";

async function BackendHealthLoader() {
  const health = await fetchBackendHealth();
  return <BackendHealth health={health} />;
}

export function BackendHealthSection() {
  return (
    <Suspense
      fallback={
        <BackendHealth health={null} loading />
      }
    >
      <BackendHealthLoader />
    </Suspense>
  );
}
