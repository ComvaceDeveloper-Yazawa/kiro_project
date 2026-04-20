import { AppError } from './app.error';

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource}が見つかりません (ID: ${id})` : `${resource}が見つかりません`;
    super(message, 404, 'NOT_FOUND', { resource, id });
  }
}
