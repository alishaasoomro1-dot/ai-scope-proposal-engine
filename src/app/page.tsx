import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  FileText,
  Layers3,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI job analyzer", desc: "Understand the brief, spot the requirements, and decide if a project is right for you." },
  { icon: FileText, title: "Proposal generator", desc: "Create tailored proposals that connect your experience to what each client needs." },
  { icon: Target, title: "Scope builder", desc: "Turn a conversation into clear deliverables, milestones, and payment expectations." },
  { icon: Zap, title: "A smoother workflow", desc: "Spend less time on repetitive admin and more time doing your best work." },
];

const steps = [
  { title: "Set up your profile", desc: "Add your skills and experience so every result feels relevant to you." },
  { title: "Bring a project brief", desc: "Paste a job post or client requirements into your workspace." },
  { title: "Create your next move", desc: "Generate a proposal or scope, refine it, and send it with confidence." },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#111827]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/25" aria-label="AI Freelance Engine home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#16A34A] text-white"><Sparkles size={20} aria-hidden="true" /></span>
          <span><span className="block text-xs font-extrabold tracking-tight sm:text-sm">AI Freelance Engine</span><span className="hidden text-xs text-[#111827] sm:block">Your work, moving forward</span></span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-medium text-[#111827] md:flex">
          <Link className="rounded py-2 transition hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]" href="#features">Features</Link>
          <Link className="rounded py-2 transition hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]" href="#how">How it works</Link>
          <Link className="rounded py-2 transition hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]" href="#benefits">Benefits</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl px-2 text-xs font-semibold text-[#111827] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7] sm:px-4 sm:text-sm">Log in</Link>
          <Link href="/register" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-[#16A34A] px-2.5 text-xs font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7] sm:gap-2 sm:px-5 sm:text-sm"><span className="sm:hidden">Start</span><span className="hidden sm:inline">Get started</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </header>

      <section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#F8FAFC]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#DCFCE7] px-3.5 py-2 text-xs font-bold text-[#111827] sm:text-sm"><Sparkles size={15} aria-hidden="true" /> A smarter freelance workflow</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">Make your next freelance pitch <span className="text-[#16A34A]">your strongest yet.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#6B7280] sm:text-lg sm:leading-8">Go from job brief to confident proposal and clear project scope with AI tools built for independent work.</p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#16A34A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/30">Start for free <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="#features" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:border-[#16A34A] hover:bg-[#DCFCE7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/25">Explore features</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]"><span className="inline-flex items-center gap-2"><Check size={16} className="text-[#16A34A]" aria-hidden="true" /> Built for freelancers</span><span className="inline-flex items-center gap-2"><Check size={16} className="text-[#16A34A]" aria-hidden="true" /> Your voice stays yours</span></div>
          </div>

          <div aria-label="Preview of the AI freelance workspace" className="mx-auto w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-3 shadow-lg sm:p-5">
            <div className="rounded-2xl bg-[#F8FAFC] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#111827]">Your workspace</p><h2 className="mt-1 text-lg font-bold text-[#111827]">Project assistant</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1.5 text-xs font-bold text-[#111827]"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Ready</span></div>
              <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#DCFCE7] text-[#111827]"><Search size={18} aria-hidden="true" /></span><div><p className="text-sm font-bold text-[#111827]">Job brief analyzed</p><p className="text-xs text-[#111827]">Key skills and goals identified</p></div><Check className="ml-auto text-[#111827]" size={18} aria-hidden="true" /></div></div>
              <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#DCFCE7] text-[#111827]"><FileText size={18} aria-hidden="true" /></span><div><p className="text-sm font-bold text-[#111827]">Proposal drafted</p><p className="text-xs text-[#111827]">Personalized to the project</p></div><Check className="ml-auto text-[#111827]" size={18} aria-hidden="true" /></div></div>
              <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#DCFCE7] text-[#111827]"><Layers3 size={18} aria-hidden="true" /></span><div><p className="text-sm font-bold text-[#111827]">Scope organized</p><p className="text-xs text-[#111827]">Deliverables made clear</p></div><Check className="ml-auto text-[#111827]" size={18} aria-hidden="true" /></div></div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#16A34A] p-4 text-white"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#DCFCE7] text-[#111827]"><ShieldCheck size={20} aria-hidden="true" /></span><p className="text-sm leading-6 text-white">A more organized way to move from opportunity to kickoff.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-8 bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111827]">Everything in one place</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">More time for the work you love</h2><p className="mt-4 text-base leading-7 text-[#111827]">Practical tools for the moments that make a freelance project successful.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">{features.map(({ icon: Icon, title, desc }) => <article key={title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:shadow-md sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#DCFCE7] text-[#111827]"><Icon size={21} aria-hidden="true" /></span><h3 className="mt-5 font-bold text-[#111827]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#111827]">{desc}</p></article>)}</div>
        </div>
      </section>

      <section id="how" className="scroll-mt-8 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111827]">A clear path forward</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">From brief to ready</h2><p className="mt-4 text-base leading-7 text-[#111827]">Three simple steps to make your freelance workflow feel lighter.</p></div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">{steps.map(({ title, desc }, index) => <li key={title} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7"><span className="text-sm font-extrabold tracking-[0.14em] text-[#111827]">STEP 0{index + 1}</span><h3 className="mt-4 text-lg font-bold text-[#111827]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#111827]">{desc}</p></li>)}</ol>
        </div>
      </section>

      <section id="benefits" className="scroll-mt-8 bg-[#DCFCE7] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111827]">Made for independent work</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Spend less energy on busywork.</h2><p className="mt-4 max-w-xl text-base leading-7 text-[#111827]">Bring your job analysis, proposal writing, and project planning into one focused workspace. Get a useful first draft, then shape it in your own voice.</p></div>
          <ul className="grid gap-3 sm:grid-cols-2">{["Start with a clearer brief", "Personalize each proposal", "Set expectations early", "Keep your workflow together"].map((item) => <li key={item} className="flex min-h-14 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#DCFCE7] text-[#111827]"><Check size={15} aria-hidden="true" /></span>{item}</li>)}</ul>
        </div>
      </section>

      <footer id="about" className="bg-[#111827] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-7 rounded-3xl border border-[#6B7280] bg-[#111827] p-6 sm:p-9 md:flex-row md:items-center"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 text-sm font-semibold text-white"><Rocket size={17} aria-hidden="true" /> Your next project starts here</span><h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Ready to make your next move?</h2><p className="mt-2 text-sm leading-6 text-white">Build a more confident freelance workflow, one project at a time.</p></div><Link href="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]">Create your account <ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#6B7280] pt-6 text-sm text-white sm:flex-row sm:items-center"><p className="text-white">© 2026 AI Freelance Engine — Built by Areesha Ali Akber</p><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2"><Link className="min-h-11 rounded py-2 text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DCFCE7]" href="#features">Features</Link><Link className="min-h-11 rounded py-2 text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DCFCE7]" href="#how">How it works</Link><Link className="min-h-11 rounded py-2 text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DCFCE7]" href="/login">Log in</Link></nav></div>
        </div>
      </footer>
    </main>
  );
}
