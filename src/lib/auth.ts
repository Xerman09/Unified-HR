import { SignJWT, jwtVerify } from "jose";
import type { DirectusUser } from "./directus";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  departmentId: number | null;
};

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    if (name === "JWT_SECRET") return "default-secret-do-not-use-in-production";
    console.warn(`[Auth Config Warning]: Missing environment variable: ${name}`);
    return "";
  }
  return v;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(mustEnv("JWT_SECRET"));
}

export async function signSession(user: SessionUser): Promise<string> {
  // 12 hours
  const expSeconds = 60 * 60 * 12;

  return await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expSeconds}s`)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const u = (payload as any)?.user;
    if (!u || typeof u !== "object") return null;
    if (typeof u.id !== "number" || typeof u.email !== "string") return null;
    return u as SessionUser;
  } catch {
    return null;
  }
}

export function buildName(u: DirectusUser): string {
  const parts = [u.user_fname, u.user_mname, u.user_lname].filter(Boolean);
  const n = parts.join(" ").trim();
  return n || u.user_email;
}
