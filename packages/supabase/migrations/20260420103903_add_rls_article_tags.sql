-- =============================================================================
-- Migration: Add RLS policies for article_tags table
-- Description: 記事タグ関連へのアクセス制御ポリシー
-- =============================================================================

-- RLS 有効化
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシー: 公開記事のタグは全ユーザーが閲覧可能
CREATE POLICY "article_tags_select_published"
  ON article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.is_published = true
    )
  );

-- SELECT ポリシー: 自分の記事のタグは閲覧可能
CREATE POLICY "article_tags_select_own"
  ON article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- INSERT ポリシー: 自分の記事にタグを追加可能
CREATE POLICY "article_tags_insert_own"
  ON article_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- DELETE ポリシー: 自分の記事のタグを削除可能
CREATE POLICY "article_tags_delete_own"
  ON article_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );
