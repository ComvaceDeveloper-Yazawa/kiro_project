# 次に読むべき記事機能

## 概要

記事を連載形式で繋げることができる「次に読むべき記事」機能を実装しました。

## 機能

1. **記事の連結**: 記事に「次の記事」を設定できます
2. **記事詳細画面**: 記事の下部に「次に読む」セクションが表示されます
3. **記事編集画面**: 次の記事を選択できるドロップダウンが追加されました

## セットアップ

### 1. データベースマイグレーション

```bash
cd packages/backend
npx prisma migrate deploy
```

または、開発環境の場合:

```bash
cd packages/backend
npx prisma migrate dev
```

### 2. Prismaクライアントの再生成

```bash
cd packages/backend
npx prisma generate
```

### 3. アプリケーションの再起動

バックエンドとフロントエンドを再起動してください。

## 使い方

### 記事編集画面で次の記事を設定

1. 記事編集画面を開く
2. 「次に読む記事（オプション）」ドロップダウンから記事を選択
3. 記事を保存

### 記事詳細画面で次の記事を確認

1. 次の記事が設定されている記事を開く
2. 記事の下部に「次に読む」セクションが表示される
3. クリックすると次の記事に移動

## データベーススキーマ

```sql
-- articles テーブルに next_article_id カラムを追加
ALTER TABLE "public"."articles" ADD COLUMN "next_article_id" UUID;

-- 外部キー制約を追加
ALTER TABLE "public"."articles"
  ADD CONSTRAINT "articles_next_article_id_fkey"
  FOREIGN KEY ("next_article_id")
  REFERENCES "public"."articles"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- インデックスを追加
CREATE INDEX "idx_articles_next_article_id" ON "public"."articles"("next_article_id");
```

## API変更

### CreateArticleInput

```typescript
{
  title: string;
  content: string;
  tags: string[];
  isPublished?: boolean;
  nextArticleId?: string | null; // 追加
}
```

### UpdateArticleInput

```typescript
{
  title: string;
  content: string;
  tags: string[];
  nextArticleId?: string | null; // 追加
}
```

### Article

```typescript
{
  id: string;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  publishedAt: Date | null;
  nextArticleId?: string | null; // 追加
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  nextArticle?: { id: string; title: string } | null; // 追加
}
```

## 実装ファイル

### バックエンド

- `packages/backend/prisma/schema.prisma` - Prismaスキーマ
- `packages/backend/prisma/migrations/20260421000000_add_next_article/migration.sql` - マイグレーション
- `packages/backend/src/domain/entities/article.entity.ts` - Articleエンティティ
- `packages/backend/src/infrastructure/prisma/article.repository.impl.ts` - リポジトリ実装
- `packages/backend/src/application/usecases/create-article.usecase.ts` - 作成ユースケース
- `packages/backend/src/application/usecases/update-article.usecase.ts` - 更新ユースケース

### 共有

- `packages/shared/src/schemas/article.schema.ts` - スキーマ定義

### フロントエンド

- `packages/frontend/src/components/ArticleForm.vue` - 記事フォーム
- `packages/frontend/src/views/ArticleEditView.vue` - 記事編集画面
- `packages/frontend/src/views/ArticleDetailView.vue` - 記事詳細画面

## 注意事項

- 循環参照（A→B→A）は現在チェックしていません
- 次の記事は同じ著者の記事のみ選択可能です
- 次の記事が削除された場合、自動的に`null`に設定されます（ON DELETE SET NULL）
