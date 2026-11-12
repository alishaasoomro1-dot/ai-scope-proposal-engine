"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Briefcase, FileText, FolderKanban, History, LayoutDashboard, LogOut, Search, Settings, Shield, Sparkles, User } from "lucide-react";
import { logout } from "@/actions/auth";
import type { Role } from "@/db/schema";

const D = "/dashboard";
const NAV: Record<Role, { href: string; label: string; icon: LucideIcon }[]> = {
  freelancer: [
    { href: D, label: "Dashboard", icon: LayoutDashboard }, { href: `${D}/profile`, label: "Profile", icon: User },
    { href: `${D}/analyzer`, label: "Job Analyzer", icon: Search }, { href: `${D}/proposals`, label: "Proposal Generator", icon: FileText },
    { href: `${D}/scopes`, label: "Scope Generator", icon: FolderKanban }, { href: `${D}/history`, label: "History", icon: History },
    { href: `${D}/settings`, label: "Settings", icon: Settings },
  ],
  client: [
    { href: D, label: "Dashboard", icon: LayoutDashboard }, { href: `${D}/jobs`, label: "Jobs & Contracts", icon: Briefcase },
    { href: `${D}/scopes`, label: "Scope Generator", icon: FolderKanban }, { href: `${D}/history`, label: "History", icon: History },
    { href: `${D}/settings`, label: "Settings", icon: Settings },
  ],
  admin: [
    { href: D, label: "Dashboard", icon: LayoutDashboard }, { href: `${D}/admin`, label: "Admin Panel", icon: Shield },
    { href: `${D}/settings`, label: "Settings", icon: Settings },
  ],
};

export default function Sidebar({ role, name }: { role: Role; name: string }) {
  const pathname = usePathname();
  return (
    <aside className="z-20 flex w-full shrink-0 flex-col border-b border-[#E5E7EB] bg-white md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <Link href={D} className="flex min-h-16 items-center gap-3 border-b border-[#E5E7EB] px-4 py-3 focus-visible:outline-none sm:px-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#16A34A] text-white"><Sparkles size={19} aria-hidden="true" /></span>
        <span className="min-w-0"><span className="block truncate text-sm font-bold text-[#111827]">AI Freelance Engine</span><span className="block text-xs text-[#6B7280]">Your work, moving forward</span></span>
      </Link>
      <div className="hidden border-b border-[#E5E7EB] px-5 py-4 md:block">
        <p className="truncate text-sm font-semibold text-[#111827]">{name}</p>
        <p className="mt-0.5 text-xs capitalize text-[#6B7280]">{role}</p>
      </div>
      <nav aria-label="Dashboard navigation" className="grid grid-cols-2 gap-1.5 px-3 py-2 sm:grid-cols-3 md:flex md:flex-1 md:flex-col md:gap-1.5 md:overflow-y-auto md:px-3 md:py-5">
        {NAV[role].map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== D && pathname.startsWith(`${href}/`));
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl px-2.5 text-left text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7] sm:text-sm md:w-full md:px-3 ${active ? "bg-[#DCFCE7] text-[#111827]" : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"}`}>
            <Icon size={17} aria-hidden="true" /><span>{label}</span>
          </Link>;
        })}
      </nav>
      <div className="px-3 pb-2 md:hidden">
        <form action={logout}><button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] px-3 text-sm font-medium text-[#6B7280] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]"><LogOut size={17} aria-hidden="true" />Sign out</button></form>
      </div>
      <div className="hidden border-t border-[#E5E7EB] p-3 md:block">
        <form action={logout}><button className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#6B7280] transition hover:bg-[#F8FAFC] hover:text-[#111827] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]"><LogOut size={17} aria-hidden="true" />Sign out</button></form>
      </div>
    </aside>
  );
}
