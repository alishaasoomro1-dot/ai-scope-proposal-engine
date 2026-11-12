import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Password needs at least 8 characters."),
  role: z.enum(["freelancer", "client"], { message: "Choose a role." }),
});
export const loginSchema = z.object({ email: z.string().trim().email("Enter a valid email."), password: z.string().min(1, "Enter your password.") });
export const profileSchema = z.object({
  fullName: z.string().trim().min(2), photoUrl: z.string().trim().default(""), skills: z.string().default(""),
  experience: z.enum(["beginner", "intermediate", "expert"]), portfolio: z.string().default(""),
  hourlyRate: z.coerce.number().int().min(0).max(10000).optional(), bio: z.string().max(2000).default(""), projects: z.string().max(3000).default(""),
});
export const jobSchema = z.object({
  title: z.string().trim().min(3, "Enter a job title.").max(200),
  description: z.string().trim().min(20, "Describe the job in at least 20 characters.").max(8000),
  budget: z.preprocess((value) => value === "" || value == null ? undefined : value, z.coerce.number().int().min(0).max(1_000_000_000).optional()),
});
export const aiInputSchema = z.object({
  title: z.string().trim().min(2, "Add a job title.").max(200),
  description: z.string().trim().min(20, "Describe the job in at least 20 characters.").max(8000),
  jobId: z.number().int().positive().optional(),
  analysisId: z.number().int().positive().optional(),
  budget: z.number().finite().min(0).max(1_000_000_000).optional(),
  platform: z.string().trim().max(80).optional(),
  deadline: z.string().trim().max(120).optional(),
  country: z.string().trim().max(100).optional(),
  metadata: z.record(z.string(), z.union([z.string().max(500), z.number(), z.boolean()])).optional().default({}),
});

export const jobAnalysisSchema = z.object({
  executiveSummary: z.string(), projectCategory: z.string(), subcategory: z.string(), industry: z.string(),
  requiredSkills: z.array(z.string()), optionalSkills: z.array(z.string()), hiddenSkills: z.array(z.string()),
  missingInformation: z.array(z.string()),
  complexityAnalysis: z.object({ level: z.enum(["Low", "Medium", "High"]), reasons: z.array(z.string()), whyDifficult: z.string() }),
  estimatedTimeline: z.object({ clientDeadline: z.string(), estimate: z.string(), assessment: z.string(), basis: z.string() }),
  budgetIntelligence: z.object({ clientBudget: z.string(), assessment: z.string(), reason: z.string(), scopeFit: z.string() }),
  riskAssessment: z.array(z.string()),
  successProbability: z.object({ score: z.number().int().min(0).max(100), assessment: z.string(), drivers: z.array(z.string()) }),
  questionsToAskClient: z.array(z.string()), hiddenRequirements: z.array(z.string()), deliverablesPrediction: z.array(z.string()),
  recommendedTechStack: z.array(z.object({ item: z.string(), basis: z.enum(["Explicit", "Inferred"]), confidence: z.enum(["Low", "Medium", "High"]) })),
  redFlags: z.array(z.string()), finalRecommendation: z.enum(["Proceed", "Clarify first", "Decline"]),
  recommendationReason: z.string(), confidenceScore: z.number().int().min(0).max(100),
});
