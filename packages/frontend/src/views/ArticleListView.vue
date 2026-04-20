<template>
  <div class="article-list-view">
    <div class="article-list-view__header">
      <h1>技術ブログ</h1>
      <router-link to="/articles/new" class="article-list-view__create-button">
        新規記事作成
      </router-link>
    </div>

    <div class="article-list-view__content">
      <aside class="article-list-view__sidebar">
        <TagFilter @update:selectedTags="handleTagFilter" />
      </aside>

      <main class="article-list-view__main">
        <div v-if="loading" class="article-list-view__loading">読み込み中...</div>

        <div v-else-if="error" class="article-list-view__error">
          {{ error }}
        </div>

        <div v-else-if="articles.length === 0" class="article-list-view__empty">
          記事がありません
        </div>

        <div v-else class="article-list-view__articles">
          <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>

        <div v-if="pagination.totalPages > 1" class="article-list-view__pagination">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="article-list-view__page-button"
          >
            前へ
          </button>
          <span class="article-list-view__page-info">
            {{ pagination.page }} / {{ pagination.totalPages }}
          </span>
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="article-list-view__page-button"
          >
            次へ
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArticleApi } from '../composables/useArticleApi';
import ArticleCard from '../components/ArticleCard.vue';
import TagFilter from '../components/TagFilter.vue';
import type { Article } from '@monorepo/shared';

const api = useArticleApi();
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

    articles.value = result.articles;
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
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.article-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-list-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.article-list-view__header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.article-list-view__create-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
}

.article-list-view__create-button:hover {
  background: #2563eb;
}

.article-list-view__content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .article-list-view__content {
    grid-template-columns: 1fr;
  }
}

.article-list-view__loading,
.article-list-view__error,
.article-list-view__empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.article-list-view__error {
  color: #dc2626;
}

.article-list-view__articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-list-view__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.article-list-view__page-button {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
}

.article-list-view__page-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.article-list-view__page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.article-list-view__page-info {
  font-weight: 600;
}
</style>
