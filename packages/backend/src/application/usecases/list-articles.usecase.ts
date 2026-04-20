import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';

export interface ListArticlesInput {
  page: number;
  limit: number;
}

export interface ListArticlesOutput {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListArticlesUsecase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: ListArticlesInput): Promise<ListArticlesOutput> {
    const { page, limit } = input;

    // 公開記事のみ取得
    const { articles, total } = await this.articleRepository.findAll({
      page,
      limit,
      isPublished: true,
    });

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
