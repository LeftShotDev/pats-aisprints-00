import type { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_COOKIE_NAME = "quizmaker_session";
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ---------------------------------------------------------------------------
// Internal crypto helpers (SubtleCrypto — compatible with Cloudflare Workers)
// ---------------------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const pairs = hex.match(/.{2}/g) ?? [];
  const buffer = new ArrayBuffer(pairs.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < pairs.length; i++) {
    arr[i] = parseInt(pairs[i], 16);
  }
  return arr;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string comparison to prevent timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signHmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bytesToHex(new Uint8Array(signature));
}

async function verifyHmac(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await signHmac(data, secret);
  return safeEqual(expected, signature);
}

// ---------------------------------------------------------------------------
// Password hashing (PBKDF2 via SubtleCrypto)
// ---------------------------------------------------------------------------

/**
 * Hashes a plain-text password using PBKDF2-SHA256 with a random salt.
 * Returns a string in the format `saltHex:keyHex`.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltBuffer = new ArrayBuffer(16);
  const salt = new Uint8Array(saltBuffer);
  crypto.getRandomValues(salt);
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );

  return `${bytesToHex(salt)}:${bytesToHex(new Uint8Array(bits))}`;
}

/**
 * Verifies a plain-text password against a stored `saltHex:keyHex` hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, expectedKeyHex] = storedHash.split(":");
  if (!saltHex || !expectedKeyHex) return false;

  const salt = hexToBytes(saltHex);
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );

  return safeEqual(bytesToHex(new Uint8Array(bits)), expectedKeyHex);
}

// ---------------------------------------------------------------------------
// Session tokens (HMAC-signed, stored in HTTP-only cookie)
// ---------------------------------------------------------------------------

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

/**
 * Creates a signed session token for a given user ID.
 * Format: `base64(payload).hmacSignature`
 */
export async function createSessionToken(userId: string): Promise<string> {
  const secret = process.env.HMAC_SECRET;
  if (!secret) throw new Error("HMAC_SECRET environment variable is not set");

  const payload = btoa(JSON.stringify({ userId, expiresAt: Date.now() + SESSION_EXPIRY_MS }));
  const signature = await signHmac(payload, secret);
  return `${payload}.${signature}`;
}

/**
 * Validates a session token and returns the payload if valid, or null if
 * the token is malformed, the signature is invalid, or the session has expired.
 */
export async function validateSessionToken(token: string): Promise<SessionPayload | null> {
  const secret = process.env.HMAC_SECRET;
  if (!secret) return null;

  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  const valid = await verifyHmac(payload, signature, secret);
  if (!valid) return null;

  try {
    const parsed = JSON.parse(atob(payload)) as SessionPayload;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

/**
 * Writes the session cookie onto a NextResponse.
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_MS / 1000,
    path: "/",
  });
}

/**
 * Clears the session cookie from a NextResponse.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Reads and validates the session from an incoming NextRequest.
 * Returns the session payload, or null if not authenticated.
 */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSessionToken(token);
}
