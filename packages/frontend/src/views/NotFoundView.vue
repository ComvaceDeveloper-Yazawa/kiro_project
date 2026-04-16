<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <main class="l-main l-flex l-flex--center l-flex--col">
    <div class="not-found l-flex l-flex--col l-flex--center">
      <p class="not-found__code t-caption">404</p>
      <h1 class="not-found__title t-heading-2">ページが見つかりません</h1>
      <p class="not-found__message t-body">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <button
        class="m-button m-button--primary"
        data-testid="not-found-home-button"
        @click="router.push({ name: 'Home' })"
      >
        ホームへ戻る
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "@/styles/base/variables" as *;

.not-found {
  gap: $space-6;
  text-align: center;
  padding: $space-24 $space-6;
  max-width: 480px;
  margin: 0 auto;

  &__code {
    font-size: $font-size-sm;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $color-text-muted;
  }

  &__title {
    color: $color-primary;
  }

  &__message {
    color: $color-text-muted;
  }
}
</style>
