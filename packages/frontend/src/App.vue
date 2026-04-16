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

<style lang="scss">
// グローバルスタイル（SMACSS 順序）
// _variables.scss は additionalData で自動注入済み
@use "sass:color";
@use "./styles/base/reset";
@use "./styles/base/typography";
@use "./styles/layout/grid";
@use "./styles/module/button";
@use "./styles/state/states";
@use "./styles/theme/apple";
</style>
