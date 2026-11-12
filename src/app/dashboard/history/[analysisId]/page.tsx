import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { generations, jobAnalyses } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { section } from "@/lib/ai";
import type { FreelancePackageExport, PackageGeneration } from "@/types";
import CopyButton from "@/components/CopyButton";
import { Badge, Card, PageHeader, btnGhost } from "@/components/Ui";

const stringField = (value: unknown) => typeof value === "string" && value.trim() ? value : "Not available";
const lines = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

function OutputVersions({ title, versions, heading }: { title: string; versions: PackageGeneration[]; heading: string }) {
  return <Card>
    <h2 className="mb-3 text-lg font-semibold">{title}</h2>
    {versions.length === 0 ? <p className="text-sm text-[#6B7280]">No {title.toLowerCase()} generated for this analysis yet.</p> : <div className="space-y-3">
      {versions.map((version, index) => <details key={version.id} className="rounded-xl border border-[#E5E7EB] p-4" open={index === versions.length - 1}>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 font-medium">
          <span>{title} Version {versions.length - index}</span>
          <span className="flex items-center gap-2 text-xs text-[#6B7280]"><Badge>{version.createdAt.toLocaleDateString()}</Badge><CopyButton text={version.output} /></span>
        </summary>
        <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6">{version.output}</pre>
      </details>)}
    </div>}
    <Link href={heading} className={`${btnGhost} mt-4 inline-flex`}>Generate another version</Link>
  </Card>;
}

export default async function PackagePage({ params }: { params: Promise<{ analysisId: string }> }) {
  const session = await requireUser(["freelancer", "client"]);
  const { analysisId: rawId } = await params;
  const analysisId = Number(rawId);
  if (!Number.isSafeInteger(analysisId) || analysisId < 1) notFound();

  const analysisRow = await db.query.jobAnalyses.findFirst({
    where: and(eq(jobAnalyses.id, analysisId), eq(jobAnalyses.userId, session.id)),
  });
  if (!analysisRow) notFound();

  const generationsRows = await db.select().from(generations)
    .where(and(eq(generations.userId, session.id), eq(generations.analysisId, analysisId)))
    .orderBy(asc(generations.createdAt), asc(generations.id));
  const analysis = analysisRow.analysis;
  const proposals = generationsRows.filter((row) => row.kind === "proposal");
  const scopes = generationsRows.filter((row) => row.kind === "scope");
  const exportPackage: FreelancePackageExport = {
    formatVersion: 1,
    packageId: analysisRow.id,
    createdAt: analysisRow.createdAt.toISOString(),
    job: { id: analysisRow.jobId, title: analysisRow.title, description: analysisRow.description, metadata: analysisRow.metadata },
    analysis,
    versions: {
      proposals: proposals.map(({ id, kind, title, output, createdAt }) => ({ id, kind, title, output, createdAt })),
      scopes: scopes.map(({ id, kind, title, output, createdAt }) => ({ id, kind, title, output, createdAt })),
    },
  };
  const complexity = analysis.complexityAnalysis && typeof analysis.complexityAnalysis === "object" ? (analysis.complexityAnalysis as Record<string, unknown>).level : "Not available";
  const budget = analysis.budgetIntelligence && typeof analysis.budgetIntelligence === "object" ? (analysis.budgetIntelligence as Record<string, unknown>) : {};
  const latestScope = scopes.at(-1)?.output;
  const scopeSections = latestScope ? ["Deliverables", "Milestones", "Timeline", "Terms"].map((name) => section(latestScope, name)).filter(Boolean) : [];

  return <>
    <PageHeader title="Project Package" hint={`${analysisRow.title} · Analysis version ${analysisRow.id}`} />
    <div className="mb-6 flex flex-wrap gap-3">
      <Link className={btnGhost} href={`/dashboard/proposals?analysisId=${analysisRow.id}`}>Regenerate proposal</Link>
      <Link className={btnGhost} href={`/dashboard/scopes?analysisId=${analysisRow.id}`}>Regenerate scope</Link>
      <Link className={btnGhost} href={`/dashboard/analyzer?analysisId=${analysisRow.id}`}>Create new analysis</Link>
      <CopyButton text={JSON.stringify(exportPackage, null, 2)} />
    </div>

    <div className="space-y-5">
      <Card>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Job Analysis</h2><Badge>Version {analysisRow.id}</Badge></div>
        <p className="text-sm leading-6 text-[#111827]">{stringField(analysis.executiveSummary)}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold">Required skills</dt><dd className="mt-1 text-sm text-[#111827]">{lines(analysis.requiredSkills).join(", ") || "Not available"}</dd></div>
          <div><dt className="text-sm font-semibold">Difficulty</dt><dd className="mt-1 text-sm text-[#111827]">{stringField(complexity)}</dd></div>
          <div><dt className="text-sm font-semibold">Budget</dt><dd className="mt-1 text-sm text-[#111827]">{stringField(budget.clientBudget)} · {stringField(budget.assessment)}</dd></div>
          <div><dt className="text-sm font-semibold">Timeline</dt><dd className="mt-1 text-sm text-[#111827]">{analysis.estimatedTimeline && typeof analysis.estimatedTimeline === "object" ? stringField((analysis.estimatedTimeline as Record<string, unknown>).estimate) : "Not available"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm font-semibold">Risks</dt><dd className="mt-1 text-sm text-[#111827]">{lines(analysis.riskAssessment).length ? lines(analysis.riskAssessment).map((risk, i) => <span key={i} className="block">• {risk}</span>) : "Not available"}</dd></div>
        </dl>
      </Card>

      <OutputVersions title="Proposal" versions={exportPackage.versions.proposals} heading={`/dashboard/proposals?analysisId=${analysisRow.id}`} />
      <OutputVersions title="Scope" versions={exportPackage.versions.scopes} heading={`/dashboard/scopes?analysisId=${analysisRow.id}`} />
      {latestScope && <Card><h2 className="mb-3 font-semibold">Scope highlights</h2><div className="space-y-3">{scopeSections.map((part, i) => <pre key={i} className="whitespace-pre-wrap font-sans text-sm leading-6">{part}</pre>)}</div></Card>}
    </div>
  </>;
}
