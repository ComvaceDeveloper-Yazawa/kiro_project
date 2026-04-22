-- =============================================================================
-- Migration: Add RLS policies for articles table
-- Description: 記事へのアクセス制御ポリシー
-- =============================================================================

-- RLS 有効化
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシー: 公開記事は全ユーザーが閲覧可能
CREATE POLICY "articles_select_published"
  ON articles FOR SELECT
  USING (is_published = true);

-- SELECT ポリシー: 自分の記事（下書き含む）は閲覧可能
CREATE POLICY "articles_select_own"
  ON articles FOR SELECT
  USING (auth.uid() = author_id);

-- INSERT ポリシー: 認証済みユーザーは記事を作成可能
CREATE POLICY "articles_insert_own"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- UPDATE ポリシー: 自分の記事のみ更新可能
CREATE POLICY "articles_update_own"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- DELETE ポリシー: 自分の記事のみ削除可能
CREATE POLICY "articles_delete_own"
  ON articles FOR DELETE
  USING (auth.uid() = author_id);
