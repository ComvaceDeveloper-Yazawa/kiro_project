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
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ success: false, error: 'ファイルが指定されていません' });
      }

      const buffer = await data.toBuffer();
      const body = data.fields as { articleId?: { value: string } };
      const articleId = body.articleId?.value;

      fastify.log.info(
        { fileName: data.filename, size: buffer.length, articleId },
        '画像アップロード開始',
      );

      const usecase = new UploadImageUsecase(articleRepo, imageRepo, storageService);
      const image = await usecase.execute({
        file: buffer,
        fileName: data.filename,
        articleId: articleId || undefined,
        userId: request.user.id,
      });

      fastify.log.info({ imageId: image.id, url: image.url }, '画像アップロード成功');

      return reply.code(201).send({ success: true, data: image });
    } catch (error) {
      fastify.log.error(error, '画像アップロードエラー');
      throw error;
    }
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
