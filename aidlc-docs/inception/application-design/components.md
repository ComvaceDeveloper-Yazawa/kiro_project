# コンポーネント定義

## 設計方針サマリー

| 決定事項             | 採用内容                                                     |
| -------------------- | ------------------------------------------------------------ |
| バックエンドレイヤー | DDD 寄り 4 層（routes → usecases → domain → infrastructure） |
| フロント composables | API 通信は composables のみ、store は状態保持のみ            |
| Pinia 記法           | Setup 記法（defineStore with setup function）                |
| shared 公開範囲      | Zod スキーマと推論型（z.infer）のみ                          |
| Fastify プラグイン   | 機能ごとにプラグイン分割                                     |
| エラーハンドリング   | setErrorHandler でグローバル集約                             |

---

## パッケージ構成

```
monorepo/
├── packages/
│   ├── shared/          # Zod スキーマ・推論型のみ
│   ├── frontend/        # Vue 3 SPA
│   ├── backend/         # Fastify API サーバー
│   └── supabase/        # Supabase CLI 管理（DB・マイグレーション）
```

---

## shared パッケージ

### SharedSchemas

- 責務: フロント・バック共通の Zod スキーマ定義と型推論の提供
- 公開範囲: Zod スキーマオブジェクトと `z.infer<>` による型のみ
- 禁止事項: ビジネスロジック・ユーティリティ関数・副作用のある処理を含めない

| コンポーネント    | 責務                                                    |
| ----------------- | ------------------------------------------------------- |
| `schemas/api/`    | API リクエスト・レスポンスの Zod スキーマ               |
| `schemas/domain/` | ドメインエンティティの Zod スキーマ（バリデーション用） |
| `index.ts`        | 公開エントリポイント（スキーマと型のみ re-export）      |

---

## backend パッケージ

DDD 寄り 4 層アーキテクチャを採用。

### 層の責務

| 層                | ディレクトリ          | 責務                                                    |
| ----------------- | --------------------- | ------------------------------------------------------- |
| Interface 層      | `src/routes/`         | HTTP リクエスト受付・レスポンス返却・Zod バリデーション |
| Application 層    | `src/usecases/`       | ユースケースの調整・トランザクション境界                |
| Domain 層         | `src/domain/`         | ビジネスルール・エンティティ・ドメインサービス          |
| Infrastructure 層 | `src/infrastructure/` | Prisma リポジトリ・Supabase Auth・外部サービス          |

### コンポーネント一覧

#### Interface 層（`src/routes/`）

| コンポーネント               | 責務                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| `plugins/auth.plugin.ts`     | Supabase Auth JWT 検証・リクエストへのユーザー情報付与               |
| `plugins/db.plugin.ts`       | Prisma クライアントの DI・接続管理                                   |
| `plugins/routes.plugin.ts`   | 全ルートの登録・プレフィックス管理                                   |
| `routes/{resource}.route.ts` | リソースごとのエンドポイント定義・Zod スキーマによる入力検証         |
| `hooks/error.handler.ts`     | setErrorHandler によるグローバルエラー変換・ApiResponse 形式への統一 |

#### Application 層（`src/usecases/`）

| コンポーネント                   | 責務                                            |
| -------------------------------- | ----------------------------------------------- |
| `{resource}/{action}.usecase.ts` | 単一ユースケースの実行（例: CreateUserUsecase） |

#### Domain 層（`src/domain/`）

| コンポーネント                                     | 責務                                                        |
| -------------------------------------------------- | ----------------------------------------------------------- |
| `{resource}/entities/{resource}.entity.ts`         | ドメインエンティティ・不変条件の保証                        |
| `{resource}/repositories/{resource}.repository.ts` | リポジトリインターフェース定義（抽象）                      |
| `{resource}/services/{resource}.domain-service.ts` | 複数エンティティにまたがるドメインロジック                  |
| `errors/app.error.ts`                              | AppError・DomainError・NotFoundError 等のカスタムエラー定義 |

#### Infrastructure 層（`src/infrastructure/`）

| コンポーネント                         | 責務                            |
| -------------------------------------- | ------------------------------- |
| `prisma/{resource}.repository.impl.ts` | Prisma を使ったリポジトリ実装   |
| `supabase/auth.service.ts`             | Supabase Auth との通信          |
| `prisma/client.ts`                     | Prisma クライアントシングルトン |

---

## frontend パッケージ

### コンポーネント一覧

#### API 通信層（`src/composables/api/`）

| コンポーネント        | 責務                                                              |
| --------------------- | ----------------------------------------------------------------- |
| `use{Resource}Api.ts` | fetch API を使ったリソースごとの CRUD 操作・エラーハンドリング    |
| `useApiClient.ts`     | 共通 fetch ラッパー（ベース URL・認証ヘッダー・レスポンス型変換） |

#### UI ロジック層（`src/composables/`）

| コンポーネント    | 責務                                                      |
| ----------------- | --------------------------------------------------------- |
| `use{Feature}.ts` | フォームバリデーション・UI 状態管理・イベントハンドリング |
| `useAuth.ts`      | Supabase Auth のセッション管理・ログイン/ログアウト操作   |

#### 状態管理層（`src/stores/`）※ Setup 記法

| コンポーネント          | 責務                                                 |
| ----------------------- | ---------------------------------------------------- |
| `use{Resource}Store.ts` | サーバーから取得したデータの永続状態保持・キャッシュ |
| `useAuthStore.ts`       | 認証状態（ユーザー情報・トークン）の永続保持         |

#### View 層（`src/views/`）

| コンポーネント      | 責務                                                       |
| ------------------- | ---------------------------------------------------------- |
| `{Feature}View.vue` | ページ単位のコンポーネント・ルーティングのエントリポイント |

#### UI コンポーネント層（`src/components/`）

| コンポーネント                  | 責務                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `{Feature}/{ComponentName}.vue` | 再利用可能な UI コンポーネント・プレゼンテーションのみ |

#### ルーティング（`src/router/`）

| コンポーネント | 責務                                                  |
| -------------- | ----------------------------------------------------- |
| `index.ts`     | Vue Router 定義・ナビゲーションガード（認証チェック） |
| `routes.ts`    | ルート定義の分離                                      |

---

## supabase パッケージ

| コンポーネント | 責務                                            |
| -------------- | ----------------------------------------------- |
| `migrations/`  | Supabase CLI 管理の DB マイグレーションファイル |
| `seed.sql`     | 開発用シードデータ                              |
| `config.toml`  | Supabase CLI プロジェクト設定                   |
