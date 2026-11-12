import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { jobAnalyses, jobs, scopes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import AiTool from "@/components/AiTool";
import CopyButton from "@/components/CopyButton";
import { Card, Empty, PageHeader } from "@/components/Ui";

export default async function Page({ searchParams }: { searchParams: Promise<{ analysisId?: string }> }) {
  const s = await requireUser(["freelancer", "client"]);
  const query = await searchParams;
  const parsedId = Number(query.analysisId);
  const foundAnalysis = Number.isSafeInteger(parsedId) && parsedId > 0
    ? await db.query.jobAnalyses.findFirst({ where: eq(jobAnalyses.id, parsedId) })
    : undefined;
  const ownedAnalysis = foundAnalysis?.userId === s.id ? foundAnalysis : undefined;
  const list = await db.select({ id: jobs.id, title: jobs.title, description: jobs.description, budget: jobs.budget }).from(jobs)
    .where(ownedAnalysis?.jobId
      ? or(s.role === "client" ? eq(jobs.clientId, s.id) : eq(jobs.status, "open"), eq(jobs.id, ownedAnalysis.jobId))
      : (s.role === "client" ? eq(jobs.clientId, s.id) : eq(jobs.status, "open")));
  const mine = await db.select().from(scopes).where(eq(scopes.userId, s.id)).orderBy(desc(scopes.createdAt));
  return (
    <>
      <PageHeader title="Scope Generator" hint="Turn a job into overview, deliverables, milestones, payment structure and terms." />
      <AiTool kind="scope" jobs={list} initial={ownedAnalysis ? { title: ownedAnalysis.title, description: ownedAnalysis.description, jobId: ownedAnalysis.jobId ?? undefined, analysisId: ownedAnalysis.id } : undefined} />
      <h2 className="mb-3 mt-10 text-lg font-semibold">Saved scopes</h2>
      {mine.length === 0 ? <Empty title="No scopes yet." /> : (
        <div className="space-y-3">{mine.map((x) => (
          <Card key={x.id}><div className="mb-2 flex items-center justify-between"><span className="font-medium">{x.title}</span><CopyButton text={x.content} /></div>
            <details><summary className="cursor-pointer text-sm text-[#111827]">View scope</summary><pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{x.content}</pre></details></Card>
        ))}</div>
      )}
    </>
  );
}
