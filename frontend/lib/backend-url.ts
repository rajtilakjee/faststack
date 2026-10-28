/** Direct FastAPI URL for server-side fetches (SSR, build). */
export function getServerBackendUrl(): string {
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000"
  );
}

/** Same-origin proxy so HttpOnly session cookies work in the browser. */
export function getBrowserApiBaseUrl(): string {
  return "/backend-api";
}
