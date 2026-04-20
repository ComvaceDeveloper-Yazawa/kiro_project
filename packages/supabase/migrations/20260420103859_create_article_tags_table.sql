-- =============================================================================
-- Migration: Create article_tags table
-- Description: 記事とタグの多対多関連テーブル
-- =============================================================================

-- article_tags テーブル作成
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);
