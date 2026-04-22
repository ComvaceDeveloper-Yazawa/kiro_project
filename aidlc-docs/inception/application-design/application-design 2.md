# アプリケーション設計書

## 設計方針

| 決定事項             | 採用内容                                                             | 理由                                   |
| -------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| バックエンドレイヤー | DDD 寄り 4 層                                                        | テスタビリティ・ビジネスロジックの分離 |
| フロント composables | composables はビジネスロジック・バリデーション、UI 描画は components | 責務の明確化・テスト容易性             |
| Pinia 記法           | Setup 記法                                                           | TypeScript 親和性・柔軟性              |
| shared 公開範囲      | Zod スキーマと推論型のみ                                             | 最小依存・循環依存防止                 |
| Fastify プラグイン   | 機能ごとに分割                                                       | 関心の分離・テスト容易性               |
| エラーハンドリング   | setErrorHandler でグローバル集約                                     | 一貫した ApiResponse 形式の保証        |

---

## モノレポ構成

```
monorepo/
├── package.json              # pnpm workspaces 定義
├── pnpm-workspace.yaml
├── packages/
│   ├── shared/               # Zod スキーマ・推論型のみ
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   │   ├── api/      # API リクエスト・レスポンス Zod スキーマ
│   │   │   │   └── domain/   # ドメインエンティティ Zod スキーマ
│   │   │   └── index.ts      # 公開エントリポイント
│   │   └── package.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── app.ts                    # Fastify インスタンス・プラグイン登録
│   │   │   ├── plugins/
│   │   │   │   ├── auth.plugin.ts        # JWT 検証
│   │   │   │   ├── db.plugin.ts          # Prisma DI
│   │   │   │   └── routes.plugin.ts      # ルート一括登録
│   │   │   ├── hooks/
│   │   │   │   └── error.handler.ts      # グローバルエラーハンドラー
│   │   │   ├── routes/                   # Interface 層
│   │   │   │   └── {resource}.route.ts
│   │   │   ├── usecases/                 # Application 層
│   │   │   │   └── {resource}/
│   │   │   │       └── {action}-{resource}.usecase.ts
│   │   │   ├── domain/                   # Domain 層
│   │   │   │   ├── {resource}/
│   │   │   │   │   ├── entities/
│   │   │   │   │   ├── repositories/     # インターフェース定義
│   │   │   │   │   └── services/         # ドメインサービス
│   │   │   │   └── errors/
│   │   │   │       └── app.error.ts
│   │   │   └── infrastructure/           # Infrastructure 層
│   │   │       ├── prisma/
│   │   │       │   ├── client.ts
│   │   │       │   └── {resource}.repository.impl.ts
│   │   │       └── supabase/
│   │   │           └── auth.service.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── App.vue
│   │   │   ├── router/
│   │   │   │   ├── index.ts              # Vue Router・ナビゲーションガード
│   │   │   │   └── routes.ts
│   │   │   ├── stores/                   # Pinia（Setup 記法）
│   │   │   │   ├── useAuthStore.ts
│   │   │   │   └── use{Resource}Store.ts
│   │   │   ├── composables/
│   │   │   │   ├── api/
│   │   │   │   │   ├── useApiClient.ts   # 共通 fetch ラッパー
│   │   │   │   │   └── use{Resource}Api.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── use{Feature}.ts
│   │   │   ├── views/
│   │   │   │   └── {Feature}View.vue
│   │   │   ├── components/
│   │   │   │   └── {Feature}/
│   │   │   │       └── {ComponentName}.vue
│   │   │   └── styles/
│   │   │       ├── _variables.scss       # SCSS 変数
│   │   │       ├── _mixins.scss          # SCSS mixin
│   │   │       ├── _reset.scss           # リセット CSS
│   │   │       └── global.scss           # グローバル CSS（最小限）
│   │   └── package.json
│   │
│   └── supabase/
│       ├── migrations/                   # DB マイグレーション
│       ├── seed.sql
│       └── config.toml
│
└── .github/
    └── workflows/
        ├── lint-test.yml
        └── deploy.yml
```

---

## パッケージ間依存関係

```
shared（依存なし）
  ^           ^
  |           |
backend     frontend

supabase（アプリコードに依存しない）
```

**禁止:** `backend` ↔ `frontend` の相互依存

---

## backend レイヤー依存関係

```
routes（Interface）
  └── usecases（Application）
        └── domain entities・repository interfaces（Domain）
              └── repository implementations・external services（Infrastructure）
```

**依存性逆転:** usecases は repository インターフェースに依存し、Prisma 実装は Infrastructure 層に閉じ込める

---

## frontend 依存関係

```
views
  ├── components（UI 描画・ユーザーインタラクション）
  │     └── composables（ビジネスロジック・バリデーションを委譲）
  ├── composables/api（API 通信）
  │     └── useApiClient
  └── stores（永続状態参照）

router
  └── useAuthStore（認証ガード）
```

**禁止:** `composables/api` → `stores`（循環依存）、`components` → `stores`（直接参照）

---

## データフロー

### バックエンド（リクエスト処理）

```
HTTP Request
  → routes: Zod バリデーション
  → usecase.execute()
  → domain: エンティティ生成・ビジネスルール
  → repository.save()
  → Prisma: DB 操作
  → ApiResponse<T> 返却

エラー時:
  → AppError サブクラスを throw
  → setErrorHandler がキャッチ
  → ApiResponse<never>（success: false）返却
```

### フロントエンド（ユーザー操作）

```
User Action
  → components（UI イベント受付）
  → composables（ビジネスロジック・バリデーション）
  → composables/api（fetch 呼び出し）
  → useApiClient（認証ヘッダー・エラー処理）
  → HTTP → backend
  → ApiResponse<T> 受信
  → store 更新 or View へ返却
  → components 再描画
```

---

## セキュリティ設計（SECURITY ルール対応）

| SECURITY ルール                   | 対応箇所                                                    |
| --------------------------------- | ----------------------------------------------------------- |
| SECURITY-05（入力バリデーション） | routes 層で Zod スキーマによる全入力検証                    |
| SECURITY-08（アクセス制御）       | auth.plugin で全ルートに JWT 検証・usecase 層で認可チェック |
| SECURITY-12（認証管理）           | Supabase Auth 委譲・セッション管理は useAuthStore           |
| SECURITY-15（例外処理）           | setErrorHandler でグローバル集約・fail closed 設計          |
| SECURITY-03（構造化ログ）         | 各層でリクエスト ID・ログレベル付きログ出力                 |
| SECURITY-04（HTTP ヘッダー）      | Fastify プラグインでセキュリティヘッダー設定                |

---

## 詳細ドキュメント

- [コンポーネント定義](./components.md)
- [メソッドシグネチャ](./component-methods.md)
- [サービス定義](./services.md)
- [依存関係](./component-dependency.md)
