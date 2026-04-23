import { z } from 'zod';
/**
 * 画像アップロード時の入力スキーマ
 * 要件9: 画像アップロード
 */
export const UploadImageSchema = z.object({
    articleId: z.string().uuid('有効な記事IDである必要があります'),
    file: z.object({
        filename: z.string(),
        mimetype: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'], {
            errorMap: () => ({
                message: '画像形式はJPEG、PNG、GIF、WebPのいずれかである必要があります',
            }),
        }),
        size: z.number().max(5 * 1024 * 1024, '画像ファイルサイズは5MB以下である必要があります'),
    }),
});
/**
 * ArticleImage エンティティスキーマ
 */
export const ArticleImageSchema = z.object({
    id: z.string().uuid(),
    articleId: z.string().uuid(),
    storagePath: z.string(),
    url: z.string().url(),
    createdAt: z.date(),
});
/**
 * 画像アップロードレスポンススキーマ
 */
export const UploadImageResponseSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    storagePath: z.string(),
});
//# sourceMappingURL=image.schema.js.map