import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { getUserByEmail, createUser } from "@/lib/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body as Record<string, unknown>;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password
    ) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, email, passwordHash);

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({ user }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
