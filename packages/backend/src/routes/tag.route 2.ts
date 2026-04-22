import type { FastifyPluginAsync } from 'fastify';
import { ListTagsUsecase } from '../application/usecases/list-tags.usecase.js';
import { TagRepositoryImpl } from '../infrastructure/prisma/tag.repository.impl.js';

const tagRoutes: FastifyPluginAsync = async (fastify) => {
  const tagRepo = new TagRepositoryImpl(fastify.prisma);

  // GET /api/tags - タグ一覧
  fastify.get('/', { config: { auth: false } }, async (request, reply) => {
    const usecase = new ListTagsUsecase(tagRepo);
    const tags = await usecase.execute();

    return reply.send(tags);
  });
};

export default tagRoutes;
