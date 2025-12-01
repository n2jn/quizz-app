-- AlterTable
ALTER TABLE "users" RENAME COLUMN "username" TO "name";

-- Drop the unique constraint on the old column name and recreate it
-- Note: PostgreSQL automatically renames the constraint when renaming the column
