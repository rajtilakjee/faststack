export type HealthResponse = {
  status: string;
  service: string;
};

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

export async function fetchBackendHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/health`, {
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
