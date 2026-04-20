<template>
  <div class="image-uploader">
    <div v-if="previewUrl" class="image-uploader__preview">
      <img :src="previewUrl" alt="プレビュー" class="image-uploader__image" />
      <button type="button" @click="handleClear" class="image-uploader__clear">削除</button>
    </div>

    <div v-else class="image-uploader__dropzone">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="image-uploader__input"
      />
      <div class="image-uploader__label">
        <span class="image-uploader__icon">📷</span>
        <p>画像をドラッグ＆ドロップまたはクリックして選択</p>
        <p class="image-uploader__hint">JPG, PNG, GIF, WebP（最大5MB）</p>
      </div>
    </div>

    <div v-if="error" class="image-uploader__error">
      {{ error }}
    </div>

    <button
      v-if="selectedFile && !uploaded"
      type="button"
      @click="handleUpload"
      :disabled="loading"
      class="image-uploader__upload-button"
    >
      {{ loading ? 'アップロード中...' : 'アップロード' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useImageUpload } from '../composables/useImageUpload';

interface Props {
  articleId: string;
}

interface Emits {
  (e: 'uploaded', imageUrl: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { loading, error, previewUrl, validateImage, createPreview, uploadImage, clearPreview } =
  useImageUpload();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploaded = ref(false);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (!validateImage(file)) return;

  selectedFile.value = file;
  createPreview(file);
  uploaded.value = false;
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  try {
    const result = await uploadImage(selectedFile.value, props.articleId);
    uploaded.value = true;
    emit('uploaded', result.url);
  } catch (e) {
    console.error('Upload failed:', e);
  }
};

const handleClear = () => {
  selectedFile.value = null;
  uploaded.value = false;
  clearPreview();
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
</script>

<style scoped>
.image-uploader {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
}

.image-uploader__preview {
  position: relative;
  text-align: center;
}

.image-uploader__image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 0.5rem;
}

.image-uploader__clear {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.image-uploader__clear:hover {
  background: #b91c1c;
}

.image-uploader__dropzone {
  position: relative;
  cursor: pointer;
}

.image-uploader__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.image-uploader__label {
  text-align: center;
  padding: 2rem;
}

.image-uploader__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.image-uploader__hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.image-uploader__error {
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.image-uploader__upload-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.image-uploader__upload-button:hover:not(:disabled) {
  background: #2563eb;
}

.image-uploader__upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
