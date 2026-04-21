<template>
  <div class="article-create-view">
    <ArticleForm
      submit-label="公開"
      :loading="loading"
      :enable-auto-save="false"
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
    // 公開フラグを追加して記事を作成
    const payload = {
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      isPublished: true,
    };
    console.log('📤 記事作成リクエスト:', payload);
    const article = await create(payload);
    console.log('✅ 記事作成成功:', article);
    router.push(`/articles/${article.id}`);
  } catch (e) {
    console.error('❌ 記事作成失敗:', e);
    alert('記事の作成に失敗しました');
  }
};

const handleCancel = () => {
  if (confirm('編集内容が失われますが、よろしいですか？')) {
    router.push('/articles');
  }
};
</script>

<style scoped>
.article-create-view {
  min-height: 100vh;
  background: #ffffff;
}
</style>
