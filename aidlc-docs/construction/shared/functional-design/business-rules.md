# ビジネスルール - Unit 1: shared

## スキーマ命名規則

| 対象                     | 規則                                                             | 例                      |
| ------------------------ | ---------------------------------------------------------------- | ----------------------- |
| Zod スキーマオブジェクト | `PascalCase` + `Schema` サフィックス                             | `CreateUserSchema`      |
| 推論型                   | スキーマ名から `Schema` を除いた `PascalCase` + 用途サフィックス | `CreateUserInput`       |
| レスポンス型             | `PascalCase` + `Response` サフィックス                           | `UserResponse`          |
| ファイル名               | `kebab-case` + `.schema.ts`                                      | `create-user.schema.ts` |

### 用途サフィックス一覧

| 用途               | サフィックス | 例                |
| ------------------ | ------------ | ----------------- |
| 作成リクエスト     | `Input`      | `CreateUserInput` |
| 更新リクエスト     | `Input`      | `UpdateUserInput` |
| レスポンス         | `Response`   | `UserResponse`    |
| フィルター・クエリ | `Filter`     | `UserFilter`      |
| ページネーション   | `Pagination` | `UserPagination`  |

---

## スキーマ設計ルール

### ルール 1: 作成スキーマは全フィールド必須

```typescript
// 推奨
export const CreateUserSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  name: z
    .string()
    .min(1, "必須項目です")
    .max(100, "100文字以内で入力してください"),
});

// 非推奨: optional を多用しない
export const CreateUserSchema = z.object({
  email: z.string().email().optional(), // NG: 作成時は必須のはず
});
```

### ルール 2: 更新スキーマは `.partial()` で部分更新対応

```typescript
// 推奨: 作成スキーマから派生させる
export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// 非推奨: 独立して定義しない（作成スキーマとの乖離が起きる）
```

### ルール 3: レスポンススキーマはサーバー生成フィールドを含む

```typescript
// 推奨
export const UserResponseSchema = CreateUserSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;
```

### ルール 4: ID フィールドは UUID 形式で統一

```typescript
// 推奨
id: z.string().uuid("IDはUUID形式である必要があります");

// 非推奨
id: z.string(); // 形式制約なし
id: z.number(); // 数値ID
```

### ルール 5: 日時フィールドは ISO 8601 文字列

```typescript
// 推奨（JSON シリアライズ互換）
createdAt: z.string().datetime();

// 非推奨
createdAt: z.date(); // JSON シリアライズで問題が起きる
```

---

## エクスポートルール

### ルール 6: スキーマと型は必ずペアで export

```typescript
// 推奨: 常にセットで export
export const CreateUserSchema = z.object({ ... })
export type CreateUserInput = z.infer<typeof CreateUserSchema>

// 非推奨: 型だけ・スキーマだけの export
export type CreateUserInput = { email: string } // Zod と乖離する
```

### ルール 7: index.ts は明示的 re-export のみ

```typescript
// 推奨: 明示的に列挙
export {
  CreateUserSchema,
  type CreateUserInput,
} from "./schemas/domain/user/create-user.schema";

// 非推奨: ワイルドカード export（何が公開されているか不明確）
export * from "./schemas/domain/user/create-user.schema";
```

---

## 循環依存防止ルール

### ルール 8: shared は何にも依存しない

```
// package.json の dependencies に backend・frontend を含めてはならない
{
  "dependencies": {
    "zod": "^3.x.x"
    // zod 以外の依存は原則禁止
  }
}
```

### ルール 9: shared 内でのクロスインポート禁止

```typescript
// 非推奨: schemas/domain が schemas/api を import
import { ApiResponse } from "../api/response.schema"; // NG

// 推奨: 各スキーマは独立して定義
// ApiResponse との結合は backend・frontend 側で行う
```

---

## バリデーションメッセージ標準文言

| バリデーション | 標準メッセージ                             |
| -------------- | ------------------------------------------ |
| 必須           | `"必須項目です"`                           |
| 最小文字数     | `"{n}文字以上で入力してください"`          |
| 最大文字数     | `"{n}文字以内で入力してください"`          |
| メール形式     | `"メールアドレスの形式が正しくありません"` |
| UUID 形式      | `"IDはUUID形式である必要があります"`       |
| 数値最小値     | `"{n}以上の値を入力してください"`          |
| 数値最大値     | `"{n}以下の値を入力してください"`          |
| 日時形式       | `"日時はISO 8601形式で入力してください"`   |
| URL 形式       | `"URLの形式が正しくありません"`            |
