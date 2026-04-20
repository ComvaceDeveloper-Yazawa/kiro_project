import { Article } from '../entities/article.entity';

export interface ArticleRepository {
  save(article: Article): Promise<Article>;
  findById(id: string): Promise<Article | null>;
  findAll(options: {
    page: number;
    limit: number;
    isPublished?: boolean;
  }): Promise<{ articles: Article[]; total: number }>;
  findByAuthorId(
    authorId: string,
    options: { page: number; limit: number },
  ): Promise<{ articles: Article[]; total: number }>;
  findByTags(
    tagNames: string[],
    options: { page: number; limit: number },
  ): Promise<{ articles: Article[]; total: number }>;
  delete(id: string): Promise<void>;
}
