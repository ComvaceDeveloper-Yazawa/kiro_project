# 要件定義書 — 技術ブログ機能

## イントロダクション

本ドキュメントは、Vue 3 + Fastify + Supabase で構成されるモノレポプロジェクトに技術ブログ機能を追加するための要件を定義します。ユーザーは認証後、技術記事を作成・編集・公開・削除でき、他のユーザーは公開された記事を閲覧できます。

## 用語集

- **Blog_System**: 技術ブログ機能全体を指すシステム
- **Article**: ユーザーが作成する技術記事（タイトル、本文、タグ、公開状態を持つ）
- **Author**: 記事を作成・編集・削除できる認証済みユーザー
- **Reader**: 公開された記事を閲覧できるユーザー（認証不要）
- **Tag**: 記事を分類するためのラベル
- **Draft**: 下書き状態の記事（作成者のみ閲覧可能）
- **Published**: 公開状態の記事（全ユーザーが閲覧可能）
- **Markdown_Parser**: Markdown 形式のテキストを HTML に変換するパーサー
- **Pretty_Printer**: Article オブジェクトを Markdown 形式に整形するプリンター
- **Article_Repository**: Article の永続化を担当するリポジトリ
- **Tag_Repository**: Tag の永続化を担当するリポジトリ
- **Image_Storage**: Supabase Storage を使用した画像ファイルの保存領域
- **Sandbox_Embed**: StackBlitz や CodeSandbox などのコードサンドボックスの埋め込み iframe

---

## 要件

### 要件 1: 記事の作成

**ユーザーストーリー:** 開発者として、技術記事を作成したいので、知識を共有できるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが記事作成リクエストを送信する、THE Blog_System SHALL タイトル・本文・タグを検証する
2. WHEN タイトルが 1 文字以上 200 文字以下である、THE Blog_System SHALL タイトルを受け入れる
3. WHEN 本文が 1 文字以上 50000 文字以下である、THE Blog_System SHALL 本文を受け入れる
4. WHEN タグが 0 個以上 10 個以下である、THE Blog_System SHALL タグを受け入れる
5. WHEN 各タグが 1 文字以上 30 文字以下である、THE Blog_System SHALL タグを受け入れる
6. WHEN 検証が成功する、THE Blog_System SHALL 記事を下書き状態で保存する
7. WHEN 記事が保存される、THE Blog_System SHALL 一意な記事 ID を生成する
8. WHEN 記事が保存される、THE Blog_System SHALL 作成日時と更新日時を記録する
9. WHEN 記事が保存される、THE Blog_System SHALL 作成者の ID を記録する

### 要件 2: 記事の編集

**ユーザーストーリー:** 開発者として、自分の記事を編集したいので、内容を改善できるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが記事編集リクエストを送信する、THE Blog_System SHALL ユーザーが記事の作成者であることを検証する
2. WHEN ユーザーが記事の作成者でない、THE Blog_System SHALL 403 Forbidden エラーを返す
3. WHEN ユーザーが記事の作成者である、THE Blog_System SHALL タイトル・本文・タグを検証する
4. WHEN 検証が成功する、THE Blog_System SHALL 記事を更新する
5. WHEN 記事が更新される、THE Blog_System SHALL 更新日時を記録する
6. WHEN 記事が更新される、THE Blog_System SHALL 公開状態を変更しない

### 要件 3: 記事の公開・非公開

**ユーザーストーリー:** 開発者として、記事の公開状態を切り替えたいので、公開タイミングをコントロールできるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが公開状態変更リクエストを送信する、THE Blog_System SHALL ユーザーが記事の作成者であることを検証する
2. WHEN ユーザーが記事の作成者でない、THE Blog_System SHALL 403 Forbidden エラーを返す
3. WHEN ユーザーが記事の作成者である、THE Blog_System SHALL 公開状態を切り替える
4. WHEN 記事が公開される、THE Blog_System SHALL 公開日時を記録する
5. WHEN 記事が非公開になる、THE Blog_System SHALL 公開日時をクリアする

### 要件 4: 記事の削除

**ユーザーストーリー:** 開発者として、自分の記事を削除したいので、不要な記事を管理できるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが記事削除リクエストを送信する、THE Blog_System SHALL ユーザーが記事の作成者であることを検証する
2. WHEN ユーザーが記事の作成者でない、THE Blog_System SHALL 403 Forbidden エラーを返す
3. WHEN ユーザーが記事の作成者である、THE Blog_System SHALL 記事を削除する
4. WHEN 記事が削除される、THE Blog_System SHALL 関連するタグの関連付けを削除する

### 要件 5: 公開記事の一覧表示

**ユーザーストーリー:** 読者として、公開された記事の一覧を見たいので、興味のある記事を見つけられるようにしたい

#### 受入基準

1. THE Blog_System SHALL 公開状態の記事のみを一覧に含める
2. THE Blog_System SHALL 記事を公開日時の降順で並べる
3. THE Blog_System SHALL 各記事のタイトル・作成者名・公開日時・タグを含める
4. THE Blog_System SHALL ページネーションをサポートする
5. WHEN ページサイズが指定される、THE Blog_System SHALL 1 ページあたり 1 件以上 100 件以下の記事を返す
6. WHEN ページサイズが指定されない、THE Blog_System SHALL 1 ページあたり 20 件の記事を返す

### 要件 6: 記事の詳細表示

**ユーザーストーリー:** 読者として、記事の全文を読みたいので、技術情報を学べるようにしたい

#### 受入基準

1. WHEN 記事が公開状態である、THE Blog_System SHALL 全ユーザーに記事の全文を表示する
2. WHEN 記事が下書き状態である、THE Blog_System SHALL 作成者のみに記事の全文を表示する
3. WHEN 下書き記事に認証されていないユーザーがアクセスする、THE Blog_System SHALL 401 Unauthorized エラーを返す
4. WHEN 下書き記事に作成者以外のユーザーがアクセスする、THE Blog_System SHALL 404 Not Found エラーを返す
5. THE Blog_System SHALL 記事のタイトル・本文・作成者名・公開日時・更新日時・タグを表示する

### 要件 7: 自分の記事一覧表示

**ユーザーストーリー:** 開発者として、自分が作成した記事の一覧を見たいので、記事を管理できるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが自分の記事一覧をリクエストする、THE Blog_System SHALL そのユーザーが作成した全記事を返す
2. THE Blog_System SHALL 公開状態と下書き状態の両方の記事を含める
3. THE Blog_System SHALL 記事を更新日時の降順で並べる
4. THE Blog_System SHALL 各記事のタイトル・公開状態・公開日時・更新日時・タグを含める
5. THE Blog_System SHALL ページネーションをサポートする

### 要件 8: タグによる記事検索

**ユーザーストーリー:** 読者として、特定のタグで記事を絞り込みたいので、興味のあるトピックの記事を見つけられるようにしたい

#### 受入基準

1. WHEN ユーザーがタグを指定する、THE Blog_System SHALL そのタグを持つ公開記事のみを返す
2. WHEN 複数のタグが指定される、THE Blog_System SHALL 全ての指定タグを持つ記事のみを返す
3. THE Blog_System SHALL 記事を公開日時の降順で並べる
4. THE Blog_System SHALL ページネーションをサポートする

### 要件 9: 画像アップロード

**ユーザーストーリー:** 開発者として、記事に画像をアップロードしたいので、視覚的にわかりやすい記事を作成できるようにしたい

#### 受入基準

1. WHEN 認証済みユーザーが画像をアップロードする、THE Blog_System SHALL 画像ファイルを検証する
2. THE Blog_System SHALL JPEG, PNG, GIF, WebP 形式の画像を受け入れる
3. THE Blog_System SHALL 画像ファイルサイズを 5MB 以下に制限する
4. THE Blog_System SHALL 画像の幅と高さを 10000px 以下に制限する
5. WHEN 画像が検証される、THE Blog_System SHALL Supabase Storage に画像を保存する
6. WHEN 画像が保存される、THE Blog_System SHALL 一意なファイル名を生成する
7. WHEN 画像が保存される、THE Blog_System SHALL 公開 URL を返す
8. THE Blog_System SHALL 記事削除時に関連する画像を削除する
9. THE Blog_System SHALL 作成者のみが自分の画像を削除できるようにする
10. THE Blog_System SHALL Supabase Storage RLS で画像へのアクセスを制御する

### 要件 10: Markdown パースと拡張機能

**ユーザーストーリー:** 開発者として、Markdown 形式で記事を書きたいので、コードブロック・見出し・画像・サンドボックスを使って読みやすい記事を作成できるようにしたい

#### 受入基準

1. WHEN 記事本文が Markdown 形式で提供される、THE Markdown_Parser SHALL それを HTML に変換する
2. WHEN 無効な Markdown が提供される、THE Markdown_Parser SHALL エラーメッセージを返す
3. THE Pretty_Printer SHALL Article オブジェクトを有効な Markdown 形式に整形する
4. FOR ALL 有効な Article オブジェクト、THE Blog_System SHALL パース・プリント・パースのラウンドトリップで同等のオブジェクトを生成する
5. THE Markdown_Parser SHALL 画像の Markdown 記法（`![alt](url)`）をサポートする
6. THE Markdown_Parser SHALL コードブロックのシンタックスハイライトをサポートする
7. THE Markdown_Parser SHALL XSS 攻撃を防ぐために HTML をサニタイズする

### 要件 11: コードサンドボックス埋め込み

**ユーザーストーリー:** 開発者として、記事にインタラクティブなコードサンドボックスを埋め込みたいので、読者がコードを実際に動かして学べるようにしたい

#### 受入基準

1. THE Blog_System SHALL StackBlitz WebContainers の埋め込み URL をサポートする
2. THE Blog_System SHALL CodeSandbox の埋め込み URL をサポートする
3. WHEN Markdown に `[sandbox:stackblitz](url)` 記法が含まれる、THE Markdown_Parser SHALL iframe 埋め込みコードを生成する
4. WHEN Markdown に `[sandbox:codesandbox](url)` 記法が含まれる、THE Markdown_Parser SHALL iframe 埋め込みコードを生成する
5. THE Blog_System SHALL サンドボックス iframe に適切な sandbox 属性を設定する
6. THE Blog_System SHALL サンドボックス iframe の高さを 500px に設定する
7. THE Blog_System SHALL サンドボックス URL のホワイトリストを検証する
8. WHEN 無効なサンドボックス URL が提供される、THE Blog_System SHALL エラーメッセージを返す

### 要件 12: タグの管理

**ユーザーストーリー:** 開発者として、タグを効率的に管理したいので、既存のタグを再利用できるようにしたい

#### 受入基準

1. WHEN 新しいタグ名が記事に追加される、THE Blog_System SHALL タグが既に存在するか確認する
2. WHEN タグが既に存在する、THE Blog_System SHALL 既存のタグを再利用する
3. WHEN タグが存在しない、THE Blog_System SHALL 新しいタグを作成する
4. THE Blog_System SHALL 使用されていないタグを保持する
5. THE Blog_System SHALL 全タグの一覧を取得できる機能を提供する

### 要件 13: アクセシビリティ

**ユーザーストーリー:** 視覚障害のある読者として、スクリーンリーダーで記事を読みたいので、適切なセマンティック HTML とアクセシビリティ属性が提供されるようにしたい

#### 受入基準

1. THE Blog_System SHALL 全ての画像に alt 属性を提供する
2. THE Blog_System SHALL 見出しを適切な階層（h1, h2, h3）で構造化する
3. THE Blog_System SHALL フォーカス可能な要素に視覚的なフォーカスインジケーターを表示する
4. THE Blog_System SHALL キーボードのみで全ての機能を操作可能にする
5. THE Blog_System SHALL ARIA ラベルを適切に使用する
6. THE Blog_System SHALL 色のコントラスト比を WCAG AA 基準（4.5:1）以上にする

### 要件 16: セキュリティとアクセス制御

**ユーザーストーリー:** システム管理者として、記事へのアクセスを適切に制御したいので、セキュリティを確保できるようにしたい

#### 受入基準

1. THE Blog_System SHALL 記事作成・編集・削除・公開状態変更に認証を要求する
2. THE Blog_System SHALL 記事の作成者のみが編集・削除・公開状態変更できるようにする
3. THE Blog_System SHALL Supabase RLS ポリシーで記事へのアクセスを制御する
4. THE Blog_System SHALL 全入力パラメータに Zod バリデーションを適用する
5. WHEN バリデーションが失敗する、THE Blog_System SHALL 400 Bad Request エラーを返す
6. THE Blog_System SHALL エラーレスポンスに内部情報を含めない

### 要件 14: レスポンシブデザイン

**ユーザーストーリー:** 読者として、スマートフォン・タブレット・デスクトップのどのデバイスでも快適に記事を読みたいので、画面幅に応じた最適なレイアウトで表示されるようにしたい

#### 受入基準

1. THE Blog_System SHALL モバイル（320px〜767px）、タブレット（768px〜1023px）、デスクトップ（1024px以上）の3つのブレークポイントをサポートする
2. WHEN 画面幅がモバイルサイズである、THE Blog_System SHALL 1カラムレイアウトで表示する
3. WHEN 画面幅がタブレットサイズである、THE Blog_System SHALL 2カラムレイアウトで表示する
4. WHEN 画面幅がデスクトップサイズである、THE Blog_System SHALL 3カラムレイアウトまたは中央寄せレイアウトで表示する
5. THE Blog_System SHALL 画像を画面幅に応じて自動リサイズする
6. THE Blog_System SHALL コードブロックを横スクロール可能にする
7. THE Blog_System SHALL サンドボックス iframe を画面幅に応じてリサイズする
8. THE Blog_System SHALL タッチデバイスでのスワイプ操作をサポートする
9. THE Blog_System SHALL フォントサイズを画面幅に応じて調整する（モバイル: 14px〜16px、デスクトップ: 16px〜18px）
10. THE Blog_System SHALL ナビゲーションメニューをモバイルではハンバーガーメニューで表示する
11. THE Blog_System SHALL 全てのインタラクティブ要素（ボタン、リンク）のタップターゲットを最低 44px × 44px にする
12. THE Blog_System SHALL viewport meta タグを設定する（`<meta name="viewport" content="width=device-width, initial-scale=1.0">`）

### 要件 15: パフォーマンス

**ユーザーストーリー:** 読者として、記事を素早く読み込みたいので、快適に閲覧できるようにしたい

#### 受入基準

1. WHEN 記事一覧がリクエストされる、THE Blog_System SHALL 500ms 以内にレスポンスを返す
2. WHEN 記事詳細がリクエストされる、THE Blog_System SHALL 300ms 以内にレスポンスを返す
3. THE Blog_System SHALL 記事一覧クエリに適切なインデックスを使用する
4. THE Blog_System SHALL タグ検索クエリに適切なインデックスを使用する
5. THE Blog_System SHALL 画像を遅延読み込み（lazy loading）する
6. THE Blog_System SHALL 画像を WebP 形式で配信する（対応ブラウザの場合）

---

## データベース設計の考慮事項

本要件定義では、以下のテーブル構造を想定しています：

- **articles**: 記事の基本情報（id, title, content, author_id, is_published, published_at, created_at, updated_at）
- **tags**: タグ情報（id, name, created_at）
- **article_tags**: 記事とタグの多対多関連（article_id, tag_id）
- **article_images**: 記事に関連する画像（id, article_id, storage_path, url, created_at）

Supabase RLS ポリシーにより、以下のアクセス制御を実装します：

- 公開記事: 全ユーザーが SELECT 可能
- 下書き記事: 作成者のみが SELECT 可能
- INSERT/UPDATE/DELETE: 作成者のみが実行可能
- 画像ファイル: 公開記事の画像は全ユーザーが閲覧可能、下書き記事の画像は作成者のみが閲覧可能

---

## 技術スタック

- **フロントエンド**: Vue 3 + TypeScript + SCSS + Pinia + Vue Router
- **バックエンド**: Fastify + Prisma + TypeScript + Zod
- **データベース**: Supabase PostgreSQL
- **ストレージ**: Supabase Storage（画像ファイル保存）
- **認証**: Supabase Auth
- **Markdown パーサー**: marked または markdown-it（実装時に選定）
- **シンタックスハイライト**: highlight.js または Prism.js（実装時に選定）
- **HTML サニタイザー**: DOMPurify（XSS 対策）
- **コードサンドボックス**: StackBlitz WebContainers（推奨）、CodeSandbox（代替）

---

## 成功基準

- 認証済みユーザーが記事を作成・編集・公開・削除できる
- 全ユーザーが公開記事を閲覧できる
- タグによる記事検索が機能する
- Markdown 形式で記事を作成できる
- 記事に画像をアップロードして埋め込める
- StackBlitz や CodeSandbox のサンドボックスを記事に埋め込める
- 画像とサンドボックスが適切にレンダリングされる
- モバイル・タブレット・デスクトップで完全にレスポンシブ対応している
- アクセシビリティ基準（WCAG AA）を満たしている
- セキュリティ要件（SECURITY-05, SECURITY-08, SECURITY-12, SECURITY-15）が満たされている
- パフォーマンス要件が満たされている
- テストカバレッジ 100% を達成している
