<template>
  <div class="tag-filter">
    <h3 class="tag-filter__title">タグで絞り込み</h3>

    <div v-if="loading" class="tag-filter__loading">読み込み中...</div>

    <div v-else-if="error" class="tag-filter__error">
      {{ error }}
    </div>

    <div v-else class="tag-filter__tags">
      <button
        v-for="tag in tags"
        :key="tag.id"
        @click="toggleTag(tag.name)"
        :class="['tag-filter__tag', { 'tag-filter__tag--active': isSelected(tag.name) }]"
        type="button"
      >
        #{{ tag.name }}
      </button>
    </div>

    <button
      v-if="selectedTags.length > 0"
      @click="clearSelection"
      class="tag-filter__clear"
      type="button"
    >
      選択をクリア
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTag } from '../composables/useTag';

interface Emits {
  (e: 'update:selectedTags', tags: string[]): void;
}

const emit = defineEmits<Emits>();

const { tags, selectedTags, loading, error, loadTags, toggleTag, clearSelection } = useTag();

const isSelected = (tagName: string): boolean => {
  return selectedTags.value.includes(tagName);
};

const handleToggle = (tagName: string) => {
  toggleTag(tagName);
  emit('update:selectedTags', selectedTags.value);
};

const handleClear = () => {
  clearSelection();
  emit('update:selectedTags', []);
};

onMounted(() => {
  loadTags();
});
</script>

<style scoped>
.tag-filter {
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.tag-filter__title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.tag-filter__loading,
.tag-filter__error {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
}

.tag-filter__error {
  color: #dc2626;
}

.tag-filter__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-filter__tag {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-filter__tag:hover {
  background: #e5e7eb;
}

.tag-filter__tag--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tag-filter__clear {
  width: 100%;
  padding: 0.5rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.tag-filter__clear:hover {
  background: #e5e7eb;
}
</style>
