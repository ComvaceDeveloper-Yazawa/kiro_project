# 設計書 — 技術ブログ機能

## 概要

技術ブログ機能は、Vue 3 + Fastify + Supabase で構成されるモノレポプロジェクトに追加される新機能です。認証済みユーザーが技術記事を作成・編集・公開・削除でき、全ユーザーが公開記事を閲覧できます。Markdown形式での記事作成、画像アップロード、コードサンドボックス埋め込み、タグによる検索機能を提供します。

### 主要機能

- 記事のCRUD操作（作成・編集・公開・削除）
- Markdownパース（シンタックスハイライト、XSS対策）
- 画像アップロード（Supabase Storage）
- コードサンドボックス埋め込み（StackBlitz / CodeSandbox）
- タグによる記事検索
- レスポンシブデザイン（モバイル・タブレット・デスクトップ）
- アクセシビリティ対応（WCAG AA）

---

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vue 3)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Views      │  │  Components  │  │  Composables │      │
│  │              │  │              │  │              │      │
│  │ ArticleList  │  │ ArticleCard  │  │ useArticle   │      │
│  │ ArticleDetail│  │ ArticleForm  │  │ useMarkdown  │      │
│  │ ArticleEdit  │  │ TagFilter    │  │ useImage     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  Pinia Stores   │                        │
│                   │  - useArticle   │                        │
│                   │  - useAuth      │                        │
│                   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Fastify)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │  Usecases    │  │   Domain     │      │
│  │              │  │              │  │              │      │
│  │ article.route│  │ create-      │  │ Article      │      │
│  │ tag.route    │  │ article      │  │ Tag          │      │
│  │ image.route  │  │ publish-     │  │ Markdown     │      │
│  │              │  │ article      │  │ Parser       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │ Infrastructure  │                        │
│                   │ - Prisma Repos  │                        │
│                   │ - Supabase Auth │                        │
│                   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PostgreSQL / Storage
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   Storage    │  │     Auth     │      │
│  │              │  │              │  │              │      │
│  │ - articles   │  │ - images/    │  │ - JWT        │      │
│  │ - tags       │  │              │  │ - Sessions   │      │
│  │ - article_   │  │              │  │              │      │
│  │   tags       │  │              │  │              │      │
│  │ - article_   │  │              │  │              │      │
│  │   images     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### レイヤー構成

#### Frontend（4層）

1. **View / Component層**: UI描画・イベント受付
2. **Composables層**: ビジネスロジック・バリデーション・API通信
3. **Stores層**: 認証状態・サーバーデータの永続保持
4. **API Client層**: fetch ラッパー・認証ヘッダー付与

#### Backend（DDD寄り4層）

1. **Interface層（routes）**: HTTPリクエスト受付・Zodバリデーション
2. **Application層（usecases）**: ユースケース調整・トランザクション境界
3. **Domain層**: ビジネスルール・エンティティ・ドメインサービス
4. **Infrastructure層**: Prismaリポジトリ・Supabase Auth

---

## コンポーネントとインターフェース

### Frontend コンポーネント

#### Views

- **ArticleListView**: 公開記事一覧表示
- **ArticleDetailView**: 記事詳細表示
- **ArticleCreateView**: 記事作成フォーム
- **ArticleEditView**: 記事編集フォーム
- **MyArticlesView**: 自分の記事一覧表示

#### Components

- **ArticleCard**: 記事カード（一覧表示用）
- **ArticleForm**: 記事作成・編集フォーム
- **MarkdownEditor**: Markdownエディタ
- **MarkdownPreview**: Markdownプレビュー
- **TagFilter**: タグフィルター
- **TagInput**: タグ入力コンポーネント
- **ImageUploader**: 画像アップローダー
- **SandboxEmbed**: サンドボックス埋め込み

#### Composables

- **useArticleApi**: 記事API通信
- **useArticle**: 記事ビジネスロジック
- **useMarkdown**: Markdownパース・プレビュー
- **useImageUpload**: 画像アップロード
- **useTagApi**: タグAPI通信
- **useTag**: タグ管理ロジック

#### Stores

- **useArticleStore**: 記事データ永続保持
- **useAuthStore**: 認証状態保持

### Backend コンポーネント

#### Routes

- **article.route.ts**: 記事エンドポイント
  - `POST /api/articles` - 記事作成
  - `GET /api/articles` - 公開記事一覧
  - `GET /api/articles/:id` - 記事詳細
  - `PUT /api/articles/:id` - 記事更新
  - `DELETE /api/articles/:id` - 記事削除
  - `PATCH /api/articles/:id/publish` - 記事公開
  - `GET /api/articles/my` - 自分の記事一覧
  - `GET /api/articles/search` - タグ検索

- **tag.route.ts**: タグエンドポイント
  - `GET /api/tags` - タグ一覧

- **image.route.ts**: 画像エンドポイント
  - `POST /api/images` - 画像アップロード
  - `DELETE /api/images/:id` - 画像削除

#### Usecases

- **create-article.usecase.ts**: 記事作成
- **update-article.usecase.ts**: 記事更新
- **publish-article.usecase.ts**: 記事公開・非公開
- **delete-article.usecase.ts**: 記事削除
- **get-article.usecase.ts**: 記事取得
- **list-articles.usecase.ts**: 記事一覧取得
- **search-articles-by-tags.usecase.ts**: タグ検索
- **upload-image.usecase.ts**: 画像アップロード
- **delete-image.usecase.ts**: 画像削除

#### Domain Entities

- **Article**: 記事エンティティ
  - id: string
  - title: string
  - content: string (Markdown)
  - authorId: string
  - isPublished: boolean
  - publishedAt: Date | null
  - createdAt: Date
  - updatedAt: Date
  - tags: Tag[]

- **Tag**: タグエンティティ
  - id: string
  - name: string
  - createdAt: Date

- **ArticleImage**: 記事画像エンティティ
  - id: string
  - articleId: string
  - storagePath: string
  - url: string
  - createdAt: Date

#### Domain Services

- **MarkdownParser**: Markdownパーサー
  - `parse(markdown: string): string` - Markdown → HTML変換
  - `validate(markdown: string): ValidationResult` - Markdown検証
  - `sanitize(html: string): string` - XSS対策サニタイズ

- **MarkdownPrinter**: Markdownプリンター
  - `print(article: Article): string` - Article → Markdown変換

- **SandboxValidator**: サンドボックスURL検証
  - `validateUrl(url: string): boolean` - URL検証
  - `generateEmbedCode(url: string, type: 'stackblitz' | 'codesandbox'): string` - iframe生成

#### Repositories

- **ArticleRepository**: 記事リポジトリ
  - `save(article: Article): Promise<void>`
  - `findById(id: string): Promise<Article | null>`
  - `findAll(options: PaginationOptions): Promise<Article[]>`
  - `findByAuthorId(authorId: string, options: PaginationOptions): Promise<Article[]>`
  - `findByTags(tagIds: string[], options: PaginationOptions): Promise<Article[]>`
  - `delete(id: string): Promise<void>`

- **TagRepository**: タグリポジトリ
  - `save(tag: Tag): Promise<void>`
  - `findByName(name: string): Promise<Tag | null>`
  - `findAll(): Promise<Tag[]>`
  - `findOrCreate(name: string): Promise<Tag>`

- **ArticleImageRepository**: 記事画像リポジトリ
  - `save(image: ArticleImage): Promise<void>`
  - `findByArticleId(articleId: string): Promise<ArticleImage[]>`
  - `delete(id: string): Promise<void>`

---

## データモデル

### データベーススキーマ

```sql
-- articles テーブル
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_articles_updated_at ON articles(updated_at DESC);

-- tags テーブル
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_name ON tags(name);

-- article_tags テーブル（多対多）
CREATE TABLE article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);

-- article_images テーブル
CREATE TABLE article_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_article_images_article_id ON article_images(article_id);
```

### Supabase RLS ポリシー

```sql
-- articles テーブル
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 公開記事は全ユーザーが閲覧可能
CREATE POLICY "articles_select_published"
  ON articles FOR SELECT
  USING (is_published = true);

-- 自分の記事（下書き含む）は閲覧可能
CREATE POLICY "articles_select_own"
  ON articles FOR SELECT
  USING (auth.uid() = author_id);

-- 認証済みユーザーは記事を作成可能
CREATE POLICY "articles_insert_own"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- 自分の記事のみ更新可能
CREATE POLICY "articles_update_own"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- 自分の記事のみ削除可能
CREATE POLICY "articles_delete_own"
  ON articles FOR DELETE
  USING (auth.uid() = author_id);

-- tags テーブル
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがタグを閲覧可能
CREATE POLICY "tags_select_all"
  ON tags FOR SELECT
  USING (true);

-- 認証済みユーザーがタグを作成可能
CREATE POLICY "tags_insert_authenticated"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- article_tags テーブル
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- 公開記事のタグは全ユーザーが閲覧可能
CREATE POLICY "article_tags_select_published"
  ON article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.is_published = true
    )
  );

-- 自分の記事のタグは閲覧可能
CREATE POLICY "article_tags_select_own"
  ON article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- 自分の記事にタグを追加可能
CREATE POLICY "article_tags_insert_own"
  ON article_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- 自分の記事のタグを削除可能
CREATE POLICY "article_tags_delete_own"
  ON article_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- article_images テーブル
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- 公開記事の画像は全ユーザーが閲覧可能
CREATE POLICY "article_images_select_published"
  ON article_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.is_published = true
    )
  );

-- 自分の記事の画像は閲覧可能
CREATE POLICY "article_images_select_own"
  ON article_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- 自分の記事に画像を追加可能
CREATE POLICY "article_images_insert_own"
  ON article_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- 自分の記事の画像を削除可能
CREATE POLICY "article_images_delete_own"
  ON article_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_images.article_id
      AND articles.author_id = auth.uid()
    )
  );
```

### Supabase Storage RLS

```sql
-- images バケット
CREATE POLICY "images_select_published"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.is_published = true
    )
  );

CREATE POLICY "images_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.author_id = auth.uid()
    )
  );

CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "images_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    EXISTS (
      SELECT 1 FROM article_images ai
      JOIN articles a ON a.id = ai.article_id
      WHERE ai.storage_path = name
      AND a.author_id = auth.uid()
    )
  );
```

---

## Correctness Properties

_プロパティとは、システムの全ての有効な実行において真であるべき特性や振る舞いのことです。本質的には、システムが何をすべきかについての形式的な記述です。プロパティは、人間が読める仕様と機械が検証可能な正しさの保証との橋渡しとなります。_

### 受入基準テストプレワーク

要件1: 記事の作成
1.1. WHEN 認証済みユーザーが記事作成リクエストを送信する、THE Blog_System SHALL タイトル・本文・タグを検証する
Thoughts: これは全ての記事作成リクエストに適用されるバリデーションルールです。ランダムな入力（有効・無効）を生成してバリデーションが正しく動作することをテストできます
Classification: PROPERTY
Test Strategy: ランダムな記事データを生成し、バリデーション結果が期待通りか検証

1.2-1.5. タイトル・本文・タグの長さ制限
Thoughts: これらは境界値テストです。プロパティテストのジェネレーターで境界値を含むランダムデータを生成してテストできます
Classification: PROPERTY (ジェネレーターで境界値を含める)
Test Strategy: 境界値を含むランダムデータを生成し、バリデーションが正しく動作することを検証

1.6-1.9. 記事保存時の動作
Thoughts: これらは記事作成の副作用です。任意の有効な記事データで作成後、IDが生成され、日時が記録され、作成者IDが設定されることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな有効記事データで作成し、必須フィールドが正しく設定されることを検証

要件2: 記事の編集
2.1-2.2. 作成者検証
Thoughts: これは認可チェックです。ランダムなユーザーと記事の組み合わせで、作成者のみが編集できることを検証できます
Classification: PROPERTY
Test Strategy: ランダムなユーザー・記事ペアを生成し、作成者のみが編集可能であることを検証

2.3-2.6. 記事更新
Thoughts: 任意の有効な記事データで更新後、更新日時が変更され、公開状態が維持されることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事と更新データを生成し、更新が正しく動作することを検証

要件3: 記事の公開・非公開
3.1-3.2. 作成者検証
Thoughts: 要件2と同様の認可チェックです
Classification: PROPERTY
Test Strategy: ランダムなユーザー・記事ペアを生成し、作成者のみが公開状態を変更可能であることを検証

3.3-3.5. 公開状態切り替え
Thoughts: 公開・非公開の切り替えが正しく動作し、公開日時が適切に設定・クリアされることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事で公開・非公開を切り替え、公開日時が正しく管理されることを検証

要件4: 記事の削除
4.1-4.3. 作成者検証と削除
Thoughts: 認可チェックと削除動作です。削除後に記事が存在しないことを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事を生成し、作成者のみが削除可能で、削除後に記事が存在しないことを検証

4.4. タグ関連付けの削除
Thoughts: 記事削除時にタグ関連付けも削除されることを検証できます
Classification: PROPERTY
Test Strategy: タグ付き記事を削除し、関連付けも削除されることを検証

要件5: 公開記事の一覧表示
5.1-5.6. 一覧表示とページネーション
Thoughts: これは一覧取得の動作です。ランダムな記事セットで、公開記事のみが返され、正しくソート・ページネーションされることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事セット（公開・下書き混在）を生成し、一覧が正しく動作することを検証

要件6: 記事の詳細表示
6.1-6.5. アクセス制御と詳細表示
Thoughts: これはアクセス制御のテストです。公開記事は全員、下書きは作成者のみがアクセス可能であることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事とユーザーの組み合わせで、アクセス制御が正しく動作することを検証

要件7: 自分の記事一覧表示
7.1-7.5. 自分の記事一覧
Thoughts: 特定ユーザーの記事のみが返されることを検証できます
Classification: PROPERTY
Test Strategy: ランダムなユーザーと記事セットで、そのユーザーの記事のみが返されることを検証

要件8: タグによる記事検索
8.1-8.4. タグ検索
Thoughts: タグフィルタリングが正しく動作することを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事とタグの組み合わせで、タグ検索が正しく動作することを検証

要件9: 画像アップロード
9.1-9.4. 画像バリデーション
Thoughts: 画像ファイルのバリデーションです。ランダムな画像データ（有効・無効）でバリデーションが正しく動作することを検証できます
Classification: PROPERTY
Test Strategy: ランダムな画像データを生成し、バリデーションが正しく動作することを検証

9.5-9.7. 画像保存
Thoughts: 画像保存後にURLが返されることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな有効画像データで保存し、URLが返されることを検証

9.8-9.10. 画像削除とアクセス制御
Thoughts: 記事削除時に画像も削除され、作成者のみが画像を削除できることを検証できます
Classification: PROPERTY
Test Strategy: ランダムな記事と画像で、削除とアクセス制御が正しく動作することを検証

要件10: Markdownパースと拡張機能
10.1-10.2. Markdownパース
Thoughts: Markdownパーサーの基本動作です。ランダムなMarkdownを生成してパースできることを検証できます
Classification: PROPERTY
Test Strategy: ランダムなMarkdownを生成し、パースが正しく動作することを検証

10.3-10.4. ラウンドトリップ
Thoughts: これは典型的なラウンドトリッププロパティです。Article → Markdown → Article の変換で同等のオブジェクトが得られることを検証できます
Classification: PROPERTY
Test Strategy: ランダムなArticleオブジェクトでラウンドトリップが成功することを検証

10.5-10.7. Markdown拡張機能
Thoughts: 画像記法、シンタックスハイライト、XSS対策が正しく動作することを検証できます
Classification: PROPERTY
Test Strategy: ランダムなMarkdown（画像、コードブロック、HTML含む）で拡張機能が正しく動作することを検証

要件11: コードサンドボックス埋め込み
11.1-11.8. サンドボックス埋め込み
Thoughts: サンドボックスURL検証とiframe生成が正しく動作することを検証できます
Classification: PROPERTY
Test Strategy: ランダムなURL（有効・無効）でサンドボックス埋め込みが正しく動作することを検証

要件12: タグの管理
12.1-12.5. タグ管理
Thoughts: タグの作成・再利用が正しく動作することを検証できます
Classification: PROPERTY
Test Strategy: ランダムなタグ名で、既存タグの再利用と新規作成が正しく動作することを検証

要件13: アクセシビリティ
13.1-13.6. アクセシビリティ
Thoughts: これらはUI/UXの要件で、自動テストが困難です
Classification: INTEGRATION / MANUAL
Test Strategy: 手動テストまたはアクセシビリティツールでの検証

要件14: レスポンシブデザイン
14.1-14.12. レスポンシブデザイン
Thoughts: これらはUI/UXの要件で、自動テストが困難です
Classification: INTEGRATION / MANUAL
Test Strategy: 手動テストまたはビジュアルリグレッションテストでの検証

要件15: パフォーマンス
15.1-15.6. パフォーマンス
Thoughts: これらはパフォーマンス要件で、プロパティテストには適していません
Classification: INTEGRATION
Test Strategy: パフォーマンステストツールでの検証

要件16: セキュリティとアクセス制御
16.1-16.6. セキュリティ
Thoughts: これらは認証・認可・バリデーションの要件で、他のプロパティでカバーされます
Classification: PROPERTY (他のプロパティでカバー)
Test Strategy: 各プロパティテストで認証・認可・バリデーションを検証

### プロパティリフレクション

上記の分析を見直し、冗長性を排除します：

- 要件1.2-1.5（境界値テスト）は要件1.1（バリデーション）に統合可能
- 要件2.1-2.2、3.1-3.2、4.1-4.2（作成者検証）は共通の認可プロパティに統合可能
- 要件9.1-9.4（画像バリデーション）は単一のバリデーションプロパティに統合可能
- 要件10.5-10.7（Markdown拡張機能）は単一のパースプロパティに統合可能

### Property 1: 記事バリデーション

*任意の*記事作成リクエストに対して、タイトルが1-200文字、本文が1-50000文字、タグが0-10個、各タグが1-30文字の場合のみ、システムは記事を受け入れる

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: 記事作成時のメタデータ生成

*任意の*有効な記事データに対して、記事作成時にシステムは一意なID、作成日時、更新日時、作成者IDを生成する

**Validates: Requirements 1.6, 1.7, 1.8, 1.9**

### Property 3: 作成者のみが記事を操作可能

*任意の*記事と任意のユーザーに対して、そのユーザーが記事の作成者である場合のみ、システムは編集・削除・公開状態変更を許可する

**Validates: Requirements 2.1, 2.2, 3.1, 3.2, 4.1, 4.2**

### Property 4: 記事更新時の動作

*任意の*記事と有効な更新データに対して、記事更新時にシステムは更新日時を更新し、公開状態を変更しない

**Validates: Requirements 2.3, 2.4, 2.5, 2.6**

### Property 5: 公開状態切り替え

*任意の*記事に対して、公開時にシステムは公開日時を設定し、非公開時にシステムは公開日時をクリアする

**Validates: Requirements 3.3, 3.4, 3.5**

### Property 6: 記事削除時の関連データ削除

*任意の*記事に対して、記事削除時にシステムはタグ関連付けと画像を削除する

**Validates: Requirements 4.3, 4.4, 9.8**

### Property 7: 公開記事一覧のフィルタリングとソート

*任意の*記事セット（公開・下書き混在）に対して、公開記事一覧は公開状態の記事のみを含み、公開日時の降順でソートされる

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 8: ページネーション

*任意の*記事セットとページサイズ（1-100）に対して、システムは指定されたページサイズ以下の記事を返す

**Validates: Requirements 5.4, 5.5, 5.6**

### Property 9: 記事詳細のアクセス制御

*任意の*記事とユーザーに対して、記事が公開状態の場合は全ユーザーがアクセス可能、下書き状態の場合は作成者のみがアクセス可能

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 10: 自分の記事一覧フィルタリング

*任意の*ユーザーと記事セットに対して、自分の記事一覧はそのユーザーが作成した記事のみを含み、更新日時の降順でソートされる

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 11: タグ検索フィルタリング

*任意の*タグセットと記事セットに対して、タグ検索は指定された全てのタグを持つ公開記事のみを返す

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 12: 画像バリデーション

*任意の*画像アップロードリクエストに対して、画像形式がJPEG/PNG/GIF/WebP、ファイルサイズが5MB以下、幅・高さが10000px以下の場合のみ、システムは画像を受け入れる

**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 13: 画像アップロード時のURL生成

*任意の*有効な画像データに対して、画像アップロード時にシステムは一意なファイル名を生成し、公開URLを返す

**Validates: Requirements 9.5, 9.6, 9.7**

### Property 14: 画像削除の認可

*任意の*画像とユーザーに対して、そのユーザーが画像の記事の作成者である場合のみ、システムは画像削除を許可する

**Validates: Requirements 9.9, 9.10**

### Property 15: Markdownパースの基本動作

*任意の*有効なMarkdownに対して、システムはHTMLに変換し、XSS攻撃を防ぐためにサニタイズする

**Validates: Requirements 10.1, 10.2, 10.7**

### Property 16: Markdownラウンドトリップ

*任意の*有効なArticleオブジェクトに対して、プリント→パース→プリントのラウンドトリップで同等のMarkdown文字列が得られる

**Validates: Requirements 10.3, 10.4**

### Property 17: Markdown拡張機能

*任意の*Markdown（画像記法、コードブロック含む）に対して、システムは画像をレンダリングし、コードブロックにシンタックスハイライトを適用する

**Validates: Requirements 10.5, 10.6**

### Property 18: サンドボックスURL検証とiframe生成

*任意の*サンドボックスURL（StackBlitz/CodeSandbox）に対して、URLがホワイトリストに含まれる場合のみ、システムは適切なsandbox属性を持つiframe埋め込みコードを生成する

**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8**

### Property 19: タグの作成と再利用

*任意の*タグ名に対して、タグが既に存在する場合はシステムは既存のタグを再利用し、存在しない場合は新しいタグを作成する

**Validates: Requirements 12.1, 12.2, 12.3, 12.4**

---

## エラーハンドリング

### エラー分類

#### Domain Errors（ドメインエラー）

- **ValidationError**: バリデーション失敗（400 Bad Request）
  - タイトル・本文・タグの長さ制限違反
  - 画像形式・サイズ・寸法制限違反
  - 無効なMarkdown
  - 無効なサンドボックスURL

- **AuthorizationError**: 認可失敗（403 Forbidden）
  - 作成者以外による記事編集・削除・公開状態変更
  - 作成者以外による画像削除

- **NotFoundError**: リソース未検出（404 Not Found）
  - 存在しない記事ID
  - 存在しない画像ID
  - 存在しないタグID

- **ConflictError**: リソース競合（409 Conflict）
  - 同名タグの重複作成（通常は再利用されるが、並行処理で発生する可能性）

#### Infrastructure Errors（インフラエラー）

- **DatabaseError**: データベースエラー（500 Internal Server Error）
  - Prismaクエリ失敗
  - トランザクション失敗

- **StorageError**: ストレージエラー（500 Internal Server Error）
  - Supabase Storage アップロード失敗
  - 画像削除失敗

- **AuthenticationError**: 認証失敗（401 Unauthorized）
  - JWT検証失敗
  - セッション期限切れ

### エラーレスポンス形式

全てのエラーは統一されたApiResponse形式で返却されます：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

### エラーハンドリング戦略

1. **Fail Closed設計**: エラー時はデフォルトで拒否
2. **グローバルエラーハンドラー**: `setErrorHandler`で全エラーをキャッチ
3. **内部情報の非公開**: スタックトレースやDB詳細をレスポンスに含めない
4. **構造化ログ**: エラー発生時はリクエストID・ユーザーID・エラー詳細をログ出力
5. **ユーザーフレンドリーなメッセージ**: 日本語でわかりやすいエラーメッセージを提供

---

## テスト戦略

### デュアルテストアプローチ

技術ブログ機能は、ユニットテストとプロパティベーステスト（PBT）の両方を使用して包括的なカバレッジを実現します。

#### ユニットテスト

- 特定の例とエッジケースを検証
- 統合ポイント（API、DB、Storage）をテスト
- エラー条件を検証

#### プロパティベーステスト

- 普遍的なプロパティを全入力にわたって検証
- ランダム化による包括的な入力カバレッジ
- 最小100イテレーション実行

### プロパティベーステストライブラリ

- **Backend（TypeScript）**: fast-check
- **Frontend（TypeScript）**: fast-check

### テストカバレッジ目標

- **全体**: 100%
- **除外対象**: `src/main.ts`、`src/index.ts`、型定義のみのファイル

### プロパティテスト設定

各プロパティテストは以下の設定で実行されます：

```typescript
import fc from 'fast-check';

// 最小100イテレーション
fc.assert(
  fc.property(
    // ジェネレーター
    fc.record({
      title: fc.string({ minLength: 1, maxLength: 200 }),
      content: fc.string({ minLength: 1, maxLength: 50000 }),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 10 }),
    }),
    // プロパティ
    (article) => {
      // Feature: tech-blog, Property 1: 記事バリデーション
      const result = validateArticle(article);
      return result.isValid === true;
    },
  ),
  { numRuns: 100 },
);
```

### プロパティテストタグ形式

各プロパティテストには、設計ドキュメントのプロパティを参照するコメントタグを付与します：

```typescript
// Feature: tech-blog, Property 1: 記事バリデーション
// 任意の記事作成リクエストに対して、タイトルが1-200文字、本文が1-50000文字、
// タグが0-10個、各タグが1-30文字の場合のみ、システムは記事を受け入れる
```

### テストファイル配置

- **Backend**: `packages/backend/src/**/__tests__/{filename}.test.ts`
- **Frontend**: `packages/frontend/src/**/__tests__/{filename}.test.ts`

### テスト実行コマンド

```bash
# Backend
cd packages/backend
pnpm test
pnpm test:coverage

# Frontend
cd packages/frontend
pnpm test
pnpm test:coverage
```

### テスト種別

#### 1. ユニットテスト（例ベース）

**対象**:

- 特定の例とエッジケース
- エラー条件
- 統合ポイント

**例**:

```typescript
describe('ArticleRepository', () => {
  it('記事が存在しない場合はnullを返す', async () => {
    const repo = new ArticleRepositoryImpl(prisma);
    const result = await repo.findById('non-existent-id');
    expect(result).toBeNull();
  });
});
```

#### 2. プロパティベーステスト

**対象**:

- 普遍的なプロパティ
- ランダム入力による包括的カバレッジ

**例**:

```typescript
describe('Article Validation Property', () => {
  it('Property 1: 記事バリデーション', () => {
    // Feature: tech-blog, Property 1: 記事バリデーション
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          content: fc.string({ minLength: 1, maxLength: 50000 }),
          tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 10 }),
        }),
        (article) => {
          const result = validateArticle(article);
          return result.isValid === true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

#### 3. 統合テスト

**対象**:

- API エンドポイント（Fastify `inject()`）
- データベース操作（Prisma）
- ストレージ操作（Supabase Storage）

**例**:

```typescript
describe('POST /api/articles', () => {
  it('認証済みユーザーが記事を作成できる', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/articles',
      headers: {
        authorization: `Bearer ${validToken}`,
      },
      payload: {
        title: 'Test Article',
        content: '# Test Content',
        tags: ['test'],
      },
    });
    expect(response.statusCode).toBe(201);
  });
});
```

#### 4. E2Eテスト（Playwright）

**対象**:

- ユーザーフロー全体
- UI/UXの動作確認

**例**:

```typescript
test('記事を作成して公開できる', async ({ page }) => {
  await page.goto('/articles/new');
  await page.fill('[data-testid="article-title"]', 'Test Article');
  await page.fill('[data-testid="article-content"]', '# Test Content');
  await page.click('[data-testid="article-submit"]');
  await expect(page).toHaveURL(/\/articles\/\w+/);
});
```

### モック戦略

#### Backend

- **Prisma**: `vitest.mock`でモック
- **Supabase Auth**: `SupabaseAuthService`をモック
- **Supabase Storage**: `StorageService`をモック

#### Frontend

- **API Client**: `useApiClient`を`vi.mock`でモック
- **Pinia Stores**: `createTestingPinia()`でモック
- **Vue Router**: `createMemoryHistory()`でモック

### テスト実行順序

1. **ユニットテスト**: 最速、依存なし
2. **プロパティベーステスト**: 中速、100イテレーション
3. **統合テスト**: 中速、DB/Storage接続
4. **E2Eテスト**: 最遅、ブラウザ起動

### CI/CDでのテスト実行

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
```

---

## まとめ

技術ブログ機能の設計は、以下の要素で構成されます：

1. **アーキテクチャ**: Vue 3 + Fastify + Supabase のモノレポ構成、DDD寄り4層アーキテクチャ
2. **コンポーネント**: Frontend（Views、Components、Composables、Stores）、Backend（Routes、Usecases、Domain、Infrastructure）
3. **データモデル**: articles、tags、article_tags、article_images テーブル、Supabase RLS ポリシー
4. **Correctness Properties**: 19個のプロパティで全要件をカバー
5. **エラーハンドリング**: 統一されたApiResponse形式、Fail Closed設計
6. **テスト戦略**: ユニットテスト + プロパティベーステスト（fast-check、最小100イテレーション）

この設計により、セキュアで保守性の高い技術ブログ機能を実現します。
