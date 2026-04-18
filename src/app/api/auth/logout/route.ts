import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Use URL to check protocol, similar to login route.
  // NextRequest is not strictly required if we just construct a URL, but we can cast or explicitly check headers if available.
  const url = new URL(req.url);
  const isHttps = url.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "hr_portal_session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && isHttps,
    path: "/",
    maxAge: 0,
  });
  return res;
}
