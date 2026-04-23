/**
 * Vercel Serverless Function エントリーポイント
 * packages/backend 内に配置することで、モノレポの依存関係を正しく解決
 */
import { buildApp } from '../src/app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: Awaited<ReturnType<typeof buildApp>> | null = null;

/**
 * Vercel Serverless Function ハンドラー
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // アプリケーションインスタンスの再利用（コールドスタート対策）
    if (!app) {
      console.log('🚀 Initializing Fastify app...');
      app = await buildApp();
      await app.ready();
      console.log('✅ Fastify app ready');
    }

    // URLをそのまま使用 (Fastifyルートは /api/* で定義されているため)
    const url = req.url || '/';

    // VercelのリクエストをFastifyに変換して処理
    const response = await app.inject({
      method: req.method!,
      url: url,
      headers: req.headers as Record<string, string>,
      payload: req.body,
      query: req.query as Record<string, string>,
    });

    // Fastifyのレスポンスを設定
    res.status(response.statusCode);

    // ヘッダーを設定
    Object.entries(response.headers).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((v) => res.setHeader(key, v));
      } else {
        res.setHeader(key, values as string);
      }
    });

    // レスポンスボディを送信
    res.send(response.payload);
  } catch (error) {
    console.error('❌ Serverless Function Error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
    });
  }
}
