import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { generations, jobAnalyses } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import CopyButton from "@/components/CopyButton";
import { Badge, Card, Empty, PageHeader } from "@/components/Ui";

const LABEL = { analyze: "Job Analysis", proposal: "Proposal Generated", scope: "Scope Generated" } as const;

export default async function Page() {
  const s = await requireUser(["freelancer", "client"]);
  const [analyses, rows] = await Promise.all([
    db.select().from(jobAnalyses).where(eq(jobAnalyses.userId, s.id)).orderBy(desc(jobAnalyses.createdAt)).limit(100),
    db.select().from(generations).where(eq(generations.userId, s.id)).orderBy(desc(generations.createdAt)).limit(500),
  ]);
  const linked = new Map<number, typeof rows>();
  for (const row of rows) {
    if (row.analysisId == null) continue;
    linked.set(row.analysisId, [...(linked.get(row.analysisId) ?? []), row]);
  }
  const analysisIds = new Set(analyses.map((a) => a.id));
  const legacy = rows.filter((row) => row.analysisId == null || !analysisIds.has(row.analysisId));

  return (
    <>
      <PageHeader title="History" hint="Your saved analyses, proposals, and scopes, grouped into project packages." />
      {analyses.length === 0 && legacy.length === 0 ? <Empty title="Nothing here yet. Run an AI tool to create your first project package." /> : (
        <div className="space-y-3">
          {analyses.map((analysis) => {
            const versions = linked.get(analysis.id) ?? [];
            const kinds = new Set(versions.map((row) => row.kind));
            const createdAt = versions.reduce((latest, row) => row.createdAt > latest ? row.createdAt : latest, analysis.createdAt);
            return <Card key={`analysis-${analysis.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{analysis.title}</h2>
                  <p className="mt-1 text-xs text-[#6B7280]">Created {analysis.createdAt.toLocaleDateString()}{createdAt > analysis.createdAt ? ` · Updated ${createdAt.toLocaleDateString()}` : ""}</p>
                </div>
                <Link className="text-sm font-semibold text-[#111827] hover:text-[#111827]" href={`/dashboard/history/${analysis.id}`}>Open project package →</Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>✓ Job Analysis</Badge>
                <Badge>{kinds.has("proposal") ? "✓ Proposal Generated" : "Proposal not generated"}</Badge>
                <Badge>{kinds.has("scope") ? "✓ Scope Generated" : "Scope not generated"}</Badge>
              </div>
            </Card>;
          })}
          {legacy.map((row) => <Card key={`legacy-${row.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><p className="font-medium">{row.title}</p><p className="mt-1 text-xs text-[#6B7280]">Created {row.createdAt.toLocaleDateString()}</p></div>
              <span className="flex items-center gap-2"><Badge>{LABEL[row.kind]}</Badge><CopyButton text={row.output} /></span>
            </div>
            <details><summary className="mt-3 cursor-pointer text-sm text-[#111827]">View result</summary><pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{row.output}</pre></details>
          </Card>)}
        </div>
      )}
    </>
  );
}
