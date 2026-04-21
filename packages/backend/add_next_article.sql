-- Add next_article_id column to articles table
ALTER TABLE "public"."articles" ADD COLUMN IF NOT EXISTS "next_article_id" UUID;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'articles_next_article_id_fkey'
    ) THEN
        ALTER TABLE "public"."articles" 
        ADD CONSTRAINT "articles_next_article_id_fkey" 
        FOREIGN KEY ("next_article_id") 
        REFERENCES "public"."articles"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS "idx_articles_next_article_id" ON "public"."articles"("next_article_id");
