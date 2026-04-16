import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

/**
 * レート制限プラグイン（SECURITY-11 対応）
 *
 * グローバル: RATE_LIMIT_MAX req/min（デフォルト 100）
 * 認証エンドポイントは routes 側で個別に AUTH_RATE_LIMIT_MAX を適用すること。
 */
const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  const max = parseInt(process.env["RATE_LIMIT_MAX"] ?? "100", 10);

  await fastify.register(rateLimit, {
    global: true,
    max,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message:
          "リクエスト数が上限を超えました。しばらく待ってから再試行してください。",
      },
    }),
  });
};

export default fp(rateLimitPlugin, { name: "rate-limit-plugin" });
