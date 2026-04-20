import { ref } from 'vue';
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  PaginatedResponse,
} from '@monorepo/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useArticleApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const createArticle = async (input: CreateArticleInput): Promise<Article> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('記事の作成に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の作成に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateArticle = async (id: string, input: UpdateArticleInput): Promise<Article> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('記事の更新に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の更新に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const publishArticle = async (id: string, isPublished: boolean): Promise<Article> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${id}/publish`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isPublished }),
      });

      if (!response.ok) {
        throw new Error('記事の公開状態の変更に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の公開状態の変更に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteArticle = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('記事の削除に失敗しました');
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の削除に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getArticle = async (id: string): Promise<Article> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('記事の取得に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の取得に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const listArticles = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Article>> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('記事一覧の取得に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事一覧の取得に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const listMyArticles = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Article>> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/my?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('自分の記事一覧の取得に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '自分の記事一覧の取得に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const searchArticlesByTags = async (
    tags: string[],
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Article>> => {
    loading.value = true;
    error.value = null;

    try {
      const tagsParam = tags.join(',');
      const response = await fetch(
        `${API_BASE_URL}/api/articles/search?tags=${tagsParam}&page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error('記事の検索に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '記事の検索に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createArticle,
    updateArticle,
    publishArticle,
    deleteArticle,
    getArticle,
    listArticles,
    listMyArticles,
    searchArticlesByTags,
  };
}
