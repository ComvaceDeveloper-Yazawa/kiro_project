import { z } from "zod";
// =============================================================================
// 共通エラーコード定義
//
// backend の AppError サブクラスと対応させる。
// 新しいエラー種別が必要になったらここに追加し、backend の app.error.ts も更新する。
// =============================================================================
export const ErrorCodeSchema = z.enum([
    "VALIDATION_ERROR", // 入力バリデーション失敗 (400)
    "NOT_FOUND", // リソースが存在しない (404)
    "UNAUTHORIZED", // 認証されていない (401)
    "FORBIDDEN", // 権限がない (403)
    "CONFLICT", // 重複・競合 (409)
    "INTERNAL_SERVER_ERROR", // サーバー内部エラー (500)
]);
//# sourceMappingURL=error.schema.js.map