import { and, count, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  generations,
  jobs,
  proposals,
  scopes,
  users,
} from "@/db/schema";

import { requireUser } from "@/lib/auth";



import {
  FileText,
  FolderKanban,
  Search,
  Sparkles,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";

import Link from "next/link";


const n = (r: { n: number }[]) =>
  r[0]?.n ?? 0;



export default async function Home() {


  const s = await requireUser();


  let stats: [string, number][] = [];



  if (s.role === "freelancer") {


    const mine = (
      t:
      | typeof proposals
      | typeof scopes
      | typeof generations
    ) =>
      eq(t.userId, s.id);



    const [
      p,
      sc,
      a,
      act
    ] = await Promise.all([


      db
      .select({ n: count() })
      .from(proposals)
      .where(mine(proposals)),


      db
      .select({ n: count() })
      .from(scopes)
      .where(mine(scopes)),


      db
      .select({ n: count() })
      .from(generations)
      .where(
        eq(
          generations.userId,
          s.id
        )
      ),


      db
      .select({ n: count() })
      .from(proposals)
      .where(
        and(
          eq(proposals.userId,s.id),
          eq(proposals.status,"accepted")
        )
      )

    ]);



    stats = [

      [
        "Total proposals",
        n(p)
      ],

      [
        "Saved jobs",
        n(a)
      ],

      [
        "Generated scopes",
        n(sc)
      ],

      [
        "Active projects",
        n(act)
      ]

    ];



  }

  else if(s.role==="client"){


    const mine =
      await db
      .select({
        id:jobs.id,
        status:jobs.status
      })
      .from(jobs)
      .where(
        eq(
          jobs.clientId,
          s.id
        )
      );



    const ids =
      mine.map(
        j=>j.id
      );



    const got =
      ids.length

      ?

      await db
      .select({n:count()})
      .from(proposals)
      .where(
        inArray(
          proposals.jobId,
          ids
        )
      )

      :

      [{n:0}];



    stats=[

      [
        "Jobs posted",
        mine.length
      ],

      [
        "Proposals received",
        n(got)
      ],

      [
        "Active contracts",
        mine.filter(
          j=>j.status==="in_progress"
        ).length
      ]

    ];



  }

  else {


    const [
      u,
      j,
      p,
      g
    ] =
    await Promise.all([


      db
      .select({n:count()})
      .from(users),


      db
      .select({n:count()})
      .from(jobs),


      db
      .select({n:count()})
      .from(proposals),


      db
      .select({n:count()})
      .from(generations)

    ]);



    stats=[

      [
        "Users",
        n(u)
      ],

      [
        "Jobs",
        n(j)
      ],

      [
        "Proposals",
        n(p)
      ],

      [
        "AI generations",
        n(g)
      ]

    ];

  }



const actions = [
  { title: "Analyze a job", description: "Evaluate fit, surface risks, and find your next opportunity.", href: "/dashboard/analyzer", icon: Search, tone: "bg-[#DCFCE7] text-[#111827]" },
  { title: "Write a proposal", description: "Turn a promising lead into a polished client proposal.", href: "/dashboard/proposals", icon: FileText, tone: "bg-[#DCFCE7] text-[#111827]" },
  { title: "Build a project scope", description: "Set clear deliverables and expectations from day one.", href: "/dashboard/scopes", icon: FolderKanban, tone: "bg-[#DCFCE7] text-[#111827]" },
];
const statIcons = [BriefcaseBusiness, Search, FolderKanban];
return (
    <main className="mx-auto w-full max-w-7xl space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-[#16A34A] px-6 py-8 text-white sm:px-9 sm:py-10">
        <div aria-hidden="true" className="absolute -right-16 -top-28 h-80 w-80 rounded-full border-[48px] border-white/5" />
        <div aria-hidden="true" className="absolute -bottom-32 right-44 h-64 w-64 rounded-full border-[36px] border-[#E5E7EB]/10" />
        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCFCE7] bg-[#DCFCE7] px-3 py-1.5 text-xs font-semibold text-[#111827]"><Sparkles size={14} aria-hidden="true" /> Your freelance workspace</div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {s.name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white sm:text-base">Keep your work moving. Find the right opportunities and create a stronger first impression with AI.</p>
          </div>
          <Link href={s.role === "client" ? "/dashboard/jobs" : "/dashboard/analyzer"} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#DCFCE7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">{s.role === "client" ? "Manage jobs" : "Find opportunities"}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <section aria-labelledby="overview-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111827]">Your workspace</p><h2 id="overview-title" className="mt-1 text-xl font-bold tracking-tight text-[#111827]">Dashboard overview</h2></div><p className="text-sm text-[#111827]">A snapshot of your freelance activity</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value], index) => { const Icon = statIcons[index % statIcons.length]; return <article key={label} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:border-[#E5E7EB] hover:shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-medium text-[#111827]">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#DCFCE7] text-[#111827]"><Icon size={19} aria-hidden="true" /></span></div><p className="mt-5 text-3xl font-bold tracking-tight text-[#111827]">{value.toLocaleString()}</p><p className="mt-1 text-xs text-[#6B7280]">All time</p></article>; })}
        </div>
      </section>
      <section aria-labelledby="actions-title">
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111827]">Make your next move</p><h2 id="actions-title" className="mt-1 text-xl font-bold tracking-tight text-[#111827]">Quick actions</h2></div>
        <div className="grid gap-4 md:grid-cols-3">{actions.map(({ title, description, href, icon: Icon, tone }) => <Link key={href} href={href} className="group flex min-h-48 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/20"><div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon size={20} aria-hidden="true" /></span><ArrowUpRight size={18} className="text-[#6B7280] transition group-hover:text-[#111827]" aria-hidden="true" /></div><h3 className="mt-5 font-bold text-[#111827]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#111827]">{description}</p></Link>)}</div>
      </section>
    </main>
  );
}
