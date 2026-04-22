# Code Generation サマリー — Unit 1: shared

## 生成ファイル一覧

| ファイル                                             | 種別         | 内容                                                       |
| ---------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `packages/shared/package.json`                       | 設定         | パッケージ定義（名前: `@monorepo/shared`、依存: zod のみ） |
| `packages/shared/tsconfig.json`                      | 設定         | TypeScript 設定（strict: true、target: ES2020）            |
| `packages/shared/src/index.ts`                       | ソース       | 公開エントリポイント（明示的 re-export のみ）              |
| `packages/shared/src/schemas/api/response.schema.ts` | ソース       | `ApiResponse<T>` 共通ラッパー型                            |
| `packages/shared/src/schemas/api/error.schema.ts`    | ソース       | `ErrorCode` 共通エラーコード                               |
| `packages/shared/CODING_STANDARDS.md`                | ドキュメント | スキーマ命名規則・設計ルール・追加手順                     |

## 使い方サンプル

### backend での使用例

```typescript
import type { ApiResponse, ErrorCode } from "@monorepo/shared";
import { ErrorCodeSchema } from "@monorepo/shared";

// レスポンス型として使用
function createSuccessResponse<T>(data: T, message = ""): ApiResponse<T> {
  return { success: true, data, message };
}

function createErrorResponse(
  code: ErrorCode,
  message: string,
): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
```

### frontend での使用例

```typescript
import type { ApiResponse, UserResponse } from "@monorepo/shared";

async function fetchUser(id: string): Promise<UserResponse> {
  const res = await fetch(`/api/users/${id}`);
  const json: ApiResponse<UserResponse> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}
```

### 新しいリソーススキーマの使用例

```typescript
// packages/shared/src/schemas/domain/user/create-user.schema.ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  name: z
    .string()
    .min(1, "必須項目です")
    .max(100, "100文字以内で入力してください"),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

## 完了条件チェック

- [x] ディレクトリ構成・設定ファイル生成
- [x] CODING_STANDARDS.md 生成
- [x] index.ts（エントリポイント）生成
- [x] ApiResponse<T> スキーマ生成
- [x] ErrorCode スキーマ生成
