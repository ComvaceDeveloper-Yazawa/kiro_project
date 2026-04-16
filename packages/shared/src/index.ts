// =============================================================================
// @monorepo/shared - 公開エントリポイント
//
// ルール:
//   - スキーマ（Zod オブジェクト）と推論型（z.infer<>）のみ re-export する
//   - ビジネスロジック・ユーティリティ関数・副作用のある処理は含めない
//   - ワイルドカード export (export * from ...) は禁止。必ず明示的に列挙する
// =============================================================================

// --- API 共通型 ---
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from "./schemas/api/response.schema";
export {
  createApiSuccessSchema,
  ApiErrorSchema,
} from "./schemas/api/response.schema";

export type { ErrorCode } from "./schemas/api/error.schema";
export { ErrorCodeSchema } from "./schemas/api/error.schema";

// --- ドメインスキーマ ---
// リソースを追加したら以下のパターンで追記する:
//
// export {
//   Create{Resource}Schema,
//   Update{Resource}Schema,
//   {Resource}ResponseSchema,
// } from './schemas/domain/{resource}/create-{resource}.schema'
// export type { Create{Resource}Input } from './schemas/domain/{resource}/create-{resource}.schema'
// export type { Update{Resource}Input } from './schemas/domain/{resource}/update-{resource}.schema'
// export type { {Resource}Response } from './schemas/domain/{resource}/{resource}-response.schema'
