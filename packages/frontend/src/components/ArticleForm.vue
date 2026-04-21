<template>
  <form
    @submit.prevent="handleSubmit"
    class="article-form"
    :class="{ 'article-form--fullscreen': isFullscreen }"
  >
    <!-- ツールバー -->
    <div class="article-form__toolbar">
      <div class="article-form__toolbar-left">
        <button
          type="button"
          @click="toggleFullscreen"
          class="article-form__toolbar-button"
          title="フルスクリーンモード"
        >
          {{ isFullscreen ? '📐' : '⛶' }}
        </button>
        <button
          type="button"
          @click="togglePreview"
          class="article-form__toolbar-button"
          :class="{ 'article-form__toolbar-button--active': showPreview }"
          title="プレビュー表示"
        >
          👁️
        </button>
      </div>
      <div class="article-form__toolbar-right">
        <span v-if="autoSaving" class="article-form__autosave-indicator">保存中...</span>
        <span v-else-if="lastSaved" class="article-form__autosave-indicator">
          {{ lastSaved }}に保存済み
        </span>
      </div>
    </div>

    <!-- カバー画像 -->
    <div class="article-form__cover" v-if="formData.coverImage || showCoverUpload">
      <div v-if="formData.coverImage" class="article-form__cover-preview">
        <img :src="formData.coverImage" alt="カバー画像" />
        <button
          type="button"
          @click="removeCoverImage"
          class="article-form__cover-remove"
          title="カバー画像を削除"
        >
          ✕
        </button>
      </div>
      <div v-else class="article-form__cover-upload">
        <input
          type="file"
          ref="coverInputRef"
          @change="handleCoverUpload"
          accept="image/*"
          class="article-form__cover-input"
        />
        <button type="button" @click="triggerCoverUpload" class="article-form__cover-upload-button">
          📷 カバー画像を追加
        </button>
      </div>
    </div>
    <button v-else type="button" @click="showCoverUpload = true" class="article-form__add-cover">
      カバー画像を追加
    </button>

    <!-- タイトル -->
    <div class="article-form__title-container">
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="article-form__title-input"
        placeholder="無題"
        @input="handleTitleInput"
      />
      <span v-if="errors.title" class="article-form__error">
        {{ errors.title }}
      </span>
    </div>

    <!-- タグ -->
    <div class="article-form__tags-container">
      <TagInput v-model="formData.tags" />
      <span v-if="errors.tags" class="article-form__error">
        {{ errors.tags }}
      </span>
    </div>

    <!-- エディタ -->
    <div class="article-form__editor-wrapper">
      <div
        class="article-form__editor-container"
        :class="{ 'article-form__editor-container--split': showPreview }"
      >
        <div class="article-form__editor-pane">
          <MarkdownEditor
            v-model="formData.content"
            placeholder="本文を入力... '/' でコマンドを表示"
            @input="handleContentInput"
            @drop="handleDrop"
            @dragover.prevent
          />
        </div>
        <div v-if="showPreview" class="article-form__preview-pane">
          <div class="article-form__preview-label">プレビュー</div>
          <MarkdownPreview :markdown="formData.content" />
        </div>
      </div>
      <span v-if="errors.content" class="article-form__error">
        {{ errors.content }}
      </span>
    </div>

    <!-- アクション -->
    <div class="article-form__actions">
      <button
        type="button"
        @click="handleCancel"
        class="article-form__button article-form__button--secondary"
        :disabled="loading"
      >
        キャンセル
      </button>
      <button
        type="submit"
        class="article-form__button article-form__button--primary"
        :disabled="loading"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import MarkdownPreview from './MarkdownPreview.vue';
import TagInput from './TagInput.vue';
import { useImageUpload } from '../composables/useImageUpload';

interface FormData {
  title: string;
  content: string;
  tags: string[];
  coverImage?: string;
}

interface Props {
  initialData?: Partial<FormData>;
  submitLabel?: string;
  loading?: boolean;
  enableAutoSave?: boolean;
}

interface Emits {
  (e: 'submit', data: FormData): void;
  (e: 'cancel'): void;
  (e: 'autoSave', data: FormData): void;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: '保存',
  loading: false,
  enableAutoSave: true,
});

const emit = defineEmits<Emits>();

const formData = reactive<FormData>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
  tags: props.initialData?.tags || [],
  coverImage: props.initialData?.coverImage,
});

const errors = reactive<Record<string, string>>({});
const isFullscreen = ref(false);
const showPreview = ref(false);
const showCoverUpload = ref(false);
const coverInputRef = ref<HTMLInputElement | null>(null);
const autoSaving = ref(false);
const lastSaved = ref<string>('');
const autoSaveTimer = ref<number | null>(null);

const { uploadImage, uploading } = useImageUpload();

const validate = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!formData.title.trim()) {
    errors.title = 'タイトルは必須です';
  }

  if (formData.title.length > 200) {
    errors.title = 'タイトルは200文字以内で入力してください';
  }

  if (!formData.content.trim()) {
    errors.content = '本文は必須です';
  }

  if (formData.tags.length > 10) {
    errors.tags = 'タグは10個まで設定できます';
  }

  return Object.keys(errors).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit('submit', { ...formData });
};

const handleCancel = () => {
  emit('cancel');
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

const handleCoverUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadImage(file);
    formData.coverImage = result.url;
  } catch (error) {
    console.error('カバー画像のアップロードエラー:', error);
    alert(
      '画像のアップロードに失敗しました: ' +
        (error instanceof Error ? error.message : '不明なエラー'),
    );
  }
};

const removeCoverImage = () => {
  formData.coverImage = undefined;
  showCoverUpload.value = false;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  try {
    const result = await uploadImage(file);
    // カーソル位置に画像を挿入
    formData.content += `\n![${file.name}](${result.url})\n`;
  } catch (error) {
    console.error('画像のアップロードエラー:', error);
    alert(
      '画像のアップロードに失敗しました: ' +
        (error instanceof Error ? error.message : '不明なエラー'),
    );
  }
};

const scheduleAutoSave = () => {
  if (!props.enableAutoSave) return;

  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value);
  }

  autoSaveTimer.value = window.setTimeout(async () => {
    autoSaving.value = true;
    try {
      emit('autoSave', { ...formData });
      const now = new Date();
      lastSaved.value = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    } finally {
      autoSaving.value = false;
    }
  }, 3000); // 3秒後に自動保存
};

const handleTitleInput = () => {
  scheduleAutoSave();
};

const handleContentInput = () => {
  scheduleAutoSave();
};

// クリーンアップ
onUnmounted(() => {
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value);
  }
  document.body.style.overflow = '';
});

// ESCキーでフルスクリーン解除
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen.value) {
      toggleFullscreen();
    }
  };
  window.addEventListener('keydown', handleEscape);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
.article-form {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  position: relative;
}

.article-form--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: none;
  z-index: 1000;
  overflow-y: auto;
  padding: 0;
}

/* ツールバー */
.article-form__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.article-form__toolbar-left,
.article-form__toolbar-right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.article-form__toolbar-button {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.article-form__toolbar-button:hover {
  background: #f9fafb;
}

.article-form__toolbar-button--active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.article-form__autosave-indicator {
  font-size: 0.875rem;
  color: #6b7280;
}

/* カバー画像 */
.article-form__add-cover {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  background: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.article-form__add-cover:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.article-form__cover {
  margin-bottom: 2rem;
}

.article-form__cover-preview {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0.5rem;
}

.article-form__cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-form__cover-remove {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.article-form__cover-remove:hover {
  background: rgba(0, 0, 0, 0.8);
}

.article-form__cover-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.article-form__cover-input {
  display: none;
}

.article-form__cover-upload-button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.article-form__cover-upload-button:hover {
  background: #f3f4f6;
}

/* タイトル */
.article-form__title-container {
  padding: 2rem 4rem 1rem;
}

.article-form__title-input {
  width: 100%;
  padding: 0;
  border: none;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  background: transparent;
}

.article-form__title-input:focus {
  outline: none;
}

.article-form__title-input::placeholder {
  color: #d1d5db;
}

/* タグ */
.article-form__tags-container {
  padding: 0 4rem 1rem;
}

/* エディタ */
.article-form__editor-wrapper {
  padding: 0 4rem 4rem;
}

.article-form__editor-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  min-height: 500px;
}

.article-form__editor-container--split {
  grid-template-columns: 1fr 1fr;
}

.article-form__preview-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-form__error {
  display: block;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

/* アクション */
.article-form__actions {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 2rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.article-form__button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.article-form__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.article-form__button--primary {
  background: #3b82f6;
  color: white;
}

.article-form__button--primary:hover:not(:disabled) {
  background: #2563eb;
}

.article-form__button--secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.article-form__button--secondary:hover:not(:disabled) {
  background: #f9fafb;
}

/* レスポンシブ */
@media (max-width: 1024px) {
  .article-form__editor-container--split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .article-form__title-container,
  .article-form__tags-container,
  .article-form__editor-wrapper {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .article-form__title-input {
    font-size: 2rem;
  }

  .article-form__toolbar {
    padding: 0.75rem 1rem;
  }
}
</style>
