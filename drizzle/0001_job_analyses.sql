-- Additive AI analysis storage. Existing records and tables are preserved.
CREATE TABLE IF NOT EXISTS "job_analyses" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "job_id" integer REFERENCES "jobs"("id") ON DELETE SET NULL,
  "input_hash" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "analysis" jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "job_analyses_user_hash_idx" ON "job_analyses" ("user_id", "input_hash");
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "analysis_id" integer REFERENCES "job_analyses"("id") ON DELETE SET NULL;
ALTER TABLE "scopes" ADD COLUMN IF NOT EXISTS "analysis_id" integer REFERENCES "job_analyses"("id") ON DELETE SET NULL;
ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "analysis_id" integer REFERENCES "job_analyses"("id") ON DELETE SET NULL;
