# ✅ Vercelセットアップチェックリスト

このチェックリストに従って、Vercelのデプロイを完了させてください。

---

## 🎯 ステップ1: コードをGitHubにプッシュ

```bash
git add .
git commit -m "Add Vercel deployment configuration and fix TypeScript errors"
git push
```

---

## 🔧 ステップ2: バックエンドの環境変数を設定

### 2.1 Vercel Dashboardにアクセス

1. https://vercel.com/dashboard にアクセス
2. `kiro-project-backend` プロジェクトを選択
3. **Settings** → **Environment Variables** に移動

### 2.2 環境変数を追加

以下の環境変数を1つずつ追加してください：

| Name                        | Value                                                                                                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                  | `production`                                                                                                                                                                                                                  |
| `SUPABASE_URL`              | `https://plytrwrjwjquvcgsppbt.supabase.co`                                                                                                                                                                                    |
| `SUPABASE_ANON_KEY`         | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAzODMsImV4cCI6MjA5MjE2NjM4M30.Vn1RMcnPNNC7J1TKM4LCeUPQRIwOW4lEriivgn76lPA`            |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU5MDM4MywiZXhwIjoyMDkyMTY2MzgzfQ.wipR8z9yNNaDBp_HaELZ52nypzgZVGDY0vmyrgq_oI4` |
| `DATABASE_URL`              | `postgresql://postgres.plytrwrjwjquvcgsppbt:yazawa_2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`                                                                                                |
| `DIRECT_URL`                | `postgresql://postgres.plytrwrjwjquvcgsppbt:yazawa_2026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`                                                                                                               |
| `CORS_ORIGIN`               | `https://kiro-project-frontend.vercel.app,https://kiro-project-frontend-*.vercel.app`                                                                                                                                         |
| `RATE_LIMIT_MAX`            | `100`                                                                                                                                                                                                                         |
| `AUTH_RATE_LIMIT_MAX`       | `10`                                                                                                                                                                                                                          |

**重要**: 各環境変数で以下の環境を選択してください：

- ✅ Production
- ✅ Preview
- ✅ Development

### 2.3 バックエンドを再デプロイ

1. **Deployments** タブに移動
2. 最新のデプロイメントの **"..."** メニューをクリック
3. **"Redeploy"** を選択
4. **"Redeploy"** ボタンをクリック

### 2.4 デプロイ完了を確認

- [ ] デプロイが成功している（緑色のチェックマーク）
- [ ] https://kiro-project-backend.vercel.app/health にアクセスして `{"status":"ok"}` が返ってくる

---

## 🎨 ステップ3: フロントエンドの環境変数を設定

### 3.1 Vercel Dashboardにアクセス

1. https://vercel.com/dashboard にアクセス
2. `kiro-project-frontend` プロジェクトを選択
3. **Settings** → **Environment Variables** に移動

### 3.2 環境変数を追加

以下の環境変数を1つずつ追加してください：

| Name                     | Value                                                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL`      | `https://kiro-project-backend.vercel.app`                                                                                                                                                                          |
| `VITE_SUPABASE_URL`      | `https://plytrwrjwjquvcgsppbt.supabase.co`                                                                                                                                                                         |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAzODMsImV4cCI6MjA5MjE2NjM4M30.Vn1RMcnPNNC7J1TKM4LCeUPQRIwOW4lEriivgn76lPA` |

**重要**: 各環境変数で以下の環境を選択してください：

- ✅ Production
- ✅ Preview
- ✅ Development

### 3.3 フロントエンドを再デプロイ

1. **Deployments** タブに移動
2. 最新のデプロイメントの **"..."** メニューをクリック
3. **"Redeploy"** を選択
4. **"Use existing Build Cache"** のチェックを**外す**（重要！）
5. **"Redeploy"** ボタンをクリック

### 3.4 デプロイ完了を確認

- [ ] デプロイが成功している（緑色のチェックマーク）
- [ ] https://kiro-project-frontend.vercel.app にアクセスできる
- [ ] ブラウザのコンソールで以下のログが表示される：
  ```
  🔍 Supabase環境変数チェック: {
    url: "✅ 設定済み",
    key: "✅ 設定済み",
    ...
  }
  ```

---

## ✅ ステップ4: 動作確認

### 4.1 フロントエンドにアクセス

https://kiro-project-frontend.vercel.app にアクセス

### 4.2 ログイン

1. ログインページが表示されることを確認
2. テストユーザーでログイン
3. ログインが成功することを確認

### 4.3 記事一覧

1. 記事一覧ページが表示されることを確認
2. 記事が表示されることを確認

### 4.4 記事作成

1. 記事作成ページにアクセス
2. 記事を作成
3. 保存が成功することを確認

### 4.5 画像アップロード

1. 記事編集ページで画像をドラッグ&ドロップ
2. 画像がアップロードされることを確認

---

## 🐛 トラブルシューティング

### エラー: `supabaseUrl is required`

**原因**: フロントエンドの環境変数が設定されていない

**解決策**:

1. `docs/VERCEL_TROUBLESHOOTING.md` を参照
2. 環境変数が正しく設定されているか確認
3. 再デプロイ（キャッシュなし）

### エラー: CORSエラー

**原因**: バックエンドのCORS設定が正しくない

**解決策**:

1. バックエンドの`CORS_ORIGIN`を確認
2. フロントエンドのURLが含まれているか確認
3. バックエンドを再デプロイ

### エラー: データベース接続エラー

**原因**: データベースURLが正しくない

**解決策**:

1. `DATABASE_URL`と`DIRECT_URL`を確認
2. Supabase Dashboardで接続文字列を再確認
3. バックエンドを再デプロイ

---

## 📚 参考ドキュメント

- `docs/VERCEL_QUICK_START.md` - クイックスタートガイド
- `docs/VERCEL_DEPLOYMENT.md` - 詳細なデプロイガイド
- `docs/VERCEL_ENV_VARS.md` - 環境変数設定ガイド
- `docs/VERCEL_TROUBLESHOOTING.md` - トラブルシューティング

---

## 🎉 完了！

すべてのチェックが完了したら、デプロイ完了です！

本番環境URL:

- フロントエンド: https://kiro-project-frontend.vercel.app
- バックエンド: https://kiro-project-backend.vercel.app

お疲れ様でした！🎊
