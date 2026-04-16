import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import cors from "@fastify/cors";

/**
 * CORS プラグイン（SECURITY-04 / SECURITY-08 対応）
 *
 * CORS_ORIGIN 環境変数でオリジンを制御する。
 * 認証エンドポイントにワイルドカードオリジンは使用しない。
 */
const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const rawOrigin = process.env["CORS_ORIGIN"] ?? "http://localhost:5173";
  // カンマ区切りで複数オリジン指定可能
  const allowedOrigins = rawOrigin.split(",").map((o) => o.trim());

  await fastify.register(cors, {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
};

export default fp(corsPlugin, { name: "cors-plugin" });
