<template>
  <div class="markdown-preview">
    <div v-if="html" class="markdown-preview__content" v-html="html" />
    <div v-else class="markdown-preview__empty">プレビューがここに表示されます</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMarkdown } from '../composables/useMarkdown';

interface Props {
  markdown: string;
}

const props = defineProps<Props>();

const { setMarkdown, html } = useMarkdown();

const computedHtml = computed(() => {
  setMarkdown(props.markdown);
  return html.value;
});
</script>

<style scoped>
.markdown-preview {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  background: white;
  min-height: 300px;
}

.markdown-preview__content {
  line-height: 1.6;
  color: #1f2937;
}

.markdown-preview__content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-preview__content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.markdown-preview__content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-preview__content :deep(p) {
  margin-bottom: 1rem;
}

.markdown-preview__content :deep(code) {
  padding: 0.125rem 0.25rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.markdown-preview__content :deep(pre) {
  padding: 1rem;
  background: #1f2937;
  color: #f9fafb;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-preview__content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.markdown-preview__content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-preview__content :deep(ul),
.markdown-preview__content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-preview__content :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-preview__content :deep(blockquote) {
  padding-left: 1rem;
  border-left: 4px solid #d1d5db;
  color: #6b7280;
  margin-bottom: 1rem;
}

.markdown-preview__empty {
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
}
</style>
