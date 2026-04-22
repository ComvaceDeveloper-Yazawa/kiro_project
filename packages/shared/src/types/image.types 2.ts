import { z } from 'zod';
import {
  ArticleImageSchema,
  UploadImageSchema,
  UploadImageResponseSchema,
} from '../schemas/image.schema';

/**
 * ArticleImage エンティティ型
 */
export type ArticleImage = z.infer<typeof ArticleImageSchema>;

/**
 * 画像アップロード時の入力型
 */
export type UploadImageInput = z.infer<typeof UploadImageSchema>;

/**
 * 画像アップロードレスポンス型
 */
export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;
