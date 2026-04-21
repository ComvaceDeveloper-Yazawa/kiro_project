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
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;
  min-height: 500px;
}

.markdown-preview__content {
  line-height: 1.75;
  color: #111827;
  font-size: 1rem;
}

.markdown-preview__content :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: #111827;
}

.markdown-preview__content :deep(h2) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.875rem;
  line-height: 1.3;
  color: #111827;
}

.markdown-preview__content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  color: #111827;
}

.markdown-preview__content :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;
  color: #111827;
}

.markdown-preview__content :deep(p) {
  margin-bottom: 1.25rem;
  color: #374151;
}

.markdown-preview__content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.markdown-preview__content :deep(em) {
  font-style: italic;
}

.markdown-preview__content :deep(code) {
  padding: 0.125rem 0.375rem;
  background: rgba(135, 131, 120, 0.15);
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875em;
  color: #eb5757;
}

.markdown-preview__content :deep(pre) {
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.markdown-preview__content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 0.875rem;
}

.markdown-preview__content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  transition: border-color 0.2s;
}

.markdown-preview__content :deep(a:hover) {
  border-bottom-color: #3b82f6;
}

.markdown-preview__content :deep(ul),
.markdown-preview__content :deep(ol) {
  margin-left: 1.75rem;
  margin-bottom: 1.25rem;
}

.markdown-preview__content :deep(li) {
  margin-bottom: 0.5rem;
  color: #374151;
}

.markdown-preview__content :deep(li::marker) {
  color: #6b7280;
}

.markdown-preview__content :deep(blockquote) {
  padding: 0.75rem 1.25rem;
  border-left: 3px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  margin-bottom: 1.5rem;
  border-radius: 0 0.25rem 0.25rem 0;
}

.markdown-preview__content :deep(blockquote p) {
  margin-bottom: 0.5rem;
}

.markdown-preview__content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.markdown-preview__content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.markdown-preview__content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

.markdown-preview__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.markdown-preview__content :deep(th),
.markdown-preview__content :deep(td) {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.markdown-preview__content :deep(th) {
  background: #f9fafb;
  font-weight: 600;
  color: #111827;
}

.markdown-preview__content :deep(td) {
  color: #374151;
}

.markdown-preview__empty {
  color: #d1d5db;
  text-align: center;
  padding: 4rem 2rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .markdown-preview__content {
    font-size: 0.9375rem;
  }

  .markdown-preview__content :deep(h1) {
    font-size: 1.875rem;
  }

  .markdown-preview__content :deep(h2) {
    font-size: 1.5rem;
  }

  .markdown-preview__content :deep(h3) {
    font-size: 1.25rem;
  }
}
</style>
