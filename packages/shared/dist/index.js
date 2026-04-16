// =============================================================================
// @monorepo/shared - 公開エントリポイント
//
// ルール:
//   - スキーマ（Zod オブジェクト）と推論型（z.infer<>）のみ re-export する
//   - ビジネスロジック・ユーティリティ関数・副作用のある処理は含めない
//   - ワイルドカード export (export * from ...) は禁止。必ず明示的に列挙する
// =============================================================================
export { createApiSuccessSchema, ApiErrorSchema, } from "./schemas/api/response.schema";
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
//# sourceMappingURL=index.js.map