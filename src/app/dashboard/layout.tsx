import { requireUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const s = await requireUser();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar role={s.role} name={s.name} />
      <main className="min-w-0 flex-1 bg-[#F8FAFC] p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
