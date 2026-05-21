import { cookies } from "next/headers";

export const COOKIE_NAME = "aso_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  partnerId: string;
  partnerName: string;
}

/** Encode session payload to a base64 string for the cookie */
export function encodeSession(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/** Decode and return the session payload from the cookie (server-side only) */
export function getSession(): SessionPayload | null {
  try {
    const cookie = cookies().get(COOKIE_NAME);
    if (!cookie?.value) return null;
    const decoded = Buffer.from(cookie.value, "base64").toString("utf-8");
    const payload = JSON.parse(decoded) as SessionPayload;
    if (!payload.partnerId || !payload.partnerName) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Decode session from a raw cookie string (for middleware / route handlers) */
export function decodeSessionValue(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf-8");
    const payload = JSON.parse(decoded) as SessionPayload;
    if (!payload.partnerId || !payload.partnerName) return null;
    return payload;
  } catch {
    return null;
  }
}
