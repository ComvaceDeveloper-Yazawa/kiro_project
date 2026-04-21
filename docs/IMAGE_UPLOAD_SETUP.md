# 画像アップロード機能のセットアップ

## Supabase Storage バケット設定

### 1. バケットの作成

Supabase Dashboard で以下の手順を実行：

1. Storage セクションに移動
2. 「New bucket」をクリック
3. バケット名: `images`
4. Public bucket: **ON** (公開バケット)
5. 「Create bucket」をクリック

### 2. RLS ポリシーの設定

`images` バケットに以下のポリシーを設定：

#### SELECT ポリシー（画像の閲覧）

```sql
-- 全ユーザーが画像を閲覧可能
CREATE POLICY "images_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');
```

#### INSERT ポリシー（画像のアップロード）

```sql
-- 認証済みユーザーが画像をアップロード可能
CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );
```

#### DELETE ポリシー（画像の削除）

```sql
-- 認証済みユーザーが自分の画像を削除可能
CREATE POLICY "images_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 3. 環境変数の設定

`.env` ファイルに以下を設定：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## トラブルシューティング

### 画像アップロードが失敗する場合

1. **認証トークンの確認**
   - ブラウザの開発者ツール → Console で「認証トークンが見つかりません」と表示される場合、ログインしていない可能性があります
   - LocalStorage に `auth_token` または `supabase.auth.token` が保存されているか確認

2. **Supabase バケットの確認**
   - Supabase Dashboard → Storage → `images` バケットが存在するか確認
   - バケットが Public になっているか確認

3. **RLS ポリシーの確認**
   - Supabase Dashboard → Storage → `images` → Policies で上記のポリシーが設定されているか確認

4. **ネットワークエラーの確認**
   - ブラウザの開発者ツール → Network タブで `/api/images` のリクエストを確認
   - ステータスコードが 401 の場合: 認証エラー
   - ステータスコードが 403 の場合: 権限エラー
   - ステータスコードが 500 の場合: サーバーエラー

5. **バックエンドログの確認**
   ```bash
   cd packages/backend
   pnpm dev
   ```

   - コンソールに「画像アップロード開始」「画像アップロード成功」のログが表示されるか確認

### デバッグモード

フロントエンドのコンソールに詳細なログが表示されます：

- `画像アップロード開始`: アップロード開始時
- `画像アップロードレスポンス`: サーバーからのレスポンス
- `画像アップロード成功`: アップロード成功時
- `画像アップロードエラー`: エラー発生時

## 画像アップロードの仕組み

### 一時的な画像アップロード

記事作成時（articleId がない場合）は、一時的な画像として Supabase Storage にアップロードされます：

- パス: `articles/temp-{userId}/{timestamp}-{filename}`
- DB には保存されない
- URL のみが返される

### 記事に紐づく画像アップロード

記事編集時（articleId がある場合）は、記事に紐づく画像として保存されます：

- パス: `articles/{articleId}/{timestamp}-{filename}`
- DB の `article_images` テーブルに保存される
- 記事削除時に自動削除される

## 対応画像形式

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## 画像サイズ制限

- 最大ファイルサイズ: 5MB
- 最大幅・高さ: 10000px

## 使い方

### カバー画像のアップロード

1. 記事作成・編集画面で「カバー画像を追加」をクリック
2. 画像ファイルを選択
3. アップロード完了後、プレビューが表示される

### 本文への画像挿入

#### 方法1: ドラッグ&ドロップ

1. エディタに画像ファイルをドラッグ&ドロップ
2. 自動的に Markdown 記法で挿入される

#### 方法2: ツールバーから挿入

1. ツールバーの 🖼️ ボタンをクリック
2. Markdown 記法が挿入される
3. URL を手動で入力

#### 方法3: Markdown 記法で直接入力

```markdown
![画像の説明](https://your-image-url.com/image.jpg)
```
