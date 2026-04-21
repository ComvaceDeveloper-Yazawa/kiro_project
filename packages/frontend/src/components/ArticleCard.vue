<template>
  <article class="article-card">
    <div class="article-card__header">
      <h2 class="article-card__title">
        <router-link :to="`/articles/${article.id}`">
          {{ article.title }}
        </router-link>
      </h2>
      <span v-if="!article.isPublished" class="article-card__draft-badge"> 下書き </span>
    </div>

    <div class="article-card__meta">
      <time :datetime="article.createdAt.toString()">
        {{ formatDate(article.createdAt) }}
      </time>
      <span v-if="article.isPublished && article.publishedAt">
        公開: {{ formatDate(article.publishedAt) }}
      </span>
    </div>

    <div class="article-card__content">
      {{ truncateContent(article.content, 150) }}
    </div>

    <div v-if="article.tags.length > 0" class="article-card__tags">
      <span v-for="tag in article.tags" :key="tag.id" class="article-card__tag">
        #{{ tag.name }}
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '@monorepo/shared';

interface Props {
  article: Article;
}

defineProps<Props>();

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const truncateContent = (content: string, maxLength: number): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};
</script>

<style scoped>
.article-card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  transition: box-shadow 0.2s;
}

.article-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.article-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.article-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.article-card__title a {
  color: #1f2937;
  text-decoration: none;
}

.article-card__title a:hover {
  color: #3b82f6;
}

.article-card__draft-badge {
  padding: 0.25rem 0.5rem;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.75rem;
  border-radius: 0.25rem;
}

.article-card__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.article-card__content {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.article-card__tag {
  padding: 0.25rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.875rem;
  border-radius: 9999px;
}
</style>
