# 認証機能のセットアップ

## 概要

技術ブログアプリケーションは Supabase Auth を使用した認証機能を提供します。

## セットアップ手順

### 1. 環境変数の設定

`packages/backend/.env` ファイルに以下を設定：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`packages/frontend/.env` ファイルに以下を設定：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000
```

### 2. テストユーザーの作成

```bash
cd packages/backend
pnpm install
pnpm create-test-user
```

以下のテストユーザーが作成されます：

- **Email**: test@example.com
- **Password**: test1234

### 3. アプリケーションの起動

#### バックエンド

```bash
cd packages/backend
pnpm dev
```

#### フロントエンド

```bash
cd packages/frontend
pnpm dev
```

### 4. ログイン

1. ブラウザで http://localhost:5173 を開く
2. ログイン画面で「テストユーザーで入力」ボタンをクリック
3. 「ログイン」ボタンをクリック

## 認証の仕組み

### トークンの保存

ログイン成功時、以下のトークンが LocalStorage に保存されます：

- `auth_token`: Supabase のアクセストークン
- `supabase.auth.token`: Supabase のアクセストークン（バックアップ）

### トークンの使用

API リクエスト時、以下のヘッダーが自動的に付与されます：

```
Authorization: Bearer <access_token>
```

### セッションの復元

アプリケーション起動時、Supabase のセッションが自動的に復元されます。

## トラブルシューティング

### ログインできない

1. **環境変数の確認**
   - `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` が正しく設定されているか確認
   - `.env` ファイルが正しい場所にあるか確認

2. **テストユーザーの確認**
   - Supabase Dashboard → Authentication → Users でテストユーザーが存在するか確認
   - 存在しない場合は `pnpm create-test-user` を再実行

3. **ネットワークエラーの確認**
   - ブラウザの開発者ツール → Network タブでエラーを確認
   - Supabase のステータスページを確認: https://status.supabase.com/

### 画像アップロードで 401 エラー

1. **トークンの確認**
   - ブラウザの開発者ツール → Application → Local Storage で `auth_token` が存在するか確認
   - 存在しない場合は再ログイン

2. **セッションの確認**
   - ブラウザの開発者ツール → Console で「✅ 認証トークンを保存しました」が表示されているか確認
   - 表示されていない場合は再ログイン

3. **バックエンドの確認**
   - バックエンドのコンソールでエラーログを確認
   - `UnauthorizedError` が表示される場合は、トークンが無効または期限切れ

## 新しいユーザーの作成

### 方法1: Supabase Dashboard

1. Supabase Dashboard → Authentication → Users
2. 「Add user」をクリック
3. Email とパスワードを入力
4. 「Create user」をクリック

### 方法2: スクリプトを修正

`packages/backend/scripts/create-test-user.ts` を編集して、新しいユーザーを作成：

```typescript
const testEmail = 'newuser@example.com';
const testPassword = 'newpassword123';
```

```bash
cd packages/backend
pnpm create-test-user
```

## セキュリティ

### 本番環境での注意事項

1. **テストユーザーの削除**
   - 本番環境ではテストユーザーを削除してください

2. **環境変数の保護**
   - `.env` ファイルを Git にコミットしないでください
   - `SUPABASE_SERVICE_ROLE_KEY` は絶対に公開しないでください

3. **パスワードポリシー**
   - 本番環境では強力なパスワードを使用してください
   - 最低8文字、大文字・小文字・数字・記号を含む

4. **トークンの有効期限**
   - Supabase のデフォルトでは、アクセストークンは1時間で期限切れになります
   - リフレッシュトークンは自動的に更新されます

## API エンドポイント

### 認証が必要なエンドポイント

以下のエンドポイントは認証が必要です：

- `POST /api/articles` - 記事作成
- `PUT /api/articles/:id` - 記事更新
- `DELETE /api/articles/:id` - 記事削除
- `PATCH /api/articles/:id/publish` - 記事公開・非公開
- `GET /api/articles/my` - 自分の記事一覧
- `POST /api/images` - 画像アップロード
- `DELETE /api/images/:id` - 画像削除

### 認証が不要なエンドポイント

以下のエンドポイントは認証不要です：

- `GET /api/articles` - 公開記事一覧
- `GET /api/articles/:id` - 記事詳細（公開記事のみ）
- `GET /api/articles/search` - タグ検索
- `GET /api/tags` - タグ一覧

## 参考リンク

- [Supabase Auth ドキュメント](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
