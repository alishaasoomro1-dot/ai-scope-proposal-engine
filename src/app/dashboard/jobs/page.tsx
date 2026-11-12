import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { jobs, proposals, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { closeJob, decideProposal, postJob } from "@/actions/app";
import { Badge, Card, Empty, PageHeader, btn, btnGhost, input } from "@/components/Ui";

export default async function Page() {
  const s = await requireUser(["client"]);
  const mine = await db.select().from(jobs).where(eq(jobs.clientId, s.id)).orderBy(desc(jobs.createdAt));
  const props = mine.length
    ? await db.select({ id: proposals.id, jobId: proposals.jobId, content: proposals.content, status: proposals.status, who: users.name })
        .from(proposals).innerJoin(users, eq(users.id, proposals.userId)).where(inArray(proposals.jobId, mine.map((j) => j.id)))
    : [];
  return (
    <>
      <PageHeader title="Jobs & Contracts" hint="Post a job, review proposals, and accept one to start a contract." />
      <Card className="mb-8 max-w-2xl"><form action={postJob} className="space-y-3">
        <label className="sr-only" htmlFor="job-title">Job title</label><input id="job-title" name="title" placeholder="Job title" className={input} required minLength={3} />
        <label className="sr-only" htmlFor="job-description">Job description</label><textarea id="job-description" name="description" placeholder="Describe the work (at least 20 characters)" className={`${input} h-28`} required minLength={20} />
        <label className="sr-only" htmlFor="job-budget">Budget in USD (optional)</label><input id="job-budget" name="budget" type="number" min={0} placeholder="Budget in USD (optional)" className={input} />
        <button className={btn}>Post job</button>
      </form></Card>
      {mine.length === 0 ? <Empty title="You have not posted any jobs yet." /> : (
        <div className="space-y-4">{mine.map((j) => (
          <Card key={j.id}>
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{j.title}</h3><span className="flex items-center gap-2"><Badge>{j.status.replace("_", " ")}</Badge>
              {j.status !== "closed" && <form action={closeJob}><input type="hidden" name="id" value={j.id} /><button className={btnGhost}>{j.status === "in_progress" ? "Complete contract" : "Close job"}</button></form>}</span></div>
            <p className="mt-1 text-sm text-[#111827]">{j.description}</p>
            <div className="mt-4 space-y-2">{props.filter((p) => p.jobId === j.id).map((p) => (
              <div key={p.id} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm">
                <div className="mb-1 flex items-center justify-between"><b>{p.who}</b><Badge>{p.status}</Badge></div>
                <details><summary className="cursor-pointer text-[#111827]">Read proposal</summary><pre className="mt-2 whitespace-pre-wrap font-sans">{p.content}</pre></details>
                {p.status === "pending" && (
                  <form action={decideProposal} className="mt-2 flex gap-2"><input type="hidden" name="id" value={p.id} />
                    <button name="decision" value="accept" className={btn}>Accept</button><button name="decision" value="reject" className={btnGhost}>Reject</button></form>
                )}
              </div>))}
              {!props.some((p) => p.jobId === j.id) && <p className="text-sm text-[#6B7280]">No proposals yet.</p>}
            </div>
          </Card>))}
        </div>
      )}
    </>
  );
}
