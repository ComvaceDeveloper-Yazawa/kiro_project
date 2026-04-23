import { z } from 'zod';
/**
 * ページネーション入力スキーマ
 * 要件5: 公開記事の一覧表示
 */
export const PaginationSchema = z.object({
    page: z
        .number()
        .int('ページ番号は整数である必要があります')
        .min(1, 'ページ番号は1以上である必要があります')
        .default(1),
    pageSize: z
        .number()
        .int('ページサイズは整数である必要があります')
        .min(1, 'ページサイズは1以上である必要があります')
        .max(100, 'ページサイズは100以下である必要があります')
        .default(20),
});
/**
 * ページネーションレスポンススキーマ
 */
export const PaginatedResponseSchema = (dataSchema) => z.object({
    data: z.array(dataSchema),
    pagination: z.object({
        page: z.number().int(),
        pageSize: z.number().int(),
        total: z.number().int(),
        totalPages: z.number().int(),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});
//# sourceMappingURL=pagination.schema.js.map