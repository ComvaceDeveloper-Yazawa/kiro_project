# タスクリスト — 技術ブログ機能

## 概要

このタスクリストは、技術ブログ機能の実装を段階的に進めるためのものです。各タスクは独立して実行可能で、テスト駆動開発（TDD）とプロパティベーステスト（PBT）を組み合わせて実装します。

---

## Phase 1: データベース基盤

### Task 1: Supabase マイグレーション作成

- [x] 1.1. articles テーブルのマイグレーションファイル作成
- [x] 1.2. tags テーブルのマイグレーションファイル作成
- [x] 1.3. article_tags テーブルのマイグレーションファイル作成
- [x] 1.4. article_images テーブルのマイグレーションファイル作成
- [x] 1.5. インデックスの作成（articles.author_id, articles.published_at, articles.updated_at, tags.name, article_tags.tag_id, article_images.article_id）
- [x] 1.6. マイグレーションをリモートに適用（`supabase db push`）

### Task 2: Supabase RLS ポリシー作成

- [x] 2.1. articles テーブルの RLS ポリシー作成（SELECT: 公開記事は全員、下書きは作成者のみ）
- [x] 2.2. articles テーブルの RLS ポリシー作成（INSERT/UPDATE/DELETE: 作成者のみ）
- [x] 2.3. tags テーブルの RLS ポリシー作成（SELECT: 全員、INSERT: 認証済みユーザー）
- [x] 2.4. article_tags テーブルの RLS ポリシー作成（SELECT: 公開記事のタグは全員、下書きは作成者のみ）
- [x] 2.5. article_tags テーブルの RLS ポリシー作成（INSERT/DELETE: 作成者のみ）
- [x] 2.6. article_images テーブルの RLS ポリシー作成（SELECT: 公開記事の画像は全員、下書きは作成者のみ）
- [x] 2.7. article_images テーブルの RLS ポリシー作成（INSERT/DELETE: 作成者のみ）

### Task 3: Supabase Storage 設定

- [x] 3.1. images バケット作成（Supabase Dashboard または CLI）
- [x] 3.2. images バケットの RLS ポリシー作成（SELECT: 公開記事の画像は全員、下書きは作成者のみ）
- [x] 3.3. images バケットの RLS ポリシー作成（INSERT: 認証済みユーザー、DELETE: 作成者のみ）

### Task 4: Prisma スキーマ同期

- [x] 4.1. Prisma スキーマを Supabase から取得（`prisma db pull`）
- [x] 4.2. Prisma Client 生成（`prisma generate`）
- [x] 4.3. Prisma スキーマの確認（articles, tags, article_tags, article_images モデルが存在することを確認）

---

## Phase 2: Shared パッケージ（型定義・バリデーション）

### Task 5: Zod スキーマ定義

- [x] 5.1. Article 関連の Zod スキーマ作成（`packages/shared/src/schemas/article.schema.ts`）
  - CreateArticleSchema（title, content, tags）
  - UpdateArticleSchema（title, content, tags）
  - ArticleSchema（id, title, content, authorId, isPublished, publishedAt, createdAt, updatedAt, tags）
- [x] 5.2. Tag 関連の Zod スキーマ作成（`packages/shared/src/schemas/tag.schema.ts`）
  - TagSchema（id, name, createdAt）
- [x] 5.3. Image 関連の Zod スキーマ作成（`packages/shared/src/schemas/image.schema.ts`）
  - UploadImageSchema（file, articleId）
  - ArticleImageSchema（id, articleId, storagePath, url, createdAt）
- [x] 5.4. Pagination 関連の Zod スキーマ作成（`packages/shared/src/schemas/pagination.schema.ts`）
  - PaginationSchema（page, pageSize）

### Task 6: TypeScript 型定義

- [x] 6.1. Article 型定義作成（`packages/shared/src/types/article.types.ts`）
  - Article, CreateArticleInput, UpdateArticleInput
- [x] 6.2. Tag 型定義作成（`packages/shared/src/types/tag.types.ts`）
  - Tag
- [x] 6.3. Image 型定義作成（`packages/shared/src/types/image.types.ts`）
  - ArticleImage, UploadImageInput
- [x] 6.4. Pagination 型定義作成（`packages/shared/src/types/pagination.types.ts`）
  - PaginationOptions, PaginatedResponse
- [x] 6.5. Index ファイル作成（schemas/index.ts, types/index.ts, src/index.ts）

---

## Phase 3: Backend — Domain 層

### Task 7: Domain エンティティ作成

- [ ] 7.1. Article エンティティ作成（`packages/backend/src/domain/entities/article.entity.ts`）
- [ ] 7.2. Tag エンティティ作成（`packages/backend/src/domain/entities/tag.entity.ts`）
- [ ] 7.3. ArticleImage エンティティ作成（`packages/backend/src/domain/entities/article-image.entity.ts`）

### Task 8: Domain サービス作成

- [ ] 8.1. MarkdownParser サービス作成（`packages/backend/src/domain/services/markdown-parser.service.ts`）
  - parse(markdown: string): string メソッド
  - validate(markdown: string): ValidationResult メソッド
  - sanitize(html: string): string メソッド
- [ ] 8.2. MarkdownPrinter サービス作成（`packages/backend/src/domain/services/markdown-printer.service.ts`）
  - print(article: Article): string メソッド
- [ ] 8.3. SandboxValidator サービス作成（`packages/backend/src/domain/services/sandbox-validator.service.ts`）
  - validateUrl(url: string): boolean メソッド
  - generateEmbedCode(url: string, type: 'stackblitz' | 'codesandbox'): string メソッド

### Task 9: Domain エラークラス作成

- [ ] 9.1. ValidationError クラス作成（`packages/backend/src/domain/errors/validation.error.ts`）
- [ ] 9.2. AuthorizationError クラス作成（`packages/backend/src/domain/errors/authorization.error.ts`）
- [ ] 9.3. NotFoundError クラス作成（`packages/backend/src/domain/errors/not-found.error.ts`）
- [ ] 9.4. ConflictError クラス作成（`packages/backend/src/domain/errors/conflict.error.ts`）

---

## Phase 4: Backend — Infrastructure 層

### Task 10: Prisma リポジトリ作成

- [ ] 10.1. ArticleRepository インターフェース作成（`packages/backend/src/domain/repositories/article.repository.ts`）
- [ ] 10.2. ArticleRepositoryImpl 実装作成（`packages/backend/src/infrastructure/prisma/article.repository.impl.ts`）
  - save, findById, findAll, findByAuthorId, findByTags, delete メソッド
- [ ] 10.3. TagRepository インターフェース作成（`packages/backend/src/domain/repositories/tag.repository.ts`）
- [ ] 10.4. TagRepositoryImpl 実装作成（`packages/backend/src/infrastructure/prisma/tag.repository.impl.ts`）
  - save, findByName, findAll, findOrCreate メソッド
- [ ] 10.5. ArticleImageRepository インターフェース作成（`packages/backend/src/domain/repositories/article-image.repository.ts`）
- [ ] 10.6. ArticleImageRepositoryImpl 実装作成（`packages/backend/src/infrastructure/prisma/article-image.repository.impl.ts`）
  - save, findByArticleId, delete メソッド

### Task 11: Supabase Storage サービス作成

- [ ] 11.1. StorageService インターフェース作成（`packages/backend/src/domain/services/storage.service.ts`）
- [ ] 11.2. SupabaseStorageService 実装作成（`packages/backend/src/infrastructure/supabase/storage.service.impl.ts`）
  - uploadImage, deleteImage, getPublicUrl メソッド

---

## Phase 5: Backend — Application 層（Usecases）

### Task 12: Article Usecases 作成

- [ ] 12.1. CreateArticleUsecase 作成（`packages/backend/src/application/usecases/create-article.usecase.ts`）
- [ ] 12.2. UpdateArticleUsecase 作成（`packages/backend/src/application/usecases/update-article.usecase.ts`）
- [ ] 12.3. PublishArticleUsecase 作成（`packages/backend/src/application/usecases/publish-article.usecase.ts`）
- [ ] 12.4. DeleteArticleUsecase 作成（`packages/backend/src/application/usecases/delete-article.usecase.ts`）
- [ ] 12.5. GetArticleUsecase 作成（`packages/backend/src/application/usecases/get-article.usecase.ts`）
- [ ] 12.6. ListArticlesUsecase 作成（`packages/backend/src/application/usecases/list-articles.usecase.ts`）
- [ ] 12.7. SearchArticlesByTagsUsecase 作成（`packages/backend/src/application/usecases/search-articles-by-tags.usecase.ts`）

### Task 13: Image Usecases 作成

- [ ] 13.1. UploadImageUsecase 作成（`packages/backend/src/application/usecases/upload-image.usecase.ts`）
- [ ] 13.2. DeleteImageUsecase 作成（`packages/backend/src/application/usecases/delete-image.usecase.ts`）

### Task 14: Tag Usecases 作成

- [ ] 14.1. ListTagsUsecase 作成（`packages/backend/src/application/usecases/list-tags.usecase.ts`）

---

## Phase 6: Backend — Interface 層（Routes）

### Task 15: Article Routes 作成

- [ ] 15.1. article.route.ts 作成（`packages/backend/src/routes/article.route.ts`）
  - POST /api/articles - 記事作成
  - GET /api/articles - 公開記事一覧
  - GET /api/articles/:id - 記事詳細
  - PUT /api/articles/:id - 記事更新
  - DELETE /api/articles/:id - 記事削除
  - PATCH /api/articles/:id/publish - 記事公開・非公開
  - GET /api/articles/my - 自分の記事一覧
  - GET /api/articles/search - タグ検索

### Task 16: Tag Routes 作成

- [ ] 16.1. tag.route.ts 作成（`packages/backend/src/routes/tag.route.ts`）
  - GET /api/tags - タグ一覧

### Task 17: Image Routes 作成

- [ ] 17.1. image.route.ts 作成（`packages/backend/src/routes/image.route.ts`）
  - POST /api/images - 画像アップロード
  - DELETE /api/images/:id - 画像削除

### Task 18: Routes プラグイン登録

- [ ] 18.1. routes.plugin.ts に article.route を登録
- [ ] 18.2. routes.plugin.ts に tag.route を登録
- [ ] 18.3. routes.plugin.ts に image.route を登録

---

## Phase 7: Frontend — Composables 層

### Task 19: Article Composables 作成

- [ ] 19.1. useArticleApi composable 作成（`packages/frontend/src/composables/useArticleApi.ts`）
  - createArticle, updateArticle, publishArticle, deleteArticle, getArticle, listArticles, searchArticlesByTags API 呼び出し
- [ ] 19.2. useArticle composable 作成（`packages/frontend/src/composables/useArticle.ts`）
  - 記事ビジネスロジック（バリデーション、状態管理）

### Task 20: Markdown Composables 作成

- [ ] 20.1. useMarkdown composable 作成（`packages/frontend/src/composables/useMarkdown.ts`）
  - Markdown パース、プレビュー、シンタックスハイライト

### Task 21: Image Composables 作成

- [ ] 21.1. useImageUpload composable 作成（`packages/frontend/src/composables/useImageUpload.ts`）
  - 画像アップロード、プレビュー、削除

### Task 22: Tag Composables 作成

- [ ] 22.1. useTagApi composable 作成（`packages/frontend/src/composables/useTagApi.ts`）
  - listTags API 呼び出し
- [ ] 22.2. useTag composable 作成（`packages/frontend/src/composables/useTag.ts`）
  - タグ管理ロジック

---

## Phase 8: Frontend — Stores 層

### Task 23: Article Store 作成

- [ ] 23.1. useArticleStore 作成（`packages/frontend/src/stores/article.store.ts`）
  - 記事データの永続保持、キャッシュ管理

---

## Phase 9: Frontend — Components 層

### Task 24: Article Components 作成

- [ ] 24.1. ArticleCard.vue 作成（`packages/frontend/src/components/ArticleCard.vue`）
- [ ] 24.2. ArticleForm.vue 作成（`packages/frontend/src/components/ArticleForm.vue`）
- [ ] 24.3. MarkdownEditor.vue 作成（`packages/frontend/src/components/MarkdownEditor.vue`）
- [ ] 24.4. MarkdownPreview.vue 作成（`packages/frontend/src/components/MarkdownPreview.vue`）

### Task 25: Tag Components 作成

- [ ] 25.1. TagFilter.vue 作成（`packages/frontend/src/components/TagFilter.vue`）
- [ ] 25.2. TagInput.vue 作成（`packages/frontend/src/components/TagInput.vue`）

### Task 26: Image Components 作成

- [ ] 26.1. ImageUploader.vue 作成（`packages/frontend/src/components/ImageUploader.vue`）

### Task 27: Sandbox Components 作成

- [ ] 27.1. SandboxEmbed.vue 作成（`packages/frontend/src/components/SandboxEmbed.vue`）

---

## Phase 10: Frontend — Views 層

### Task 28: Article Views 作成

- [ ] 28.1. ArticleListView.vue 作成（`packages/frontend/src/views/ArticleListView.vue`）
- [ ] 28.2. ArticleDetailView.vue 作成（`packages/frontend/src/views/ArticleDetailView.vue`）
- [ ] 28.3. ArticleCreateView.vue 作成（`packages/frontend/src/views/ArticleCreateView.vue`）
- [ ] 28.4. ArticleEditView.vue 作成（`packages/frontend/src/views/ArticleEditView.vue`）
- [ ] 28.5. MyArticlesView.vue 作成（`packages/frontend/src/views/MyArticlesView.vue`）

### Task 29: Vue Router 設定

- [ ] 29.1. Article ルート追加（`packages/frontend/src/router/index.ts`）
  - /articles - 公開記事一覧
  - /articles/:id - 記事詳細
  - /articles/new - 記事作成
  - /articles/:id/edit - 記事編集
  - /my-articles - 自分の記事一覧

---

## Phase 11: Frontend — スタイリング（SCSS）

### Task 30: Article スタイル作成

- [ ] 30.1. ArticleCard.scss 作成（`packages/frontend/src/components/ArticleCard.scss`）
- [ ] 30.2. ArticleForm.scss 作成（`packages/frontend/src/components/ArticleForm.scss`）
- [ ] 30.3. MarkdownEditor.scss 作成（`packages/frontend/src/components/MarkdownEditor.scss`）
- [ ] 30.4. MarkdownPreview.scss 作成（`packages/frontend/src/components/MarkdownPreview.scss`）

### Task 31: レスポンシブデザイン対応

- [ ] 31.1. モバイル（320px〜767px）スタイル作成
- [ ] 31.2. タブレット（768px〜1023px）スタイル作成
- [ ] 31.3. デスクトップ（1024px以上）スタイル作成
- [ ] 31.4. ハンバーガーメニュー実装（モバイル）
- [ ] 31.5. タップターゲット最低 44px × 44px 対応

### Task 32: アクセシビリティ対応

- [ ] 32.1. 全画像に alt 属性追加
- [ ] 32.2. 見出し階層（h1, h2, h3）の適切な構造化
- [ ] 32.3. フォーカスインジケーター実装
- [ ] 32.4. キーボード操作対応
- [ ] 32.5. ARIA ラベル追加
- [ ] 32.6. コントラスト比 4.5:1 以上の確認

---

## Phase 12: テスト — Backend ユニットテスト

### Task 33: Domain 層ユニットテスト

- [ ] 33.1. MarkdownParser サービステスト作成
- [ ] 33.2. MarkdownPrinter サービステスト作成
- [ ] 33.3. SandboxValidator サービステスト作成

### Task 34: Infrastructure 層ユニットテスト

- [ ] 34.1. ArticleRepositoryImpl テスト作成
- [ ] 34.2. TagRepositoryImpl テスト作成
- [ ] 34.3. ArticleImageRepositoryImpl テスト作成
- [ ] 34.4. SupabaseStorageService テスト作成

### Task 35: Application 層ユニットテスト

- [ ] 35.1. CreateArticleUsecase テスト作成
- [ ] 35.2. UpdateArticleUsecase テスト作成
- [ ] 35.3. PublishArticleUsecase テスト作成
- [ ] 35.4. DeleteArticleUsecase テスト作成
- [ ] 35.5. GetArticleUsecase テスト作成
- [ ] 35.6. ListArticlesUsecase テスト作成
- [ ] 35.7. SearchArticlesByTagsUsecase テスト作成
- [ ] 35.8. UploadImageUsecase テスト作成
- [ ] 35.9. DeleteImageUsecase テスト作成
- [ ] 35.10. ListTagsUsecase テスト作成

### Task 36: Interface 層統合テスト

- [ ] 36.1. Article Routes 統合テスト作成（Fastify inject()）
- [ ] 36.2. Tag Routes 統合テスト作成
- [ ] 36.3. Image Routes 統合テスト作成

---

## Phase 13: テスト — Backend プロパティベーステスト

### Task 37: Property 1-5 テスト作成

- [ ] 37.1. Property 1: 記事バリデーション テスト作成
- [ ] 37.2. Property 2: 記事作成時のメタデータ生成 テスト作成
- [ ] 37.3. Property 3: 作成者のみが記事を操作可能 テスト作成
- [ ] 37.4. Property 4: 記事更新時の動作 テスト作成
- [ ] 37.5. Property 5: 公開状態切り替え テスト作成

### Task 38: Property 6-10 テスト作成

- [ ] 38.1. Property 6: 記事削除時の関連データ削除 テスト作成
- [ ] 38.2. Property 7: 公開記事一覧のフィルタリングとソート テスト作成
- [ ] 38.3. Property 8: ページネーション テスト作成
- [ ] 38.4. Property 9: 記事詳細のアクセス制御 テスト作成
- [ ] 38.5. Property 10: 自分の記事一覧フィルタリング テスト作成

### Task 39: Property 11-15 テスト作成

- [ ] 39.1. Property 11: タグ検索フィルタリング テスト作成
- [ ] 39.2. Property 12: 画像バリデーション テスト作成
- [ ] 39.3. Property 13: 画像アップロード時のURL生成 テスト作成
- [ ] 39.4. Property 14: 画像削除の認可 テスト作成
- [ ] 39.5. Property 15: Markdownパースの基本動作 テスト作成

### Task 40: Property 16-19 テスト作成

- [ ] 40.1. Property 16: Markdownラウンドトリップ テスト作成
- [ ] 40.2. Property 17: Markdown拡張機能 テスト作成
- [ ] 40.3. Property 18: サンドボックスURL検証とiframe生成 テスト作成
- [ ] 40.4. Property 19: タグの作成と再利用 テスト作成

---

## Phase 14: テスト — Frontend ユニットテスト

### Task 41: Composables ユニットテスト

- [ ] 41.1. useArticleApi テスト作成
- [ ] 41.2. useArticle テスト作成
- [ ] 41.3. useMarkdown テスト作成
- [ ] 41.4. useImageUpload テスト作成
- [ ] 41.5. useTagApi テスト作成
- [ ] 41.6. useTag テスト作成

### Task 42: Stores ユニットテスト

- [ ] 42.1. useArticleStore テスト作成

### Task 43: Components ユニットテスト

- [ ] 43.1. ArticleCard.vue テスト作成
- [ ] 43.2. ArticleForm.vue テスト作成
- [ ] 43.3. MarkdownEditor.vue テスト作成
- [ ] 43.4. MarkdownPreview.vue テスト作成
- [ ] 43.5. TagFilter.vue テスト作成
- [ ] 43.6. TagInput.vue テスト作成
- [ ] 43.7. ImageUploader.vue テスト作成
- [ ] 43.8. SandboxEmbed.vue テスト作成

---

## Phase 15: テスト — E2E テスト

### Task 44: Article E2E テスト作成

- [ ] 44.1. 記事作成フロー E2E テスト作成（Playwright）
- [ ] 44.2. 記事編集フロー E2E テスト作成
- [ ] 44.3. 記事公開フロー E2E テスト作成
- [ ] 44.4. 記事削除フロー E2E テスト作成
- [ ] 44.5. 記事一覧表示 E2E テスト作成
- [ ] 44.6. 記事詳細表示 E2E テスト作成
- [ ] 44.7. タグ検索 E2E テスト作成

### Task 45: Image E2E テスト作成

- [ ] 45.1. 画像アップロード E2E テスト作成

---

## Phase 16: ドキュメント・最終調整

### Task 46: README 更新

- [ ] 46.1. 技術ブログ機能の使い方を README に追記
- [ ] 46.2. API エンドポイント一覧を README に追記

### Task 47: テストカバレッジ確認

- [ ] 47.1. Backend テストカバレッジ 100% 確認
- [ ] 47.2. Frontend テストカバレッジ 100% 確認

### Task 48: パフォーマンステスト

- [ ] 48.1. 記事一覧 API レスポンスタイム 500ms 以内確認
- [ ] 48.2. 記事詳細 API レスポンスタイム 300ms 以内確認

### Task 49: セキュリティ確認

- [ ] 49.1. RLS ポリシーの動作確認（公開記事・下書き記事のアクセス制御）
- [ ] 49.2. 認可チェックの動作確認（作成者のみが編集・削除可能）
- [ ] 49.3. XSS 対策の動作確認（DOMPurify サニタイズ）
- [ ] 49.4. Zod バリデーションの動作確認

### Task 50: 最終動作確認

- [ ] 50.1. 全機能の動作確認（記事作成・編集・公開・削除・一覧・詳細・タグ検索・画像アップロード・サンドボックス埋め込み）
- [ ] 50.2. レスポンシブデザインの動作確認（モバイル・タブレット・デスクトップ）
- [ ] 50.3. アクセシビリティの動作確認（キーボード操作・スクリーンリーダー）

---

## 完了条件

- [ ] 全50タスク完了
- [ ] テストカバレッジ 100% 達成
- [ ] 全 E2E テスト合格
- [ ] パフォーマンス要件達成（記事一覧 500ms 以内、記事詳細 300ms 以内）
- [ ] セキュリティ要件達成（RLS、認可、XSS 対策、バリデーション）
- [ ] レスポンシブデザイン完全対応
- [ ] アクセシビリティ基準（WCAG AA）達成
