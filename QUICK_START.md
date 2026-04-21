# 🚀 クイックスタートガイド

技術ブログアプリケーションを5分でセットアップ！

## 📋 前提条件

- Node.js 20以上
- pnpm
- Supabase アカウント

## 🔧 セットアップ

### 1. Supabase プロジェクトの作成

1. https://supabase.com にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例: tech-blog）
4. データベースパスワードを設定
5. リージョンを選択（Japan推奨）
6. 「Create new project」をクリック

### 2. Supabase 認証情報の取得

プロジェクト作成後、以下の情報を取得：

1. **Project URL**
   - Settings → API → Project URL
   - 例: `https://abcdefghijklmnop.supabase.co`

2. **Anon Key**
   - Settings → API → Project API keys → anon public
   - 例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Service Role Key**
   - Settings → API → Project API keys → service_role
   - ⚠️ **重要**: この鍵は絶対に公開しないでください！

### 3. データベースのセットアップ

#### マイグレーションの実行

```bash
cd packages/backend
pnpm install
pnpm db:push
```

#### Supabase Storage バケットの作成

1. Supabase Dashboard → Storage
2. 「New bucket」をクリック
3. バケット名: `images`
4. Public bucket: **ON**
5. 「Create bucket」をクリック

#### RLS ポリシーの設定

Supabase Dashboard → SQL Editor で以下を実行：

```sql
-- 全ユーザーが画像を閲覧可能
CREATE POLICY "images_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- 認証済みユーザーが画像をアップロード可能
CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );
```

### 4. 環境変数の設定

#### バックエンド

`packages/backend/.env` を作成：

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres?pgbouncer=true

# Server
PORT=3000
HOST=0.0.0.0

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limit
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
```

**DATABASE_URL の取得方法**:

- Supabase Dashboard → Settings → Database → Connection string → URI
- `[password]` を実際のデータベースパスワードに置き換える

#### フロントエンド

`packages/frontend/.env` を作成：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000
```

### 5. テストユーザーの作成

```bash
cd packages/backend
pnpm create-test-user
```

以下のような出力が表示されます：

```
✅ テストユーザーを作成しました！

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ログイン情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: test@example.com
🔑 Password: test1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. アプリケーションの起動

#### ターミナル1: バックエンド

```bash
cd packages/backend
pnpm dev
```

#### ターミナル2: フロントエンド

```bash
cd packages/frontend
pnpm dev
```

### 7. ログイン

1. ブラウザで http://localhost:5173 を開く
2. 「🧪 テストユーザー」セクションの「テストユーザーで入力」ボタンをクリック
3. 「ログイン」ボタンをクリック

## ✅ 動作確認

### 記事の作成

1. ログイン後、「記事を書く」または `/articles/new` にアクセス
2. タイトルを入力
3. 本文をMarkdownで入力
4. タグを追加
5. 「公開」ボタンをクリック

### 画像のアップロード

#### 方法1: ドラッグ&ドロップ

1. 記事作成画面で画像ファイルをエディタにドラッグ&ドロップ
2. 自動的にMarkdown記法で挿入される

#### 方法2: カバー画像

1. 「カバー画像を追加」をクリック
2. 画像ファイルを選択
3. プレビューが表示される

## 🐛 トラブルシューティング

### ログインできない（Invalid login credentials）

**原因**: テストユーザーが作成されていない

**解決策**:

```bash
cd packages/backend
pnpm create-test-user
```

### 画像アップロードで 401 エラー

**原因**: 認証トークンが保存されていない

**解決策**:

1. 一度ログアウト
2. 再度ログイン
3. ブラウザの開発者ツール → Console で「✅ 認証トークンを保存しました」が表示されることを確認

### データベース接続エラー

**原因**: DATABASE_URL が正しくない

**解決策**:

1. Supabase Dashboard → Settings → Database → Connection string
2. URI をコピー
3. `[password]` を実際のパスワードに置き換える
4. `packages/backend/.env` の `DATABASE_URL` を更新

### Supabase Storage エラー

**原因**: `images` バケットが作成されていない

**解決策**:

1. Supabase Dashboard → Storage
2. 「New bucket」をクリック
3. バケット名: `images`、Public bucket: ON
4. RLS ポリシーを設定（上記参照）

## 📚 詳細ドキュメント

- [認証機能のセットアップ](docs/AUTHENTICATION_SETUP.md)
- [画像アップロード機能のセットアップ](docs/IMAGE_UPLOAD_SETUP.md)
- [技術ブログAPI仕様](docs/TECH_BLOG_API.md)

## 🎯 次のステップ

1. 記事を作成して公開
2. 画像をアップロード
3. タグで記事を検索
4. Notion風のエディタを体験

## 💡 ヒント

- **フルスクリーンモード**: ツールバーの ⛶ ボタンをクリック
- **プレビュー表示**: ツールバーの 👁️ ボタンをクリック
- **キーボードショートカット**:
  - Ctrl/Cmd + B: 太字
  - Ctrl/Cmd + I: 斜体
  - Ctrl/Cmd + K: リンク
  - Ctrl/Cmd + E: コード
  - ESC: フルスクリーン解除

## 🆘 サポート

問題が解決しない場合は、以下を確認してください：

1. Node.js のバージョン（20以上）
2. pnpm がインストールされているか
3. Supabase プロジェクトが有効か
4. 環境変数が正しく設定されているか
5. ポート 3000 と 5173 が使用可能か

それでも解決しない場合は、GitHub Issues で報告してください。
