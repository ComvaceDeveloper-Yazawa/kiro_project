import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';

export interface GetArticleInput {
  articleId: string;
  userId: string | null;
}

export class GetArticleUsecase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: GetArticleInput): Promise<Article> {
    // 記事の取得
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) {
      throw new NotFoundError('記事', input.articleId);
    }

    // デバッグログ
    console.log('🔍 記事アクセスチェック:', {
      articleId: article.id,
      title: article.title,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
      authorId: article.authorId,
      requestUserId: input.userId,
    });

    // アクセス権限チェック
    if (!article.isAccessibleBy(input.userId)) {
      console.log('❌ アクセス拒否:', {
        isPublished: article.isPublished,
        userId: input.userId,
        authorId: article.authorId,
      });
      throw new AuthorizationError('この記事にアクセスする権限がありません');
    }

    console.log('✅ アクセス許可');
    return article;
  }
}
