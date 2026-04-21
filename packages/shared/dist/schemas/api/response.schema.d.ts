import { z } from 'zod';
/**
 * 成功レスポンスの Zod スキーマファクトリ。
 * data の型はエンドポイントごとに異なるためジェネリクスで受け取る。
 *
 * @example
 * const UserResponseSchema = createApiSuccessSchema(UserSchema)
 */
export declare const createApiSuccessSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodString;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodString;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
/**
 * エラーレスポンスの Zod スキーマ（固定形式）。
 */
export declare const ApiErrorSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}>;
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message: string;
}
export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;
/**
 * 全 API レスポンスのユニオン型。
 * frontend・backend 両方でこの型を使用する。
 *
 * @example
 * async function fetchUser(id: string): Promise<ApiResponse<UserResponse>> { ... }
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
//# sourceMappingURL=response.schema.d.ts.map