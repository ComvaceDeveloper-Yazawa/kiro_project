# Vercelデプロイ クイックスタート

このガイドでは、最短でVercelにデプロイする手順を説明します。

## 📋 事前準備

1. ✅ Vercelアカウントを作成: https://vercel.com/signup
2. ✅ GitHubにリポジトリをプッシュ
3. ✅ Supabaseプロジェクトを作成: https://supabase.com
4. ✅ Supabaseの接続情報を取得:
   - Project Settings → Database → Connection string
   - Transaction mode (Pooler) → `DATABASE_URL`
   - Direct connection → `DIRECT_URL`
   - Project Settings → API → `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 ステップ1: バックエンドをデプロイ

### 1. Vercelプロジェクトを作成

1. https://vercel.com/new にアクセス
2. GitHubリポジトリを選択
3. プロジェクト名: `tech-blog-backend`

### 2. 設定

**Root Directory**: `packages/backend`

**Build Command**: `pnpm install && pnpm --filter @monorepo/backend db:generate`

**Install Command**: `pnpm install`

### 3. 環境変数を追加

```bash
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.xxxxx:password@...pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:password@...pooler.supabase.com:5432/postgres
CORS_ORIGIN=*
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
```

### 4. デプロイ

"Deploy"をクリック → URLをメモ（例: `https://tech-blog-backend.vercel.app`）

---

## 🎨 ステップ2: フロントエンドをデプロイ

### 1. Vercelプロジェクトを作成

1. https://vercel.com/new にアクセス
2. **同じGitHubリポジトリ**を選択
3. プロジェクト名: `tech-blog-frontend`

### 2. 設定

**Root Directory**: `./`

**Build Command**: `pnpm build:frontend`

**Output Directory**: `packages/frontend/dist`

**Install Command**: `pnpm install`

### 3. 環境変数を追加

```bash
VITE_API_BASE_URL=https://tech-blog-backend.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. デプロイ

"Deploy"をクリック → URLをメモ（例: `https://tech-blog-frontend.vercel.app`）

---

## 🔧 ステップ3: CORS設定を更新

### 1. バックエンドの環境変数を更新

1. バックエンドプロジェクト → Settings → Environment Variables
2. `CORS_ORIGIN`を更新:

```bash
CORS_ORIGIN=https://tech-blog-frontend.vercel.app
```

### 2. 再デプロイ

Deployments → 最新デプロイの "..." → "Redeploy"

---

## ✅ 完了！

フロントエンドのURLにアクセスして動作を確認してください。

**フロントエンド**: https://tech-blog-frontend.vercel.app

**バックエンド**: https://tech-blog-backend.vercel.app

---

## 🐛 問題が発生した場合

### バックエンドが動作しない

1. Deployments → 最新デプロイ → "View Function Logs"
2. エラーメッセージを確認
3. 環境変数が正しく設定されているか確認

### フロントエンドからAPIにアクセスできない

1. ブラウザの開発者ツール → Console
2. CORSエラーが表示されている場合:
   - バックエンドの`CORS_ORIGIN`を確認
   - バックエンドを再デプロイ

### データベースに接続できない

1. `DATABASE_URL`と`DIRECT_URL`を確認
2. Supabase Dashboardで接続文字列を再確認
3. `?pgbouncer=true`が`DATABASE_URL`に含まれているか確認

---

## 📚 詳細ガイド

より詳しい情報は [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) を参照してください。

---

## 💡 ヒント

### 環境変数のテンプレート

環境変数をコピー＆ペーストしやすいように、テンプレートを用意しています：

**バックエンド**: `packages/backend/.env.example`

**フロントエンド**: `packages/frontend/.env.example`

### ローカルでテスト

```bash
# Vercel CLIをインストール
npm i -g vercel

# ログイン
vercel login

# バックエンドをテスト
cd packages/backend
vercel dev

# フロントエンドをテスト（別ターミナル）
cd ../..
vercel dev
```

### 自動デプロイ

- `main`ブランチへのプッシュ → 本番環境に自動デプロイ
- プルリクエスト → プレビュー環境に自動デプロイ

---

## 🎉 次のステップ

1. カスタムドメインを設定
2. 分析ツールを有効化
3. パフォーマンスを最適化
4. モニタリングを設定

詳細は [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) を参照してください。
