-- =============================================================================
-- Migration: Create article_images table
-- Description: 記事に関連する画像のメタデータテーブル
-- =============================================================================

-- article_images テーブル作成
CREATE TABLE IF NOT EXISTS article_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);
