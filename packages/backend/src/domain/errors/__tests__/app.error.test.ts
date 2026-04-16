import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
} from "../app.error";

describe("AppError", () => {
  it("NotFoundError は statusCode 404 と code NOT_FOUND を持つ", () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error instanceof AppError).toBe(true);
  });

  it("ValidationError は statusCode 400 と code VALIDATION_ERROR を持つ", () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
  });

  it("UnauthorizedError は statusCode 401 と code UNAUTHORIZED を持つ", () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("ForbiddenError は statusCode 403 と code FORBIDDEN を持つ", () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });

  it("ConflictError は statusCode 409 と code CONFLICT を持つ", () => {
    const error = new ConflictError();
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
  });

  it("InternalServerError は statusCode 500 と code INTERNAL_SERVER_ERROR を持つ", () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
  });

  it("ServiceUnavailableError は statusCode 503 と code SERVICE_UNAVAILABLE を持つ", () => {
    const error = new ServiceUnavailableError();
    expect(error.statusCode).toBe(503);
    expect(error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it("カスタムメッセージを設定できる", () => {
    const error = new NotFoundError("ユーザーが見つかりません");
    expect(error.message).toBe("ユーザーが見つかりません");
  });
});
