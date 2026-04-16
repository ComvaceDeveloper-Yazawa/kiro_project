import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { ServiceUnavailableError } from "../domain/errors/app.error.js";

// Fastify インスタンスへの型拡張
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

/**
 * Prisma クライアント DI プラグイン
 *
 * fastify.prisma としてシングルトンの Prisma クライアントを提供する。
 * アプリ終了時に自動的に切断する。
 */
const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient({
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  try {
    await prisma.$connect();
  } catch {
    throw new ServiceUnavailableError("データベースへの接続に失敗しました");
  }

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};

// fastify-plugin でラップすることでスコープを親に公開する
export default fp(dbPlugin, { name: "db-plugin" });
