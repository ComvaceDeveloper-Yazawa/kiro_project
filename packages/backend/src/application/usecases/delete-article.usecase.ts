import { ArticleRepository } from '../../domain/repositories/article.repository';
import { ArticleImageRepository } from '../../domain/repositories/article-image.repository';
import { StorageService } from '../../domain/services/storage.service';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';

export interface DeleteArticleInput {
  articleId: string;
  userId: string;
}

export class DeleteArticleUsecase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleImageRepository: ArticleImageRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: DeleteArticleInput): Promise<void> {
    // 記事の取得
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) {
      throw new NotFoundError('記事', input.articleId);
    }

    // 認可チェック
    if (!article.canBeModifiedBy(input.userId)) {
      throw new AuthorizationError('この記事を削除する権限がありません');
    }

    // 関連画像の削除
    const images = await this.articleImageRepository.findByArticleId(input.articleId);
    await Promise.all(
      images.map(async (image) => {
        await this.storageService.deleteImage(image.storagePath);
        await this.articleImageRepository.delete(image.id);
      }),
    );

    // 記事の削除（article_tagsはCASCADEで自動削除される）
    await this.articleRepository.delete(input.articleId);
  }
}
