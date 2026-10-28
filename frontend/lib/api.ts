import { getServerBackendUrl } from "@/lib/backend-url";

export type HealthResponse = {
  status: string;
  service: string;
};

export async function fetchBackendHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${getServerBackendUrl()}/api/v1/health`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as HealthResponse;
  } catch {
    return null;
  }
}
