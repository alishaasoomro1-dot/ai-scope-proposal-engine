import { SYSTEM } from "@/lib/prompts";

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const TIMEOUT_MS = Math.min(Math.max(Number(process.env.AI_TIMEOUT_MS) || 45_000, 5_000), 120_000);
const MAX_ATTEMPTS = Math.min(Math.max(Number(process.env.AI_MAX_ATTEMPTS) || 3, 1), 4);

export class AiServiceError extends Error {
  constructor(message: string, public status = 502, options?: ErrorOptions) {
    super(message, options);
    this.name = "AiServiceError";
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generate(prompt: string): Promise<string> {
  if (!API_KEY) throw new AiServiceError("AI service is not configured.", 503);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 3000,
        }),
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (error) {
      clearTimeout(timer);
      const timedOut = error instanceof Error && error.name === "AbortError";
      if (attempt < MAX_ATTEMPTS) { await wait(250 * 2 ** (attempt - 1)); continue; }
      console.error("AI provider request failed", { model: MODEL, timedOut });
      throw new AiServiceError(timedOut ? "The AI request timed out. Please try again." : "The AI provider is temporarily unavailable.", 504);
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500;
      if (retryable && attempt < MAX_ATTEMPTS) {
        const retryAfter = Number(response.headers.get("retry-after"));
        await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 300 * 2 ** (attempt - 1));
        continue;
      }
      console.error("AI provider returned an error", { model: MODEL, status: response.status });
      throw new AiServiceError(response.status === 429 ? "AI service is busy. Please try again shortly." : "The AI provider could not complete this request.", response.status === 429 ? 429 : 502);
    }

    try {
      const data = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
      const output = data.choices?.[0]?.message?.content?.trim();
      if (!output) throw new Error("Empty provider response");
      return output;
    } catch {
      console.error("AI provider returned an invalid response", { model: MODEL });
      throw new AiServiceError("The AI provider returned an invalid response. Please retry.");
    }
  }
  throw new AiServiceError("The AI request could not be completed.");
}

export function section(text: string, title: string): string {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp(`## ${escaped}[\\s\\S]*?(?=##|$)`, "i"))?.[0] ?? "";
}
