<template>
  <div class="markdown-editor">
    <div class="markdown-editor__toolbar">
      <button type="button" @click="insertBold" class="markdown-editor__button" title="太字">
        <strong>B</strong>
      </button>
      <button type="button" @click="insertItalic" class="markdown-editor__button" title="斜体">
        <em>I</em>
      </button>
      <button type="button" @click="insertLink" class="markdown-editor__button" title="リンク">
        🔗
      </button>
      <button type="button" @click="insertCode" class="markdown-editor__button" title="コード">
        &lt;/&gt;
      </button>
      <button type="button" @click="insertHeading" class="markdown-editor__button" title="見出し">
        H
      </button>
    </div>

    <textarea
      ref="textareaRef"
      v-model="localValue"
      @input="handleInput"
      class="markdown-editor__textarea"
      :placeholder="placeholder"
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
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Markdownで記事を書く...',
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
};

const insertText = (before: string, after: string = '') => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = localValue.value.substring(start, end);

  const newText =
    localValue.value.substring(0, start) +
    before +
    selectedText +
    after +
    localValue.value.substring(end);

  localValue.value = newText;
  emit('update:modelValue', newText);

  // カーソル位置を調整
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
  }, 0);
};

const insertBold = () => insertText('**', '**');
const insertItalic = () => insertText('*', '*');
const insertLink = () => insertText('[', '](url)');
const insertCode = () => insertText('`', '`');
const insertHeading = () => insertText('## ');
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.markdown-editor__toolbar {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #d1d5db;
}

.markdown-editor__button {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.markdown-editor__button:hover {
  background: #f3f4f6;
}

.markdown-editor__button:active {
  background: #e5e7eb;
}

.markdown-editor__textarea {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: vertical;
}

.markdown-editor__textarea:focus {
  outline: none;
}
</style>
