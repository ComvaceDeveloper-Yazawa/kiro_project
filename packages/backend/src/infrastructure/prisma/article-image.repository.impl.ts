import { PrismaClient } from '@prisma/client';
import { ArticleImage } from '../../domain/entities/article-image.entity';
import { ArticleImageRepository } from '../../domain/repositories/article-image.repository';

export class ArticleImageRepositoryImpl implements ArticleImageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(image: ArticleImage): Promise<ArticleImage> {
    const saved = await this.prisma.article_images.create({
      data: {
        id: image.id,
        article_id: image.articleId,
        storage_path: image.storagePath,
        url: image.url,
        created_at: image.createdAt,
      },
    });

    return new ArticleImage(
      saved.id,
      saved.article_id,
      saved.storage_path,
      saved.url,
      saved.created_at,
    );
  }

  async findByArticleId(articleId: string): Promise<ArticleImage[]> {
    const images = await this.prisma.article_images.findMany({
      where: { article_id: articleId },
      orderBy: { created_at: 'asc' },
    });

    return images.map(
      (img) => new ArticleImage(img.id, img.article_id, img.storage_path, img.url, img.created_at),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article_images.delete({
      where: { id },
    });
  }
}
