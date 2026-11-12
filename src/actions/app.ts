"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, profiles, proposals, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { jobSchema, profileSchema } from "@/lib/validation";

export async function updateProfile(fd: FormData): Promise<void> {
  const s = await requireUser(["freelancer"]);
  const p = profileSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return;
  const v = { ...p.data, hourlyRate: p.data.hourlyRate ?? null };
  await db.insert(profiles).values({ userId: s.id, ...v }).onConflictDoUpdate({ target: profiles.userId, set: v });
  revalidatePath("/dashboard/profile");
}

export async function updateName(fd: FormData): Promise<void> {
  const s = await requireUser();
  const name = String(fd.get("name") ?? "").trim();
  if (name.length < 2) return;
  await db.update(users).set({ name }).where(eq(users.id, s.id));
  revalidatePath("/dashboard", "layout");
}

export async function postJob(fd: FormData): Promise<void> {
  const s = await requireUser(["client"]);
  const p = jobSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return;
  await db.insert(jobs).values({ clientId: s.id, title: p.data.title, description: p.data.description, budget: p.data.budget ?? null });
  revalidatePath("/dashboard/jobs");
}

export async function decideProposal(fd: FormData): Promise<void> {
  const s = await requireUser(["client"]);
  const id = Number(fd.get("id"));
  const accept = fd.get("decision") === "accept";
  const prop = await db.query.proposals.findFirst({ where: eq(proposals.id, id) });
  if (!prop?.jobId) return;
  const job = await db.query.jobs.findFirst({ where: and(eq(jobs.id, prop.jobId), eq(jobs.clientId, s.id)) });
  if (!job) return;
  await db.update(proposals).set({ status: accept ? "accepted" : "rejected" }).where(eq(proposals.id, id));
  if (accept) await db.update(jobs).set({ status: "in_progress" }).where(eq(jobs.id, job.id));
  revalidatePath("/dashboard/jobs");
}

export async function closeJob(fd: FormData): Promise<void> {
  const s = await requireUser(["client"]);
  await db.update(jobs).set({ status: "closed" }).where(and(eq(jobs.id, Number(fd.get("id"))), eq(jobs.clientId, s.id)));
  revalidatePath("/dashboard/jobs");
}

export async function deleteUser(fd: FormData): Promise<void> {
  const s = await requireUser(["admin"]);
  const id = Number(fd.get("id"));
  if (id === s.id) return;
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/dashboard/admin");
}

export async function changeRole(fd: FormData): Promise<void> {
  const s = await requireUser(["admin"]);
  const id = Number(fd.get("id"));
  const role = String(fd.get("role"));
  if (id === s.id || !["freelancer", "client", "admin"].includes(role)) return;
  await db.update(users).set({ role: role as "freelancer" | "client" | "admin" }).where(eq(users.id, id));
  revalidatePath("/dashboard/admin");
}
