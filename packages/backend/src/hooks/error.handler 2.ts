import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../domain/errors/app.error.js';

/**
 * グローバルエラーハンドラー（SECURITY-09 / SECURITY-15 対応）
 *
 * - AppError サブクラス → 対応する HTTP ステータスと ApiResponse 形式に変換
 * - 予期しないエラー → 500 で返却（詳細は非公開）
 * - スタックトレース・内部パスはレスポンスに含めない
 */
export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // 構造化ログ（SECURITY-03）
  request.log.error({
    err: error,
    requestId: request.id,
    method: request.method,
    url: request.url,
  });

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Fastify のバリデーションエラー（schema オプション使用時）
  if ('statusCode' in error && error.statusCode === 400) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '入力値が正しくありません',
      },
    });
  }

  // 予期しないエラー — 詳細は非公開（SECURITY-09）
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'サーバーエラーが発生しました',
    },
  });
}
