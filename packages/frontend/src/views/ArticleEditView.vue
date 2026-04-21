<template>
  <div class="article-edit-view">
    <div v-if="loadingArticle" class="article-edit-view__loading">
      <div class="article-edit-view__spinner"></div>
      <p>読み込み中...</p>
    </div>

    <div v-else-if="error" class="article-edit-view__error">
      <p>{{ error }}</p>
      <button @click="$router.push('/articles')" class="article-edit-view__error-button">
        記事一覧に戻る
      </button>
    </div>

    <div v-else-if="article">
      <ArticleForm
        :initial-data="{
          title: article.title,
          content: article.content,
          tags: article.tags.map((tag) => tag.name),
        }"
        submit-label="更新"
        :loading="loading"
        :enable-auto-save="true"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @auto-save="handleAutoSave"
      />

      <!-- フローティングアクションボタン -->
      <div class="article-edit-view__fab">
        <button
          v-if="!article.isPublished"
          @click="handlePublish"
          :disabled="loading"
          class="article-edit-view__fab-button article-edit-view__fab-button--publish"
          title="記事を公開"
        >
          🚀 公開
        </button>
        <button
          v-else
          @click="handleUnpublish"
          :disabled="loading"
          class="article-edit-view__fab-button article-edit-view__fab-button--unpublish"
          title="記事を非公開にする"
        >
          🔒 非公開
        </button>
      </div>
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

const handleAutoSave = async (data: UpdateArticleInput) => {
  // 自動保存ロジック
  try {
    await update(articleId, data);
    console.log('自動保存完了');
  } catch (e) {
    console.error('自動保存失敗', e);
  }
};

const handlePublish = async () => {
  if (!confirm('記事を公開しますか？公開すると全てのユーザーが閲覧できるようになります。')) return;

  try {
    await publish(articleId);
    alert('✅ 記事を公開しました');
    await load(articleId); // 再読み込み
  } catch (e) {
    alert('公開に失敗しました');
  }
};

const handleUnpublish = async () => {
  if (!confirm('記事を非公開にしますか？')) return;

  try {
    await unpublish(articleId);
    alert('✅ 記事を非公開にしました');
    await load(articleId); // 再読み込み
  } catch (e) {
    alert('非公開化に失敗しました');
  }
};

const handleCancel = () => {
  if (confirm('編集内容が失われますが、よろしいですか？')) {
    router.push(`/articles/${articleId}`);
  }
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
  min-height: 100vh;
  background: #ffffff;
  position: relative;
}

.article-edit-view__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #6b7280;
}

.article-edit-view__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.article-edit-view__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.article-edit-view__error p {
  color: #dc2626;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.article-edit-view__error-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.article-edit-view__error-button:hover {
  background: #2563eb;
}

/* フローティングアクションボタン */
.article-edit-view__fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
}

.article-edit-view__fab-button {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-edit-view__fab-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.article-edit-view__fab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.article-edit-view__fab-button--publish {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.article-edit-view__fab-button--unpublish {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

@media (max-width: 768px) {
  .article-edit-view__fab {
    bottom: 1rem;
    right: 1rem;
  }

  .article-edit-view__fab-button {
    padding: 0.875rem 1.25rem;
    font-size: 0.8125rem;
  }
}
</style>
