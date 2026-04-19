import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from "../../domain/errors/app.error.js";

/**
 * Supabase Auth サービス
 *
 * JWT 検証と Supabase Auth ユーザー情報の取得を担当する。
 * auth.plugin.ts から使用される。
 */
export class SupabaseAuthService {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL と SUPABASE_ANON_KEY 環境変数が設定されていません",
      );
    }

    this.client = createClient(url, key);
  }

  /**
   * Bearer トークンを検証し、認証済みユーザー情報を返す
   * @throws UnauthorizedError — トークンが無効または期限切れ
   * @throws ServiceUnavailableError — Supabase Auth への接続失敗
   */
  async verifyToken(token: string): Promise<User> {
    try {
      const { data, error } = await this.client.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedError("トークンが無効または期限切れです");
      }

      return data.user;
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new ServiceUnavailableError(
        "Supabase Auth サービスへの接続に失敗しました",
      );
    }
  }
}
