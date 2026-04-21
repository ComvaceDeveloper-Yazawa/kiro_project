import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

/**
 * 認証ストア（Pinia Setup 記法）
 *
 * 認証状態（ユーザー情報・セッション）の永続保持を担当する。
 * ビジネスロジックは useAuth composable に委譲する。
 */
export const useAuthStore = defineStore('auth-store', () => {
  // --- state ---
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const isLoading = ref(false);

  // --- getters ---
  const isAuthenticated = computed(() => user.value !== null);

  // --- actions ---

  /** アプリ起動時にセッションを復元する */
  async function initialize(): Promise<void> {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    user.value = data.session?.user ?? null;

    // トークンをLocalStorageに保存
    if (data.session?.access_token) {
      localStorage.setItem('auth_token', data.session.access_token);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
    }

    // セッション変更を監視
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession;
      user.value = newSession?.user ?? null;

      // トークンを更新
      if (newSession?.access_token) {
        localStorage.setItem('auth_token', newSession.access_token);
        localStorage.setItem('supabase.auth.token', newSession.access_token);
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('supabase.auth.token');
      }
    });
  }

  /** メール・パスワードでサインイン */
  async function signIn(email: string, password: string): Promise<void> {
    isLoading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      session.value = data.session;
      user.value = data.user;

      // トークンをLocalStorageに保存（画像アップロード等で使用）
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token);
        localStorage.setItem('supabase.auth.token', data.session.access_token);
        console.log('✅ 認証トークンを保存しました');
      }
    } finally {
      isLoading.value = false;
    }
  }

  /** サインアウト */
  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    user.value = null;
    session.value = null;

    // トークンをLocalStorageから削除
    localStorage.removeItem('auth_token');
    localStorage.removeItem('supabase.auth.token');
    console.log('✅ 認証トークンを削除しました');
  }

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    initialize,
    signIn,
    signOut,
  };
});
