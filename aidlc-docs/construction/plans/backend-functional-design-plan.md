# Functional Design 計画 - Unit 3: backend

## 実行チェックリスト

- [x] Step 1: 設計判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: business-logic-model.md 生成
- [x] Step 4: business-rules.md 生成
- [x] Step 5: domain-entities.md 生成

---

## 前提（確定済み）

- Fastify + Prisma + Supabase Auth による API サーバー
- DDD 寄り 4 層（Interface / Application / Domain / Infrastructure）
- エラーハンドリング: setErrorHandler でグローバル集約
- Fastify プラグイン: 機能ごとに分割（auth / db / routes）
- Prisma 接続: マイグレーション用 Direct / アプリ用 Pooler（Pgbouncer）
- shared の ApiResponse<T> / Zod スキーマを使用
- セキュリティ: SECURITY-01〜15 全ルール適用

---

## 設計判断質問

各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

Fastify の `app.ts` でのプラグイン登録に `@fastify/cors` や `@fastify/helmet` などのセキュリティ系プラグインを含めますか？

A) Yes — cors・helmet・rate-limit を含める（セキュリティヘッダー・CORS・レート制限を初期から設定）
B) cors と helmet のみ（rate-limit は後から追加）
C) スキャフォールディングには含めない（後から追加）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2

`auth.plugin.ts` の JWT 検証方式はどうしますか？

A) Supabase の `@supabase/supabase-js` クライアントを使って JWT を検証（`supabase.auth.getUser(token)`）
B) `jsonwebtoken` ライブラリで直接 JWT を検証（Supabase の公開鍵を使用）
C) `@fastify/jwt` プラグインを使用
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

`db.plugin.ts` での Prisma クライアントの DI 方法はどうしますか？

A) `fastify.decorate('prisma', prismaClient)` でシングルトンとして装飾
B) リクエストごとに新しい Prisma クライアントを生成
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

`AppError` のサブクラス構成はどうしますか？

A) 基本 5 種類のみ（NotFoundError / ValidationError / UnauthorizedError / ForbiddenError / ConflictError）
B) 基本 5 種類 + InternalServerError（予期しないエラー用）
C) 基本 5 種類 + InternalServerError + ServiceUnavailableError（外部サービス障害用）
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5

Prisma の `schema.prisma` の初期設定で、`datasource` の接続方式はどう定義しますか？

A) `DATABASE_URL` 環境変数のみ（1 つの接続文字列で管理）
B) `DATABASE_URL`（Pooler 用）と `DIRECT_URL`（マイグレーション用）の 2 つを定義
C) Other (please describe after [Answer]: tag below)

[Answer]: A
