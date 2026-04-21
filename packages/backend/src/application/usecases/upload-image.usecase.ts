import { ArticleImage } from '../../domain/entities/article-image.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { ArticleImageRepository } from '../../domain/repositories/article-image.repository';
import { StorageService } from '../../domain/services/storage.service';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';
import { ValidationError } from '../../domain/errors/validation.error';

export interface UploadImageInput {
  file: Buffer;
  fileName: string;
  articleId?: string;
  userId: string;
}

export class UploadImageUsecase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleImageRepository: ArticleImageRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: UploadImageInput): Promise<ArticleImage> {
    // 記事IDが指定されている場合は記事の存在確認と認可チェック
    if (input.articleId) {
      const article = await this.articleRepository.findById(input.articleId);
      if (!article) {
        throw new NotFoundError('記事', input.articleId);
      }

      // 認可チェック
      if (!article.canBeModifiedBy(input.userId)) {
        throw new AuthorizationError('この記事に画像をアップロードする権限がありません');
      }
    }

    // ファイルバリデーション
    this.validateImage(input.file, input.fileName);

    // Storageにアップロード（一時的な画像の場合はarticleIdなし）
    const storagePath = await this.storageService.uploadImage(
      input.file,
      input.fileName,
      input.articleId || `temp-${input.userId}`,
    );

    // 公開URLを取得
    const url = this.storageService.getPublicUrl(storagePath);

    // ArticleImageエンティティ作成（articleIdがない場合は一時的な画像）
    const articleImage = ArticleImage.create(input.articleId || '', storagePath, url);

    // articleIdがある場合のみDBに保存
    if (input.articleId) {
      return this.articleImageRepository.save(articleImage);
    }

    // 一時的な画像の場合はDBに保存せず、URLのみ返す
    return articleImage;
  }

  private validateImage(file: Buffer, fileName: string): void {
    // ファイルサイズチェック（5MB以下）
    const maxSize = 5 * 1024 * 1024;
    if (file.length > maxSize) {
      throw new ValidationError('画像ファイルは5MB以下にしてください');
    }

    // 拡張子チェック
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      throw new ValidationError('画像ファイルはjpg, jpeg, png, gif, webp形式のみ対応しています');
    }
  }
}
