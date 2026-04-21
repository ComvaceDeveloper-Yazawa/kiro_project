import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';

export interface PublishArticleInput {
  articleId: string;
  userId: string;
  isPublished: boolean;
}

export class PublishArticleUsecase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: PublishArticleInput): Promise<Article> {
    // 記事の取得
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) {
      throw new NotFoundError('記事', input.articleId);
    }

    console.log('📝 公開処理前:', {
      articleId: article.id,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
      requestedState: input.isPublished,
    });

    // 認可チェック
    if (!article.canBeModifiedBy(input.userId)) {
      throw new AuthorizationError('この記事を公開/非公開にする権限がありません');
    }

    // 公開状態の切り替え
    if (input.isPublished) {
      article.publish();
    } else {
      article.unpublish();
    }

    console.log('📝 公開処理後:', {
      articleId: article.id,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
    });

    // 保存
    const saved = await this.articleRepository.save(article);

    console.log('💾 保存後:', {
      articleId: saved.id,
      isPublished: saved.isPublished,
      publishedAt: saved.publishedAt,
    });

    return saved;
  }
}
