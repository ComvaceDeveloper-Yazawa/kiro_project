<template>
  <form
    @submit.prevent="handleSubmit"
    class="article-form"
    :class="{ 'article-form--fullscreen': isFullscreen }"
  >
    <!-- モダンなツールバー -->
    <div class="article-form__toolbar">
      <div class="article-form__toolbar-left">
        <button
          type="button"
          @click="toggleFullscreen"
          class="article-form__toolbar-button"
          :title="isFullscreen ? '通常表示' : 'フルスクリーン'"
        >
          <ArrowsPointingOutIcon v-if="!isFullscreen" class="article-form__icon" />
          <ArrowsPointingInIcon v-else class="article-form__icon" />
        </button>
        <button
          type="button"
          @click="togglePreview"
          class="article-form__toolbar-button"
          :class="{ 'article-form__toolbar-button--active': showPreview }"
          title="プレビュー表示"
        >
          <EyeIcon class="article-form__icon" />
        </button>
      </div>
      <div class="article-form__toolbar-center">
        <div v-if="autoSaving" class="article-form__autosave-indicator">
          <ArrowPathIcon class="article-form__icon article-form__icon--spin" />
          <span>保存中...</span>
        </div>
        <div
          v-else-if="lastSaved"
          class="article-form__autosave-indicator article-form__autosave-indicator--saved"
        >
          <CheckCircleIcon class="article-form__icon" />
          <span>{{ lastSaved }}に保存済み</span>
        </div>
      </div>
      <div class="article-form__toolbar-right">
        <button
          type="button"
          @click="handleCancel"
          class="article-form__toolbar-button article-form__toolbar-button--secondary"
          :disabled="loading"
        >
          <XMarkIcon class="article-form__icon" />
          <span>キャンセル</span>
        </button>
        <button
          type="submit"
          class="article-form__toolbar-button article-form__toolbar-button--primary"
          :disabled="loading"
        >
          <CheckIcon class="article-form__icon" />
          <span>{{ submitLabel }}</span>
        </button>
      </div>
    </div>

    <div class="article-form__content">
      <!-- タイトル -->
      <div class="article-form__title-container">
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="article-form__title-input"
          placeholder="記事のタイトルを入力..."
          @input="handleTitleInput"
        />
        <span v-if="errors.title" class="article-form__error">
          <ExclamationCircleIcon class="article-form__error-icon" />
          {{ errors.title }}
        </span>
      </div>

      <!-- メタ情報セクション -->
      <div class="article-form__meta-section">
        <!-- タグ -->
        <div class="article-form__meta-item">
          <label class="article-form__meta-label">
            <TagIcon class="article-form__icon" />
            タグ
          </label>
          <TagInput v-model="formData.tags" />
          <span v-if="errors.tags" class="article-form__error">
            <ExclamationCircleIcon class="article-form__error-icon" />
            {{ errors.tags }}
          </span>
        </div>

        <!-- 次に読む記事 -->
        <div
          v-if="availableArticles && availableArticles.length > 0"
          class="article-form__meta-item"
        >
          <label for="nextArticle" class="article-form__meta-label">
            <ArrowRightCircleIcon class="article-form__icon" />
            次に読む記事
          </label>
          <div class="article-form__select-wrapper">
            <select id="nextArticle" v-model="formData.nextArticleId" class="article-form__select">
              <option :value="null">選択しない</option>
              <option v-for="article in availableArticles" :key="article.id" :value="article.id">
                {{ article.title }}
              </option>
            </select>
            <ChevronDownIcon class="article-form__select-icon" />
          </div>
          <p class="article-form__hint">この記事を読み終えた後に表示される記事を選択できます</p>
        </div>
      </div>

      <!-- エディタ -->
      <div class="article-form__editor-section">
        <div class="article-form__editor-header">
          <div class="article-form__editor-tabs">
            <button
              type="button"
              class="article-form__editor-tab"
              :class="{ 'article-form__editor-tab--active': !showPreview }"
              @click="showPreview = false"
            >
              <PencilIcon class="article-form__icon" />
              編集
            </button>
            <button
              type="button"
              class="article-form__editor-tab"
              :class="{ 'article-form__editor-tab--active': showPreview }"
              @click="showPreview = true"
            >
              <EyeIcon class="article-form__icon" />
              プレビュー
            </button>
          </div>
        </div>

        <div class="article-form__editor-wrapper">
          <div
            class="article-form__editor-container"
            :class="{ 'article-form__editor-container--split': showPreview }"
          >
            <div class="article-form__editor-pane">
              <MarkdownEditor
                v-model="formData.content"
                placeholder="本文を入力... Markdownがサポートされています"
                @input="handleContentInput"
                @drop="handleDrop"
                @dragover.prevent
              />
            </div>
            <div v-if="showPreview" class="article-form__preview-pane">
              <div class="article-form__preview-header">
                <DocumentTextIcon class="article-form__icon" />
                プレビュー
              </div>
              <MarkdownPreview :markdown="formData.content" />
            </div>
          </div>
          <span v-if="errors.content" class="article-form__error">
            <ExclamationCircleIcon class="article-form__error-icon" />
            {{ errors.content }}
          </span>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TagIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  PencilIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline';
import MarkdownEditor from './MarkdownEditor.vue';
import MarkdownPreview from './MarkdownPreview.vue';
import TagInput from './TagInput.vue';
import { useImageUpload } from '../composables/useImageUpload';

interface FormData {
  title: string;
  content: string;
  tags: string[];
  coverImage?: string | undefined;
  nextArticleId?: string | null | undefined;
}

interface Props {
  initialData?: Partial<FormData>;
  submitLabel?: string;
  loading?: boolean;
  enableAutoSave?: boolean;
  availableArticles?: Array<{ id: string; title: string }>; // 選択可能な記事リスト
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
  availableArticles: () => [],
});

const emit = defineEmits<Emits>();

const formData = reactive<FormData>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
  tags: props.initialData?.tags || [],
  coverImage: props.initialData?.coverImage,
  nextArticleId: props.initialData?.nextArticleId,
});

const errors = reactive<Record<string, string>>({});
const isFullscreen = ref(false);
const showPreview = ref(false);
const showCoverUpload = ref(false);
const coverInputRef = ref<HTMLInputElement | null>(null);
const autoSaving = ref(false);
const lastSaved = ref<string>('');
const autoSaveTimer = ref<number | null>(null);

const { uploadImage, loading: uploadingImage } = useImageUpload();

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
  emit('submit', {
    title: formData.title,
    content: formData.content,
    tags: formData.tags,
    coverImage: formData.coverImage ?? undefined,
    nextArticleId: formData.nextArticleId ?? null,
  });
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
  formData.coverImage = undefined as string | undefined;
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
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.article-form--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}

/* モダンなツールバー */
.article-form__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(var(--color-surface-rgb, 242, 243, 243), 0.95);
}

[data-theme='dark'] .article-form__toolbar {
  background: rgba(22, 32, 46, 0.95);
}

.article-form__toolbar-left,
.article-form__toolbar-center,
.article-form__toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.article-form__toolbar-center {
  flex: 1;
  justify-content: center;
}

.article-form__toolbar-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  transition: all 0.2s;
}

.article-form__toolbar-button:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.article-form__toolbar-button--active {
  background: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

.article-form__toolbar-button--primary {
  background: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

.article-form__toolbar-button--primary:hover {
  opacity: 0.9;
}

.article-form__toolbar-button--secondary {
  background: transparent;
  color: var(--color-text-muted);
}

.article-form__toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.article-form__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.article-form__icon--spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.article-form__autosave-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  padding: 0.5rem 1rem;
  background: var(--color-background);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.article-form__autosave-indicator--saved {
  color: var(--color-success);
  border-color: var(--color-success);
}

/* コンテンツエリア */
.article-form__content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* タイトル */
.article-form__title-container {
  margin-bottom: 2rem;
}

.article-form__title-input {
  width: 100%;
  padding: 1rem 0;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
  background: transparent;
  transition: border-color 0.2s;
}

.article-form__title-input:focus {
  outline: none;
  border-bottom-color: var(--color-primary);
}

.article-form__title-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.4;
}

/* メタ情報セクション */
.article-form__meta-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.article-form__meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-form__meta-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.article-form__select-wrapper {
  position: relative;
}

.article-form__select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
}

.article-form__select:hover {
  border-color: var(--color-primary);
}

.article-form__select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
}

.article-form__select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.article-form__hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* エディタセクション */
.article-form__editor-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.article-form__editor-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.article-form__editor-tabs {
  display: flex;
  gap: 0.5rem;
}

.article-form__editor-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.article-form__editor-tab:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.article-form__editor-tab--active {
  background: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

.article-form__editor-wrapper {
  min-height: 500px;
}

.article-form__editor-container {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 500px;
}

.article-form__editor-container--split {
  grid-template-columns: 1fr 1fr;
}

.article-form__editor-pane {
  padding: 1.5rem;
  min-height: 500px;
}

.article-form__preview-pane {
  padding: 1.5rem;
  border-left: 1px solid var(--color-border);
  background: var(--color-background);
  overflow-y: auto;
  max-height: 800px;
}

.article-form__preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.article-form__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(209, 50, 18, 0.1);
  border: 1px solid var(--color-error);
  border-radius: 0.5rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.article-form__error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* レスポンシブ */
@media (max-width: 1024px) {
  .article-form__editor-container--split {
    grid-template-columns: 1fr;
  }

  .article-form__preview-pane {
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 768px) {
  .article-form__content {
    padding: 1rem;
  }

  .article-form__title-input {
    font-size: 2rem;
  }

  .article-form__toolbar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }

  .article-form__toolbar-center {
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }

  .article-form__meta-section {
    grid-template-columns: 1fr;
  }

  .article-form__toolbar-button span {
    display: none;
  }
}
</style>
