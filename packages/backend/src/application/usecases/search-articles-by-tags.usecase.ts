import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { ValidationError } from '../../domain/errors/validation.error';

export interface SearchArticlesByTagsInput {
  tags: string[];
  page: number;
  limit: number;
}

export interface SearchArticlesByTagsOutput {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class SearchArticlesByTagsUsecase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: SearchArticlesByTagsInput): Promise<SearchArticlesByTagsOutput> {
    const { tags, page, limit } = input;

    // バリデーション
    if (!tags || tags.length === 0) {
      throw new ValidationError('検索するタグを指定してください');
    }

    if (tags.length > 10) {
      throw new ValidationError('タグは10個まで指定できます');
    }

    // タグで検索
    const { articles, total } = await this.articleRepository.findByTags(tags, {
      page,
      limit,
    });

    // 公開記事のみフィルタリング
    const publishedArticles = articles.filter((article) => article.isPublished);
    const publishedTotal = publishedArticles.length;

    return {
      articles: publishedArticles,
      pagination: {
        page,
        limit,
        total: publishedTotal,
        totalPages: Math.ceil(publishedTotal / limit),
      },
    };
  }
}
