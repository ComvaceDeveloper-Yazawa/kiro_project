import { z } from 'zod';
import { TagSchema, CreateTagSchema } from '../schemas/tag.schema';

/**
 * Tag エンティティ型
 */
export type Tag = z.infer<typeof TagSchema>;

/**
 * Tag 作成時の入力型
 */
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
