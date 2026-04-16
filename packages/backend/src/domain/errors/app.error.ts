/**
 * AppError — アプリケーション全体で使用するカスタムエラー基底クラス
 *
 * 使い方:
 *   throw new NotFoundError('ユーザーが見つかりません');
 *
 * setErrorHandler が AppError のサブクラスを判定し、
 * 適切な HTTP ステータスと ApiResponse 形式に変換する。
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    // V8 エンジンでスタックトレースを正しく取得するため
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 404 — リソースが存在しない */
export class NotFoundError extends AppError {
  constructor(message = "リソースが見つかりません") {
    super("NOT_FOUND", message, 404);
  }
}

/** 400 — 入力値が不正 */
export class ValidationError extends AppError {
  constructor(message = "入力値が正しくありません") {
    super("VALIDATION_ERROR", message, 400);
  }
}

/** 401 — 認証が必要 */
export class UnauthorizedError extends AppError {
  constructor(message = "認証が必要です") {
    super("UNAUTHORIZED", message, 401);
  }
}

/** 403 — 権限不足 */
export class ForbiddenError extends AppError {
  constructor(message = "アクセス権限がありません") {
    super("FORBIDDEN", message, 403);
  }
}

/** 409 — リソースの競合 */
export class ConflictError extends AppError {
  constructor(message = "リソースが既に存在します") {
    super("CONFLICT", message, 409);
  }
}

/** 500 — 予期しないサーバーエラー */
export class InternalServerError extends AppError {
  constructor(message = "サーバーエラーが発生しました") {
    super("INTERNAL_SERVER_ERROR", message, 500);
  }
}

/** 503 — 外部サービス障害（Supabase Auth / Prisma 接続失敗など） */
export class ServiceUnavailableError extends AppError {
  constructor(message = "サービスが一時的に利用できません") {
    super("SERVICE_UNAVAILABLE", message, 503);
  }
}
