-- =============================================================================
-- Migration: Add RLS policies for Storage (images bucket)
-- Description: 画像ストレージへのアクセス制御ポリシー
-- =============================================================================

-- images バケット作成（既に存在する場合はスキップ）
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- SELECT ポリシー: 公開記事の画像は全ユーザーが閲覧可能
CREATE POLICY "images_select_published"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.is_published = true
    )
  );

-- SELECT ポリシー: 自分の記事の画像は閲覧可能
CREATE POLICY "images_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.author_id = auth.uid()
    )
  );

-- INSERT ポリシー: 認証済みユーザーが画像をアップロード可能
CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- DELETE ポリシー: 自分の記事の画像を削除可能
CREATE POLICY "images_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.author_id = auth.uid()
    )
  );
