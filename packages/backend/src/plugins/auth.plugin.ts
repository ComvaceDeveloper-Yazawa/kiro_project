import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import type { User } from "@supabase/supabase-js";
import { SupabaseAuthService } from "../infrastructure/supabase/auth.service.js";
import { UnauthorizedError } from "../domain/errors/app.error.js";

// リクエストへの型拡張
declare module "fastify" {
  interface FastifyRequest {
    user: Pick<User, "id" | "email">;
  }
}

/**
 * JWT 認証プラグイン
 *
 * Authorization: Bearer <token> ヘッダーを検証し、
 * request.user にユーザー情報を付与する。
 *
 * 認証が不要なルートには { config: { auth: false } } を設定すること。
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
  const authService = new SupabaseAuthService();

  fastify.addHook("preHandler", async (request) => {
    // auth: false が設定されたルートはスキップ
    const routeConfig = request.routeOptions.config as Record<string, unknown>;
    if (routeConfig.auth === false) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    const token = authHeader.slice(7);
    const user = await authService.verifyToken(token);

    request.user = {
      id: user.id,
      email: user.email ?? "",
    };
  });
};

export default fp(authPlugin, {
  name: "auth-plugin",
  dependencies: ["db-plugin"],
});
