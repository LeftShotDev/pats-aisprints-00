import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { getUserByEmail, toPublicUser } from "@/lib/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as Record<string, unknown>;

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    // Verify password even when user is not found to prevent timing-based
    // enumeration of registered email addresses.
    const passwordValid = user
      ? await verifyPassword(password, user.password_hash)
      : (await verifyPassword(password, "00000000000000000000000000000000:00000000000000000000000000000000"), false);

    if (!user || !passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({ user: toPublicUser(user) });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
