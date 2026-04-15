# サービス定義

## サービスレイヤーの考え方

このプロジェクトでは DDD 寄り 4 層を採用しているため、「サービス」は以下の 2 種類に分かれます。

| 種別                           | 配置                                      | 責務                                                         |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| Application Service（Usecase） | `backend/src/usecases/`                   | ユースケースの調整・リポジトリ呼び出し・トランザクション管理 |
| Domain Service                 | `backend/src/domain/{resource}/services/` | 複数エンティティにまたがるドメインロジック                   |

---

## Application Services（Usecases）

各ユースケースは単一責任原則に従い、1 ファイル = 1 ユースケースとします。

### 命名規則

```
{Action}{Resource}Usecase
例: CreateUserUsecase, GetUserUsecase, UpdateUserUsecase, DeleteUserUsecase
```

### 標準的なユースケース構造

```typescript
// src/usecases/{resource}/create-{resource}.usecase.ts
export class Create{Resource}Usecase {
  constructor(
    private readonly {resource}Repository: {Resource}Repository,
    // 必要に応じて他のリポジトリ・ドメインサービスを DI
  ) {}

  async execute(input: Create{Resource}Input): Promise<{Resource}Type> {
    // 1. ドメインエンティティ生成（不変条件チェック）
    // 2. リポジトリ経由で永続化
    // 3. 型変換して返却
  }
}
```

### ユースケース一覧（リソース共通パターン）

| ユースケース              | 入力                                     | 出力               | 説明                                     |
| ------------------------- | ---------------------------------------- | ------------------ | ---------------------------------------- |
| `Create{Resource}Usecase` | `Create{Resource}Input`                  | `{Resource}Type`   | 新規作成                                 |
| `Get{Resource}Usecase`    | `{ id: string }`                         | `{Resource}Type`   | 単件取得（存在しない場合 NotFoundError） |
| `List{Resource}Usecase`   | `{Resource}Filter?`                      | `{Resource}Type[]` | 一覧取得                                 |
| `Update{Resource}Usecase` | `{ id: string } & Update{Resource}Input` | `{Resource}Type`   | 更新                                     |
| `Delete{Resource}Usecase` | `{ id: string }`                         | `void`             | 削除                                     |

---

## Domain Services

複数エンティティにまたがるロジック、または単一エンティティに収まらないビジネスルールを担当します。

### 配置基準

- 単一エンティティで完結するロジック → エンティティのメソッドに実装
- 複数エンティティが関与するロジック → Domain Service に実装
- 外部サービス（Supabase Auth 等）との通信 → Infrastructure 層に実装

### 例

```typescript
// src/domain/{resource}/services/{resource}.domain-service.ts
export class {Resource}DomainService {
  // 複数エンティティにまたがるビジネスルール
  // 例: 権限チェック、集計ロジック、クロスエンティティバリデーション
}
```

---

## Fastify プラグイン構成

機能ごとにプラグイン分割し、`app.ts` で登録します。

```
src/
├── app.ts                    # Fastify インスタンス生成・プラグイン登録
├── plugins/
│   ├── auth.plugin.ts        # JWT 検証・request.user 付与
│   ├── db.plugin.ts          # Prisma クライアント DI（fastify.prisma として装飾）
│   └── routes.plugin.ts      # 全ルートの一括登録
└── hooks/
    └── error.handler.ts      # setErrorHandler によるグローバルエラー変換
```

### プラグイン登録順序（依存関係）

```
app.ts
  └── db.plugin        # 最初（他プラグインが Prisma に依存）
  └── auth.plugin      # db の後（Auth 検証に Prisma を使う場合）
  └── routes.plugin    # 最後（ルートは auth・db に依存）
  └── error.handler    # 全プラグイン登録後に設定
```

---

## エラーハンドリングフロー

```
Route Handler
  └── throws AppError サブクラス（NotFoundError, ValidationError 等）
        └── setErrorHandler がキャッチ
              └── error.code と statusCode を判定
                    └── ApiResponse 形式に変換して返却

{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "リソースが見つかりません"
  }
}
```

### Zod バリデーションエラーの扱い

```typescript
// routes 層で Zod パースエラーを ValidationError に変換
const result = schema.safeParse(request.body);
if (!result.success) {
  throw new ValidationError(result.error.message);
}
```
