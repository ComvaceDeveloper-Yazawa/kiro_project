# マイグレーション実行手順

## 次に読む記事機能のデータベース更新

### 方法1: Supabaseダッシュボードから実行（推奨）

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 左メニューから「SQL Editor」を選択
4. 以下のSQLを実行:

```sql
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
```

5. 「Run」ボタンをクリック

### 方法2: psqlコマンドから実行

```bash
# .envファイルからDATABASE_URLを取得
cd packages/backend
source .env

# SQLファイルを実行
psql $DATABASE_URL -f add_next_article.sql
```

### 確認

マイグレーションが成功したか確認:

```sql
-- next_article_idカラムが追加されているか確認
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'articles'
  AND column_name = 'next_article_id';

-- インデックスが作成されているか確認
SELECT indexname
FROM pg_indexes
WHERE tablename = 'articles'
  AND indexname = 'idx_articles_next_article_id';

-- 外部キー制約が作成されているか確認
SELECT conname
FROM pg_constraint
WHERE conname = 'articles_next_article_id_fkey';
```

## 完了後

1. バックエンドサーバーを再起動
2. フロントエンドの開発サーバーを再起動
3. ブラウザのキャッシュをクリア（Cmd+Shift+R）

## トラブルシューティング

### エラー: column "next_article_id" already exists

すでにカラムが存在しています。問題ありません。

### エラー: constraint "articles_next_article_id_fkey" already exists

すでに制約が存在しています。問題ありません。

### エラー: relation "idx_articles_next_article_id" already exists

すでにインデックスが存在しています。問題ありません。

すべて`IF NOT EXISTS`句を使用しているため、既に存在する場合はスキップされます。
