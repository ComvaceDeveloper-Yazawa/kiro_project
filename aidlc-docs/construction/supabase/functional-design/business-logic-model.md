# ビジネスロジックモデル - Unit 2: supabase

## パッケージの性質

supabase パッケージはアプリケーションコードを持たない「インフラ管理専用パッケージ」です。
Supabase CLI を通じて DB スキーマ・RLS ポリシー・設定を管理します。

---

## 確定した設計方針

| 決定事項          | 内容                                                       |
| ----------------- | ---------------------------------------------------------- |
| ローカル開発環境  | リモート Supabase プロジェクトに直接接続（Docker 不要）    |
| RLS 管理          | マイグレーションファイルに SQL で記述（Supabase CLI 管理） |
| profiles テーブル | 作成しない（`auth.users` のみ使用）                        |
| Edge Functions    | 不使用（Fastify バックエンドで完結）                       |
| Prisma 接続       | マイグレーション: Direct / アプリ実行: Pooler（Pgbouncer） |

---

## ディレクトリ構成（確定）

```
packages/supabase/
├── migrations/           # Supabase CLI 管理のマイグレーションファイル
│   └── .gitkeep          # 空ディレクトリ保持用
├── seed.sql              # 開発用シードデータ（空）
├── config.toml           # Supabase CLI プロジェクト設定
└── CODING_STANDARDS.md   # このパッケージのコーディング規約
```

---

## 開発ワークフロー

### リモート接続フロー（Q1: B）

```
1. supabase login                    # Supabase アカウントにログイン
2. supabase link --project-ref <id>  # リモートプロジェクトに接続
3. supabase db pull                  # リモートの現在のスキーマをローカルに取り込む
4. （スキーマ変更）
5. supabase migration new <name>     # 新しいマイグレーションファイルを作成
6. （SQL を記述）
7. supabase db push                  # リモートにマイグレーションを適用
```

### Prisma との連携フロー

```
マイグレーション適用後:
  supabase db push（Direct 接続でスキーマ変更）
    ↓
  prisma db pull（Prisma スキーマを DB から同期）
    ↓
  prisma generate（Prisma Client を再生成）
```

---

## RLS ポリシー設計（Q2: A）

RLS ポリシーはマイグレーションファイルに SQL で記述し、Supabase CLI で管理します。

### 基本方針

- すべてのテーブルで RLS を有効化（`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`）
- `auth.uid()` を使って認証済みユーザーのみアクセス可能にする
- ポリシーは「最小権限」原則に従い、必要な操作のみ許可

### RLS ポリシーの標準パターン

```sql
-- テーブルの RLS 有効化
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- 自分のデータのみ SELECT 可能
CREATE POLICY "{table_name}_select_own"
  ON {table_name}
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のデータのみ INSERT 可能
CREATE POLICY "{table_name}_insert_own"
  ON {table_name}
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分のデータのみ UPDATE 可能
CREATE POLICY "{table_name}_update_own"
  ON {table_name}
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分のデータのみ DELETE 可能
CREATE POLICY "{table_name}_delete_own"
  ON {table_name}
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## auth.users との連携（Q3: B）

`profiles` テーブルは作成しません。ユーザー情報は `auth.users` のみで管理します。

### Fastify での auth.users 参照

```typescript
// backend の auth.plugin.ts で JWT を検証し、
// request.user に Supabase の User オブジェクトを付与する
// → usecase 層で request.user.id を使って RLS の auth.uid() と照合
```

### 将来的に profiles が必要になった場合

以下のマイグレーションパターンを使用します（現時点では不要）:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 追加フィールド
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```
