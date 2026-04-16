import { describe, it, expect } from "vitest";
import { createApiSuccessSchema, ApiErrorSchema } from "../response.schema";
import { z } from "zod";

describe("ApiResponse スキーマ", () => {
  it("成功レスポンスのスキーマが正しく動作する", () => {
    const schema = createApiSuccessSchema(z.object({ id: z.string() }));
    const result = schema.safeParse({
      success: true,
      data: { id: "1" },
      message: "OK",
    });
    expect(result.success).toBe(true);
  });

  it("エラーレスポンスのスキーマが正しく動作する", () => {
    const result = ApiErrorSchema.safeParse({
      success: false,
      error: { code: "NOT_FOUND", message: "Not found" },
    });
    expect(result.success).toBe(true);
  });

  it("不正な成功レスポンスはバリデーションエラーになる", () => {
    const schema = createApiSuccessSchema(z.object({ id: z.string() }));
    const result = schema.safeParse({
      success: true,
      data: { id: 123 },
      message: "OK",
    });
    expect(result.success).toBe(false);
  });
});
