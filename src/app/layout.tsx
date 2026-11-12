import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Freelance Scope & Proposal Engine",
  description:
    "Analyze freelance jobs, generate winning proposals, create project scopes, and manage client work with AI.",
  keywords: [
    "AI",
    "Freelancing",
    "Proposal Generator",
    "Project Scope",
    "Job Analyzer",
    "Dashboard",
  ],
  authors: [
    {
      name: "AI Freelance Engine",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] text-[#111827] antialiased">{children}</body>
    </html>
  );
}
