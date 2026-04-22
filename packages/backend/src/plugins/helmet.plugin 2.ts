import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import helmet from "@fastify/helmet";

/**
 * Helmet プラグイン（SECURITY-04 対応）
 *
 * HTTP セキュリティヘッダーを設定する:
 * - Content-Security-Policy
 * - Strict-Transport-Security (HSTS)
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - Referrer-Policy: strict-origin-when-cross-origin
 */
const helmetPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
};

export default fp(helmetPlugin, { name: "helmet-plugin" });
