import { NextRequest, NextResponse } from "next/server";

import { getServerBackendUrl } from "@/lib/backend-url";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await context.params;
  const target = new URL(`${getServerBackendUrl()}/${path.join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "host" || HOP_BY_HOP.has(lower)) {
      return;
    }
    headers.set(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const backendResponse = await fetch(target, init);
  const responseHeaders = new Headers();

  backendResponse.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) {
      return;
    }
    responseHeaders.append(key, value);
  });

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
