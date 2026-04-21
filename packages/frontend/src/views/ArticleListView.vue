<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useArticleApi } from '../composables/useArticleApi';
import { useAuthStore } from '../stores/useAuthStore';
import ArticleCard from '../components/ArticleCard.vue';
import TagFilter from '../components/TagFilter.vue';
import type { Article } from '@monorepo/shared';

const api = useArticleApi();
const authStore = useAuthStore();

const articles = ref<Article[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedTags = ref<string[]>([]);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

const hasArticles = computed(() => articles.value.length > 0);
const showPagination = computed(() => pagination.value.totalPages > 1);

const loadArticles = async () => {
  loading.value = true;
  error.value = null;

  try {
    let result;
    if (selectedTags.value.length > 0) {
      result = await api.searchArticlesByTags(
        selectedTags.value,
        pagination.value.page,
        pagination.value.limit,
      );
    } else {
      result = await api.listArticles(pagination.value.page, pagination.value.limit);
    }

    articles.value = result.data;
    pagination.value = result.pagination;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '記事の取得に失敗しました';
  } finally {
    loading.value = false;
  }
};

const handleTagFilter = (tags: string[]) => {
  selectedTags.value = tags;
  pagination.value.page = 1;
  loadArticles();
};

const goToPage = (page: number) => {
  pagination.value.page = page;
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <div class="article-list">
    <!-- ヘッダーセクション -->
    <div class="article-list__hero">
      <div class="article-list__hero-content">
        <h1 class="article-list__title">技術ブログ</h1>
        <p class="article-list__subtitle">最新の技術記事をチェックしよう</p>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div class="article-list__container">
      <div class="article-list__content">
        <!-- サイドバー（タグフィルター） -->
        <aside class="article-list__sidebar">
          <div class="article-list__sidebar-sticky">
            <h2 class="article-list__sidebar-title">タグで絞り込み</h2>
            <TagFilter @update:selectedTags="handleTagFilter" />
          </div>
        </aside>

        <!-- 記事一覧 -->
        <main class="article-list__main">
          <!-- ローディング -->
          <div v-if="loading" class="article-list__loading">
            <div class="article-list__spinner"></div>
            <p>記事を読み込み中...</p>
          </div>

          <!-- エラー -->
          <div v-else-if="error" class="article-list__error">
            <svg
              class="article-list__error-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{{ error }}</p>
            <button class="article-list__retry-btn" @click="loadArticles">再試行</button>
          </div>

          <!-- 記事なし -->
          <div v-else-if="!hasArticles" class="article-list__empty">
            <svg
              class="article-list__empty-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3>記事がありません</h3>
            <p v-if="selectedTags.length > 0">選択したタグに一致する記事が見つかりませんでした</p>
            <p v-else>まだ記事が投稿されていません</p>
          </div>

          <!-- 記事リスト -->
          <div v-else class="article-list__articles">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
          </div>

          <!-- ページネーション -->
          <div v-if="showPagination && !loading" class="article-list__pagination">
            <button
              class="article-list__page-btn"
              :disabled="pagination.page === 1"
              @click="goToPage(pagination.page - 1)"
            >
              <svg
                class="article-list__page-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              前へ
            </button>

            <div class="article-list__page-numbers">
              <span class="article-list__page-current">{{ pagination.page }}</span>
              <span class="article-list__page-separator">/</span>
              <span class="article-list__page-total">{{ pagination.totalPages }}</span>
            </div>

            <button
              class="article-list__page-btn"
              :disabled="pagination.page === pagination.totalPages"
              @click="goToPage(pagination.page + 1)"
            >
              次へ
              <svg
                class="article-list__page-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/base/variables' as *;

.article-list {
  min-height: calc(100vh - 60px);
  background-color: var(--color-background);

  &__hero {
    background: linear-gradient(135deg, var(--color-secondary) 0%, #1a2332 100%);
    padding: $space-16 $space-4;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }

  &__hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    color: #ffffff;
    margin-bottom: $space-4;

    @media (max-width: 767px) {
      font-size: $font-size-3xl;
    }
  }

  &__subtitle {
    font-size: $font-size-lg;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: $space-8;
  }

  &__create-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-6;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background-color: #ec7211;
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__container {
    max-width: 1600px;
    margin: 0 auto;
    padding: $space-8 $space-4;
  }

  &__content {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: $space-8;
    align-items: start;

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
    }
  }

  &__sidebar {
    @media (max-width: 1023px) {
      order: 2;
    }
  }

  &__sidebar-sticky {
    position: sticky;
    top: 80px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-md;
    padding: $space-6;

    @media (max-width: 1023px) {
      position: static;
    }
  }

  &__sidebar-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: var(--color-text);
    margin-bottom: $space-4;
  }

  &__selected-tags {
    margin-top: $space-6;
    padding-top: $space-6;
    border-top: 1px solid var(--color-border);
  }

  &__selected-tags-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: var(--color-text-muted);
    margin-bottom: $space-3;
  }

  &__tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    margin-bottom: $space-3;
  }

  &__tag {
    display: inline-block;
    padding: $space-1 $space-3;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    border-radius: $border-radius-full;
  }

  &__clear-tags {
    width: 100%;
    padding: $space-2;
    background-color: transparent;
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  &__main {
    min-width: 0;
    width: 100%;

    @media (max-width: 1023px) {
      order: 1;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-16;
    color: var(--color-text-muted);
  }

  &__spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: $space-4;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-16;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-md;
    text-align: center;
  }

  &__error-icon {
    width: 64px;
    height: 64px;
    color: var(--color-error);
    margin-bottom: $space-4;
  }

  &__retry-btn {
    margin-top: $space-4;
    padding: $space-2 $space-4;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: $border-radius-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background-color: #ec7211;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-16;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-md;
    text-align: center;
  }

  &__empty-icon {
    width: 64px;
    height: 64px;
    color: var(--color-text-muted);
    margin-bottom: $space-4;
  }

  &__articles {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-4;
    margin-top: $space-8;
    padding-top: $space-8;
    border-top: 1px solid var(--color-border);
  }

  &__page-btn {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: var(--color-secondary);
      border-color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__page-icon {
    width: 16px;
    height: 16px;
  }

  &__page-numbers {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    font-weight: $font-weight-semibold;
  }

  &__page-current {
    color: var(--color-primary);
  }

  &__page-separator {
    color: var(--color-text-muted);
  }

  &__page-total {
    color: var(--color-text-muted);
  }
}
</style>
