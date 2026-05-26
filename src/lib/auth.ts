import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE = "mw_refund_auth";

function envPassword(): string {
  const pw = process.env.INTERNAL_APP_PASSWORD;
  if (!pw || pw.length === 0) {
    throw new Error(
      "INTERNAL_APP_PASSWORD is not set. Add it to your environment variables.",
    );
  }
  return pw;
}

export function hashPassword(pw: string): string {
  return createHash("sha256").update(pw).digest("hex");
}

export function expectedToken(): string {
  return hashPassword(envPassword());
}

export function tokensMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  let cookieValue: string | undefined;
  try {
    const jar = await cookies();
    cookieValue = jar.get(AUTH_COOKIE)?.value;
  } catch {
    return false;
  }
  if (!cookieValue) return false;
  try {
    return tokensMatch(cookieValue, expectedToken());
  } catch {
    return false;
  }
}
