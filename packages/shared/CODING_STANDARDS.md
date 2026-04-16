# コーディング規約 — packages/shared

このパッケージは **Zod スキーマと推論型のみ** を提供します。
ビジネスロジック・ユーティリティ関数・副作用のある処理は一切含めません。

---

## 1. ファイル命名規則

| 対象                     | 規則                   | 例                      |
| ------------------------ | ---------------------- | ----------------------- |
| スキーマファイル         | `kebab-case.schema.ts` | `create-user.schema.ts` |
| ディレクトリ（リソース） | `kebab-case`           | `domain/user/`          |

### ファイル分割の単位

リソースごとに **操作単位** でファイルを分割します。

```
src/schemas/domain/{resource}/
├── create-{resource}.schema.ts     # 作成リクエスト
├── update-{resource}.schema.ts     # 更新リクエスト（partial）
└── {resource}-response.schema.ts  # レスポンス（サーバー生成フィールド含む）
```

**理由:** 作成・更新で必須フィールドが異なるため、1ファイルにまとめると
`optional` の乱用につながる。操作ごとに分割することで意図が明確になる。

---

## 2. スキーマ・型の命名規則

| 対象                     | 規則                      | 例                 |
| ------------------------ | ------------------------- | ------------------ |
| Zod スキーマオブジェクト | `PascalCase` + `Schema`   | `CreateUserSchema` |
| 作成リクエスト型         | `PascalCase` + `Input`    | `CreateUserInput`  |
| 更新リクエスト型         | `PascalCase` + `Input`    | `UpdateUserInput`  |
| レスポンス型             | `PascalCase` + `Response` | `UserResponse`     |
| フィルター型             | `PascalCase` + `Filter`   | `UserFilter`       |

---

## 3. スキーマ設計ルール

### ルール 1: スキーマと推論型は同一ファイルに同居させる

```typescript
// ✅ 推奨
export const CreateUserSchema = z.object({ ... })
export type CreateUserInput = z.infer<typeof CreateUserSchema>

// ❌ 非推奨: 型だけ別ファイルに分離する
// → スキーマと型が乖離するリスクがある
```

### ルール 2: 作成スキーマは全フィールド必須

```typescript
// ✅ 推奨
export const CreateUserSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  name: z
    .string()
    .min(1, "必須項目です")
    .max(100, "100文字以内で入力してください"),
});

// ❌ 非推奨: 作成時に optional を使う
export const CreateUserSchema = z.object({
  email: z.string().email().optional(), // 作成時は必須のはず
});
```

### ルール 3: 更新スキーマは作成スキーマから `.partial()` で派生させる

```typescript
// ✅ 推奨: 作成スキーマから派生（常に同期される）
import { CreateUserSchema } from "./create-user.schema";
export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// ❌ 非推奨: 独立して定義する（作成スキーマとの乖離が起きる）
```

### ルール 4: レスポンススキーマはサーバー生成フィールドを追加する

```typescript
// ✅ 推奨
import { CreateUserSchema } from "./create-user.schema";
export const UserResponseSchema = CreateUserSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;
```

### ルール 5: ID は UUID、日時は ISO 8601 文字列で統一

```typescript
// ✅ 推奨
id: z.string().uuid("IDはUUID形式である必要があります");
createdAt: z.string().datetime();

// ❌ 非推奨
id: z.number(); // 数値ID
createdAt: z.date(); // Date オブジェクト（JSON シリアライズで問題が起きる）
```

---

## 4. エクスポートルール

### index.ts はワイルドカード export 禁止

```typescript
// ✅ 推奨: 明示的に列挙
export { CreateUserSchema } from "./schemas/domain/user/create-user.schema";
export type { CreateUserInput } from "./schemas/domain/user/create-user.schema";

// ❌ 非推奨: ワイルドカード（何が公開されているか不明確になる）
export * from "./schemas/domain/user/create-user.schema";
```

---

## 5. 循環依存防止ルール

### このパッケージは何にも依存しない

```json
// package.json の dependencies は zod のみ
{
  "dependencies": {
    "zod": "^3.x.x"
  }
}
// backend・frontend を dependencies に追加してはならない
```

### パッケージ内でのクロスインポート禁止

```typescript
// ❌ 非推奨: schemas/domain が schemas/api を import する
import { ApiResponse } from "../../api/response.schema";

// ✅ 推奨: 各スキーマは独立して定義する
// ApiResponse との結合は backend・frontend 側で行う
```

---

## 6. バリデーションメッセージ標準文言

全スキーマのエラーメッセージは **日本語** で統一します。

| バリデーション | 標準メッセージ                             |
| -------------- | ------------------------------------------ |
| 必須           | `'必須項目です'`                           |
| 最小文字数     | `'{n}文字以上で入力してください'`          |
| 最大文字数     | `'{n}文字以内で入力してください'`          |
| メール形式     | `'メールアドレスの形式が正しくありません'` |
| UUID 形式      | `'IDはUUID形式である必要があります'`       |
| 数値最小値     | `'{n}以上の値を入力してください'`          |
| 数値最大値     | `'{n}以下の値を入力してください'`          |
| 日時形式       | `'日時はISO 8601形式で入力してください'`   |
| URL 形式       | `'URLの形式が正しくありません'`            |

---

## 7. 新しいリソースを追加する手順

1. `src/schemas/domain/{resource}/` ディレクトリを作成
2. `create-{resource}.schema.ts` を作成（全フィールド必須）
3. `update-{resource}.schema.ts` を作成（`.partial()` で派生）
4. `{resource}-response.schema.ts` を作成（`.extend()` でサーバーフィールド追加）
5. `src/index.ts` に明示的 re-export を追記

```typescript
// src/index.ts への追記例（User リソースの場合）
export { CreateUserSchema } from "./schemas/domain/user/create-user.schema";
export type { CreateUserInput } from "./schemas/domain/user/create-user.schema";
export { UpdateUserSchema } from "./schemas/domain/user/update-user.schema";
export type { UpdateUserInput } from "./schemas/domain/user/update-user.schema";
export { UserResponseSchema } from "./schemas/domain/user/user-response.schema";
export type { UserResponse } from "./schemas/domain/user/user-response.schema";
```
