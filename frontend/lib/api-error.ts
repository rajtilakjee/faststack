export function formatApiError(body: unknown, fallback = "Something went wrong"): string {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const detail = (body as { detail?: unknown }).detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return null;
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return fallback;
}
