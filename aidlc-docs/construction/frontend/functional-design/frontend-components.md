# フロントエンドコンポーネント定義 - Unit 4: frontend

## コンポーネント設計方針

- Apple.com スタイル: ホワイトベース・大きなタイポグラフィ・余白重視・シンプル
- 全インタラクティブ要素に `data-testid` を付与（テスト自動化対応）
- ビジネスロジックは composables に委譲し、コンポーネントは UI に専念

---

## App.vue

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/useAuthStore";

const authStore = useAuthStore();

// アプリ起動時にセッションを復元
onMounted(async () => {
  await authStore.initialize();
});
</script>

<template>
  <RouterView />
</template>
```

---

## Router

### `router/index.ts`

```typescript
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useAuthStore } from "../stores/useAuthStore";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // スクロール位置をページ遷移時にトップに戻す（Apple スタイル）
  scrollBehavior: () => ({ top: 0, behavior: "smooth" }),
});

// ナビゲーションガード（SECURITY-08）
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (to.meta["requiresAuth"] && !authStore.isAuthenticated) {
    return { name: "Login" };
  }
});
```

### `router/routes.ts`

```typescript
import type { RouteRecordRaw } from "vue-router";
// 機能追加時はここに import して展開する
// import { authRoutes } from './auth/auth.routes'

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
  },
];
```

---

## Stores

### `stores/useAuthStore.ts`（Pinia Setup 記法）

```typescript
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth-store", () => {
  // --- state ---
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const isLoading = ref(false);

  // --- getters ---
  const isAuthenticated = computed(() => user.value !== null);

  // --- actions ---
  async function initialize(): Promise<void> {
    // Supabase セッション復元
  }

  async function signIn(email: string, password: string): Promise<void> {
    isLoading.value = true;
    try {
      // Supabase Auth サインイン
    } finally {
      isLoading.value = false;
    }
  }

  async function signOut(): Promise<void> {
    // Supabase Auth サインアウト
    user.value = null;
    session.value = null;
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
```

---

## Composables

### `composables/api/useApiClient.ts`

```typescript
import type { ApiResponse } from "@monorepo/shared";
import { useAuthStore } from "../../stores/useAuthStore";

export function useApiClient() {
  const authStore = useAuthStore();
  const baseUrl = import.meta.env["VITE_API_BASE_URL"] as string;

  // 認証ヘッダーを付与した fetch ラッパー
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = authStore.session?.access_token;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    return response.json() as Promise<ApiResponse<T>>;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
```

### `composables/useAuth.ts`

```typescript
import { useAuthStore } from "../stores/useAuthStore";
import { storeToRefs } from "pinia";

// 認証ビジネスロジック（UI 描画は含まない）
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
```

---

## Views（スキャフォールディング）

### `views/HomeView.vue`

```vue
<script setup lang="ts">
// ホームページ
// 認証状態に応じてコンテンツを切り替える
</script>

<template>
  <main class="l-main">
    <section class="l-section">
      <h1 class="t-hero">Welcome</h1>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "../styles/base/variables" as *;

.l-main {
  min-height: 100vh;
  background-color: $color-background;
}

.l-section {
  max-width: 980px;
  margin: 0 auto;
  padding: $space-24 $space-6;
}

.t-hero {
  font-size: $font-size-hero;
  font-weight: $font-weight-bold;
  color: $color-primary;
  letter-spacing: -0.02em;
  line-height: $line-height-tight;
}
</style>
```

### `views/NotFoundView.vue`

```vue
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <main class="l-not-found">
    <h1 class="t-heading">404</h1>
    <p class="t-body">ページが見つかりません</p>
    <button
      class="m-button m-button--primary"
      data-testid="not-found-home-button"
      @click="router.push({ name: 'Home' })"
    >
      ホームへ戻る
    </button>
  </main>
</template>

<style scoped lang="scss">
@use "../styles/base/variables" as *;

.l-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: $space-6;
  background-color: $color-background;
}

.t-heading {
  font-size: $font-size-hero;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.t-body {
  font-size: $font-size-lg;
  color: $color-text-muted;
}
</style>
```

---

## SCSS グローバルファイル構成

### `styles/global.scss`（エントリポイント）

```scss
// Base
@use "base/reset";
@use "base/typography";

// Layout
@use "layout/grid";

// Module
@use "module/button";

// State
@use "state/states";

// Theme
@use "theme/apple";
```

### `styles/base/_reset.scss`

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: $color-background;
  color: $color-text;
  font-family: $font-family-base;
  line-height: $line-height-base;
}

img,
video {
  max-width: 100%;
  height: auto;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: $color-accent;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
```

### `styles/module/_button.scss`（Apple スタイルボタン）

```scss
@use "../base/variables" as *;

.m-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-3 $space-6;
  border-radius: $border-radius-full;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  transition:
    background-color $transition-fast,
    transform $transition-fast;

  &:active {
    transform: scale(0.98);
  }

  // Primary（Apple ブルー）
  &--primary {
    background-color: $color-accent;
    color: #ffffff;

    &:hover {
      background-color: darken($color-accent, 8%);
      text-decoration: none;
    }
  }

  // Secondary（アウトライン）
  &--secondary {
    background-color: transparent;
    color: $color-accent;
    border: 1px solid $color-accent;

    &:hover {
      background-color: rgba($color-accent, 0.05);
      text-decoration: none;
    }
  }

  // Ghost（テキストのみ）
  &--ghost {
    background-color: transparent;
    color: $color-text;

    &:hover {
      background-color: $color-surface;
      text-decoration: none;
    }
  }
}
```

### `styles/state/_states.scss`

```scss
.is-hidden {
  display: none !important;
}

.is-visible {
  display: block !important;
}

.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.is-disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: not-allowed;
}

.is-error {
  border-color: $color-error !important;
}
```
