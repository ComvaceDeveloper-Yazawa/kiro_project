import { ref } from 'vue';
import type { Tag } from '@monorepo/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useTagApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const listTags = async (): Promise<Tag[]> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tags`);

      if (!response.ok) {
        throw new Error('タグ一覧の取得に失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タグ一覧の取得に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    listTags,
  };
}
