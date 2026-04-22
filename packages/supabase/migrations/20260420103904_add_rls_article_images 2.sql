-- =============================================================================
-- Migration: Add RLS policies for article_images table
-- Description: 記事画像へのアクセス制御ポリシー
-- =============================================================================

-- RLS 有効化
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシー: 公開記事の画像は全ユーザーが閲覧可能
CREATE POLICY "article_images_select_published"
  ON article_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.is_published = true
    )
  );

-- SELECT ポリシー: 自分の記事の画像は閲覧可能
CREATE POLICY "article_images_select_own"
  ON article_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- INSERT ポリシー: 自分の記事に画像を追加可能
CREATE POLICY "article_images_insert_own"
  ON article_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- DELETE ポリシー: 自分の記事の画像を削除可能
CREATE POLICY "article_images_delete_own"
  ON article_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );
