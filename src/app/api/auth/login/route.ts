import { NextRequest, NextResponse } from "next/server";
import { fetchUserByEmail, getDepartmentId, isUserDeleted } from "@/lib/directus";
import { buildName, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await fetchUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (isUserDeleted(user)) {
      return NextResponse.json({ message: "Account is disabled" }, { status: 403 });
    }

    // NOTE: This compares plaintext passwords because your Directus sample shows plaintext.
    // For production, store hashed passwords and verify securely.
    if (user.user_password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const deptId = getDepartmentId(user);
    if (deptId !== 2) {
      return NextResponse.json({ message: "Access denied: Department 2 only" }, { status: 403 });
    }

    const sessionToken = await signSession({
      id: user.user_id,
      email: user.user_email,
      name: buildName(user),
      departmentId: deptId,
      isAdmin: (user as any).isAdmin ?? null,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "hr_portal_session",
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
