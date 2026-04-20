-- =============================================================================
-- Migration: Create tags table
-- Description: 記事を分類するためのタグテーブル
-- =============================================================================

-- tags テーブル作成
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
