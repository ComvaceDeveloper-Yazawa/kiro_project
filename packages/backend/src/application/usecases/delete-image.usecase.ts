import { ArticleImageRepository } from '../../domain/repositories/article-image.repository';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { StorageService } from '../../domain/services/storage.service';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';

export interface DeleteImageInput {
  imageId: string;
  userId: string;
}

export class DeleteImageUsecase {
  constructor(
    private readonly articleImageRepository: ArticleImageRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: DeleteImageInput): Promise<void> {
    // 画像の取得
    const images = await this.articleImageRepository.findByArticleId(input.imageId);
    const image = images.find((img) => img.id === input.imageId);

    if (!image) {
      throw new NotFoundError('画像', input.imageId);
    }

    // 記事の取得
    const article = await this.articleRepository.findById(image.articleId);
    if (!article) {
      throw new NotFoundError('記事', image.articleId);
    }

    // 認可チェック
    if (!article.canBeModifiedBy(input.userId)) {
      throw new AuthorizationError('この画像を削除する権限がありません');
    }

    // Storageから削除
    await this.storageService.deleteImage(image.storagePath);

    // DBから削除
    await this.articleImageRepository.delete(input.imageId);
  }
}
