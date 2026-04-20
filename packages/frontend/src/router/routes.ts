import type { RouteRecordRaw } from 'vue-router';

// 機能追加時はここに機能別ルートファイルを import して展開する
// 例: import { authRoutes } from './auth/auth.routes'

export const routes: RouteRecordRaw[] = [
  // ...authRoutes,

  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: false },
  },
  // 技術ブログ機能のルート
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/ArticleListView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/articles/new',
    name: 'ArticleCreate',
    component: () => import('../views/ArticleCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetailView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/articles/:id/edit',
    name: 'ArticleEdit',
    component: () => import('../views/ArticleEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-articles',
    name: 'MyArticles',
    component: () => import('../views/MyArticlesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
];
