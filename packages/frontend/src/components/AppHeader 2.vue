<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/composables/useTheme';

const router = useRouter();
const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();

const isDark = computed(() => theme.value === 'dark');

async function handleSignOut() {
  await authStore.signOut();
  router.push({ name: 'Home' });
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <!-- ロゴ -->
      <div class="header__logo">
        <router-link to="/" class="header__logo-link">
          <span class="header__logo-text">Tech Blog</span>
        </router-link>
      </div>

      <!-- ナビゲーション -->
      <nav class="header__nav">
        <router-link to="/articles" class="header__nav-link">記事一覧</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/my-articles" class="header__nav-link">
          マイ記事
        </router-link>
        <router-link to="/articles/new" class="header__nav-link header__nav-link--primary">
          記事を書く
        </router-link>
      </nav>

      <!-- ユーティリティ -->
      <div class="header__utils">
        <!-- テーマ切り替えボタン -->
        <button
          class="header__theme-toggle"
          :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            class="header__icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg v-else class="header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- ユーザーメニュー -->
        <div v-if="authStore.isAuthenticated" class="header__user">
          <button class="header__user-button" @click="handleSignOut">ログアウト</button>
        </div>
        <div v-else class="header__user">
          <router-link to="/" class="header__user-button">ログイン</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/base/variables' as *;

.header {
  background-color: var(--color-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: $shadow-sm;

  &__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 $space-4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;

    @media (max-width: 767px) {
      padding: 0 $space-3;
    }
  }

  &__logo {
    flex-shrink: 0;
  }

  &__logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: $font-weight-bold;
    font-size: $font-size-xl;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.8;
      text-decoration: none;
    }
  }

  &__logo-text {
    margin-left: $space-2;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: $space-6;
    flex: 1;
    justify-content: center;

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__nav-link {
    color: #ffffff;
    text-decoration: none;
    font-weight: $font-weight-medium;
    font-size: $font-size-sm;
    padding: $space-2 $space-3;
    border-radius: $border-radius-sm;
    transition: all $transition-fast;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      text-decoration: none;
    }

    &--primary {
      background-color: var(--color-primary);
      color: var(--color-secondary);
      font-weight: $font-weight-semibold;

      &:hover {
        background-color: #ec7211;
      }
    }
  }

  &__utils {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__theme-toggle {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    padding: $space-2;
    border-radius: $border-radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-fast;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-primary);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__user {
    display: flex;
    align-items: center;
  }

  &__user-button {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    padding: $space-2 $space-4;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all $transition-fast;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-primary);
    }
  }
}
</style>
