<template>
  <div class="markdown-editor">
    <div class="markdown-editor__toolbar">
      <button
        type="button"
        @click="insertBold"
        class="markdown-editor__button"
        title="太字 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        @click="insertItalic"
        class="markdown-editor__button"
        title="斜体 (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        @click="insertLink"
        class="markdown-editor__button"
        title="リンク (Ctrl+K)"
      >
        🔗
      </button>
      <button
        type="button"
        @click="insertCode"
        class="markdown-editor__button"
        title="コード (Ctrl+E)"
      >
        &lt;/&gt;
      </button>
      <button type="button" @click="insertHeading" class="markdown-editor__button" title="見出し">
        H
      </button>
      <button type="button" @click="insertImage" class="markdown-editor__button" title="画像">
        🖼️
      </button>
      <button
        type="button"
        @click="insertCodeBlock"
        class="markdown-editor__button"
        title="コードブロック"
      >
        { }
      </button>
    </div>

    <textarea
      ref="textareaRef"
      v-model="localValue"
      @input="handleInput"
      @keydown="handleKeydown"
      class="markdown-editor__textarea"
      :placeholder="placeholder"
      spellcheck="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'input'): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "本文を入力... '/' でコマンドを表示",
});

const emit = defineEmits<Emits>();

const localValue = ref(props.modelValue);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  },
);

const handleInput = () => {
  emit('update:modelValue', localValue.value);
  emit('input');
};

const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + B: 太字
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    insertBold();
  }
  // Ctrl/Cmd + I: 斜体
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault();
    insertItalic();
  }
  // Ctrl/Cmd + K: リンク
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    insertLink();
  }
  // Ctrl/Cmd + E: コード
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    insertCode();
  }
};

const insertText = (before: string, after: string = '', placeholder: string = '') => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = localValue.value.substring(start, end) || placeholder;

  const newText =
    localValue.value.substring(0, start) +
    before +
    selectedText +
    after +
    localValue.value.substring(end);

  localValue.value = newText;
  emit('update:modelValue', newText);
  emit('input');

  // カーソル位置を調整
  setTimeout(() => {
    textarea.focus();
    const newStart = start + before.length;
    const newEnd = newStart + selectedText.length;
    textarea.setSelectionRange(newStart, newEnd);
  }, 0);
};

const insertBold = () => insertText('**', '**', '太字テキスト');
const insertItalic = () => insertText('*', '*', '斜体テキスト');
const insertLink = () => insertText('[', '](https://example.com)', 'リンクテキスト');
const insertCode = () => insertText('`', '`', 'コード');
const insertHeading = () => insertText('## ', '', '見出し');
const insertImage = () => insertText('![', '](https://example.com/image.jpg)', '画像の説明');
const insertCodeBlock = () => insertText('```javascript\n', '\n```', 'コードをここに入力');
</script>

<style scoped>
.markdown-editor {
  border: none;
  border-radius: 0;
  overflow: visible;
}

.markdown-editor__toolbar {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 0;
  background: transparent;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.markdown-editor__button {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: #6b7280;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.markdown-editor__button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.markdown-editor__button:active {
  background: #f3f4f6;
}

.markdown-editor__textarea {
  width: 100%;
  min-height: 500px;
  padding: 0;
  border: none;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  resize: vertical;
  color: #111827;
  background: transparent;
}

.markdown-editor__textarea:focus {
  outline: none;
}

.markdown-editor__textarea::placeholder {
  color: #d1d5db;
}

/* コードブロック風のフォント */
.markdown-editor__textarea:has(+ .code-mode) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .markdown-editor__toolbar {
    padding: 0.5rem 0;
  }

  .markdown-editor__button {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    min-width: 32px;
  }

  .markdown-editor__textarea {
    font-size: 0.9375rem;
    min-height: 400px;
  }
}
</style>
