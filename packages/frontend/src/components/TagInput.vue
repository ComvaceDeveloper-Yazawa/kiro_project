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
          ×
        </button>
      </span>
    </div>

    <input
      v-model="inputValue"
      @keydown.enter.prevent="addTag"
      @keydown.comma.prevent="addTag"
      type="text"
      class="tag-input__input"
      placeholder="タグを入力してEnterまたはカンマで追加"
    />

    <div class="tag-input__hint">Enterキーまたはカンマでタグを追加できます（最大10個）</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string[];
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputValue = ref('');

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
</script>

<style scoped>
.tag-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: white;
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
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.tag-input__remove {
  background: none;
  border: none;
  color: #1e40af;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}

.tag-input__remove:hover {
  color: #1e3a8a;
}

.tag-input__input {
  width: 100%;
  border: none;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.tag-input__input:focus {
  outline: none;
}

.tag-input__hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>
