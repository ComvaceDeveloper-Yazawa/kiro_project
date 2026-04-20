<template>
  <div class="article-create-view">
    <h1>新規記事作成</h1>

    <ArticleForm
      submit-label="下書き保存"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useArticle } from '../composables/useArticle';
import ArticleForm from '../components/ArticleForm.vue';
import type { CreateArticleInput } from '@monorepo/shared';

const router = useRouter();
const { loading, create } = useArticle();

const handleSubmit = async (data: CreateArticleInput) => {
  try {
    const article = await create(data);
    router.push(`/articles/${article.id}`);
  } catch (e) {
    alert('記事の作成に失敗しました');
  }
};

const handleCancel = () => {
  router.push('/articles');
};
</script>

<style scoped>
.article-create-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-create-view h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
</style>
