import { z } from 'zod';
/**
 * Tag エンティティスキーマ
 * 要件12: タグの管理
 */
export const TagSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(30),
    createdAt: z.date(),
});
/**
 * Tag 作成時の入力スキーマ
 */
export const CreateTagSchema = z.object({
    name: z
        .string()
        .min(1, 'タグ名は1文字以上である必要があります')
        .max(30, 'タグ名は30文字以内である必要があります'),
});
//# sourceMappingURL=tag.schema.js.map