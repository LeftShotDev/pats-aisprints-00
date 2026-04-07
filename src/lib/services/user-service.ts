import { executeQueryFirst, executeMutation, generateId } from "@/lib/d1-client";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return executeQueryFirst<User>(
    "SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ?",
    [email.toLowerCase().trim()]
  );
}

export async function getUserById(id: string): Promise<User | null> {
  return executeQueryFirst<User>(
    "SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<PublicUser> {
  const id = generateId();
  await executeMutation(
    "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [id, name.trim(), email.toLowerCase().trim(), passwordHash]
  );
  return { id, name: name.trim(), email: email.toLowerCase().trim() };
}
