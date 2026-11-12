import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { jobAnalyses, jobs, proposals } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import AiTool from "@/components/AiTool";
import CopyButton from "@/components/CopyButton";
import { Badge, Card, Empty, PageHeader } from "@/components/Ui";

export default async function Page({ searchParams }: { searchParams: Promise<{ analysisId?: string }> }) {
  const s = await requireUser(["freelancer"]);
  const query = await searchParams;
  const parsedId = Number(query.analysisId);
  const initialAnalysis = Number.isSafeInteger(parsedId) && parsedId > 0
    ? await db.query.jobAnalyses.findFirst({ where: eq(jobAnalyses.id, parsedId) })
    : undefined;
  const ownedAnalysis = initialAnalysis?.userId === s.id ? initialAnalysis : undefined;
  const [open, mine] = await Promise.all([
    db.select({ id: jobs.id, title: jobs.title, description: jobs.description, budget: jobs.budget }).from(jobs).where(ownedAnalysis?.jobId ? or(eq(jobs.status, "open"), eq(jobs.id, ownedAnalysis.jobId)) : eq(jobs.status, "open")),
    db.select().from(proposals).where(eq(proposals.userId, s.id)).orderBy(desc(proposals.createdAt)),
  ]);
  return (
    <>
      <PageHeader title="Proposal Generator" hint="Uses your profile and the job text. Pick a client's job to send the proposal to them." />
      <AiTool kind="proposal" jobs={open} initial={ownedAnalysis ? { title: ownedAnalysis.title, description: ownedAnalysis.description, jobId: ownedAnalysis.jobId ?? undefined, analysisId: ownedAnalysis.id } : undefined} />
      <h2 className="mb-3 mt-10 text-lg font-semibold">Saved proposals</h2>
      {mine.length === 0 ? <Empty title="No proposals yet. Generate your first one above." /> : (
        <div className="space-y-3">{mine.map((p) => (
          <Card key={p.id}><div className="mb-2 flex items-center justify-between gap-2"><span className="font-medium">{p.jobTitle}</span><span className="flex items-center gap-2"><Badge>{p.status}</Badge><CopyButton text={p.content} /></span></div>
            <details><summary className="cursor-pointer text-sm text-[#111827]">View proposal</summary><pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{p.content}</pre></details></Card>
        ))}</div>
      )}
    </>
  );
}
