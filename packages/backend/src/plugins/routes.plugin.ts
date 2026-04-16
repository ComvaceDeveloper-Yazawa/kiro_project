import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

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
  fastify.get("/health", { config: { auth: false } }, async () => ({
    status: "ok",
  }));

  // リソースルートをここに追加する
  // await fastify.register(userRoutes, { prefix: '/api/v1/users' });
};

export default fp(routesPlugin, {
  name: "routes-plugin",
  dependencies: ["auth-plugin", "db-plugin"],
});
