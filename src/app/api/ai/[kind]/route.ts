import { createHash } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { generations, jobAnalyses, jobs, profiles, proposals, scopes } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { AiServiceError, generate, section } from "@/lib/ai";
import { prompts } from "@/lib/prompts";
import { aiInputSchema, jobAnalysisSchema } from "@/lib/validation";
import { AI_KINDS, type AiKind } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseAnalysis(raw: string): Record<string, unknown> {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new AiServiceError("Analysis could not be structured. Please try again."); }
  const parsed = jobAnalysisSchema.safeParse(value);
  if (!parsed.success) throw new AiServiceError("Analysis returned an incomplete format. Please try again.");
  return parsed.data;
}

type ProposalOutput = {
  greeting: string;
  projectUnderstanding: string;
  proposedSolution: string;
  skillsMatch: string;
  timeline: string;
  pricingStrategy: string;
  questionsToClient: string;
  callToAction: string;
  fullProposal: string;
};

function parseProposal(raw: string): ProposalOutput {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new AiServiceError("Proposal returned an invalid format. Please try again."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new AiServiceError("Proposal returned an invalid format. Please try again.");
  const fields = ["greeting", "projectUnderstanding", "proposedSolution", "skillsMatch", "timeline", "pricingStrategy", "questionsToClient", "callToAction", "fullProposal"] as const;
  const proposal = value as Record<string, unknown>;
  if (fields.some((field) => typeof proposal[field] !== "string")) throw new AiServiceError("Proposal returned incomplete content. Please try again.");
  return Object.fromEntries(fields.map((field) => [field, proposal[field]])) as ProposalOutput;
}

export async function POST(req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const session = await getSession();
  if (!session) return jsonError("Please sign in again.", 401);

  const { kind } = await ctx.params;
  if (!AI_KINDS.includes(kind as AiKind)) return jsonError("Unknown tool.", 404);
  const parsed = aiInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request.", 400);
  const input = parsed.data;

  if (kind === "proposal" && session.role !== "freelancer") return jsonError("Only freelancers can generate proposals.", 403);
  if (kind === "analyze" && session.role !== "freelancer") return jsonError("Only freelancers can analyze jobs.", 403);

  try {
    let jobMetadata: Record<string, unknown> = { ...input.metadata };
    if (input.jobId) {
      const job = await db.query.jobs.findFirst({ where: eq(jobs.id, input.jobId) });
      if (!job) return jsonError("That job is unavailable.", 404);
      let canAccess = job.status === "open" || job.clientId === session.id;
      if (!canAccess && input.analysisId) {
        const prior = await db.query.jobAnalyses.findFirst({ where: and(eq(jobAnalyses.id, input.analysisId), eq(jobAnalyses.userId, session.id), eq(jobAnalyses.jobId, job.id)) });
        canAccess = Boolean(prior);
      }
      if (!canAccess) return jsonError("That job is unavailable.", 404);
      if (job.title !== input.title || job.description !== input.description) return jsonError("The selected job details changed. Refresh and try again.", 400);
      jobMetadata = { ...jobMetadata, budget: input.budget ?? job.budget ?? "Not specified" };
    }
    if (input.platform) jobMetadata.platform = input.platform;
    if (input.deadline) jobMetadata.deadline = input.deadline;
    if (input.country) jobMetadata.country = input.country;
    if (input.budget !== undefined) jobMetadata.budget = input.budget;

    const inputHash = createHash("sha256").update(JSON.stringify({ title: input.title, description: input.description, metadata: jobMetadata })).digest("hex");
    let analysisId: number | null = null;
    let analysis: Record<string, unknown> | null = null;

    if (input.analysisId && kind !== "analyze") {
      const found = await db.query.jobAnalyses.findFirst({ where: and(eq(jobAnalyses.id, input.analysisId), eq(jobAnalyses.userId, session.id)) });
      if (!found) return jsonError("Saved analysis not found. Analyze the job again.", 404);
      if (found.title !== input.title || found.description !== input.description || (input.jobId && found.jobId !== input.jobId)) {
        return jsonError("That analysis belongs to different job details. Analyze this job again.", 400);
      }
      analysisId = found.id;
      analysis = found.analysis;
    }

    // Analyze always creates a new immutable version. Proposal and scope reuse the newest match.
    if (kind !== "analyze" && !analysis) {
      const cached = await db.query.jobAnalyses.findFirst({
        where: and(eq(jobAnalyses.userId, session.id), eq(jobAnalyses.inputHash, inputHash)),
        orderBy: [desc(jobAnalyses.createdAt)],
      });
      if (cached) { analysisId = cached.id; analysis = cached.analysis; }
    }

    if (kind === "analyze" && !analysis) {
      analysis = parseAnalysis(await generate(prompts.analyze(input.title, input.description, jobMetadata)));
      const [stored] = await db.insert(jobAnalyses).values({
        userId: session.id, jobId: input.jobId ?? null, inputHash, title: input.title,
        description: input.description, metadata: jobMetadata, analysis,
      }).returning({ id: jobAnalyses.id });
      analysisId = stored.id;
    }

    if ((kind === "proposal" || kind === "scope") && !analysis) {
      analysis = parseAnalysis(await generate(prompts.analyze(input.title, input.description, jobMetadata)));
      const [stored] = await db.insert(jobAnalyses).values({
        userId: session.id, jobId: input.jobId ?? null, inputHash, title: input.title,
        description: input.description, metadata: jobMetadata, analysis,
      }).returning({ id: jobAnalyses.id });
      analysisId = stored.id;
    }

    let output: string;
    let proposalOutput: ProposalOutput | null = null;
    if (kind === "analyze") {
      output = JSON.stringify(analysis, null, 2);
    } else {
      const analysisText = JSON.stringify(analysis, null, 2);
      if (kind === "proposal") {
        const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, session.id) });
        const profileText = profile ? [
          `Name: ${profile.fullName || session.name}`, `Skills: ${profile.skills}`,
          `Experience level: ${profile.experience}`, `Hourly rate: ${profile.hourlyRate ?? "Not specified"}`,
          `Bio: ${profile.bio}`, `Projects: ${profile.projects}`, `Portfolio: ${profile.portfolio}`,
        ].join("\n") : `Name: ${session.name}\nProfile details: Not specified`;
        proposalOutput = parseProposal(await generate(prompts.proposal(input.title, input.description, profileText, analysisText, jobMetadata)));
        // Keep the established text output and database content compatible with existing screens.
        output = proposalOutput.fullProposal;
      } else {
        output = await generate(prompts.scope(input.title, input.description, analysisText, jobMetadata));
      }
    }

    await db.insert(generations).values({ userId: session.id, jobId: input.jobId ?? null, kind: kind as AiKind, title: input.title, output, analysisId });
    if (kind === "proposal") await db.insert(proposals).values({ userId: session.id, jobId: input.jobId ?? null, analysisId, jobTitle: input.title, content: output });
    if (kind === "scope") await db.insert(scopes).values({
      userId: session.id, jobId: input.jobId ?? null, analysisId, title: input.title, content: output,
      deliverables: section(output, "Deliverables"), timeline: section(output, "Timeline"),
      milestones: section(output, "Milestones"), budget: section(output, "Payment Structure"),
    });

    return NextResponse.json({ output, analysisId, analysis, ...(proposalOutput ? { proposal: proposalOutput } : {}) });
  } catch (error) {
    if (error instanceof AiServiceError) return jsonError(error.message, error.status);
    console.error("AI request failed", { kind, userId: session.id, error });
    return jsonError("We could not complete this request. Please try again.", 500);
  }
}
