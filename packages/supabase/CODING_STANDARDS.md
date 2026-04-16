# コーディング規約 — packages/supabase

このパッケージは Supabase CLI を通じて DB スキーマ・RLS ポリシー・設定を管理します。
アプリケーションコードは含みません。

---

## 1. 開発ワークフロー

### 初回セットアップ

```bash
# 1. Supabase CLI インストール
brew install supabase/tap/supabase

# 2. ログイン
supabase login

# 3. リモートプロジェクトに接続
supabase link --project-ref <project-ref>

# 4. リモートの現在のスキーマをローカルに取り込む
supabase db pull
```

### スキーマ変更の手順

```bash
# 1. 新しいマイグレーションファイルを作成
supabase migration new <description>
# 例: supabase migration new create_posts_table

# 2. 生成されたファイル（migrations/YYYYMMDDHHMMSS_<description>.sql）に SQL を記述

# 3. リモートに適用
supabase db push

# 4. Prisma スキーマを同期（backend パッケージで実行）
cd ../backend
pnpm prisma db pull
pnpm prisma generate
```

---

## 2. マイグレーションファイルの命名規則

```
{YYYYMMDDHHMMSS}_{description}.sql
```

| 規則             | 例                                              |
| ---------------- | ----------------------------------------------- |
| テーブル作成     | `20260415000000_create_posts_table.sql`         |
| カラム追加       | `20260415000001_add_published_to_posts.sql`     |
| RLS 追加         | `20260415000002_add_rls_to_posts.sql`           |
| インデックス追加 | `20260415000003_add_index_to_posts_user_id.sql` |

### ルール

- 1マイグレーション = 1つの変更単位（テーブル作成と RLS は別ファイル推奨）
- 冪等に書く（`IF NOT EXISTS` / `IF EXISTS` を使う）
- 一度コミットしたマイグレーションは編集しない（新しいファイルで修正する）

---

## 3. RLS（Row Level Security）ポリシーの書き方

### 必須: すべてのテーブルで RLS を有効化する

```sql
-- テーブル作成後に必ず追加
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;
```

### 標準パターン（自分のデータのみ操作可能）

```sql
-- SELECT: 自分のデータのみ
CREATE POLICY "{table_name}_select_own"
  ON {table_name} FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 自分のデータのみ
CREATE POLICY "{table_name}_insert_own"
  ON {table_name} FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分のデータのみ
CREATE POLICY "{table_name}_update_own"
  ON {table_name} FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分のデータのみ
CREATE POLICY "{table_name}_delete_own"
  ON {table_name} FOR DELETE
  USING (auth.uid() = user_id);
```

### ポリシー命名規則

```
{table_name}_{operation}_{scope}
例: posts_select_own / posts_insert_own
```

### 禁止事項

```sql
-- ❌ 禁止: 全ユーザーに公開するポリシー（意図的な場合はコメント必須）
CREATE POLICY "allow_all" ON {table_name} FOR SELECT USING (true);
```

---

## 4. Prisma との接続方式

| 用途                                | 接続方式                       | 環境変数       |
| ----------------------------------- | ------------------------------ | -------------- |
| `prisma migrate` / `prisma db pull` | Direct connection              | `DIRECT_URL`   |
| アプリ実行時（Fastify）             | Connection Pooler（Pgbouncer） | `DATABASE_URL` |

```prisma
// backend/prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Pooler URL（アプリ実行用）
  directUrl = env("DIRECT_URL")     // Direct URL（マイグレーション用）
}
```

```bash
# backend/.env（gitignore 必須）
# Pooler URL（Transaction mode）
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct URL
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

---

## 5. seed.sql のルール

- 開発・テスト環境専用（本番では実行しない）
- 冪等に書く（`TRUNCATE + INSERT` または `ON CONFLICT DO NOTHING`）
- `auth.users` への直接 INSERT は避ける（Supabase Auth 経由で作成）

---

## 6. セキュリティ対応

| 項目          | 対応                                                |
| ------------- | --------------------------------------------------- |
| 接続文字列    | `.env` で管理・コード直書き禁止・`.gitignore` 必須  |
| RLS           | 全テーブルで有効化・deny-by-default                 |
| `config.toml` | `project_id` 等の機密情報は `.env.local` に分離     |
| 本番環境      | `enable_confirmations = true` に変更・IP 制限を設定 |
