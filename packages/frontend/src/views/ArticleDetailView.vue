<template>
  <div class="article-detail-view">
    <div v-if="loading" class="article-detail-view__loading">読み込み中...</div>

    <div v-else-if="error" class="article-detail-view__error">
      {{ error }}
    </div>

    <article v-else-if="article" class="article-detail-view__article">
      <header class="article-detail-view__header">
        <h1>{{ article.title }}</h1>
        <div class="article-detail-view__meta">
          <time :datetime="article.createdAt.toString()">
            {{ formatDate(article.createdAt) }}
          </time>
          <span v-if="article.isPublished && article.publishedAt">
            公開: {{ formatDate(article.publishedAt) }}
          </span>
        </div>
        <div v-if="article.tags.length > 0" class="article-detail-view__tags">
          <span v-for="tag in article.tags" :key="tag" class="article-detail-view__tag">
            #{{ tag }}
          </span>
        </div>
      </header>

      <div class="article-detail-view__content">
        <MarkdownPreview :markdown="article.content" />
      </div>

      <footer class="article-detail-view__footer">
        <router-link to="/articles" class="article-detail-view__back-button">
          一覧に戻る
        </router-link>
        <div v-if="isAuthor" class="article-detail-view__actions">
          <router-link
            :to="`/articles/${article.id}/edit`"
            class="article-detail-view__edit-button"
          >
            編集
          </router-link>
          <button @click="handleDelete" class="article-detail-view__delete-button">削除</button>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticle } from '../composables/useArticle';
import MarkdownPreview from '../components/MarkdownPreview.vue';

const route = useRoute();
const router = useRouter();
const { article, loading, error, load, remove } = useArticle();

const articleId = route.params.id as string;

// TODO: 実際の認証実装後に置き換え
const currentUserId = ref<string | null>(null);
const isAuthor = computed(() => {
  return article.value && currentUserId.value === article.value.authorId;
});

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleDelete = async () => {
  if (!confirm('本当に削除しますか？')) return;

  try {
    await remove(articleId);
    router.push('/articles');
  } catch (e) {
    alert('削除に失敗しました');
  }
};

onMounted(() => {
  load(articleId);
});
</script>

<style scoped>
.article-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-detail-view__loading,
.article-detail-view__error {
  padding: 2rem;
  text-align: center;
}

.article-detail-view__error {
  color: #dc2626;
}

.article-detail-view__header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.article-detail-view__header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.article-detail-view__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.article-detail-view__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.article-detail-view__tag {
  padding: 0.25rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.875rem;
  border-radius: 9999px;
}

.article-detail-view__content {
  margin-bottom: 2rem;
}

.article-detail-view__footer {
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.article-detail-view__back-button,
.article-detail-view__edit-button {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #1f2937;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
}

.article-detail-view__back-button:hover,
.article-detail-view__edit-button:hover {
  background: #e5e7eb;
}

.article-detail-view__actions {
  display: flex;
  gap: 1rem;
}

.article-detail-view__delete-button {
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.article-detail-view__delete-button:hover {
  background: #b91c1c;
}
</style>
