import { z } from "zod";
// =============================================================================
// ApiResponse 共通ラッパー型
//
// 全 API エンドポイントはこの形式でレスポンスを返す（確定済み仕様）:
//   成功: { success: true,  data: T, message: string }
//   失敗: { success: false, error: { code: string, message: string } }
// =============================================================================
/**
 * 成功レスポンスの Zod スキーマファクトリ。
 * data の型はエンドポイントごとに異なるためジェネリクスで受け取る。
 *
 * @example
 * const UserResponseSchema = createApiSuccessSchema(UserSchema)
 */
export const createApiSuccessSchema = (dataSchema) => z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string(),
});
/**
 * エラーレスポンスの Zod スキーマ（固定形式）。
 */
export const ApiErrorSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
    }),
});
//# sourceMappingURL=response.schema.js.map