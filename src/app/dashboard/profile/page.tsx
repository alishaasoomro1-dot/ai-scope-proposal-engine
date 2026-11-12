import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/actions/app";
import { Card, PageHeader, btn, input } from "@/components/Ui";

export default async function Page() {
  const s = await requireUser(["freelancer"]);
  const p = await db.query.profiles.findFirst({ where: eq(profiles.userId, s.id) });
  const L = "block text-sm font-medium";
  return (
    <>
      <PageHeader title="Profile" hint="The proposal generator reads this, so the more specific it is the better your proposals read." />
      <Card className="max-w-2xl">
        <form action={updateProfile} className="space-y-4">
          <label className={L}>Full name<input name="fullName" defaultValue={p?.fullName ?? s.name} className={`${input} mt-1`} required /></label>
          <label className={L}>Profile photo URL<input name="photoUrl" defaultValue={p?.photoUrl ?? ""} className={`${input} mt-1`} placeholder="https://..." /></label>
          <label className={L}>Skills (comma separated)<input name="skills" defaultValue={p?.skills ?? ""} className={`${input} mt-1`} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={L}>Experience level
              <select name="experience" defaultValue={p?.experience ?? "intermediate"} className={`${input} mt-1`}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></select></label>
            <label className={L}>Hourly rate (USD)<input name="hourlyRate" type="number" min={0} defaultValue={p?.hourlyRate ?? ""} className={`${input} mt-1`} /></label>
          </div>
          <label className={L}>Portfolio links (one per line)<textarea name="portfolio" defaultValue={p?.portfolio ?? ""} className={`${input} mt-1 h-20`} /></label>
          <label className={L}>Bio<textarea name="bio" defaultValue={p?.bio ?? ""} className={`${input} mt-1 h-24`} /></label>
          <label className={L}>Previous projects<textarea name="projects" defaultValue={p?.projects ?? ""} className={`${input} mt-1 h-24`} /></label>
          <button className={btn}>Save profile</button>
        </form>
      </Card>
    </>
  );
}
