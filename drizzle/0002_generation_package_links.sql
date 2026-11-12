-- Additive links for connected project packages and immutable output versions.
ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "job_id" integer REFERENCES "jobs"("id") ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "generations_user_analysis_idx" ON "generations" ("user_id", "analysis_id");
CREATE INDEX IF NOT EXISTS "generations_user_job_idx" ON "generations" ("user_id", "job_id");

-- Backfill pre-existing generations and saved proposal/scope rows where a matching analysis exists.
UPDATE "generations" AS g
SET "analysis_id" = (
  SELECT a."id" FROM "job_analyses" AS a
  WHERE a."user_id" = g."user_id" AND a."title" = g."title" AND a."created_at" <= g."created_at"
  ORDER BY a."created_at" DESC, a."id" DESC LIMIT 1
)
WHERE g."analysis_id" IS NULL AND EXISTS (
  SELECT 1 FROM "job_analyses" AS a
  WHERE a."user_id" = g."user_id" AND a."title" = g."title" AND a."created_at" <= g."created_at"
);
UPDATE "generations" AS g SET "job_id" = a."job_id"
FROM "job_analyses" AS a WHERE g."analysis_id" = a."id" AND g."job_id" IS NULL;

UPDATE "proposals" AS p SET "analysis_id" = (
  SELECT a."id" FROM "job_analyses" AS a
  WHERE a."user_id" = p."user_id" AND a."title" = p."job_title" AND a."created_at" <= p."created_at"
    AND (p."job_id" IS NULL OR a."job_id" = p."job_id")
  ORDER BY a."created_at" DESC, a."id" DESC LIMIT 1
)
WHERE p."analysis_id" IS NULL AND EXISTS (
  SELECT 1 FROM "job_analyses" AS a
  WHERE a."user_id" = p."user_id" AND a."title" = p."job_title" AND a."created_at" <= p."created_at"
    AND (p."job_id" IS NULL OR a."job_id" = p."job_id")
);
UPDATE "scopes" AS s SET "analysis_id" = (
  SELECT a."id" FROM "job_analyses" AS a
  WHERE a."user_id" = s."user_id" AND a."title" = s."title" AND a."created_at" <= s."created_at"
    AND (s."job_id" IS NULL OR a."job_id" = s."job_id")
  ORDER BY a."created_at" DESC, a."id" DESC LIMIT 1
)
WHERE s."analysis_id" IS NULL AND EXISTS (
  SELECT 1 FROM "job_analyses" AS a
  WHERE a."user_id" = s."user_id" AND a."title" = s."title" AND a."created_at" <= s."created_at"
    AND (s."job_id" IS NULL OR a."job_id" = s."job_id")
);
