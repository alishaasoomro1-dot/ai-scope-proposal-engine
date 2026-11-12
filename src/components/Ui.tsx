import Link from "next/link";
import type { ReactNode } from "react";

export const input = "min-h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#111827] shadow-sm outline-none transition placeholder:text-[#6B7280] focus:border-[#16A34A] focus:ring-4 focus:ring-[#DCFCE7] disabled:cursor-not-allowed disabled:opacity-50";

export const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:border-[#16A34A] hover:bg-[#DCFCE7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]";

export const btnDanger = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]";

export function PageHeader({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">{title}</h1>
        {hint && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280] sm:text-base">{hint}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm font-medium text-[#6B7280]">{label}</p>
      <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-[#111827]">{value}</p>
      <div aria-hidden="true" className="mt-4 h-1 w-10 rounded-full bg-[#16A34A]" />
    </Card>
  );
}

export function Empty({ title, description, href, action }: { title: string; description?: string; href?: string; action?: string }) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center text-center">
      <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      {description && <p className="mt-2 max-w-lg text-sm leading-6 text-[#6B7280]">{description}</p>}
      {href && action && <Link href={href} className={`${btn} mt-5`}>{action}</Link>}
    </Card>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex min-h-7 items-center rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#111827]">{children}</span>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#111827]">{children}</h2>;
}

export function Divider() { return <hr className="my-6 border-0 border-t border-[#E5E7EB]" />; }
