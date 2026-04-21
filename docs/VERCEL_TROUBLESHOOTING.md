# Vercel環境変数が読み込まれない問題の解決方法

## 🚨 問題: `supabaseUrl is required` エラー

### 症状

```
Uncaught Error: supabaseUrl is required.
```

このエラーは、フロントエンドで環境変数が正しく読み込まれていないことを示しています。

---

## ✅ 解決手順

### 1. Vercel Dashboardで環境変数を確認

1. https://vercel.com/dashboard にアクセス
2. `kiro-project-frontend` プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 以下の環境変数が設定されているか確認：

```
VITE_API_BASE_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### 2. 環境変数が設定されていない場合

**追加する環境変数**:

| Name                     | Value                                                                                                                                                                                                              | Environments                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `VITE_API_BASE_URL`      | `https://kiro-project-backend.vercel.app`                                                                                                                                                                          | Production, Preview, Development |
| `VITE_SUPABASE_URL`      | `https://plytrwrjwjquvcgsppbt.supabase.co`                                                                                                                                                                         | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXRyd3Jqd2pxdXZjZ3NwcGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAzODMsImV4cCI6MjA5MjE2NjM4M30.Vn1RMcnPNNC7J1TKM4LCeUPQRIwOW4lEriivgn76lPA` | Production, Preview, Development |

**追加方法**:

1. "Add New" ボタンをクリック
2. Name、Value、Environmentsを入力
3. "Save" をクリック

### 3. 環境変数が設定されている場合

環境変数が設定されているのにエラーが出る場合は、**再デプロイ**が必要です。

**再デプロイ方法**:

#### オプション1: Vercel Dashboardから

1. **Deployments** タブに移動
2. 最新のデプロイメントの **"..."** メニューをクリック
3. **"Redeploy"** を選択
4. **"Redeploy"** ボタンをクリック

#### オプション2: GitHubから

```bash
# 空コミットをプッシュして再デプロイをトリガー
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

### 4. デプロイログを確認

1. **Deployments** タブで最新のデプロイメントをクリック
2. **"Building"** セクションを展開
3. ビルドログで環境変数が読み込まれているか確認

ログに以下のような出力があるはずです：

```
✓ 471 modules transformed.
```

エラーがある場合は、ログに詳細が表示されます。

---

## 🔍 デバッグ方法

### ブラウザのコンソールで確認

1. https://kiro-project-frontend.vercel.app にアクセス
2. ブラウザの開発者ツールを開く（F12）
3. **Console** タブを確認

以下のようなログが表示されるはずです：

```
🔍 Supabase環境変数チェック: {
  url: "✅ 設定済み",
  key: "✅ 設定済み",
  urlValue: "https://plytrwrjwjquvcgsppbt.supabase.co",
  keyPreview: "eyJhbGciOiJIUzI1NiIsInR..."
}
```

もし以下のように表示される場合は、環境変数が読み込まれていません：

```
🔍 Supabase環境変数チェック: {
  url: "❌ 未設定",
  key: "❌ 未設定",
  urlValue: undefined,
  keyPreview: "なし"
}
```

---

## 🛠️ よくある原因と解決策

### 原因1: 環境変数名が間違っている

**確認ポイント**:

- ✅ `VITE_` プレフィックスが付いているか
- ✅ スペルミスがないか
- ✅ 大文字・小文字が正しいか

**正しい名前**:

```
VITE_API_BASE_URL          ✅
VITE_SUPABASE_URL          ✅
VITE_SUPABASE_ANON_KEY     ✅
```

**間違った名前**:

```
API_BASE_URL               ❌ (VITE_プレフィックスがない)
VITE_SUPABASE_url          ❌ (大文字・小文字が違う)
VITE_SUPABASE_ANON_KEY_    ❌ (末尾にアンダースコア)
```

### 原因2: 環境が選択されていない

環境変数を追加する際、適用する環境を選択する必要があります：

- ✅ **Production** - 本番環境（mainブランチ）
- ✅ **Preview** - プレビュー環境（プルリクエスト）
- ✅ **Development** - 開発環境（vercel dev）

**すべての環境にチェックを入れることを推奨します。**

### 原因3: 再デプロイしていない

環境変数を追加・変更した後は、**必ず再デプロイ**が必要です。

環境変数はビルド時に埋め込まれるため、既存のデプロイには反映されません。

### 原因4: ビルドキャッシュの問題

まれに、Vercelのビルドキャッシュが原因で環境変数が反映されないことがあります。

**解決策**:

1. Deployments → 最新デプロイの "..." → "Redeploy"
2. **"Use existing Build Cache"** のチェックを**外す**
3. "Redeploy" をクリック

---

## 📋 チェックリスト

環境変数の設定を確認するためのチェックリスト：

- [ ] Vercel Dashboardで環境変数が設定されている
- [ ] 環境変数名が`VITE_`で始まっている
- [ ] すべての環境（Production, Preview, Development）が選択されている
- [ ] 環境変数の値が正しい（コピペミスがない）
- [ ] 再デプロイを実行した
- [ ] デプロイが成功している（緑色のチェックマーク）
- [ ] ブラウザのコンソールでデバッグログを確認した

---

## 🔄 完全なリセット手順

それでも解決しない場合は、以下の手順で完全にリセットします：

### 1. 環境変数を削除

1. Settings → Environment Variables
2. すべての環境変数を削除

### 2. 環境変数を再追加

1. `VITE_API_BASE_URL` を追加
2. `VITE_SUPABASE_URL` を追加
3. `VITE_SUPABASE_ANON_KEY` を追加
4. すべての環境にチェックを入れる

### 3. キャッシュなしで再デプロイ

1. Deployments → 最新デプロイの "..." → "Redeploy"
2. "Use existing Build Cache" のチェックを外す
3. "Redeploy" をクリック

### 4. 確認

1. デプロイが完了するまで待つ（通常1-2分）
2. https://kiro-project-frontend.vercel.app にアクセス
3. ブラウザのコンソールでデバッグログを確認

---

## 💡 ローカルでの確認方法

Vercelにデプロイする前に、ローカルで環境変数が正しく読み込まれるか確認できます：

### 1. `.env`ファイルを確認

`packages/frontend/.env` ファイルが存在し、以下の内容が含まれているか確認：

```bash
VITE_API_BASE_URL=https://kiro-project-backend.vercel.app
VITE_SUPABASE_URL=https://plytrwrjwjquvcgsppbt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. ローカルでビルド

```bash
cd packages/frontend
pnpm build
```

エラーが出ないことを確認します。

### 3. ローカルでプレビュー

```bash
pnpm preview
```

http://localhost:4173 にアクセスして動作を確認します。

---

## 📞 サポート

それでも解決しない場合は、以下の情報を提供してください：

1. Vercel Dashboardのスクリーンショット（環境変数設定画面）
2. デプロイログ（Deployments → 最新デプロイ → Building）
3. ブラウザのコンソールログ
4. エラーメッセージの全文

---

## 参考リンク

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/initializing)
