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
  articleId: string;
  userId: string;
}

export class UploadImageUsecase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleImageRepository: ArticleImageRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: UploadImageInput): Promise<ArticleImage> {
    // 記事の存在確認
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) {
      throw new NotFoundError('記事', input.articleId);
    }

    // 認可チェック
    if (!article.canBeModifiedBy(input.userId)) {
      throw new AuthorizationError('この記事に画像をアップロードする権限がありません');
    }

    // ファイルバリデーション
    this.validateImage(input.file, input.fileName);

    // Storageにアップロード
    const storagePath = await this.storageService.uploadImage(
      input.file,
      input.fileName,
      input.articleId,
    );

    // 公開URLを取得
    const url = this.storageService.getPublicUrl(storagePath);

    // ArticleImageエンティティ作成
    const articleImage = ArticleImage.create(input.articleId, storagePath, url);

    // 保存
    return this.articleImageRepository.save(articleImage);
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
