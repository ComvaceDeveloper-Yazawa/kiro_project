# ビジネスロジックモデル - Unit 1: shared

## パッケージの性質

shared はビジネスロジックを持たない「型・スキーマ定義専用パッケージ」です。
ロジックの代わりに、**スキーマ定義のルール**と**型公開の規約**がこのパッケージの「設計」です。

---

## ディレクトリ構成（確定）

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── api/
│   │   │   ├── response.schema.ts      # ApiResponse<T> 共通ラッパー型
│   │   │   └── error.schema.ts         # ApiError 型
│   │   └── domain/
│   │       └── {resource}/
│   │           ├── create-{resource}.schema.ts
│   │           ├── update-{resource}.schema.ts
│   │           └── {resource}-response.schema.ts
│   └── index.ts                        # 公開エントリポイント
├── package.json
└── tsconfig.json
```

---

## スキーマ分割モデル

### 操作ごとのファイル分割（Q1: B）

各リソースに対して操作単位でファイルを分割します。

```
domain/{resource}/
├── create-{resource}.schema.ts    # 作成リクエスト用
├── update-{resource}.schema.ts    # 更新リクエスト用（部分更新対応）
└── {resource}-response.schema.ts  # レスポンス用（ID・タイムスタンプ含む）
```

**理由:**

- 作成・更新で必須フィールドが異なる（作成は全フィールド必須、更新は partial）
- ファイル名でスキーマの用途が即座に判別できる
- 将来的なスキーマ拡張時に影響範囲が限定される

### 型の同居（Q4: A）

スキーマと推論型を同一ファイルに定義します。

```typescript
// create-user.schema.ts の例
export const CreateUserSchema = z.object({ ... })
export type CreateUserInput = z.infer<typeof CreateUserSchema>
```

**理由:**

- スキーマと型が常に同期される（型だけ変更し忘れるミスを防ぐ）
- インポート元が 1 ファイルに集約される

---

## ApiResponse 共通ラッパー（Q2: A）

shared で定義し、frontend・backend 両方で使用します。

```typescript
// src/schemas/api/response.schema.ts
export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string(),
  });

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

## バリデーションメッセージ（Q3: A）

全スキーマのエラーメッセージは日本語で統一します。

```typescript
// 標準パターン
z.string().min(1, "必須項目です");
z.string().max(100, "100文字以内で入力してください");
z.string().email("メールアドレスの形式が正しくありません");
z.number().min(0, "0以上の値を入力してください");
```

---

## index.ts 公開ルール

```typescript
// src/index.ts
// スキーマと型のみ re-export
// ビジネスロジック・ユーティリティは含めない

export * from "./schemas/api/response.schema";
export * from "./schemas/api/error.schema";
export * from "./schemas/domain/{resource}/create-{resource}.schema";
// ... 各スキーマを明示的に export
```

**禁止事項:**

- 関数・クラス・定数（スキーマ以外）の export
- 副作用のある処理（DB 接続・API 呼び出し等）
- backend または frontend 固有のロジック
