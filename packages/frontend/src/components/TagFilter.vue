<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTagApi } from '../composables/useTagApi';
import type { Tag } from '@monorepo/shared';

interface Emits {
  (e: 'update:selectedTags', tags: string[]): void;
}

const emit = defineEmits<Emits>();

const tagApi = useTagApi();
const allTags = ref<Tag[]>([]);
const searchQuery = ref('');
const selectedTags = ref<string[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// 検索クエリでフィルタリングされたタグ
const filteredTags = computed(() => {
  if (!searchQuery.value) {
    return allTags.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allTags.value.filter((tag) => tag.name.toLowerCase().includes(query));
});

// タグが選択されているか確認
const isSelected = (tagName: string): boolean => {
  return selectedTags.value.includes(tagName);
};

// タグの選択/解除を切り替え
const toggleTag = (tagName: string) => {
  if (isSelected(tagName)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tagName);
  } else {
    selectedTags.value = [...selectedTags.value, tagName];
  }
  emit('update:selectedTags', selectedTags.value);
};

// 選択中のタグを削除
const removeTag = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tagName);
  emit('update:selectedTags', selectedTags.value);
};

// すべてのタグをクリア
const clearAll = () => {
  selectedTags.value = [];
  searchQuery.value = '';
  emit('update:selectedTags', []);
};

// タグ一覧を読み込み
const loadTags = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await tagApi.listTags();
    allTags.value = result;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'タグの取得に失敗しました';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTags();
});
</script>

<template>
  <div class="tag-filter">
    <!-- 検索インプット -->
    <div class="tag-filter__search">
      <div class="tag-filter__search-wrapper">
        <svg class="tag-filter__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="tag-filter__search-input"
          placeholder="タグを検索..."
          aria-label="タグを検索"
        />
        <button
          v-if="searchQuery"
          class="tag-filter__search-clear"
          @click="searchQuery = ''"
          aria-label="検索をクリア"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 選択中のタグ -->
    <div v-if="selectedTags.length > 0" class="tag-filter__selected">
      <div class="tag-filter__selected-header">
        <span class="tag-filter__selected-title">選択中 ({{ selectedTags.length }})</span>
        <button class="tag-filter__clear-all" @click="clearAll">すべてクリア</button>
      </div>
      <div class="tag-filter__selected-tags">
        <button
          v-for="tag in selectedTags"
          :key="tag"
          class="tag-filter__selected-tag"
          @click="removeTag(tag)"
        >
          <span>#{{ tag }}</span>
          <svg
            class="tag-filter__remove-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- ローディング -->
    <div v-if="loading" class="tag-filter__loading">
      <div class="tag-filter__spinner"></div>
      <p>タグを読み込み中...</p>
    </div>

    <!-- エラー -->
    <div v-else-if="error" class="tag-filter__error">
      <p>{{ error }}</p>
      <button class="tag-filter__retry" @click="loadTags">再試行</button>
    </div>

    <!-- タグ一覧 -->
    <div v-else class="tag-filter__tags">
      <div v-if="filteredTags.length === 0" class="tag-filter__empty">
        <p v-if="searchQuery">「{{ searchQuery }}」に一致するタグが見つかりません</p>
        <p v-else>タグがありません</p>
      </div>
      <button
        v-for="tag in filteredTags"
        :key="tag.id"
        class="tag-filter__tag"
        :class="{ 'tag-filter__tag--active': isSelected(tag.name) }"
        @click="toggleTag(tag.name)"
      >
        <span class="tag-filter__tag-name">#{{ tag.name }}</span>
        <svg
          v-if="isSelected(tag.name)"
          class="tag-filter__check-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/base/variables' as *;

.tag-filter {
  &__search {
    margin-bottom: $space-4;
  }

  &__search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    position: absolute;
    left: $space-3;
    width: 20px;
    height: 20px;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: $space-3 $space-10 $space-3 $space-10;
    background-color: var(--color-background);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    transition: all $transition-fast;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
    }

    &::placeholder {
      color: var(--color-text-muted);
    }
  }

  &__search-clear {
    position: absolute;
    right: $space-3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: var(--color-text);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__selected {
    margin-bottom: $space-4;
    padding: $space-3;
    background-color: rgba(255, 153, 0, 0.1);
    border: 1px solid var(--color-primary);
    border-radius: $border-radius-sm;
  }

  &__selected-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-2;
  }

  &__selected-title {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: var(--color-text);
  }

  &__clear-all {
    padding: $space-1 $space-2;
    background: transparent;
    border: none;
    color: var(--color-primary);
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.8;
    }
  }

  &__selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__selected-tag {
    display: flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-2;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background-color: #ec7211;
    }
  }

  &__remove-icon {
    width: 12px;
    height: 12px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-8;
    color: var(--color-text-muted);
    font-size: $font-size-sm;
  }

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: $space-2;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  &__error {
    padding: $space-4;
    text-align: center;
    color: var(--color-error);
    font-size: $font-size-sm;
  }

  &__retry {
    margin-top: $space-2;
    padding: $space-2 $space-3;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background-color $transition-fast;

    &:hover {
      background-color: #ec7211;
    }
  }

  &__tags {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-surface);
      border-radius: $border-radius-sm;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: $border-radius-sm;

      &:hover {
        background: var(--color-text-muted);
      }
    }
  }

  &__empty {
    padding: $space-8;
    text-align: center;
    color: var(--color-text-muted);
    font-size: $font-size-sm;
  }

  &__tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-2 $space-3;
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    text-align: left;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }

    &--active {
      background-color: var(--color-primary);
      color: var(--color-secondary);
      border-color: var(--color-primary);

      &:hover {
        background-color: #ec7211;
        border-color: #ec7211;
      }
    }
  }

  &__tag-name {
    font-weight: $font-weight-medium;
  }

  &__check-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}
</style>
