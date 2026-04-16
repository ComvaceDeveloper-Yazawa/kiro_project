<script setup lang="ts">
// ホームページ
// 認証状態に応じてコンテンツを切り替える
</script>

<template>
  <main class="l-main">
    <section class="l-section">
      <div class="l-container">
        <h1 class="t-hero home__title">Welcome.</h1>
        <p class="t-body home__subtitle">シンプルに、美しく。</p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "@/styles/base/variables" as *;

.home {
  &__title {
    margin-bottom: $space-6;
  }

  &__subtitle {
    max-width: 480px;
  }
}
</style>
