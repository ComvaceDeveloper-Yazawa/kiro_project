import { ref, computed } from 'vue';
import type { Article, CreateArticleInput, UpdateArticleInput } from '@monorepo/shared';
import { CreateArticleSchema, UpdateArticleSchema } from '@monorepo/shared';
import { useArticleApi } from './useArticleApi';

export function useArticle() {
  const api = useArticleApi();
  const article = ref<Article | null>(null);
  const validationErrors = ref<Record<string, string>>({});

  const isPublished = computed(() => article.value?.isPublished ?? false);
  const canPublish = computed(() => {
    if (!article.value) return false;
    return article.value.title.trim().length > 0 && article.value.content.trim().length > 0;
  });

  const validateCreateInput = (input: CreateArticleInput): boolean => {
    validationErrors.value = {};

    try {
      CreateArticleSchema.parse(input);
      return true;
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          validationErrors.value[field] = err.message;
        });
      }
      return false;
    }
  };

  const validateUpdateInput = (input: UpdateArticleInput): boolean => {
    validationErrors.value = {};

    try {
      UpdateArticleSchema.parse(input);
      return true;
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          validationErrors.value[field] = err.message;
        });
      }
      return false;
    }
  };

  const create = async (input: CreateArticleInput): Promise<Article> => {
    if (!validateCreateInput(input)) {
      throw new Error('入力内容に誤りがあります');
    }

    const created = await api.createArticle(input);
    article.value = created;
    return created;
  };

  const update = async (id: string, input: UpdateArticleInput): Promise<Article> => {
    if (!validateUpdateInput(input)) {
      throw new Error('入力内容に誤りがあります');
    }

    const updated = await api.updateArticle(id, input);
    article.value = updated;
    return updated;
  };

  const publish = async (id: string): Promise<Article> => {
    const published = await api.publishArticle(id, true);
    article.value = published;
    return published;
  };

  const unpublish = async (id: string): Promise<Article> => {
    const unpublished = await api.publishArticle(id, false);
    article.value = unpublished;
    return unpublished;
  };

  const remove = async (id: string): Promise<void> => {
    await api.deleteArticle(id);
    article.value = null;
  };

  const load = async (id: string): Promise<Article> => {
    const loaded = await api.getArticle(id);
    article.value = loaded;
    return loaded;
  };

  const clear = () => {
    article.value = null;
    validationErrors.value = {};
  };

  return {
    article,
    validationErrors,
    isPublished,
    canPublish,
    loading: api.loading,
    error: api.error,
    validateCreateInput,
    validateUpdateInput,
    create,
    update,
    publish,
    unpublish,
    remove,
    load,
    clear,
  };
}
