# Code Generation 計画 - Unit 3: backend

## ユニット概要

- **目的**: Fastify + Prisma + Supabase Auth による DDD 4層 API サーバーのスキャフォールディング
- **生成場所**: `packages/backend/`
- **依存**: `@monorepo/shared`（Unit 1）、Supabase（Unit 2）

## 実行チェックリスト

### Part 1: プロジェクト構造セットアップ

- [x] Step 1: `packages/backend/` ディレクトリ構成作成
- [x] Step 2: `packages/backend/package.json` 生成
- [x] Step 3: `packages/backend/tsconfig.json` 生成
- [x] Step 4: `packages/backend/.env.example` 生成
- [x] Step 5: `packages/backend/prisma/schema.prisma` 生成

### Part 2: Domain 層生成

- [x] Step 6: `src/domain/errors/app.error.ts` 生成（AppError 7種類）

### Part 3: Infrastructure 層生成

- [x] Step 7: `src/infrastructure/prisma/client.ts` 生成（Prisma シングルトン）
- [x] Step 8: `src/infrastructure/supabase/auth.service.ts` 生成

### Part 4: Fastify プラグイン生成

- [x] Step 9: `src/plugins/db.plugin.ts` 生成（Prisma DI）
- [x] Step 10: `src/plugins/auth.plugin.ts` 生成（JWT 検証）
- [x] Step 11: `src/plugins/cors.plugin.ts` 生成
- [x] Step 12: `src/plugins/helmet.plugin.ts` 生成
- [x] Step 13: `src/plugins/rate-limit.plugin.ts` 生成
- [x] Step 14: `src/plugins/routes.plugin.ts` 生成（空のルート登録）

### Part 5: エラーハンドラー・エントリポイント生成

- [x] Step 15: `src/hooks/error.handler.ts` 生成
- [x] Step 16: `src/app.ts` 生成（プラグイン登録・起動）
- [x] Step 17: `src/index.ts` 生成（エントリポイント）

### Part 6: ドキュメント生成

- [x] Step 18: `packages/backend/CODING_STANDARDS.md` 生成
- [x] Step 19: `aidlc-docs/construction/backend/code/summary.md` 生成

---

## ステップ詳細

### Step 2: package.json

- パッケージ名: `@monorepo/backend`
- 依存: `fastify`, `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`, `@supabase/supabase-js`, `@prisma/client`, `zod`, `@monorepo/shared`
- devDependencies: `typescript`, `esbuild`, `vitest`, `prisma`, `@types/node`
- scripts: `dev`, `build`, `start`, `test`, `lint`

### Step 3: tsconfig.json

- strict: true
- target: ES2022
- module: ESNext
- moduleResolution: bundler
- paths: `@monorepo/shared` → `../shared/src/index.ts`

### Step 5: schema.prisma

- datasource: `DATABASE_URL` 環境変数のみ
- generator: `@prisma/client`
- 空スキーマ（テーブル定義なし）

### Step 6: app.error.ts

- AppError 基底クラス + 7サブクラス
- NotFoundError / ValidationError / UnauthorizedError / ForbiddenError / ConflictError / InternalServerError / ServiceUnavailableError

### Step 16: app.ts

- プラグイン登録順序: cors → helmet → rate-limit → db → auth → routes → errorHandler
- `CORS_ORIGIN` 環境変数で origin 制御

### Step 18: CODING_STANDARDS.md

- 4層アーキテクチャの責務分担
- 命名規則（ファイル・クラス・関数）
- エラーハンドリング方針
- テスト方針（Vitest・カバレッジ100%）
- 新リソース追加手順
