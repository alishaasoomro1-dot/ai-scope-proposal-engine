import AiTool from "@/components/AiTool";
import { PageHeader } from "@/components/Ui";
import { requireUser } from "@/lib/auth";
import { db } from "@/db";
import { jobAnalyses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({ searchParams }: { searchParams: Promise<{ analysisId?: string }> }) {
  const s = await requireUser(["freelancer"]);
  const query = await searchParams;
  const id = Number(query.analysisId);
  const found = Number.isSafeInteger(id) && id > 0 ? await db.query.jobAnalyses.findFirst({ where: eq(jobAnalyses.id, id) }) : undefined;
  const initial = found?.userId === s.id ? { title: found.title, description: found.description, jobId: found.jobId ?? undefined, analysisId: found.id } : undefined;
  return (<><PageHeader title="Job Analyzer" hint="Paste a job post to see skills, difficulty, budget, risks and a strategy." /><AiTool kind="analyze" initial={initial} /></>);
}
