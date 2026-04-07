# User Authentication - Technical PRD

## Overview

This document outlines the requirements for implementing the user authentication system in QuizMaker. The system will allow K-12 teachers to create personal accounts using an email and password, log in securely, and have all of their generated content protected behind authentication. Sessions will persist across page refreshes, and unauthenticated users will be redirected to the login page.

---

## Business Requirements

### Account Management

- Teachers can register for an account with their name, email address, and a password
- Email addresses must be unique across all accounts
- Passwords must meet a minimum security standard (8+ characters)
- Teachers can log out of their account from any page

### Authentication & Access

- Teachers can log in with their registered email and password
- Invalid credentials must be rejected with a clear error message
- Authenticated sessions must persist across page refreshes and browser restarts (within a reasonable expiry window)
- All MCQ management routes must be protected — unauthenticated users are redirected to `/login`
- After a successful login, the teacher is redirected to the MCQ dashboard
- Sign-up and login forms must be compatible with password managers — inputs must use correct `name`, `type`, and `autocomplete` attributes so browsers and password managers can offer to save and autofill credentials

### Privacy & Security

- Each teacher's content is private and only accessible to them
- Passwords must never be stored in plain text
- Session tokens must be stored in secure, HTTP-only cookies

---

## Technical Requirements

### Database Schema

A single `users` table stores teacher account data.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);
```

### API Endpoints

#### POST /api/auth/signup

Registers a new teacher account.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

- Success (201): `{ "user": { "id": "string", "name": "string", "email": "string" } }` — sets session cookie
- Error (400): `{ "error": "Validation error message" }` — missing fields or password too short
- Error (409): `{ "error": "Email already registered" }` — duplicate email
- Error (500): `{ "error": "Internal server error" }`

---

#### POST /api/auth/login

Authenticates an existing teacher.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

- Success (200): `{ "user": { "id": "string", "name": "string", "email": "string" } }` — sets session cookie
- Error (400): `{ "error": "Email and password are required" }`
- Error (401): `{ "error": "Invalid email or password" }`
- Error (500): `{ "error": "Internal server error" }`

---

#### POST /api/auth/logout

Clears the session cookie.

**Response:**

- Success (200): `{ "success": true }` — clears session cookie

---

#### GET /api/auth/me

Returns the currently authenticated user. Used to hydrate client-side session state.

**Response:**

- Success (200): `{ "user": { "id": "string", "name": "string", "email": "string" } }`
- Error (401): `{ "error": "Not authenticated" }`

---

### Session Implementation

Sessions are stored entirely in a signed, HTTP-only cookie. No server-side session store is required.

- **Cookie name**: `quizmaker_session`
- **Contents**: JSON payload `{ userId, expiresAt }` signed with an `HMAC_SECRET` env variable
- **Expiry**: 7 days, refreshed on each authenticated request
- **Flags**: `HttpOnly`, `Secure` (production), `SameSite=Lax`

The session is validated in Next.js middleware on every request to a protected route.

---

### User Interface Requirements

#### Sign Up Page (`/signup`)

- Full name field (required)
- Email field (required, email format)
- Password field (required, minimum 8 characters)
- Submit button: "Create Account"
- Link to `/login` for existing users
- Inline validation errors on submit
- On success: redirect to `/mcqs`

#### Login Page (`/login`)

- Email field (required)
- Password field (required)
- Submit button: "Log In"
- Link to `/signup` for new users
- Error banner for invalid credentials
- On success: redirect to `/mcqs` (or the originally requested protected route)

#### Logout

- "Log Out" button available in the application nav/header on all authenticated pages
- Calls `POST /api/auth/logout`, clears cookie, redirects to `/login`

---

## Implementation Phases

### Phase 1: Database & Core Auth Logic - ⏳ PLANNED

**Objective**: Create the users table migration and implement the core password hashing and session utilities.

**Tasks**:

1. Create D1 migration for the `users` table
2. Apply migration locally
3. Implement password hashing helpers in `src/lib/auth.ts` (using `bcryptjs` or `crypto` SubtleCrypto)
4. Implement session creation, reading, and validation helpers in `src/lib/auth.ts`
5. Add `HMAC_SECRET` to `.dev.vars`

**Deliverables**:

- `migrations/0001_users_table.sql`
- `src/lib/auth.ts`

---

### Phase 2: API Routes - ⏳ PLANNED

**Objective**: Implement the four auth API endpoints.

**Tasks**:

1. `POST /api/auth/signup` — validate input, check for duplicate email, hash password, insert user, set session cookie
2. `POST /api/auth/login` — validate input, look up user by email, compare password hash, set session cookie
3. `POST /api/auth/logout` — clear session cookie
4. `GET /api/auth/me` — read and validate session cookie, return user data

**Deliverables**:

- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`

---

### Phase 3: Route Protection (Middleware) - ⏳ PLANNED

**Objective**: Protect all MCQ routes and redirect unauthenticated users.

**Tasks**:

1. Implement Next.js middleware to validate the session cookie on every request
2. Redirect unauthenticated requests to `/login` (preserving the intended destination as a query param)
3. Redirect authenticated users away from `/login` and `/signup` to `/mcqs`

**Deliverables**:

- `src/middleware.ts`

---

### Phase 4: UI Pages & Components - ⏳ PLANNED

**Objective**: Build the sign-up and login pages with form validation and error handling.

**Tasks**:

1. Create the sign-up page and form component using shadcn/ui Form + react-hook-form + zod
2. Create the login page and form component
3. Add a logout button to the application header/nav
4. Wire up all forms to the API routes
5. Handle redirect logic post-login and post-signup

**Deliverables**:

- `src/app/signup/page.tsx`
- `src/app/login/page.tsx`
- `src/components/auth/signup-form.tsx`
- `src/components/auth/login-form.tsx`
- `src/components/layout/header.tsx` (with logout button)

---

## Technical Implementation Details

### Key Files

- `migrations/0001_users_table.sql` — users table schema
- `src/lib/auth.ts` — password hashing, session creation/validation, cookie helpers
- `src/lib/d1-client.ts` — shared D1 database helpers
- `src/middleware.ts` — route protection and session validation
- `src/app/api/auth/*/route.ts` — auth API endpoints

### Session Signing Pattern

```typescript
// src/lib/auth.ts

const SESSION_COOKIE = "quizmaker_session";
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: string): Promise<string> {
  const payload = JSON.stringify({ userId, expiresAt: Date.now() + SESSION_EXPIRY_MS });
  const signature = await sign(payload, process.env.HMAC_SECRET!);
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

export async function readSession(token: string): Promise<{ userId: string } | null> {
  const [encodedPayload, signature] = token.split(".");
  const payload = Buffer.from(encodedPayload, "base64").toString();
  const valid = await verify(payload, signature, process.env.HMAC_SECRET!);
  if (!valid) return null;
  const { userId, expiresAt } = JSON.parse(payload);
  if (Date.now() > expiresAt) return null;
  return { userId };
}
```

### Password Hashing

Use the Web Crypto API (`SubtleCrypto`) available in the Cloudflare Workers runtime instead of `bcryptjs`, which has compatibility issues in the edge runtime. Use PBKDF2 with SHA-256.

### Middleware Pattern

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const token = req.cookies.get("quizmaker_session")?.value;
  const session = token ? await readSession(token) : null;

  if (!session && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isPublic) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/mcqs";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Important Notes

- Do not use `bcryptjs` — it is not compatible with the Cloudflare Workers runtime. Use `SubtleCrypto` (PBKDF2) instead.
- The `HMAC_SECRET` env variable must be set in `.dev.vars` for local development and as a Cloudflare secret for production.
- All D1 access must go through `src/lib/d1-client.ts` helpers to ensure proper parameter binding.

---

## Success Criteria

- A teacher can register with name, email, and password
- A teacher can log in with their email and password
- Invalid credentials are rejected with a clear error message
- A session persists across page refreshes
- All MCQ routes redirect unauthenticated users to `/login`
- After login, the teacher is redirected to `/mcqs`
- Logging out clears the session and redirects to `/login`
- A teacher cannot access another teacher's content

---

## Troubleshooting Guide

### D1 Binding Error in Local Dev

**Problem**: `Cannot read properties of undefined (reading 'prepare')`
**Cause**: The D1 binding is not available — wrangler dev is not running or the binding name is wrong
**Solution**: Ensure `npm run dev` is used (which starts wrangler), and that the binding name in `wrangler.jsonc` matches the one accessed via `env`
**Code Reference**: `src/lib/d1-client.ts`

### Session Cookie Not Persisting

**Problem**: Teacher is logged out on every page refresh
**Cause**: Cookie is not being set with `HttpOnly` and `Path=/`, or the `SameSite` attribute is causing it to be dropped
**Solution**: Verify the `Set-Cookie` header in the API response includes `Path=/; HttpOnly; SameSite=Lax`

### SubtleCrypto Not Available

**Problem**: `crypto.subtle is undefined` in local dev
**Cause**: Running in a Node.js context without the `nodejs_compat` flag
**Solution**: Ensure `"nodejs_compat"` is in `compatibility_flags` in `wrangler.jsonc`

---

## Future Enhancements

- Password reset via email (requires an email service integration)
- Email verification on signup
- "Remember me" option with extended session expiry
- OAuth login (Google)
- Account settings page (change name, change password)

---

## Dependencies

### External Dependencies

- None — authentication is implemented without third-party auth services

### Internal Dependencies

- `src/lib/d1-client.ts` — database access helpers (must be created in Phase 1)
- Cloudflare D1 binding (`quizmaker_app_database`) — user data storage
- `HMAC_SECRET` environment variable — session signing

### Environment Variables


| Variable      | Location                        | Purpose                           |
| ------------- | ------------------------------- | --------------------------------- |
| `HMAC_SECRET` | `.dev.vars` / Cloudflare secret | Signs and verifies session tokens |


---

## Risks and Mitigation

### Technical Risks

- **Risk**: `SubtleCrypto` PBKDF2 is slower than bcrypt and the implementation is more verbose
- **Mitigation**: Use a well-tested helper pattern; performance is acceptable for auth flows
- **Risk**: Session tokens stored in cookies can be forged if `HMAC_SECRET` leaks
- **Mitigation**: Never commit `HMAC_SECRET` to the repo; rotate the secret if compromised (all existing sessions will be invalidated)
- **Risk**: SQL injection via user-supplied email or password
- **Mitigation**: All queries use prepared statements via `src/lib/d1-client.ts` helpers

### User Experience Risks

- **Risk**: Teachers lose their session unexpectedly (7-day expiry)
- **Mitigation**: Session expiry window is reasonable for a school-day workflow; can be extended if needed

---

## Current Status

**Last Updated**: April 7, 2026
**Current Phase**: Phase 1 - Not started
**Status**: ⏳ PLANNED
**Next Steps**: Create D1 migration and implement `src/lib/auth.ts`