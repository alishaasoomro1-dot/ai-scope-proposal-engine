import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { generations, jobs, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { changeRole, deleteUser } from "@/actions/app";
import { Badge, Card, PageHeader, Stat, btnGhost, input } from "@/components/Ui";

export default async function Page() {
  const s = await requireUser(["admin"]);
  const [all, allJobs, usage, recent] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(20),
    db.select({ kind: generations.kind, n: count() }).from(generations).groupBy(generations.kind),
    db.select({ title: generations.title, kind: generations.kind, who: users.name, at: generations.createdAt })
      .from(generations).innerJoin(users, eq(users.id, generations.userId)).orderBy(desc(generations.createdAt)).limit(10),
  ]);
  return (
    <>
      <PageHeader title="Admin panel" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Users" value={all.length} /><Stat label="Jobs" value={allJobs.length} />
        {usage.map((u) => <Stat key={u.kind} label={`AI ${u.kind} calls`} value={u.n} />)}
      </div>
      <h2 className="mb-3 text-lg font-semibold">Users</h2>
      <Card className="mb-8 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">User accounts and role controls</caption><thead><tr className="text-[#6B7280]"><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>
        {all.map((u) => (<tr key={u.id} className="border-t border-[#E5E7EB]"><td className="py-2">{u.name}</td><td>{u.email}</td>
          <td>{u.id === s.id ? <Badge>{u.role}</Badge> : (
            <form action={changeRole} className="flex gap-1"><input type="hidden" name="id" value={u.id} />
              <select aria-label={`Role for ${u.name}`} name="role" defaultValue={u.role} className={input}><option>freelancer</option><option>client</option><option>admin</option></select><button className={btnGhost}>Set</button></form>)}</td>
          <td>{u.id !== s.id && <form action={deleteUser}><input type="hidden" name="id" value={u.id} /><button aria-label={`Delete ${u.name}`} className={btnGhost}>Delete</button></form>}</td></tr>))}
      </tbody></table></Card>
      <h2 className="mb-3 text-lg font-semibold">Jobs</h2>
      <Card className="mb-8"><ul className="space-y-1 text-sm">{allJobs.map((j) => <li key={j.id} className="flex justify-between"><span>{j.title}</span><Badge>{j.status.replace("_", " ")}</Badge></li>)}{allJobs.length === 0 && <li className="text-[#6B7280]">No jobs posted yet.</li>}</ul></Card>
      <h2 className="mb-3 text-lg font-semibold">Recent AI usage</h2>
      <Card><ul className="space-y-1 text-sm">{recent.map((r, i) => <li key={i}>{r.who} ran <b>{r.kind}</b> on "{r.title}" · {r.at.toLocaleString()}</li>)}{recent.length === 0 && <li className="text-[#6B7280]">No AI usage yet.</li>}</ul></Card>
    </>
  );
}
