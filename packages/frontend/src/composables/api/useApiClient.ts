import type { ApiResponse } from "@monorepo/shared";
import { useAuthStore } from "../../stores/useAuthStore";

/**
 * 共通 fetch ラッパー（SECURITY-08 対応）
 *
 * - useAuthStore からトークンを取得して Authorization ヘッダーに付与
 * - ApiResponse<T> 型に変換して返却
 * - エラーハンドリングは呼び出し元の composables で行う
 */
export function useApiClient() {
  const authStore = useAuthStore();
  const baseUrl = import.meta.env["VITE_API_BASE_URL"] as string;

  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = authStore.session?.access_token;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    return response.json() as Promise<ApiResponse<T>>;
  }

  return {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),

    post: <T>(path: string, body: unknown) =>
      request<T>(path, {
        method: "POST",
        body: JSON.stringify(body),
      }),

    put: <T>(path: string, body: unknown) =>
      request<T>(path, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
