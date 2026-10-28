import { formatApiError } from "@/lib/api-error";
import { getBrowserApiBaseUrl } from "@/lib/backend-url";

export type UserPublic = {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
};

export class AuthRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthRequestError";
  }
}

function apiPath(path: string): string {
  return `${getBrowserApiBaseUrl()}${path}`;
}

async function parseAuthResponse(response: Response): Promise<UserPublic> {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthRequestError(formatApiError(body, "Request failed"));
  }

  return body as UserPublic;
}

export async function fetchCurrentUserClient(): Promise<UserPublic | null> {
  const response = await fetch(apiPath("/api/v1/auth/me"), {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new AuthRequestError(formatApiError(await response.json().catch(() => null)));
  }

  return (await response.json()) as UserPublic;
}

export async function loginClient(
  email: string,
  password: string,
): Promise<UserPublic> {
  const response = await fetch(apiPath("/api/v1/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResponse(response);
}

export async function registerClient(
  email: string,
  password: string,
): Promise<UserPublic> {
  const response = await fetch(apiPath("/api/v1/auth/register"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResponse(response);
}

export async function logoutClient(): Promise<void> {
  const response = await fetch(apiPath("/api/v1/auth/logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 204) {
    throw new AuthRequestError(
      formatApiError(await response.json().catch(() => null), "Logout failed"),
    );
  }
}
