import type { FastifyPluginAsync } from 'fastify';
import { UploadImageUsecase } from '../application/usecases/upload-image.usecase.js';
import { DeleteImageUsecase } from '../application/usecases/delete-image.usecase.js';
import { ArticleRepositoryImpl } from '../infrastructure/prisma/article.repository.impl.js';
import { ArticleImageRepositoryImpl } from '../infrastructure/prisma/article-image.repository.impl.js';
import { SupabaseStorageService } from '../infrastructure/supabase/storage.service.impl.js';

const imageRoutes: FastifyPluginAsync = async (fastify) => {
  const articleRepo = new ArticleRepositoryImpl(fastify.prisma);
  const imageRepo = new ArticleImageRepositoryImpl(fastify.prisma);
  const storageService = new SupabaseStorageService();

  // POST /api/images - 画像アップロード
  fastify.post('/', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.code(400).send({ error: 'ファイルが指定されていません' });
    }

    const buffer = await data.toBuffer();
    const body = data.fields as { articleId?: { value: string } };
    const articleId = body.articleId?.value;

    if (!articleId) {
      return reply.code(400).send({ error: 'articleIdが指定されていません' });
    }

    const usecase = new UploadImageUsecase(articleRepo, imageRepo, storageService);
    const image = await usecase.execute({
      file: buffer,
      fileName: data.filename,
      articleId,
      userId: request.user.id,
    });

    return reply.code(201).send(image);
  });

  // DELETE /api/images/:id - 画像削除
  fastify.delete('/:id', async (request, reply) => {
    const params = request.params as { id: string };

    const usecase = new DeleteImageUsecase(imageRepo, articleRepo, storageService);
    await usecase.execute({
      imageId: params.id,
      userId: request.user.id,
    });

    return reply.code(204).send();
  });
};

export default imageRoutes;
