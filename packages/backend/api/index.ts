/**
 * Vercel Serverless Function エントリーポイント
 *
 * Fastifyアプリケーションをサーバーレス環境で実行するためのアダプター
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

    // VercelのリクエストをFastifyに変換して処理
    await app
      .inject({
        method: req.method || 'GET',
        url: req.url || '/',
        headers: req.headers as Record<string, string>,
        payload: req.body,
        query: req.query as Record<string, string>,
      })
      .then((response) => {
        // Fastifyのレスポンスを設定
        res.status(response.statusCode);

        // ヘッダーを設定
        Object.entries(response.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });

        // レスポンスボディを送信
        res.send(response.body);
      });
  } catch (error) {
    console.error('❌ Serverless Function Error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
