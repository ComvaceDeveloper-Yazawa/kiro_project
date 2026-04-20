import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';

export interface ListMyArticlesInput {
  userId: string;
  page: number;
  limit: number;
}

export interface ListMyArticlesOutput {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListMyArticlesUsecase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: ListMyArticlesInput): Promise<ListMyArticlesOutput> {
    const { userId, page, limit } = input;

    // 自分の記事を取得（公開・下書き両方）
    const { articles, total } = await this.articleRepository.findByAuthorId(userId, {
      page,
      limit,
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
