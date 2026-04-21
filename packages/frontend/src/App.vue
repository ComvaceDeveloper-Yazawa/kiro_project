<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import { useTheme } from './composables/useTheme';
import AppHeader from './components/AppHeader.vue';

const authStore = useAuthStore();
const { theme } = useTheme();

// アプリ起動時にセッションを復元
onMounted(async () => {
  await authStore.initialize();
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style lang="scss">
// グローバルスタイル（SMACSS 順序）
// _variables.scss は additionalData で自動注入済み
@use 'sass:color';
@use './styles/global';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
