import { z } from 'zod';
/**
 * Article 作成時の入力スキーマ
 * 要件1: 記事の作成
 */
export const CreateArticleSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルは1文字以上である必要があります')
        .max(200, 'タイトルは200文字以内である必要があります'),
    content: z
        .string()
        .min(1, '本文は1文字以上である必要があります')
        .max(50000, '本文は50000文字以内である必要があります'),
    tags: z
        .array(z
        .string()
        .min(1, 'タグは1文字以上である必要があります')
        .max(30, 'タグは30文字以内である必要があります'))
        .max(10, 'タグは10個以内である必要があります')
        .default([]),
    isPublished: z.boolean().optional().default(false), // 公開するかどうか
    nextArticleId: z.string().uuid().optional().nullable(), // 次に読むべき記事のID
});
/**
 * Article 更新時の入力スキーマ
 * 要件2: 記事の編集
 */
export const UpdateArticleSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルは1文字以上である必要があります')
        .max(200, 'タイトルは200文字以内である必要があります'),
    content: z
        .string()
        .min(1, '本文は1文字以上である必要があります')
        .max(50000, '本文は50000文字以内である必要があります'),
    tags: z
        .array(z
        .string()
        .min(1, 'タグは1文字以上である必要があります')
        .max(30, 'タグは30文字以内である必要があります'))
        .max(10, 'タグは10個以内である必要があります')
        .default([]),
    nextArticleId: z.string().uuid().optional().nullable(), // 次に読むべき記事のID
});
/**
 * Article エンティティスキーマ
 */
export const ArticleSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    authorId: z.string().uuid(),
    isPublished: z.boolean(),
    publishedAt: z.date().nullable(),
    nextArticleId: z.string().uuid().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tags: z.array(z.object({
        id: z.string().uuid(),
        name: z.string(),
    })),
    nextArticle: z
        .object({
        id: z.string().uuid(),
        title: z.string(),
    })
        .nullable()
        .optional(),
});
/**
 * Article 一覧レスポンススキーマ
 */
export const ArticleListItemSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    authorId: z.string().uuid(),
    authorName: z.string().optional(),
    isPublished: z.boolean(),
    publishedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tags: z.array(z.object({
        id: z.string().uuid(),
        name: z.string(),
    })),
});
//# sourceMappingURL=article.schema.js.map