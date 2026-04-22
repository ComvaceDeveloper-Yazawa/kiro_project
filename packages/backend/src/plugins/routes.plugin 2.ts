import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import articleRoutes from '../routes/article.route.js';
import tagRoutes from '../routes/tag.route.js';
import imageRoutes from '../routes/image.route.js';

/**
 * ルート登録プラグイン
 *
 * 新しいリソースのルートを追加するときはここに import して register する。
 *
 * 例:
 *   import userRoutes from '../routes/user/user.route.js';
 *   await fastify.register(userRoutes, { prefix: '/api/v1/users' });
 */
const routesPlugin: FastifyPluginAsync = async (fastify) => {
  // ヘルスチェックエンドポイント（認証不要）
  fastify.get('/health', { config: { auth: false } }, async () => ({
    status: 'ok',
  }));

  // 技術ブログ機能のルート
  await fastify.register(articleRoutes, { prefix: '/api/articles' });
  await fastify.register(tagRoutes, { prefix: '/api/tags' });
  await fastify.register(imageRoutes, { prefix: '/api/images' });
};

export default fp(routesPlugin, {
  name: 'routes-plugin',
  dependencies: ['auth-plugin', 'db-plugin'],
});
