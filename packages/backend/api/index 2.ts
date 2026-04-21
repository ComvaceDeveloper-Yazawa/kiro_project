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
  // アプリケーションインスタンスの再利用（コールドスタート対策）
  if (!app) {
    app = await buildApp();
    await app.ready();
  }

  // Fastifyのリクエストハンドラーに委譲
  app.server.emit('request', req, res);
}
