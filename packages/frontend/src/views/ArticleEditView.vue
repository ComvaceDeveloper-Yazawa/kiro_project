<template>
  <div class="article-edit-view">
    <div v-if="loadingArticle" class="article-edit-view__loading">読み込み中...</div>

    <div v-else-if="error" class="article-edit-view__error">
      {{ error }}
    </div>

    <div v-else-if="article">
      <div class="article-edit-view__header">
        <h1>記事編集</h1>
        <button
          v-if="!article.isPublished"
          @click="handlePublish"
          :disabled="loading"
          class="article-edit-view__publish-button"
        >
          公開する
        </button>
        <button
          v-else
          @click="handleUnpublish"
          :disabled="loading"
          class="article-edit-view__unpublish-button"
        >
          非公開にする
        </button>
      </div>

      <ArticleForm
        :initial-data="{
          title: article.title,
          content: article.content,
          tags: article.tags,
        }"
        submit-label="更新"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticle } from '../composables/useArticle';
import ArticleForm from '../components/ArticleForm.vue';
import type { UpdateArticleInput } from '@monorepo/shared';

const route = useRoute();
const router = useRouter();
const { article, loading, error, load, update, publish, unpublish } = useArticle();

const articleId = route.params.id as string;
const loadingArticle = ref(true);

const handleSubmit = async (data: UpdateArticleInput) => {
  try {
    await update(articleId, data);
    router.push(`/articles/${articleId}`);
  } catch (e) {
    alert('記事の更新に失敗しました');
  }
};

const handlePublish = async () => {
  if (!confirm('記事を公開しますか？')) return;

  try {
    await publish(articleId);
    alert('記事を公開しました');
  } catch (e) {
    alert('公開に失敗しました');
  }
};

const handleUnpublish = async () => {
  if (!confirm('記事を非公開にしますか？')) return;

  try {
    await unpublish(articleId);
    alert('記事を非公開にしました');
  } catch (e) {
    alert('非公開化に失敗しました');
  }
};

const handleCancel = () => {
  router.push(`/articles/${articleId}`);
};

onMounted(async () => {
  try {
    await load(articleId);
  } finally {
    loadingArticle.value = false;
  }
});
</script>

<style scoped>
.article-edit-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-edit-view__loading,
.article-edit-view__error {
  padding: 2rem;
  text-align: center;
}

.article-edit-view__error {
  color: #dc2626;
}

.article-edit-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.article-edit-view__header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.article-edit-view__publish-button,
.article-edit-view__unpublish-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.article-edit-view__publish-button {
  background: #10b981;
  color: white;
}

.article-edit-view__publish-button:hover:not(:disabled) {
  background: #059669;
}

.article-edit-view__unpublish-button {
  background: #f59e0b;
  color: white;
}

.article-edit-view__unpublish-button:hover:not(:disabled) {
  background: #d97706;
}

.article-edit-view__publish-button:disabled,
.article-edit-view__unpublish-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
