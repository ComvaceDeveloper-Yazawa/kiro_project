import { ArticleImage } from '../entities/article-image.entity';

export interface ArticleImageRepository {
  save(image: ArticleImage): Promise<ArticleImage>;
  findByArticleId(articleId: string): Promise<ArticleImage[]>;
  delete(id: string): Promise<void>;
}
