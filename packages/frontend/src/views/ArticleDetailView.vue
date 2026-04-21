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
          <span v-for="tag in article.tags" :key="tag.id" class="article-detail-view__tag">
            #{{ tag.name }}
          </span>
        </div>
      </header>

      <div class="article-detail-view__content">
        <MarkdownPreview :markdown="article.content" />
      </div>

      <!-- 次に読む記事 -->
      <div v-if="article.nextArticle" class="article-detail-view__next-article">
        <h3 class="article-detail-view__next-article-title">次に読む</h3>
        <router-link
          :to="`/articles/${article.nextArticle.id}`"
          class="article-detail-view__next-article-link"
        >
          <div class="article-detail-view__next-article-card">
            <span class="article-detail-view__next-article-label">次の記事</span>
            <h4 class="article-detail-view__next-article-name">{{ article.nextArticle.title }}</h4>
            <svg
              class="article-detail-view__next-article-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </router-link>
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
import { useAuthStore } from '../stores/useAuthStore';
import MarkdownPreview from '../components/MarkdownPreview.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { article, loading, error, load, remove } = useArticle();

const articleId = route.params.id as string;

const isAuthor = computed(() => {
  return article.value && authStore.user?.id === article.value.authorId;
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
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.article-detail-view__loading,
.article-detail-view__error {
  padding: 2rem;
  text-align: center;
}

.article-detail-view__error {
  color: var(--color-error);
}

.article-detail-view__header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
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
  color: var(--color-text-muted);
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
  width: 100%;
}

.article-detail-view__next-article {
  margin-bottom: 2rem;
  padding: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  width: 100%;
}

.article-detail-view__next-article-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.article-detail-view__next-article-link {
  text-decoration: none;
  display: block;
}

.article-detail-view__next-article-card {
  position: relative;
  padding: 1.5rem;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-detail-view__next-article-card:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.article-detail-view__next-article-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.article-detail-view__next-article-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.article-detail-view__next-article-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.article-detail-view__article {
  width: 100%;
  max-width: 100%;
}

.article-detail-view__footer {
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  width: 100%;
}

.article-detail-view__back-button,
.article-detail-view__edit-button {
  padding: 0.75rem 1.5rem;
  background: var(--color-surface);
  color: var(--color-text);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.article-detail-view__back-button:hover,
.article-detail-view__edit-button:hover {
  background: var(--color-border);
}

.article-detail-view__actions {
  display: flex;
  gap: 1rem;
}

.article-detail-view__delete-button {
  padding: 0.75rem 1.5rem;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.article-detail-view__delete-button:hover {
  opacity: 0.9;
}
</style>
