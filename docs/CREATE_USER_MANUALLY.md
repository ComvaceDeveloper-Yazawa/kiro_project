# Supabase Dashboard でユーザーを手動作成

スクリプトがうまく動作しない場合は、Supabase Dashboard から直接ユーザーを作成できます。

## 📝 手順

### 1. Supabase Dashboard にアクセス

https://supabase.com/dashboard にアクセスしてログイン

### 2. プロジェクトを選択

技術ブログ用のプロジェクトを選択

### 3. Authentication セクションに移動

左サイドバーから「Authentication」→「Users」をクリック

### 4. ユーザーを作成

1. 「Add user」ボタンをクリック
2. 「Create new user」を選択
3. 以下の情報を入力：
   - **Email**: `test@example.com`
   - **Password**: `test1234`
   - **Auto Confirm User**: ✅ チェックを入れる（重要！）
4. 「Create user」ボタンをクリック

### 5. ユーザーが作成されたことを確認

Users リストに `test@example.com` が表示されることを確認

### 6. ログインを試す

1. http://localhost:5173 を開く
2. Email: `test@example.com`
3. Password: `test1234`
4. 「ログイン」ボタンをクリック

## ✅ 確認事項

### ユーザーのステータスを確認

Users リストで以下を確認：

- **Email**: test@example.com
- **Email Confirmed**: ✅ Yes（重要！）
- **Last Sign In**: ログイン後に更新される

### Email Confirmed が No の場合

1. ユーザーをクリック
2. 「Confirm email」ボタンをクリック
3. 再度ログインを試す

## 🐛 それでもログインできない場合

### 1. パスワードをリセット

1. Users リストでユーザーをクリック
2. 「Reset password」をクリック
3. 新しいパスワードを設定: `test1234`
4. 「Update user」をクリック

### 2. ユーザーを削除して再作成

1. Users リストでユーザーをクリック
2. 「Delete user」をクリック
3. 上記の手順で再度作成

### 3. 別のメールアドレスで試す

1. `testuser@example.com` など別のメールアドレスで作成
2. フロントエンドのログイン画面で新しいメールアドレスを使用

## 💡 よくある問題

### 問題1: "Email not confirmed"

**原因**: メール確認が完了していない

**解決策**:

- ユーザー作成時に「Auto Confirm User」にチェックを入れる
- または、既存ユーザーの「Confirm email」ボタンをクリック

### 問題2: "Invalid login credentials"

**原因**:

- パスワードが間違っている
- ユーザーが存在しない
- メール確認が完了していない

**解決策**:

1. Supabase Dashboard → Authentication → Users でユーザーが存在するか確認
2. Email Confirmed が Yes になっているか確認
3. パスワードをリセット

### 問題3: "User already registered"

**原因**: 同じメールアドレスのユーザーが既に存在する

**解決策**:

- 既存のユーザーを削除してから再作成
- または、既存のユーザーのパスワードをリセット

## 🔐 セキュリティ設定の確認

### Email Auth が有効か確認

1. Supabase Dashboard → Authentication → Providers
2. 「Email」が Enabled になっているか確認
3. 無効の場合は有効にする

### Confirm email が無効か確認

1. Supabase Dashboard → Authentication → Settings
2. 「Enable email confirmations」が無効になっているか確認
3. 開発環境では無効にすることを推奨

## 📞 サポート

それでも問題が解決しない場合は、以下の情報を確認してください：

1. Supabase プロジェクトのステータス: https://status.supabase.com/
2. ブラウザのコンソールエラー（開発者ツール → Console）
3. ネットワークタブのエラー（開発者ツール → Network）

## 🎯 次のステップ

ユーザー作成が完了したら：

1. ログインを試す
2. 記事を作成
3. 画像をアップロード
4. Notion風エディタを体験
