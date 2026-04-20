import { ref, computed } from 'vue';
import type { Tag } from '@monorepo/shared';
import { useTagApi } from './useTagApi';

export function useTag() {
  const api = useTagApi();
  const tags = ref<Tag[]>([]);
  const selectedTags = ref<string[]>([]);

  const availableTags = computed(() => tags.value);
  const selectedTagObjects = computed(() =>
    tags.value.filter((tag) => selectedTags.value.includes(tag.name)),
  );

  const loadTags = async () => {
    tags.value = await api.listTags();
  };

  const selectTag = (tagName: string) => {
    if (!selectedTags.value.includes(tagName)) {
      selectedTags.value.push(tagName);
    }
  };

  const deselectTag = (tagName: string) => {
    selectedTags.value = selectedTags.value.filter((t) => t !== tagName);
  };

  const toggleTag = (tagName: string) => {
    if (selectedTags.value.includes(tagName)) {
      deselectTag(tagName);
    } else {
      selectTag(tagName);
    }
  };

  const clearSelection = () => {
    selectedTags.value = [];
  };

  const setSelectedTags = (tagNames: string[]) => {
    selectedTags.value = tagNames;
  };

  return {
    tags,
    selectedTags,
    availableTags,
    selectedTagObjects,
    loading: api.loading,
    error: api.error,
    loadTags,
    selectTag,
    deselectTag,
    toggleTag,
    clearSelection,
    setSelectedTags,
  };
}
