"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { login, register, type FormState } from "@/actions/auth";
import { btn, input } from "./Ui";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? login : register, undefined);
  const registerMode = mode === "register";
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-7 flex items-center justify-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCFCE7]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#16A34A] text-white"><Sparkles size={20} aria-hidden="true" /></span>
          <span className="text-left"><span className="block text-base font-bold tracking-tight text-[#111827]">AI Freelance Engine</span><span className="block text-xs text-[#6B7280]">Your work, moving forward</span></span>
        </Link>
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-[#111827]">{registerMode ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1 text-sm leading-6 text-[#6B7280]">{registerMode ? "Set up your workspace and start your next project." : "Sign in to continue to your freelance workspace."}</p>
          <form action={action} className="mt-6 space-y-4">
            {registerMode && <label className="block text-sm font-medium text-[#111827]">Full name<input name="name" className={`${input} mt-1.5`} placeholder="Your name" autoComplete="name" required /></label>}
            <label className="block text-sm font-medium text-[#111827]">Email address<input name="email" type="email" className={`${input} mt-1.5`} placeholder="you@example.com" autoComplete="email" required /></label>
            <label className="block text-sm font-medium text-[#111827]">Password<input name="password" type="password" minLength={registerMode ? 8 : 1} className={`${input} mt-1.5`} placeholder="Enter your password" autoComplete={registerMode ? "new-password" : "current-password"} required /></label>
            {registerMode && <label className="block text-sm font-medium text-[#111827]">Account type<select name="role" defaultValue="freelancer" className={`${input} mt-1.5`}><option value="freelancer">Freelancer</option><option value="client">Client</option></select></label>}
            {state?.error && <div role="alert" className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-3 text-sm text-[#111827]">{state.error}</div>}
            <button className={`${btn} w-full`} disabled={pending} aria-live="polite">{pending ? "Processing…" : registerMode ? "Create account" : "Sign in"}<ArrowRight size={16} aria-hidden="true" /></button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B7280]">{registerMode ? "Already have an account? " : "Don't have an account? "}<Link href={registerMode ? "/login" : "/register"} className="rounded font-semibold text-[#111827] underline decoration-[#16A34A] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">{registerMode ? "Sign in" : "Create account"}</Link></p>
        </section>
        <p className="mt-5 text-center text-xs text-[#6B7280]">AI support for independent work.</p>
      </div>
    </main>
  );
}
