import { ref } from 'vue';
import type { ArticleImage } from '@monorepo/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useImageUpload() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const previewUrl = ref<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const validateImage = (file: File): boolean => {
    error.value = null;

    // ファイルサイズチェック（5MB以下）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      error.value = '画像ファイルは5MB以下にしてください';
      return false;
    }

    // 拡張子チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      error.value = '画像ファイルはjpg, jpeg, png, gif, webp形式のみ対応しています';
      return false;
    }

    return true;
  };

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File, articleId: string): Promise<ArticleImage> => {
    if (!validateImage(file)) {
      throw new Error(error.value || '画像のバリデーションに失敗しました');
    }

    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('articleId', articleId);

      const response = await fetch(`${API_BASE_URL}/api/images`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      return await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '画像のアップロードに失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteImage = async (imageId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('画像の削除に失敗しました');
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '画像の削除に失敗しました';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const clearPreview = () => {
    previewUrl.value = null;
  };

  return {
    loading,
    error,
    previewUrl,
    validateImage,
    createPreview,
    uploadImage,
    deleteImage,
    clearPreview,
  };
}
