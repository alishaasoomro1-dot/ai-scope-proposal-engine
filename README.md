# AI Freelance Scope & Proposal Engine

Next.js 16 (App Router) + TypeScript + Tailwind v4 + PostgreSQL (Drizzle ORM) + Groq.

## Setup
1. `docker compose up -d` (or use your own PostgreSQL 14+)
2. `cp .env.example .env` and set `DATABASE_URL`, `AUTH_SECRET`, `GROQ_API_KEY`
3. `npm install`
4. `npm run db:push` (creates tables)
5. `npm run db:seed` (optional demo data)
6. `npm run dev` then open http://localhost:3000

Seed logins (password `Password123!`): `admin@example.com`, `freelancer@example.com`, `client@example.com`.
AI analysis is stored per user and reused by proposal and scope generation when the job inputs match. Set `AI_TIMEOUT_MS` and `AI_MAX_ATTEMPTS` to tune provider reliability. AI tools require a valid `GROQ_API_KEY`.

## Structure
- `src/app` pages and the `api/ai/[kind]` route · `src/actions` server actions · `src/db` schema, connection, seed
- `src/lib/prompts.ts` all AI prompts (edit here) · `src/lib/ai.ts` OpenRouter client · `src/proxy.ts` route gate

## Notes
- Roles: freelancer, client, admin. Make an admin by running the seed, or change a role in the admin panel.
- Profile photo is a URL field (no file upload storage is included).
- Contracts are modeled as accepted proposals: accepting one moves the job to "in progress".
