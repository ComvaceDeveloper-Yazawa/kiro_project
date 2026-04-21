<template>
  <div class="my-articles-view">
    <h1>自分の記事</h1>

    <div v-if="loading" class="my-articles-view__loading">読み込み中...</div>

    <div v-else-if="error" class="my-articles-view__error">
      {{ error }}
    </div>

    <div v-else-if="articles.length === 0" class="my-articles-view__empty">記事がありません</div>

    <div v-else class="my-articles-view__articles">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <div v-if="pagination.totalPages > 1" class="my-articles-view__pagination">
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="my-articles-view__page-button"
      >
        前へ
      </button>
      <span class="my-articles-view__page-info">
        {{ pagination.page }} / {{ pagination.totalPages }}
      </span>
      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="my-articles-view__page-button"
      >
        次へ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArticleApi } from '../composables/useArticleApi';
import ArticleCard from '../components/ArticleCard.vue';
import type { Article } from '@monorepo/shared';

const api = useArticleApi();
const articles = ref<Article[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

const loadArticles = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await api.listMyArticles(pagination.value.page, pagination.value.limit);
    articles.value = result.articles;
    pagination.value = result.pagination;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '記事の取得に失敗しました';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  pagination.value.page = page;
  loadArticles();
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.my-articles-view {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.my-articles-view h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.my-articles-view__loading,
.my-articles-view__error,
.my-articles-view__empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.my-articles-view__error {
  color: #dc2626;
}

.my-articles-view__articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
}

.my-articles-view__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.my-articles-view__page-button {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
}

.my-articles-view__page-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.my-articles-view__page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.my-articles-view__page-info {
  font-weight: 600;
}
</style>
