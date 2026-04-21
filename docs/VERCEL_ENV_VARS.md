# Vercel環境変数設定ガイド

このドキュメントでは、Vercelにデプロイする際に設定する環境変数をまとめています。

## 🔧 バックエンド環境変数

**プロジェクト**: `kiro-project-backend`
**URL**: https://kiro-project-backend.vercel.app

### 必須環境変数

```bash
# Node環境
NODE_ENV=production

# Supabase
SUPABASE_URL=https://plytrwrjwjquvcgsppbt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAzODMsImV4cCI6MjA5MjE2NjM4M30.Vn1RMcnPNNC7J1TKM4LCeUPQRIwOW4lEriivgn76lPA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU5MDM4MywiZXhwIjoyMDkyMTY2MzgzfQ.wipR8z9yNNaDBp_HaELZ52nypzgZVGDY0vmyrgq_oI4

# Database (Supabase Pooler URL - Transaction mode)
DATABASE_URL=postgresql://postgres.plytrwrjwjquvcgsppbt:yazawa_2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Database (Direct URL)
DIRECT_URL=postgresql://postgres.plytrwrjwjquvcgsppbt:yazawa_2026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

# CORS (フロントエンドのURL + プレビュー環境)
CORS_ORIGIN=https://kiro-project-frontend.vercel.app,https://kiro-project-frontend-*.vercel.app

# Rate Limiting
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
```

### 設定手順

1. Vercel Dashboard → `kiro-project-backend` → Settings → Environment Variables
2. 上記の環境変数を1つずつ追加
3. 各変数で適用する環境を選択：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## 🎨 フロントエンド環境変数

**プロジェクト**: `kiro-project-frontend`
**URL**: https://kiro-project-frontend.vercel.app

### 必須環境変数

```bash
# バックエンドAPI
VITE_API_BASE_URL=https://kiro-project-backend.vercel.app

# Supabase
VITE_SUPABASE_URL=https://plytrwrjwjquvcgsppbt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAzODMsImV4cCI6MjA5MjE2NjM4M30.Vn1RMcnPNNC7J1TKM4LCeUPQRIwOW4lEriivgn76lPA
```

### 設定手順

1. Vercel Dashboard → `kiro-project-frontend` → Settings → Environment Variables
2. 上記の環境変数を1つずつ追加
3. 各変数で適用する環境を選択：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## 📋 チェックリスト

### バックエンド設定確認

- [ ] `NODE_ENV=production` が設定されている
- [ ] Supabase接続情報が正しい
- [ ] `DATABASE_URL`にPooler URL（ポート6543）を使用
- [ ] `DIRECT_URL`にDirect URL（ポート5432）を使用
- [ ] `DATABASE_URL`に`?pgbouncer=true`が含まれている
- [ ] `CORS_ORIGIN`にフロントエンドURLが含まれている
- [ ] レート制限が設定されている

### フロントエンド設定確認

- [ ] `VITE_API_BASE_URL`がバックエンドURLを指している
- [ ] Supabase接続情報が正しい
- [ ] すべての環境変数が`VITE_`プレフィックスで始まっている

---

## 🔄 環境変数の更新方法

### 1. Vercel Dashboardで更新

1. プロジェクト → Settings → Environment Variables
2. 変更したい変数の "Edit" をクリック
3. 新しい値を入力
4. Save

### 2. 再デプロイ

環境変数を変更した後は、再デプロイが必要です：

1. Deployments タブに移動
2. 最新のデプロイメントの "..." メニューをクリック
3. "Redeploy" を選択

または、新しいコミットをプッシュすると自動的に再デプロイされます。

---

## 🚨 トラブルシューティング

### バックエンド: データベース接続エラー

**症状**: `Error: P1001: Can't reach database server`

**解決策**:

1. `DATABASE_URL`と`DIRECT_URL`を確認
2. Supabase Dashboardで接続文字列を再確認
3. パスワードに特殊文字が含まれている場合はURLエンコード

### バックエンド: CORSエラー

**症状**: フロントエンドから`Access-Control-Allow-Origin`エラー

**解決策**:

1. `CORS_ORIGIN`にフロントエンドのURLが含まれているか確認
2. ワイルドカード`*`を使用している場合は、具体的なURLに変更
3. バックエンドを再デプロイ

### フロントエンド: APIリクエストが失敗

**症状**: `Failed to fetch` または `Network Error`

**解決策**:

1. `VITE_API_BASE_URL`が正しいか確認
2. バックエンドがデプロイされているか確認
3. ブラウザの開発者ツールでネットワークタブを確認

### フロントエンド: 環境変数が反映されない

**症状**: `undefined` または古い値が使用されている

**解決策**:

1. 環境変数名が`VITE_`で始まっているか確認
2. Vercel Dashboardで環境変数が保存されているか確認
3. フロントエンドを再デプロイ
4. ブラウザのキャッシュをクリア

---

## 🔐 セキュリティ注意事項

### ⚠️ 公開してはいけない情報

- `SUPABASE_SERVICE_ROLE_KEY` - バックエンドのみで使用
- データベースパスワード
- その他のシークレットキー

### ✅ 公開しても安全な情報

- `SUPABASE_URL` - 公開URL
- `SUPABASE_ANON_KEY` - 匿名キー（RLSで保護されている）
- `VITE_API_BASE_URL` - 公開API URL

### 🛡️ ベストプラクティス

1. **環境変数の分離**: 本番環境とプレビュー環境で異なる値を使用
2. **最小権限の原則**: 必要最小限の権限のみを付与
3. **定期的なローテーション**: 定期的にキーを更新
4. **監査ログ**: Supabase Dashboardで認証ログを確認

---

## 📚 参考リンク

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 💡 ヒント

### ローカル開発との切り替え

ローカル開発時は、`.env`ファイルで以下のように設定：

**バックエンド**:

```bash
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**フロントエンド**:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### プレビュー環境の活用

プルリクエストごとにプレビュー環境が作成されます：

- フロントエンド: `https://kiro-project-frontend-git-branch-name.vercel.app`
- バックエンド: `https://kiro-project-backend-git-branch-name.vercel.app`

プレビュー環境用の環境変数を別途設定することも可能です。

---

## ✅ 完了確認

すべての環境変数を設定したら、以下を確認：

1. [ ] バックエンドが正常にデプロイされている
2. [ ] フロントエンドが正常にデプロイされている
3. [ ] フロントエンドからバックエンドAPIにアクセスできる
4. [ ] ログインが正常に動作する
5. [ ] 記事の作成・編集・削除が正常に動作する
6. [ ] 画像のアップロードが正常に動作する

問題がある場合は、[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)のトラブルシューティングセクションを参照してください。
