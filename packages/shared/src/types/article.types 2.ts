import { z } from 'zod';
import {
  ArticleSchema,
  CreateArticleSchema,
  UpdateArticleSchema,
  ArticleListItemSchema,
} from '../schemas/article.schema';

/**
 * Article エンティティ型
 */
export type Article = z.infer<typeof ArticleSchema>;

/**
 * Article 作成時の入力型
 */
export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

/**
 * Article 更新時の入力型
 */
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

/**
 * Article 一覧アイテム型
 */
export type ArticleListItem = z.infer<typeof ArticleListItemSchema>;
