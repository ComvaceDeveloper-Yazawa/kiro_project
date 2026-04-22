import { PrismaClient } from '@prisma/client';
import { Article } from '../../domain/entities/article.entity';
import { Tag } from '../../domain/entities/tag.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';

export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(article: Article): Promise<Article> {
    // 既存の記事かどうかを確認
    const existing = await this.prisma.articles.findUnique({
      where: { id: article.id },
    });

    if (existing) {
      // 更新
      const updated = await this.prisma.articles.update({
        where: { id: article.id },
        data: {
          title: article.title,
          content: article.content,
          is_published: article.isPublished,
          published_at: article.publishedAt,
          next_article_id: article.nextArticleId,
          updated_at: article.updatedAt,
        },
        include: {
          article_tags: {
            include: {
              tags: true,
            },
          },
          next_article: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // タグの更新
      await this.updateArticleTags(article.id, article.tags);

      const tags = updated.article_tags.map(
        (at) => new Tag(at.tags.id, at.tags.name, at.tags.created_at),
      );

      return new Article(
        updated.id,
        updated.title,
        updated.content,
        updated.author_id,
        updated.is_published,
        updated.published_at,
        updated.created_at,
        updated.updated_at,
        tags,
        updated.next_article_id,
        updated.next_article,
      );
    } else {
      // 新規作成
      const created = await this.prisma.articles.create({
        data: {
          id: article.id,
          title: article.title,
          content: article.content,
          author_id: article.authorId,
          is_published: article.isPublished,
          published_at: article.publishedAt,
          next_article_id: article.nextArticleId,
          created_at: article.createdAt,
          updated_at: article.updatedAt,
        },
        include: {
          next_article: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // タグの関連付け
      await this.updateArticleTags(article.id, article.tags);

      return new Article(
        created.id,
        created.title,
        created.content,
        created.author_id,
        created.is_published,
        created.published_at,
        created.created_at,
        created.updated_at,
        article.tags,
        created.next_article_id,
        created.next_article,
      );
    }
  }

  async findById(id: string): Promise<Article | null> {
    const article = await this.prisma.articles.findUnique({
      where: { id },
      include: {
        article_tags: {
          include: {
            tags: true,
          },
        },
        next_article: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!article) return null;

    const tags = article.article_tags.map(
      (at) => new Tag(at.tags.id, at.tags.name, at.tags.created_at),
    );

    return new Article(
      article.id,
      article.title,
      article.content,
      article.author_id,
      article.is_published,
      article.published_at,
      article.created_at,
      article.updated_at,
      tags,
      article.next_article_id,
      article.next_article,
    );
  }

  async findAll(options: {
    page: number;
    limit: number;
    isPublished?: boolean;
  }): Promise<{ articles: Article[]; total: number }> {
    const { page, limit, isPublished } = options;
    const skip = (page - 1) * limit;

    const where = isPublished !== undefined ? { is_published: isPublished } : {};

    const [articles, total] = await Promise.all([
      this.prisma.articles.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          article_tags: {
            include: {
              tags: true,
            },
          },
        },
      }),
      this.prisma.articles.count({ where }),
    ]);

    return {
      articles: articles.map((article) => {
        const tags = article.article_tags.map(
          (at) => new Tag(at.tags.id, at.tags.name, at.tags.created_at),
        );
        return new Article(
          article.id,
          article.title,
          article.content,
          article.author_id,
          article.is_published,
          article.published_at,
          article.created_at,
          article.updated_at,
          tags,
          article.next_article_id,
        );
      }),
      total,
    };
  }

  async findByAuthorId(
    authorId: string,
    options: { page: number; limit: number },
  ): Promise<{ articles: Article[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.prisma.articles.findMany({
        where: { author_id: authorId },
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          article_tags: {
            include: {
              tags: true,
            },
          },
        },
      }),
      this.prisma.articles.count({ where: { author_id: authorId } }),
    ]);

    return {
      articles: articles.map((article) => {
        const tags = article.article_tags.map(
          (at) => new Tag(at.tags.id, at.tags.name, at.tags.created_at),
        );
        return new Article(
          article.id,
          article.title,
          article.content,
          article.author_id,
          article.is_published,
          article.published_at,
          article.created_at,
          article.updated_at,
          tags,
          article.next_article_id,
        );
      }),
      total,
    };
  }

  async findByTags(
    tagNames: string[],
    options: { page: number; limit: number },
  ): Promise<{ articles: Article[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const normalizedTags = tagNames.map((name) => name.toLowerCase());

    const [articles, total] = await Promise.all([
      this.prisma.articles.findMany({
        where: {
          article_tags: {
            some: {
              tags: {
                name: {
                  in: normalizedTags,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          article_tags: {
            include: {
              tags: true,
            },
          },
        },
      }),
      this.prisma.articles.count({
        where: {
          article_tags: {
            some: {
              tags: {
                name: {
                  in: normalizedTags,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      articles: articles.map((article) => {
        const tags = article.article_tags.map(
          (at) => new Tag(at.tags.id, at.tags.name, at.tags.created_at),
        );
        return new Article(
          article.id,
          article.title,
          article.content,
          article.author_id,
          article.is_published,
          article.published_at,
          article.created_at,
          article.updated_at,
          tags,
          article.next_article_id,
        );
      }),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.articles.delete({
      where: { id },
    });
  }

  private async updateArticleTags(articleId: string, tags: Tag[]): Promise<void> {
    // 既存のタグ関連を削除
    await this.prisma.article_tags.deleteMany({
      where: { article_id: articleId },
    });

    if (tags.length === 0) return;

    // タグを取得または作成
    const dbTags = await Promise.all(
      tags.map(async (tag) => {
        const normalizedName = tag.name.trim().toLowerCase();
        let dbTag = await this.prisma.tags.findUnique({
          where: { name: normalizedName },
        });

        if (!dbTag) {
          dbTag = await this.prisma.tags.create({
            data: {
              id: crypto.randomUUID(),
              name: normalizedName,
            },
          });
        }

        return dbTag;
      }),
    );

    // 新しいタグ関連を作成
    await this.prisma.article_tags.createMany({
      data: dbTags.map((tag) => ({
        article_id: articleId,
        tag_id: tag.id,
      })),
    });
  }
}
