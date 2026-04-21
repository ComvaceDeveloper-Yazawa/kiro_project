import type { FastifyPluginAsync } from 'fastify';
import { CreateArticleSchema, UpdateArticleSchema } from '@monorepo/shared';
import { CreateArticleUsecase } from '../application/usecases/create-article.usecase.js';
import { UpdateArticleUsecase } from '../application/usecases/update-article.usecase.js';
import { PublishArticleUsecase } from '../application/usecases/publish-article.usecase.js';
import { DeleteArticleUsecase } from '../application/usecases/delete-article.usecase.js';
import { GetArticleUsecase } from '../application/usecases/get-article.usecase.js';
import { ListArticlesUsecase } from '../application/usecases/list-articles.usecase.js';
import { ListMyArticlesUsecase } from '../application/usecases/list-my-articles.usecase.js';
import { SearchArticlesByTagsUsecase } from '../application/usecases/search-articles-by-tags.usecase.js';
import { ArticleRepositoryImpl } from '../infrastructure/prisma/article.repository.impl.js';
import { TagRepositoryImpl } from '../infrastructure/prisma/tag.repository.impl.js';
import { ArticleImageRepositoryImpl } from '../infrastructure/prisma/article-image.repository.impl.js';
import { SupabaseStorageService } from '../infrastructure/supabase/storage.service.impl.js';

const articleRoutes: FastifyPluginAsync = async (fastify) => {
  const articleRepo = new ArticleRepositoryImpl(fastify.prisma);
  const tagRepo = new TagRepositoryImpl(fastify.prisma);
  const imageRepo = new ArticleImageRepositoryImpl(fastify.prisma);
  const storageService = new SupabaseStorageService();

  // POST /api/articles - 記事作成
  fastify.post('/', async (request, reply) => {
    const body = CreateArticleSchema.parse(request.body);
    const usecase = new CreateArticleUsecase(articleRepo, tagRepo);

    console.log('📝 記事作成リクエスト受信:', {
      title: body.title,
      tags: body.tags,
      isPublished: body.isPublished,
    });

    const article = await usecase.execute({
      title: body.title,
      content: body.content,
      authorId: request.user.id,
      tags: body.tags || [],
      isPublished: body.isPublished, // 追加
    });

    console.log('📝 記事作成完了:', {
      id: article.id,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
    });

    return reply.code(201).send(article);
  });

  // GET /api/articles - 公開記事一覧
  fastify.get('/', { config: { auth: false } }, async (request, reply) => {
    const query = request.query as { page?: string; limit?: string };
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    const usecase = new ListArticlesUsecase(articleRepo);
    const result = await usecase.execute({ page, limit });

    return reply.send(result);
  });

  // GET /api/articles/my - 自分の記事一覧
  fastify.get('/my', async (request, reply) => {
    const query = request.query as { page?: string; limit?: string };
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    const usecase = new ListMyArticlesUsecase(articleRepo);
    const result = await usecase.execute({
      userId: request.user.id,
      page,
      limit,
    });

    return reply.send(result);
  });

  // GET /api/articles/search - タグ検索
  fastify.get('/search', { config: { auth: false } }, async (request, reply) => {
    const query = request.query as {
      tags?: string;
      page?: string;
      limit?: string;
    };
    const tags = query.tags ? query.tags.split(',') : [];
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    const usecase = new SearchArticlesByTagsUsecase(articleRepo);
    const result = await usecase.execute({ tags, page, limit });

    return reply.send(result);
  });

  // GET /api/articles/:id - 記事詳細
  fastify.get('/:id', { config: { auth: 'optional' } }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const usecase = new GetArticleUsecase(articleRepo);

      // 認証されている場合はuserIdを渡す
      const userId = request.user?.id || null;

      const article = await usecase.execute({
        articleId: params.id,
        userId,
      });

      return reply.send(article);
    } catch (error) {
      // エラーを再スローしてグローバルエラーハンドラーに処理させる
      throw error;
    }
  });

  // PUT /api/articles/:id - 記事更新
  fastify.put('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const body = UpdateArticleSchema.parse(request.body);

    const usecase = new UpdateArticleUsecase(articleRepo, tagRepo);
    const article = await usecase.execute({
      articleId: params.id,
      userId: request.user.id,
      title: body.title,
      content: body.content,
      tags: body.tags || [],
    });

    return reply.send(article);
  });

  // PATCH /api/articles/:id/publish - 記事公開・非公開
  fastify.patch('/:id/publish', async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as { isPublished: boolean };

    console.log('🚀 公開リクエスト受信:', {
      articleId: params.id,
      userId: request.user.id,
      isPublished: body.isPublished,
    });

    const usecase = new PublishArticleUsecase(articleRepo);
    const article = await usecase.execute({
      articleId: params.id,
      userId: request.user.id,
      isPublished: body.isPublished,
    });

    console.log('🚀 公開レスポンス:', {
      articleId: article.id,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
    });

    return reply.send(article);
  });

  // DELETE /api/articles/:id - 記事削除
  fastify.delete('/:id', async (request, reply) => {
    const params = request.params as { id: string };

    const usecase = new DeleteArticleUsecase(articleRepo, imageRepo, storageService);
    await usecase.execute({
      articleId: params.id,
      userId: request.user.id,
    });

    return reply.code(204).send();
  });
};

export default articleRoutes;
