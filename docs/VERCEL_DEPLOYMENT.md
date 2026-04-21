# Vercelデプロイガイド

このドキュメントでは、フロントエンドとバックエンドの両方をVercelにデプロイする手順を説明します。

## アーキテクチャ概要

- **フロントエンド**: 静的サイト（Vue + Vite）
- **バックエンド**: Serverless Functions（Fastify）
- **データベース**: Supabase PostgreSQL
- **ストレージ**: Supabase Storage

## 前提条件

- Vercelアカウント（https://vercel.com）
- GitHubリポジトリにプロジェクトがプッシュされていること
- Supabaseプロジェクトが作成されていること

## デプロイ戦略

このモノレポでは、フロントエンドとバックエンドを**別々のVercelプロジェクト**としてデプロイします。

### なぜ別々にデプロイするのか？

1. **独立したスケーリング**: フロントエンドとバックエンドを個別にスケール可能
2. **明確な責任分離**: 各プロジェクトの設定が明確
3. **デプロイの柔軟性**: 片方だけを更新可能
4. **環境変数の管理**: 各プロジェクトで独立した環境変数

---

## 1. バックエンドのデプロイ

### 1.1 Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New..." → "Project"をクリック
3. GitHubリポジトリを選択してインポート
4. プロジェクト名を設定（例: `tech-blog-backend`）

### 1.2 ビルド設定

**Framework Preset**: Other

**Root Directory**: `packages/backend`

**Build Command**:

```bash
pnpm install && pnpm --filter @monorepo/backend db:generate
```

**Output Directory**: 空欄（Serverless Functionsを使用）

**Install Command**: `pnpm install`

### 1.3 環境変数の設定

Settings → Environment Variables で以下を設定：

```bash
# Node環境
NODE_ENV=production

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database (Supabaseから取得)
# Pooler URL (Transaction mode) - ポート6543
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct URL - ポート5432
DIRECT_URL=postgresql://postgres.xxxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

# CORS (後でフロントエンドURLに更新)
CORS_ORIGIN=https://your-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
```

**Supabase接続情報の取得方法**:

1. Supabase Dashboard → Project Settings → Database
2. "Connection string" セクションから以下を取得：
   - **Transaction mode** (Pooler) → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`

### 1.4 デプロイ

"Deploy"ボタンをクリックしてデプロイを開始します。

デプロイ完了後、URLをメモしてください（例: `https://tech-blog-backend.vercel.app`）

### 1.5 動作確認

```bash
# ヘルスチェック
curl https://tech-blog-backend.vercel.app/health

# 期待されるレスポンス
{"status":"ok"}
```

---

## 2. フロントエンドのデプロイ

### 2.1 Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New..." → "Project"をクリック
3. **同じGitHubリポジトリ**を再度選択してインポート
4. プロジェクト名を設定（例: `tech-blog-frontend`）

### 2.2 ビルド設定

**Framework Preset**: Other

**Root Directory**: `./` (モノレポのルート)

**Build Command**: `pnpm build:frontend`

**Output Directory**: `packages/frontend/dist`

**Install Command**: `pnpm install`

### 2.3 環境変数の設定

Settings → Environment Variables で以下を設定：

```bash
# バックエンドAPI (ステップ1.4でメモしたURL)
VITE_API_BASE_URL=https://tech-blog-backend.vercel.app

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.4 デプロイ

"Deploy"ボタンをクリックしてデプロイを開始します。

デプロイ完了後、URLをメモしてください（例: `https://tech-blog-frontend.vercel.app`）

---

## 3. CORS設定の更新

フロントエンドのデプロイ完了後、バックエンドのCORS設定を更新します。

### 3.1 バックエンドの環境変数を更新

1. バックエンドのVercelプロジェクトに移動
2. Settings → Environment Variables
3. `CORS_ORIGIN`を更新：

```bash
CORS_ORIGIN=https://tech-blog-frontend.vercel.app
```

複数のオリジンを許可する場合（本番とプレビュー環境）:

```bash
CORS_ORIGIN=https://tech-blog-frontend.vercel.app,https://tech-blog-frontend-*.vercel.app
```

### 3.2 バックエンドを再デプロイ

1. Deployments タブに移動
2. 最新のデプロイメントの "..." メニューをクリック
3. "Redeploy" を選択

---

## 4. 動作確認

### フロントエンドの確認

1. `https://tech-blog-frontend.vercel.app`にアクセス
2. ログインページが表示されることを確認
3. 記事一覧が表示されることを確認

### バックエンドの確認

```bash
# APIエンドポイントのテスト
curl https://tech-blog-backend.vercel.app/api/articles

# 認証が必要なエンドポイントのテスト
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://tech-blog-backend.vercel.app/api/articles/my
```

---

## 自動デプロイ

### Production環境

- **トリガー**: `main`ブランチへのプッシュ
- **動作**: 両プロジェクトが自動的にデプロイされます

### Preview環境

- **トリガー**: プルリクエストの作成・更新
- **動作**: 各プロジェクトにプレビューデプロイメントが作成されます
- **URL**: `https://tech-blog-frontend-git-branch-name.vercel.app`

---

## ローカルでのVercel CLIテスト

### インストール

```bash
npm i -g vercel
```

### ログイン

```bash
vercel login
```

### バックエンドのテスト

```bash
cd packages/backend
vercel dev
```

### フロントエンドのテスト

```bash
# ルートディレクトリで
vercel dev
```

### デプロイ

```bash
# プレビュー環境
vercel

# 本番環境
vercel --prod
```

---

## トラブルシューティング

### バックエンド: "Module not found" エラー

**原因**: Prisma Clientが生成されていない

**解決策**:

1. Build Commandに`db:generate`が含まれているか確認
2. 環境変数`DATABASE_URL`と`DIRECT_URL`が正しく設定されているか確認

### バックエンド: データベース接続エラー

**原因**: DATABASE_URLの設定が間違っている

**解決策**:

1. Supabase Dashboardで接続文字列を再確認
2. `DATABASE_URL`にはPooler URL（ポート6543）を使用
3. `DIRECT_URL`にはDirect URL（ポート5432）を使用
4. `?pgbouncer=true`パラメータが`DATABASE_URL`に含まれているか確認

### バックエンド: "Function timeout" エラー

**原因**: Serverless Functionの実行時間が10秒を超えた

**解決策**:

1. データベースクエリを最適化
2. 不要な処理を削除
3. Vercel Proプランにアップグレード（タイムアウト60秒）

### フロントエンド: APIリクエストが失敗する

**原因**: CORS設定が正しくない

**解決策**:

1. バックエンドの`CORS_ORIGIN`にフロントエンドのURLが含まれているか確認
2. ブラウザの開発者ツールでCORSエラーを確認
3. バックエンドを再デプロイ

### フロントエンド: 環境変数が反映されない

**原因**: 環境変数の変更後に再ビルドしていない

**解決策**:

1. 環境変数名が`VITE_`プレフィックスで始まっているか確認
2. Vercel Dashboardで環境変数を確認
3. 再デプロイを実行

### SPAルーティングが動作しない

**原因**: リライトルールが設定されていない

**解決策**:
ルートの`vercel.json`に以下が含まれているか確認：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## パフォーマンス最適化

### Vercelの自動最適化

- CDNによるグローバル配信
- 自動画像最適化
- エッジキャッシング
- Gzip/Brotli圧縮

### 追加の最適化

#### フロントエンド

1. **コード分割**: Vue Routerの遅延ローディングを活用
2. **画像最適化**: WebP形式を使用
3. **キャッシング**: 静的アセットに長期キャッシュを設定

#### バックエンド

1. **コールドスタート対策**:
   - 不要な依存関係を削除
   - 初期化処理を最小化
   - アプリケーションインスタンスを再利用（`api/index.ts`で実装済み）

2. **データベースクエリ最適化**:
   - インデックスを適切に設定
   - N+1問題を回避
   - Prismaのクエリを最適化

3. **レスポンスキャッシング**:
   - 頻繁にアクセスされるデータをキャッシュ
   - Vercel Edge Cacheを活用

---

## セキュリティ考慮事項

### フロントエンド

- ❌ 環境変数に機密情報を含めない（ビルド時にバンドルされます）
- ✅ Supabase Anon Keyは公開されても安全（RLSで保護）
- ✅ APIキーは使用しない

### バックエンド

- ✅ `SUPABASE_SERVICE_ROLE_KEY`は環境変数で管理
- ✅ CORS設定を適切に制限
- ✅ レート制限を有効化
- ✅ Helmetでセキュリティヘッダーを設定
- ✅ 入力値のバリデーション（Zodで実装済み）

### データベース

- ✅ Row Level Security (RLS)を有効化
- ✅ 最小権限の原則を適用
- ✅ 接続文字列を環境変数で管理

---

## モニタリング

### Vercel Dashboard

各プロジェクトで以下を確認できます：

- **Deployments**: デプロイメント履歴
- **Functions**: Serverless Functionsの実行ログ（バックエンドのみ）
- **Analytics**: トラフィック分析（Pro以上）
- **Logs**: リアルタイムログ（Pro以上）

### Supabase Dashboard

- **Database**: クエリパフォーマンス
- **Storage**: ストレージ使用量
- **Auth**: 認証ログ
- **Logs**: APIログ

---

## コスト管理

### Vercel無料プラン

- **帯域幅**: 100GB/月
- **Serverless Functions実行時間**: 100時間/月
- **ビルド時間**: 6,000分/月

### 使用量の確認

1. Vercel Dashboard → Settings → Usage
2. 各メトリクスの使用状況を確認

### コスト削減のヒント

1. 画像を最適化してサイズを削減
2. 不要なAPIリクエストを削減
3. キャッシングを活用
4. Serverless Functionsの実行時間を最適化

---

## 環境別の設定

### Development

```bash
# フロントエンド
VITE_API_BASE_URL=http://localhost:3000

# バックエンド
CORS_ORIGIN=http://localhost:5173
```

### Preview (プルリクエスト)

Vercelが自動的にプレビューURLを生成します。
環境変数は本番と同じ設定を使用するか、Preview専用の値を設定できます。

### Production

本番環境の環境変数を使用します。

---

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Monorepo Support](https://vercel.com/docs/concepts/monorepos)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)

---

## よくある質問

### Q: モノレポで1つのプロジェクトとしてデプロイできますか？

A: 技術的には可能ですが、推奨しません。別々のプロジェクトとしてデプロイする方が、管理が簡単で柔軟性が高いです。

### Q: バックエンドのServerless Functionsは常に起動していますか？

A: いいえ。リクエストがあるときのみ起動します（コールドスタート）。頻繁にアクセスされる場合は、インスタンスが再利用されます。

### Q: データベースマイグレーションはどうすればいいですか？

A: ローカルまたはCI/CDパイプラインで実行してください。Vercel Serverless Functionsでは実行しないでください。

```bash
# ローカルで実行
cd packages/backend
pnpm db:migrate
```

### Q: 複数の環境（staging、production）を管理できますか？

A: はい。Vercelプロジェクトを複数作成するか、環境変数で環境を切り替えることができます。

### Q: カスタムドメインを使用できますか？

A: はい。Vercel Dashboard → Settings → Domains でカスタムドメインを追加できます。
