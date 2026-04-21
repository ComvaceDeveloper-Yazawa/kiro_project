import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { errorHandler } from './hooks/error.handler.js';
import corsPlugin from './plugins/cors.plugin.js';
import helmetPlugin from './plugins/helmet.plugin.js';
import rateLimitPlugin from './plugins/rate-limit.plugin.js';
import dbPlugin from './plugins/db.plugin.js';
import authPlugin from './plugins/auth.plugin.js';
import routesPlugin from './plugins/routes.plugin.js';

/**
 * Fastify アプリケーションファクトリ
 *
 * プラグイン登録順序（依存関係に従う）:
 * 1. セキュリティ系（cors / helmet / rate-limit）
 * 2. ファイルアップロード（multipart）
 * 3. インフラ系（db）
 * 4. 認証（auth）
 * 5. ルート（routes）
 * 6. グローバルエラーハンドラー
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      // 構造化ログ（SECURITY-03）: timestamp・requestId・level・message を含む
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            requestId: request.id,
          };
        },
      },
    },
    // リクエスト ID を自動付与（SECURITY-03）
    genReqId: () => crypto.randomUUID(),
  });

  // 1. セキュリティ系プラグイン
  await app.register(corsPlugin);
  await app.register(helmetPlugin);
  await app.register(rateLimitPlugin);

  // 2. ファイルアップロードプラグイン
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // 3. インフラ系プラグイン
  await app.register(dbPlugin);

  // 4. 認証プラグイン
  await app.register(authPlugin);

  // 5. ルートプラグイン
  await app.register(routesPlugin);

  // 6. グローバルエラーハンドラー（全プラグイン登録後）
  app.setErrorHandler(errorHandler);

  return app;
}
