export type AiKind = "analyze" | "proposal" | "scope";
export const AI_KINDS: AiKind[] = ["analyze", "proposal", "scope"];

export type PackageGeneration = {
  id: number;
  kind: AiKind;
  title: string;
  output: string;
  createdAt: Date;
};

// Stable, export-ready representation used by the package detail view.
export type FreelancePackageExport = {
  formatVersion: 1;
  packageId: number;
  createdAt: string;
  job: { id: number | null; title: string; description: string; metadata: Record<string, unknown> };
  analysis: Record<string, unknown>;
  versions: { proposals: PackageGeneration[]; scopes: PackageGeneration[] };
};
