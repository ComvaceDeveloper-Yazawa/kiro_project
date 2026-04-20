-- =============================================================================
-- Migration: Add RLS policies for tags table
-- Description: タグへのアクセス制御ポリシー
-- =============================================================================

-- RLS 有効化
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシー: 全ユーザーがタグを閲覧可能
CREATE POLICY "tags_select_all"
  ON tags FOR SELECT
  USING (true);

-- INSERT ポリシー: 認証済みユーザーがタグを作成可能
CREATE POLICY "tags_insert_authenticated"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
