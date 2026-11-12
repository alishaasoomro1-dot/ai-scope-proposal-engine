"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validation";

export type FormState = { error?: string } | undefined;

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const p = registerSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const email = p.data.email.toLowerCase();
  if (await db.query.users.findFirst({ where: eq(users.email, email) })) return { error: "That email is already registered. Try signing in." };
  const [u] = await db.insert(users).values({ name: p.data.name, email, password: await bcrypt.hash(p.data.password, 10), role: p.data.role }).returning();
  if (u.role === "freelancer") await db.insert(profiles).values({ userId: u.id, fullName: u.name });
  await createSession({ id: u.id, role: u.role, name: u.name });
  redirect("/dashboard");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const p = loginSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const u = await db.query.users.findFirst({ where: eq(users.email, p.data.email.toLowerCase()) });
  if (!u || !(await bcrypt.compare(p.data.password, u.password))) return { error: "Email or password is incorrect." };
  await createSession({ id: u.id, role: u.role, name: u.name });
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
