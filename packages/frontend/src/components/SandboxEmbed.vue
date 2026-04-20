<template>
  <div class="sandbox-embed">
    <div v-if="embedCode" v-html="embedCode" class="sandbox-embed__iframe" />
    <div v-else class="sandbox-embed__placeholder">
      <p>サンドボックスURLを入力してください</p>
      <input
        v-model="url"
        type="url"
        placeholder="https://stackblitz.com/edit/..."
        class="sandbox-embed__input"
      />
      <select v-model="type" class="sandbox-embed__select">
        <option value="stackblitz">StackBlitz</option>
        <option value="codesandbox">CodeSandbox</option>
      </select>
      <button type="button" @click="generateEmbed" class="sandbox-embed__button">
        埋め込みコードを生成
      </button>
    </div>

    <div v-if="error" class="sandbox-embed__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Emits {
  (e: 'embed', code: string): void;
}

const emit = defineEmits<Emits>();

const url = ref('');
const type = ref<'stackblitz' | 'codesandbox'>('stackblitz');
const embedCode = ref('');
const error = ref('');

const validateUrl = (urlString: string): boolean => {
  try {
    const parsedUrl = new URL(urlString);
    const hostname = parsedUrl.hostname;

    if (type.value === 'stackblitz' && !hostname.includes('stackblitz.com')) {
      error.value = 'StackBlitzのURLを入力してください';
      return false;
    }

    if (type.value === 'codesandbox' && !hostname.includes('codesandbox.io')) {
      error.value = 'CodeSandboxのURLを入力してください';
      return false;
    }

    return true;
  } catch {
    error.value = '有効なURLを入力してください';
    return false;
  }
};

const generateEmbed = () => {
  error.value = '';

  if (!url.value) {
    error.value = 'URLを入力してください';
    return;
  }

  if (!validateUrl(url.value)) {
    return;
  }

  let embedUrl = url.value;

  if (type.value === 'stackblitz') {
    const urlObj = new URL(url.value);
    if (!urlObj.searchParams.has('embed')) {
      urlObj.searchParams.set('embed', '1');
    }
    embedUrl = urlObj.toString();
  } else if (type.value === 'codesandbox') {
    embedUrl = url.value.replace('/s/', '/embed/');
  }

  const code = `<iframe
  src="${embedUrl}"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="${type.value} embed"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`;

  embedCode.value = code;
  emit('embed', code);
};
</script>

<style scoped>
.sandbox-embed {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
}

.sandbox-embed__iframe {
  width: 100%;
}

.sandbox-embed__iframe :deep(iframe) {
  width: 100%;
  height: 500px;
  border: 0;
  border-radius: 4px;
}

.sandbox-embed__placeholder {
  text-align: center;
  padding: 2rem;
}

.sandbox-embed__input,
.sandbox-embed__select {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.sandbox-embed__button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.sandbox-embed__button:hover {
  background: #2563eb;
}

.sandbox-embed__error {
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}
</style>
