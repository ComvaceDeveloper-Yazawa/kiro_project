# ドメインエンティティ定義 - Unit 1: shared

## 概要

shared パッケージはドメインエンティティ（クラス・オブジェクト）を持ちません。
代わりに、**Zod スキーマから推論される型**がエンティティの「形」を定義します。

---

## 共通型定義

### ApiResponse 型（全リソース共通）

```typescript
// src/schemas/api/response.schema.ts

import { z } from "zod";

// 成功レスポンスのジェネリックファクトリ
export const createApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string(),
  });

// エラーレスポンス（固定形式）
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

// 型エイリアス
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;

// ユニオン型（frontend・backend で使用）
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### ApiError 型

```typescript
// src/schemas/api/error.schema.ts

import { z } from "zod";

// 共通エラーコード定義
export const ErrorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "CONFLICT",
  "INTERNAL_SERVER_ERROR",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
```

---

## ドメインスキーマのテンプレート

新しいリソースを追加する際は以下のテンプレートに従います。

### 作成スキーマ（`create-{resource}.schema.ts`）

```typescript
import { z } from 'zod'

export const Create{Resource}Schema = z.object({
  // フィールド定義（全て必須・日本語メッセージ）
  name: z.string().min(1, "必須項目です").max(100, "100文字以内で入力してください"),
  // ...
})

export type Create{Resource}Input = z.infer<typeof Create{Resource}Schema>
```

### 更新スキーマ（`update-{resource}.schema.ts`）

```typescript
import { z } from 'zod'
import { Create{Resource}Schema } from './create-{resource}.schema'

// 作成スキーマから派生（部分更新）
export const Update{Resource}Schema = Create{Resource}Schema.partial()

export type Update{Resource}Input = z.infer<typeof Update{Resource}Schema>
```

### レスポンススキーマ（`{resource}-response.schema.ts`）

```typescript
import { z } from 'zod'
import { Create{Resource}Schema } from './create-{resource}.schema'

// 作成スキーマにサーバー生成フィールドを追加
export const {Resource}ResponseSchema = Create{Resource}Schema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type {Resource}Response = z.infer<typeof {Resource}ResponseSchema>
```

---

## ディレクトリ構成（リソース追加時の規則）

```
src/schemas/domain/
└── {resource}/                         # リソース名（kebab-case）
    ├── create-{resource}.schema.ts     # 作成
    ├── update-{resource}.schema.ts     # 更新
    └── {resource}-response.schema.ts  # レスポンス
```

### 命名例

| リソース | ディレクトリ      | ファイル例                 |
| -------- | ----------------- | -------------------------- |
| ユーザー | `domain/user/`    | `create-user.schema.ts`    |
| 投稿     | `domain/post/`    | `create-post.schema.ts`    |
| コメント | `domain/comment/` | `create-comment.schema.ts` |

---

## index.ts 公開エントリポイント構成

```typescript
// src/index.ts

// API 共通型
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from "./schemas/api/response.schema";
export { ApiErrorSchema, ErrorCodeSchema } from "./schemas/api/error.schema";
export type { ErrorCode } from "./schemas/api/error.schema";

// ドメインスキーマ（リソース追加時にここに追記）
// export { Create{Resource}Schema, Update{Resource}Schema, {Resource}ResponseSchema } from './schemas/domain/{resource}/...'
// export type { Create{Resource}Input, Update{Resource}Input, {Resource}Response } from './schemas/domain/{resource}/...'
```
