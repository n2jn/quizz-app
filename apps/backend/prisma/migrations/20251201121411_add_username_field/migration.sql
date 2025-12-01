-- Drop the existing constraint if it exists from previous attempts
DROP INDEX IF EXISTS "users_username_key";

-- Check if username column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'username'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "username" VARCHAR(20);

        -- Populate username from name for existing records
        UPDATE "users"
        SET "username" = LOWER(REPLACE(SUBSTRING("name", 1, 20), ' ', '_'));

        -- Make username NOT NULL
        ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
    END IF;
END $$;

-- Create unique index (with IF NOT EXISTS logic)
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
