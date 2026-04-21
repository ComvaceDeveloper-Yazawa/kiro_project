<template>
  <div class="tag-input">
    <div class="tag-input__tags">
      <span v-for="(tag, index) in modelValue" :key="index" class="tag-input__tag">
        {{ tag }}
        <button
          type="button"
          @click="removeTag(index)"
          class="tag-input__remove"
          aria-label="タグを削除"
        >
          <XMarkIcon class="tag-input__icon" />
        </button>
      </span>
    </div>

    <div class="tag-input__input-wrapper">
      <input
        v-model="inputValue"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        type="text"
        class="tag-input__input"
        placeholder="タグを入力してEnterまたはカンマで追加"
      />

      <!-- サジェスト -->
      <div v-if="showSuggestions && filteredSuggestions.length > 0" class="tag-input__suggestions">
        <button
          v-for="suggestion in filteredSuggestions"
          :key="suggestion"
          type="button"
          @mousedown.prevent="selectSuggestion(suggestion)"
          class="tag-input__suggestion"
        >
          <TagIcon class="tag-input__icon" />
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div class="tag-input__hint">
      <InformationCircleIcon class="tag-input__icon" />
      Enterキーまたはカンマでタグを追加できます（最大10個）
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { XMarkIcon, TagIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

interface Props {
  modelValue: string[];
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputValue = ref('');
const showSuggestions = ref(false);
const availableTags = ref<string[]>([]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 既存タグを取得
const loadTags = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tags`);
    if (response.ok) {
      const tags = await response.json();
      availableTags.value = tags.map((tag: { name: string }) => tag.name);
    }
  } catch (error) {
    console.error('タグの取得に失敗:', error);
  }
};

// フィルタリングされたサジェスト
const filteredSuggestions = computed(() => {
  if (!inputValue.value) return availableTags.value.slice(0, 10);

  return availableTags.value
    .filter(
      (tag) =>
        tag.toLowerCase().includes(inputValue.value.toLowerCase()) &&
        !props.modelValue.includes(tag),
    )
    .slice(0, 10);
});

const handleInput = () => {
  showSuggestions.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const selectSuggestion = (tag: string) => {
  if (props.modelValue.length >= 10) {
    alert('タグは10個まで設定できます');
    return;
  }

  emit('update:modelValue', [...props.modelValue, tag]);
  inputValue.value = '';
  showSuggestions.value = false;
};

const addTag = () => {
  const tag = inputValue.value.trim().toLowerCase();

  if (!tag) return;

  if (props.modelValue.length >= 10) {
    alert('タグは10個まで設定できます');
    return;
  }

  if (props.modelValue.includes(tag)) {
    alert('このタグは既に追加されています');
    inputValue.value = '';
    return;
  }

  emit('update:modelValue', [...props.modelValue, tag]);
  inputValue.value = '';
};

const removeTag = (index: number) => {
  const newTags = [...props.modelValue];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
};

onMounted(() => {
  loadTags();
});
</script>

<style scoped>
.tag-input {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: var(--color-surface);
  transition: all 0.2s;
}

.tag-input:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
}

.tag-input__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-input__remove {
  background: none;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.tag-input__remove:hover {
  opacity: 0.7;
}

.tag-input__input-wrapper {
  position: relative;
}

.tag-input__input {
  width: 100%;
  border: none;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  background: transparent;
  color: var(--color-text);
}

.tag-input__input:focus {
  outline: none;
}

.tag-input__input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.tag-input__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.tag-input__suggestion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text);
  transition: all 0.2s;
}

.tag-input__suggestion:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.tag-input__hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.tag-input__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
