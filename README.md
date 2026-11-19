# AI Freelance Scope & Proposal Engine

A modern AI-powered freelancing platform built with Next.js 16, TypeScript, Tailwind CSS 4, PostgreSQL, Drizzle ORM, and Groq AI.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Drizzle ORM
- Groq AI

## Setup

1. Start PostgreSQL:

```bash
docker compose up -d
```

Or use any PostgreSQL 14+ database.

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Configure the following variables inside `.env`:

- DATABASE_URL
- AUTH_SECRET
- GROQ_API_KEY

4. Install dependencies:

```bash
npm install
```

5. Create database tables:

```bash
npm run db:push
```

6. (Optional) Seed demo data:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

8. Open:

```
http://localhost:3000
```

## Demo Accounts

Password for all accounts:

```
Password123!
```

| Role | Email |
|------|-------|
| Admin | admin@example.com |
| Freelancer | freelancer@example.com |
| Client | client@example.com |

## AI Features

- AI Job Analysis
- AI Proposal Generation
- AI Scope Generation
- Analysis reuse for matching jobs
- Configurable timeout and retry settings

Required environment variables:

- GROQ_API_KEY
- OPENROUTER_API_KEY
- AI_TIMEOUT_MS
- AI_MAX_ATTEMPTS

## Project Structure

```text
src/
├── app/                 # Pages and API routes
├── actions/             # Server Actions
├── db/                  # Database schema and seed files
├── lib/
│   ├── ai.ts            # Groq AI client
│   └── prompts.ts       # AI prompts
└── proxy.ts             # Dashboard route protection
```

## Notes

- Supported roles:
  - Admin
  - Freelancer
  - Client

- Profile photos use image URLs.
- File upload storage is not included.
- Accepted proposals become contracts.
- Accepted contracts are marked as `in_progress`.