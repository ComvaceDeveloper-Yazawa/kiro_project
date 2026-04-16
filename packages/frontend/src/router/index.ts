import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useAuthStore } from "../stores/useAuthStore";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // ページ遷移時にスクロール位置をトップへ（Apple スタイル）
  scrollBehavior: () => ({ top: 0, behavior: "smooth" }),
});

/**
 * ナビゲーションガード（SECURITY-08 対応）
 *
 * meta.requiresAuth: true のルートは未認証時にログインページへリダイレクト。
 * meta.requiresAuth が未設定または false のルートは公開扱い。
 */
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta["requiresAuth"] === true && !authStore.isAuthenticated) {
    return { name: "Login", query: { redirect: to.fullPath } };
  }

  return true;
});
