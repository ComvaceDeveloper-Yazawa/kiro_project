import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * 認証ビジネスロジック composable
 *
 * UI 描画は含まない。
 * コンポーネントはこの composable を通じて認証操作を行う。
 */
export function useAuth() {
  const authStore = useAuthStore();
  const { user, isAuthenticated, isLoading } = storeToRefs(authStore);

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn: authStore.signIn,
    signOut: authStore.signOut,
  };
}
