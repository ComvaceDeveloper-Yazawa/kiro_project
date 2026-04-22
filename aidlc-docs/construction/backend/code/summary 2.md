# Code Generation サマリー - Unit 3: backend

## 生成ファイル一覧

### 設定ファイル

| ファイル                                | 内容                                                 |
| --------------------------------------- | ---------------------------------------------------- |
| `packages/backend/package.json`         | 依存関係・スクリプト定義                             |
| `packages/backend/tsconfig.json`        | TypeScript 設定（strict / bundler moduleResolution） |
| `packages/backend/.env.example`         | 環境変数テンプレート                                 |
| `packages/backend/prisma/schema.prisma` | Prisma スキーマ（空・DATABASE_URL のみ）             |

### Domain 層

| ファイル                         | 内容                              |
| -------------------------------- | --------------------------------- |
| `src/domain/errors/app.error.ts` | AppError 基底クラス + 7サブクラス |

### Infrastructure 層

| ファイル                                      | 内容                            |
| --------------------------------------------- | ------------------------------- |
| `src/infrastructure/prisma/client.ts`         | Prisma クライアントシングルトン |
| `src/infrastructure/supabase/auth.service.ts` | Supabase Auth JWT 検証サービス  |

### Fastify プラグイン

| ファイル                           | 内容                                      |
| ---------------------------------- | ----------------------------------------- |
| `src/plugins/db.plugin.ts`         | Prisma DI（fastify.prisma として装飾）    |
| `src/plugins/auth.plugin.ts`       | JWT 検証・request.user 付与               |
| `src/plugins/cors.plugin.ts`       | CORS 設定（CORS_ORIGIN 環境変数で制御）   |
| `src/plugins/helmet.plugin.ts`     | HTTP セキュリティヘッダー（CSP・HSTS 等） |
| `src/plugins/rate-limit.plugin.ts` | レート制限（100req/min グローバル）       |
| `src/plugins/routes.plugin.ts`     | ルート登録（/health エンドポイントのみ）  |

### エントリポイント

| ファイル                     | 内容                                           |
| ---------------------------- | ---------------------------------------------- |
| `src/hooks/error.handler.ts` | グローバルエラーハンドラー                     |
| `src/app.ts`                 | Fastify アプリファクトリ（プラグイン登録順序） |
| `src/index.ts`               | サーバー起動エントリポイント                   |

### ドキュメント

| ファイル                               | 内容                                 |
| -------------------------------------- | ------------------------------------ |
| `packages/backend/CODING_STANDARDS.md` | コーディング規約・新リソース追加手順 |

---

## 完了条件チェックリスト

- [x] package.json（依存関係・スクリプト）
- [x] tsconfig.json（strict モード・shared パス解決）
- [x] .env.example（全環境変数のテンプレート）
- [x] schema.prisma（空スキーマ・DATABASE_URL のみ）
- [x] AppError 7種類（NotFound / Validation / Unauthorized / Forbidden / Conflict / InternalServer / ServiceUnavailable）
- [x] Prisma シングルトン（開発ログ付き）
- [x] Supabase Auth サービス（verifyToken）
- [x] db.plugin（fastify.decorate + onClose 切断）
- [x] auth.plugin（preHandler フック・auth: false スキップ対応）
- [x] cors.plugin（CORS_ORIGIN 環境変数・credentials: true）
- [x] helmet.plugin（CSP・HSTS・X-Frame-Options）
- [x] rate-limit.plugin（グローバル 100req/min）
- [x] routes.plugin（/health エンドポイント）
- [x] error.handler（AppError 変換・予期しないエラーは詳細非公開）
- [x] app.ts（プラグイン登録順序: cors→helmet→rate-limit→db→auth→routes→errorHandler）
- [x] index.ts（必須環境変数検証・起動）
- [x] CODING_STANDARDS.md
