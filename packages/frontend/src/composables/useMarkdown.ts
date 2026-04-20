import { ref, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export function useMarkdown() {
  const markdown = ref('');
  const html = computed(() => {
    if (!markdown.value) return '';
    const rawHtml = marked.parse(markdown.value) as string;
    return DOMPurify.sanitize(rawHtml);
  });

  const setMarkdown = (value: string) => {
    markdown.value = value;
  };

  const clear = () => {
    markdown.value = '';
  };

  return {
    markdown,
    html,
    setMarkdown,
    clear,
  };
}
