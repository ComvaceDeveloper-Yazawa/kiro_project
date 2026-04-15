# Units of Work 定義

## 生成方針

| 決定事項            | 内容                                                         |
| ------------------- | ------------------------------------------------------------ |
| 実行順序            | 順番に実行（shared → supabase → backend → frontend → ci-cd） |
| コード生成粒度      | スキャフォールディング + コーディング規約ドキュメント        |
| Prisma 初期スキーマ | 空のスキーマのみ（テーブル定義なし）                         |

---

## Unit 1: shared

**目的:** フロント・バック共通の Zod スキーマと推論型を提供する唯一のパッケージ

**責務:**

- API リクエスト・レスポンスの Zod スキーマ定義
- ドメインエンティティの Zod スキーマ定義（バリデーション用）
- `z.infer<>` による TypeScript 型の公開
- ビジネスロジック・ユーティリティ・副作用のある処理は含めない

**成果物:**

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── api/          # API スキーマ（リクエスト・レスポンス）
│   │   └── domain/       # ドメインスキーマ
│   └── index.ts          # 公開エントリポイント
├── package.json
└── tsconfig.json
```

**コーディング規約ドキュメント:** `packages/shared/CODING_STANDARDS.md`

- Zod スキーマ命名規則
- 型エクスポートのルール
- 循環依存防止ルール

**完了条件:**

- [ ] ディレクトリ構成・設定ファイル生成
- [ ] CODING_STANDARDS.md 生成
- [ ] 空の index.ts（エントリポイント）生成

---

## Unit 2: supabase

**目的:** Supabase CLI で管理する DB マイグレーション・RLS ポリシー・プロジェクト設定

**責務:**

- DB マイグレーションファイルの管理
- Row Level Security（RLS）ポリシーの定義
- Supabase CLI プロジェクト設定
- 開発用シードデータ

**成果物:**

```
packages/supabase/
├── migrations/           # マイグレーションファイル（空）
├── seed.sql              # 開発用シードデータ（空）
└── config.toml           # Supabase CLI 設定
```

**コーディング規約ドキュメント:** `packages/supabase/CODING_STANDARDS.md`

- マイグレーションファイルの命名規則
- RLS ポリシーの書き方
- Prisma との接続方式（Direct / Pooler）の使い分け

**完了条件:**

- [ ] ディレクトリ構成・設定ファイル生成
- [ ] CODING_STANDARDS.md 生成
- [ ] config.toml 雛形生成

---

## Unit 3: backend

**目的:** Fastify + Prisma + Supabase Auth による API サーバー

**責務:**

- HTTP リクエスト受付・レスポンス返却（Interface 層）
- ユースケース実行・トランザクション管理（Application 層）
- ビジネスルール・エンティティ（Domain 層）
- Prisma リポジトリ実装・外部サービス通信（Infrastructure 層）

**成果物:**

```
packages/backend/
├── src/
│   ├── app.ts
│   ├── plugins/
│   │   ├── auth.plugin.ts
│   │   ├── db.plugin.ts
│   │   └── routes.plugin.ts
│   ├── hooks/
│   │   └── error.handler.ts
│   ├── routes/
│   ├── usecases/
│   ├── domain/
│   │   └── errors/
│   │       └── app.error.ts
│   └── infrastructure/
│       ├── prisma/
│       │   └── client.ts
│       └── supabase/
│           └── auth.service.ts
├── prisma/
│   └── schema.prisma     # 空のスキーマ
├── package.json
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── vitest.config.ts
```

**コーディング規約ドキュメント:** `packages/backend/CODING_STANDARDS.md`

- DDD 4層の責務分離ルール
- 命名規約（変数・関数・クラス・型）
- 非同期処理・エラーハンドリング
- ESLint all ベースの運用方針（緩めるルール一覧）
- Vitest テスト方針（カバレッジ 100% 運用）
- Prisma の書き方・接続方式

**完了条件:**

- [ ] ディレクトリ構成・設定ファイル生成
- [ ] CODING_STANDARDS.md 生成
- [ ] 空の app.ts・プラグイン雛形生成
- [ ] AppError クラス定義生成
- [ ] Prisma 空スキーマ生成

---

## Unit 4: frontend

**目的:** Vue 3 + Pinia + Vue Router による SPA

**責務:**

- ページ・UI コンポーネントの提供（View / Component 層）
- API 通信（composables/api 層）
- UI ロジック・フォームバリデーション（composables 層）
- 認証状態・サーバーデータの永続保持（stores 層）
- ルーティング・認証ガード（router 層）

**成果物:**

```
packages/frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   ├── index.ts
│   │   └── routes.ts
│   ├── stores/
│   │   └── useAuthStore.ts
│   ├── composables/
│   │   ├── api/
│   │   │   └── useApiClient.ts
│   │   └── useAuth.ts
│   ├── views/
│   ├── components/
│   └── styles/
│       ├── _variables.scss
│       ├── _mixins.scss
│       ├── _reset.scss
│       └── global.scss
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── vitest.config.ts
```

**コーディング規約ドキュメント:** `packages/frontend/CODING_STANDARDS.md`

- Vue 3 script setup の書き方
- composables / stores / views の責務分離ルール
- Pinia Setup 記法のルール
- 命名規約（変数・関数・コンポーネント・型）
- SCSS 運用ルール（SMACSS ベース・変数・mixin）
- ESLint all ベースの運用方針（緩めるルール一覧）
- Vitest テスト方針（カバレッジ 100% 運用）

**完了条件:**

- [ ] ディレクトリ構成・設定ファイル生成
- [ ] CODING_STANDARDS.md 生成
- [ ] useApiClient.ts 雛形生成
- [ ] useAuthStore.ts 雛形生成（Setup 記法）
- [ ] SCSS ファイル雛形生成

---

## Unit 5: ci-cd

**目的:** GitHub Actions による Lint + Test + Deploy の自動化と Playwright E2E

**責務:**

- PR 時の Lint チェック・Vitest 実行
- マージ時のデプロイ
- Playwright E2E テスト（主要フロー）
- 全パッケージの統合テスト

**成果物:**

```
.github/
└── workflows/
    ├── lint-test.yml     # PR 時: Lint + Vitest
    └── deploy.yml        # main マージ時: Deploy

packages/e2e/             # Playwright E2E テスト
├── tests/
├── playwright.config.ts
└── package.json
```

**コーディング規約ドキュメント:** `packages/e2e/CODING_STANDARDS.md`

- Playwright テストの書き方
- E2E テスト対象フローの選定基準
- CI/CD ワークフローの変更ルール

**完了条件:**

- [ ] GitHub Actions ワークフローファイル生成
- [ ] Playwright 設定ファイル生成
- [ ] CODING_STANDARDS.md 生成

---

## 実行順序サマリー

```
Phase 1: shared
  └── 他全ユニットが依存するため最初に完成させる

Phase 2: supabase
  └── backend の Prisma マイグレーションに必要

Phase 3: backend
  └── shared・supabase 完了後に着手

Phase 4: frontend
  └── backend 完了後に着手（API 仕様が確定してから）

Phase 5: ci-cd
  └── 全ユニット完了後に統合
```
