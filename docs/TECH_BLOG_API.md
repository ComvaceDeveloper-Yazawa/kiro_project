# 技術ブログ機能 API ドキュメント

## 概要

技術ブログ機能のREST APIエンドポイント一覧です。

## ベースURL

```
http://localhost:3000/api
```

## 認証

認証が必要なエンドポイントには、Authorizationヘッダーにベアラートークンを含める必要があります。

```
Authorization: Bearer <token>
```

---

## 記事 (Articles)

### 記事一覧取得

公開記事の一覧を取得します。

**エンドポイント:** `GET /articles`

**認証:** 不要

**クエリパラメータ:**

- `page` (number, optional): ページ番号（デフォルト: 1）
- `limit` (number, optional): 1ページあたりの件数（デフォルト: 10）

**レスポンス例:**

```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "記事タイトル",
      "content": "記事本文...",
      "authorId": "uuid",
      "isPublished": true,
      "publishedAt": "2026-04-20T10:00:00Z",
      "createdAt": "2026-04-20T09:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z",
      "tags": ["vue", "typescript"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 記事詳細取得

**エンドポイント:** `GET /articles/:id`

**認証:** 不要（公開記事）/ 必要（下書き記事）

**レスポンス例:**

```json
{
  "id": "uuid",
  "title": "記事タイトル",
  "content": "記事本文...",
  "authorId": "uuid",
  "isPublished": true,
  "publishedAt": "2026-04-20T10:00:00Z",
  "createdAt": "2026-04-20T09:00:00Z",
  "updatedAt": "2026-04-20T10:00:00Z",
  "tags": ["vue", "typescript"]
}
```

### 記事作成

**エンドポイント:** `POST /articles`

**認証:** 必要

**リクエストボディ:**

```json
{
  "title": "記事タイトル",
  "content": "記事本文...",
  "tags": ["vue", "typescript"]
}
```

**レスポンス:** 作成された記事オブジェクト（201 Created）

### 記事更新

**エンドポイント:** `PUT /articles/:id`

**認証:** 必要（作成者のみ）

**リクエストボディ:**

```json
{
  "title": "更新後のタイトル",
  "content": "更新後の本文...",
  "tags": ["vue", "typescript", "vite"]
}
```

**レスポンス:** 更新された記事オブジェクト

### 記事公開/非公開

**エンドポイント:** `PATCH /articles/:id/publish`

**認証:** 必要（作成者のみ）

**リクエストボディ:**

```json
{
  "isPublished": true
}
```

**レスポンス:** 更新された記事オブジェクト

### 記事削除

**エンドポイント:** `DELETE /articles/:id`

**認証:** 必要（作成者のみ）

**レスポンス:** 204 No Content

### 自分の記事一覧

**エンドポイント:** `GET /articles/my`

**認証:** 必要

**クエリパラメータ:**

- `page` (number, optional): ページ番号
- `limit` (number, optional): 1ページあたりの件数

**レスポンス:** 記事一覧と同じ形式

### タグ検索

**エンドポイント:** `GET /articles/search`

**認証:** 不要

**クエリパラメータ:**

- `tags` (string, required): カンマ区切りのタグ名（例: "vue,typescript"）
- `page` (number, optional): ページ番号
- `limit` (number, optional): 1ページあたりの件数

**レスポンス:** 記事一覧と同じ形式

---

## タグ (Tags)

### タグ一覧取得

**エンドポイント:** `GET /tags`

**認証:** 不要

**レスポンス例:**

```json
[
  {
    "id": "uuid",
    "name": "vue",
    "createdAt": "2026-04-20T09:00:00Z"
  },
  {
    "id": "uuid",
    "name": "typescript",
    "createdAt": "2026-04-20T09:00:00Z"
  }
]
```

---

## 画像 (Images)

### 画像アップロード

**エンドポイント:** `POST /images`

**認証:** 必要

**Content-Type:** `multipart/form-data`

**フォームデータ:**

- `file` (File): 画像ファイル（最大5MB、jpg/png/gif/webp）
- `articleId` (string): 記事ID

**レスポンス例:**

```json
{
  "id": "uuid",
  "articleId": "uuid",
  "storagePath": "articles/uuid/timestamp-filename.jpg",
  "url": "https://storage.supabase.co/...",
  "createdAt": "2026-04-20T10:00:00Z"
}
```

### 画像削除

**エンドポイント:** `DELETE /images/:id`

**認証:** 必要（記事作成者のみ）

**レスポンス:** 204 No Content

---

## エラーレスポンス

すべてのエラーは以下の形式で返されます：

```json
{
  "error": "エラーメッセージ",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

**主なエラーコード:**

- `400` - バリデーションエラー
- `401` - 認証エラー
- `403` - 認可エラー
- `404` - リソースが見つからない
- `409` - 競合エラー
- `500` - サーバーエラー
