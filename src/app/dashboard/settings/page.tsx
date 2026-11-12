import { requireUser } from "@/lib/auth";
import { updateName } from "@/actions/app";
import { Card, PageHeader, btn, input } from "@/components/Ui";

export default async function Page() {
  const s = await requireUser();
  return (
    <>
      <PageHeader title="Settings" hint={`Signed in as a ${s.role}.`} />
      <Card className="max-w-md"><form action={updateName} className="space-y-4">
        <label className="block text-sm font-medium">Display name<input name="name" defaultValue={s.name} className={`${input} mt-1`} required /></label>
        <button className={btn}>Save name</button>
      </form></Card>
    </>
  );
}
