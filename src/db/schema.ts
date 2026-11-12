import { pgTable, pgEnum, serial, integer, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["freelancer", "client", "admin"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("freelancer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  photoUrl: text("photo_url"),
  skills: text("skills").default("").notNull(),
  experience: text("experience").default("intermediate").notNull(),
  portfolio: text("portfolio").default("").notNull(),
  hourlyRate: integer("hourly_rate"),
  bio: text("bio").default("").notNull(),
  projects: text("projects").default("").notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget"),
  status: text("status", { enum: ["open", "in_progress", "closed"] }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Canonical analysis is shared by proposals and scopes to avoid repeat model calls.
export const jobAnalyses = pgTable("job_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
  inputHash: text("input_hash").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  analysis: jsonb("analysis").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("job_analyses_user_hash_idx").on(t.userId, t.inputHash)]);

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
  analysisId: integer("analysis_id").references(() => jobAnalyses.id, { onDelete: "set null" }),
  jobTitle: text("job_title").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scopes = pgTable("scopes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
  analysisId: integer("analysis_id").references(() => jobAnalyses.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  deliverables: text("deliverables").default("").notNull(),
  timeline: text("timeline").default("").notNull(),
  milestones: text("milestones").default("").notNull(),
  budget: text("budget").default("").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per AI call: powers History, saved analyses and admin AI usage.
export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
  kind: text("kind", { enum: ["analyze", "proposal", "scope"] }).notNull(),
  title: text("title").notNull(),
  analysisId: integer("analysis_id").references(() => jobAnalyses.id, { onDelete: "set null" }),
  output: text("output").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("generations_user_analysis_idx").on(t.userId, t.analysisId),
  index("generations_user_job_idx").on(t.userId, t.jobId),
]);
