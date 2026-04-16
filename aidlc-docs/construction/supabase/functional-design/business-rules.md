# ビジネスルール - Unit 2: supabase

## 1. マイグレーションファイルの命名規則

Supabase CLI が自動生成するタイムスタンププレフィックスを使用します。

```
{YYYYMMDDHHMMSS}_{description}.sql
例: 20260415000000_create_posts_table.sql
    20260415000001_add_rls_policies_to_posts.sql
```

### ルール 1: 1マイグレーション = 1つの変更単位

```sql
-- ✅ 推奨: テーブル作成とRLS設定を別ファイルに分ける
-- 20260415000000_create_posts_table.sql
CREATE TABLE posts ( ... );

-- 20260415000001_add_rls_to_posts.sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...

-- ❌ 非推奨: 複数の無関係な変更を1ファイルにまとめる
```

### ルール 2: マイグレーションは冪等に書く

```sql
-- ✅ 推奨: IF NOT EXISTS / IF EXISTS を使う
CREATE TABLE IF NOT EXISTS posts ( ... );
DROP TABLE IF EXISTS old_table;

-- ❌ 非推奨: 冪等でない記述（再実行でエラーになる）
CREATE TABLE posts ( ... );
```

### ルール 3: マイグレーションファイルは一度コミットしたら編集しない

適用済みのマイグレーションを修正する場合は、新しいマイグレーションファイルを作成します。

---

## 2. RLS ポリシーの命名規則

```
{table_name}_{operation}_{scope}
例: posts_select_own
    posts_insert_own
    posts_update_own
    posts_delete_own
```

### ルール 4: すべてのテーブルで RLS を有効化する（SECURITY-06 対応）

```sql
-- ✅ 必須: テーブル作成後に必ず RLS を有効化
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- ❌ 禁止: RLS なしのテーブルを本番環境に置く
```

### ルール 5: デフォルトは「拒否」、必要な操作のみ許可する

```sql
-- RLS を有効化するとデフォルトですべてのアクセスが拒否される
-- 必要な操作のみ明示的にポリシーで許可する（deny-by-default）
```

### ルール 6: `auth.uid()` を使って認証済みユーザーのみアクセス可能にする

```sql
-- ✅ 推奨
USING (auth.uid() = user_id)

-- ❌ 禁止: 認証なしで全データにアクセス可能なポリシー
USING (true)  -- 全ユーザーに公開（意図的な場合のみ許可・コメント必須）
```

---

## 3. Prisma 接続方式の使い分け

| 用途                                | 接続方式                       | 環境変数                                |
| ----------------------------------- | ------------------------------ | --------------------------------------- |
| `prisma migrate` / `prisma db pull` | Direct connection              | `DATABASE_URL`                          |
| アプリ実行時（Fastify）             | Connection Pooler（Pgbouncer） | `DATABASE_URL`（Pooler URL に切り替え） |

### ルール 7: 接続文字列は環境変数で管理し、コードに直書きしない（SECURITY-12 対応）

```bash
# .env（gitignore 必須）
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Pooler URL（アプリ実行用）
  directUrl = env("DIRECT_URL")     // Direct URL（マイグレーション用）
}
```

---

## 4. seed.sql のルール

### ルール 8: seed.sql は開発・テスト環境専用

```sql
-- seed.sql の先頭に必ず環境チェックコメントを記載
-- WARNING: このファイルは開発・テスト環境専用です。本番環境では実行しないでください。

-- 開発用テストデータ
INSERT INTO posts (id, title, user_id) VALUES
  ('...', 'テスト投稿1', '...');
```

### ルール 9: seed.sql は冪等に書く

```sql
-- ✅ 推奨: 既存データを削除してから挿入
TRUNCATE TABLE posts CASCADE;
INSERT INTO posts ...

-- または ON CONFLICT DO NOTHING を使う
INSERT INTO posts (...) VALUES (...) ON CONFLICT DO NOTHING;
```

---

## 5. config.toml のルール

### ルール 10: project_id は環境変数または .env.local で管理

```toml
# config.toml（リポジトリにコミット可）
[api]
port = 54321

# .env.local（gitignore 必須）
SUPABASE_PROJECT_ID=your-project-ref
```

---

## 6. セキュリティ対応（SECURITY ルール）

| SECURITY ルール             | 対応内容                                              |
| --------------------------- | ----------------------------------------------------- |
| SECURITY-01（暗号化）       | Supabase はデフォルトで保存データ暗号化・TLS 強制済み |
| SECURITY-06（最小権限）     | RLS で deny-by-default・必要な操作のみ許可            |
| SECURITY-07（ネットワーク） | Supabase ダッシュボードで IP 制限を設定（本番時）     |
| SECURITY-12（認証管理）     | 接続文字列は環境変数管理・コード直書き禁止            |
