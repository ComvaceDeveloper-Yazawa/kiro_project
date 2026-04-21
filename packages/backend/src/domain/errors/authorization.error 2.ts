import { AppError } from './app.error';

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'この操作を実行する権限がありません',
    details?: Record<string, unknown>,
  ) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}
