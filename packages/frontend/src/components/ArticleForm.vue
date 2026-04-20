<template>
  <form @submit.prevent="handleSubmit" class="article-form">
    <div class="article-form__field">
      <label for="title" class="article-form__label">タイトル</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="article-form__input"
        placeholder="記事のタイトルを入力"
        required
      />
      <span v-if="errors.title" class="article-form__error">
        {{ errors.title }}
      </span>
    </div>

    <div class="article-form__field">
      <label class="article-form__label">本文</label>
      <div class="article-form__editor-container">
        <div class="article-form__editor-pane">
          <MarkdownEditor v-model="formData.content" placeholder="Markdownで記事を書く..." />
        </div>
        <div class="article-form__preview-pane">
          <MarkdownPreview :markdown="formData.content" />
        </div>
      </div>
      <span v-if="errors.content" class="article-form__error">
        {{ errors.content }}
      </span>
    </div>

    <div class="article-form__field">
      <label for="tags" class="article-form__label">タグ</label>
      <TagInput v-model="formData.tags" />
      <span v-if="errors.tags" class="article-form__error">
        {{ errors.tags }}
      </span>
    </div>

    <div class="article-form__actions">
      <button
        type="submit"
        class="article-form__button article-form__button--primary"
        :disabled="loading"
      >
        {{ submitLabel }}
      </button>
      <button
        type="button"
        @click="handleCancel"
        class="article-form__button article-form__button--secondary"
        :disabled="loading"
      >
        キャンセル
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import MarkdownPreview from './MarkdownPreview.vue';
import TagInput from './TagInput.vue';

interface FormData {
  title: string;
  content: string;
  tags: string[];
}

interface Props {
  initialData?: Partial<FormData>;
  submitLabel?: string;
  loading?: boolean;
}

interface Emits {
  (e: 'submit', data: FormData): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: '保存',
  loading: false,
});

const emit = defineEmits<Emits>();

const formData = reactive<FormData>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
  tags: props.initialData?.tags || [],
});

const errors = reactive<Record<string, string>>({});

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
</script>

<style scoped>
.article-form {
  max-width: 1200px;
  margin: 0 auto;
}

.article-form__field {
  margin-bottom: 1.5rem;
}

.article-form__label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.article-form__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.article-form__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.article-form__editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .article-form__editor-container {
    grid-template-columns: 1fr;
  }
}

.article-form__error {
  display: block;
  margin-top: 0.25rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.article-form__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.article-form__button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
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
  background: #f3f4f6;
  color: #1f2937;
}

.article-form__button--secondary:hover:not(:disabled) {
  background: #e5e7eb;
}
</style>
