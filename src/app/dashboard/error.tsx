"use client";
import { btn } from "@/components/Ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <div role="alert" className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><p className="text-sm text-[#111827]">Something went wrong loading this page. Check that the database is running.</p><button className={`${btn} mt-4`} onClick={reset}>Try again</button></div>;
}
