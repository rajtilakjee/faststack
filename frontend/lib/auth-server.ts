import { cookies } from "next/headers";

import { getServerBackendUrl } from "@/lib/backend-url";

import type { UserPublic } from "@/lib/auth";

export async function getCurrentUserServer(): Promise<UserPublic | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${getServerBackendUrl()}/api/v1/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as UserPublic;
  } catch {
    return null;
  }
}
