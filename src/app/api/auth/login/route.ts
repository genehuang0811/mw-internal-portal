import { NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, hashPassword, tokensMatch } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  let token: string;
  try {
    token = expectedToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server is not configured";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (!tokensMatch(hashPassword(password), token)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
