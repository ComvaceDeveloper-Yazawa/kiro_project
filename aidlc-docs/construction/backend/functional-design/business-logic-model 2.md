# ビジネスロジックモデル - Unit 3: backend

## アーキテクチャ概要

backend は Fastify + Prisma + Supabase Auth による API サーバーです。
DDD 寄り 4 層アーキテクチャを採用し、各層の責務を明確に分離します。

---

## ディレクトリ構成（確定）

```
packages/backend/
├── src/
│   ├── app.ts                              # Fastify インスタンス生成・プラグイン登録
│   ├── plugins/
│   │   ├── auth.plugin.ts                  # JWT 検証・request.user 付与
│   │   ├── db.plugin.ts                    # Prisma クライアント DI
│   │   ├── routes.plugin.ts                # 全ルートの一括登録
│   │   ├── cors.plugin.ts                  # @fastify/cors 設定
│   │   ├── helmet.plugin.ts                # @fastify/helmet 設定
│   │   └── rate-limit.plugin.ts            # @fastify/rate-limit 設定
│   ├── hooks/
│   │   └── error.handler.ts                # setErrorHandler グローバルエラー変換
│   ├── routes/
│   │   └── {resource}/
│   │       └── {resource}.route.ts         # リソースごとのエンドポイント定義
│   ├── usecases/
│   │   └── {resource}/
│   │       ├── create-{resource}.usecase.ts
│   │       ├── get-{resource}.usecase.ts
│   │       ├── list-{resource}.usecase.ts
│   │       ├── update-{resource}.usecase.ts
│   │       └── delete-{resource}.usecase.ts
│   ├── domain/
│   │   ├── errors/
│   │   │   └── app.error.ts                # AppError 階層定義
│   │   └── {resource}/
│   │       ├── entities/
│   │       │   └── {resource}.entity.ts
│   │       ├── repositories/
│   │       │   └── {resource}.repository.ts  # インターフェース（抽象）
│   │       └── services/
│   │           └── {resource}.domain-service.ts
│   └── infrastructure/
│       ├── prisma/
│       │   ├── client.ts                   # Prisma クライアントシングルトン
│       │   └── {resource}/
│       │       └── {resource}.repository.impl.ts
│       └── supabase/
│           └── auth.service.ts             # Supabase Auth 通信
├── prisma/
│   └── schema.prisma                       # Prisma スキーマ（DATABASE_URL のみ）
├── package.json
├── tsconfig.json
├── .env.example
└── CODING_STANDARDS.md
```

---

## 4層アーキテクチャモデル

### 層の責務と依存方向

```
[HTTP Request]
      |
      v
+---------------------------+
|  Interface 層             |  src/routes/ + src/plugins/ + src/hooks/
|  - HTTP 受付・レスポンス  |
|  - Zod バリデーション     |
|  - JWT 認証               |
+---------------------------+
      |
      v (Input DTO)
+---------------------------+
|  Application 層           |  src/usecases/
|  - ユースケース調整       |
|  - トランザクション境界   |
+---------------------------+
      |
      v (Domain Objects)
+---------------------------+
|  Domain 層                |  src/domain/
|  - ビジネスルール         |
|  - エンティティ           |
|  - リポジトリ I/F         |
+---------------------------+
      |
      v (Repository Interface)
+---------------------------+
|  Infrastructure 層        |  src/infrastructure/
|  - Prisma 実装            |
|  - Supabase Auth          |
+---------------------------+
```

**依存ルール（依存方向は上から下のみ）:**

- Interface → Application → Domain ← Infrastructure
- Domain 層は他の層に依存しない（最も安定した層）
- Infrastructure 層は Domain のインターフェースを実装する

---

## Fastify プラグイン構成モデル

### app.ts でのプラグイン登録順序

```typescript
// 1. セキュリティ系プラグイン（最初に登録）
await app.register(corsPlugin);
await app.register(helmetPlugin);
await app.register(rateLimitPlugin);

// 2. インフラ系プラグイン
await app.register(dbPlugin); // Prisma DI

// 3. 認証プラグイン（db の後）
await app.register(authPlugin); // JWT 検証

// 4. ルートプラグイン（最後）
await app.register(routesPlugin);

// 5. グローバルエラーハンドラー（全登録後）
app.setErrorHandler(errorHandler);
```

### セキュリティプラグイン設定方針（Q1: A）

| プラグイン            | 設定内容                                                          |
| --------------------- | ----------------------------------------------------------------- |
| `@fastify/cors`       | `origin` を環境変数で制御、認証エンドポイントはワイルドカード禁止 |
| `@fastify/helmet`     | CSP・HSTS・X-Frame-Options 等の HTTP セキュリティヘッダー         |
| `@fastify/rate-limit` | グローバル: 100req/min、認証エンドポイント: 10req/min             |

---

## JWT 検証モデル（Q2: A）

### auth.plugin.ts の動作フロー

```
Request
  |
  v
Authorization ヘッダーから Bearer トークン抽出
  |
  v
supabase.auth.getUser(token) で検証
  |
  +-- 成功 --> request.user = { id, email, ... } を付与 --> 次のハンドラーへ
  |
  +-- 失敗 --> UnauthorizedError を throw --> setErrorHandler が 401 を返却
```

**採用理由:**

- Supabase の公開鍵管理・トークンリフレッシュを Supabase SDK に委譲できる
- JWT の署名検証・有効期限チェックが自動的に行われる
- `jsonwebtoken` を直接使う場合と比べて実装ミスのリスクが低い

---

## Prisma クライアント DI モデル（Q3: A）

### db.plugin.ts の実装パターン

```typescript
// シングルトンとして Fastify インスタンスに装飾
fastify.decorate("prisma", prismaClient);

// TypeScript 型拡張
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
```

**採用理由:**

- アプリケーション全体で Prisma コネクションプールを共有できる
- リクエストごとに新しいクライアントを生成するとコネクション枯渇のリスクがある
- `fastify.prisma` として各ルート・ユースケースから参照可能

---

## AppError 階層モデル（Q4: C）

### エラークラス構成（7種類）

```
AppError（基底クラス）
├── NotFoundError          404  NOT_FOUND
├── ValidationError        400  VALIDATION_ERROR
├── UnauthorizedError      401  UNAUTHORIZED
├── ForbiddenError         403  FORBIDDEN
├── ConflictError          409  CONFLICT
├── InternalServerError    500  INTERNAL_SERVER_ERROR
└── ServiceUnavailableError 503  SERVICE_UNAVAILABLE
```

**ServiceUnavailableError の用途:**

- Supabase Auth サービスへの接続失敗
- Prisma 接続タイムアウト
- 外部 API（将来追加時）の障害

### setErrorHandler での変換フロー

```typescript
// error.handler.ts
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    // AppError サブクラス → 対応する HTTP ステータスと ErrorCode で返却
    reply.status(error.statusCode).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  } else {
    // 予期しないエラー → 500 で返却（詳細は非公開）
    reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      },
    });
  }
});
```

---

## Prisma 接続モデル（Q5: A）

### schema.prisma の datasource 設定

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**DATABASE_URL の使い分け（環境変数で切り替え）:**

| 用途                   | 接続文字列の種類                                                        |
| ---------------------- | ----------------------------------------------------------------------- |
| マイグレーション実行時 | Direct URL（`postgresql://...`）を `DATABASE_URL` に設定                |
| アプリ実行時           | Pooler URL（`postgresql://...?pgbouncer=true`）を `DATABASE_URL` に設定 |

**.env.example:**

```
# アプリ実行用（Pooler 経由）
DATABASE_URL=postgresql://[user]:[password]@[host]:6543/[db]?pgbouncer=true

# マイグレーション実行時は Direct URL に差し替える
# DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[db]
```

---

## データフロー（リクエスト処理の全体像）

```
[Client]
  |
  | HTTP Request (Authorization: Bearer <token>)
  v
[Interface 層]
  auth.plugin.ts    → JWT 検証（supabase.auth.getUser）
  {resource}.route.ts → Zod バリデーション
  |
  | Input DTO（Zod 推論型）
  v
[Application 層]
  {action}.usecase.ts → ユースケース実行
  |
  | Domain Objects
  v
[Domain 層]
  {resource}.entity.ts → 不変条件チェック
  {resource}.repository.ts → リポジトリ I/F 呼び出し
  |
  | Repository Interface
  v
[Infrastructure 層]
  {resource}.repository.impl.ts → Prisma クエリ実行
  |
  | Prisma Result
  v
[Application 層]
  → エンティティ → レスポンス型変換
  |
  v
[Interface 層]
  → ApiResponse<T> 形式で返却
  |
  v
[Client]
  HTTP Response { success: true, data: {...}, message: "" }
```
