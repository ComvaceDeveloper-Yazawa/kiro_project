import type { RouteRecordRaw } from "vue-router";

// 機能追加時はここに機能別ルートファイルを import して展開する
// 例: import { authRoutes } from './auth/auth.routes'

export const routes: RouteRecordRaw[] = [
  // ...authRoutes,

  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
    meta: { requiresAuth: false },
  },
];
