<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

// フォーム状態
const email = ref('');
const password = ref('');
const error = ref('');
const isSubmitting = ref(false);

// バリデーション
const isEmailValid = computed(() => {
  if (!email.value) return true; // 未入力時はエラー表示しない
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isPasswordValid = computed(() => {
  if (!password.value) return true; // 未入力時はエラー表示しない
  return password.value.length >= 6;
});

const isFormValid = computed(() => {
  return email.value && password.value && isEmailValid.value && isPasswordValid.value;
});

// ログイン処理
async function handleLogin() {
  if (!isFormValid.value) return;

  error.value = '';
  isSubmitting.value = true;

  try {
    console.log('🔐 ログイン試行:', { email: email.value });
    await authStore.signIn(email.value, password.value);
    console.log('✅ ログイン成功');
    // ログイン成功後、記事一覧ページへリダイレクト
    router.push({ name: 'ArticleList' });
  } catch (err) {
    console.error('❌ ログインエラー:', err);

    // エラーメッセージを日本語化
    let errorMessage = 'ログインに失敗しました';

    if (err instanceof Error) {
      if (err.message.includes('Invalid login credentials')) {
        errorMessage =
          'メールアドレスまたはパスワードが正しくありません。\n\n💡 ヒント:\n• Supabase Dashboard でユーザーが作成されているか確認\n• メール確認が完了しているか確認（Email Confirmed: Yes）\n• パスワードが正しいか確認';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage =
          'メールアドレスが確認されていません。\n\nSupabase Dashboard → Authentication → Users でユーザーをクリックし、「Confirm email」ボタンをクリックしてください。';
      } else {
        errorMessage = err.message;
      }
    }

    error.value = errorMessage;
  } finally {
    isSubmitting.value = false;
  }
}

// テストユーザーで入力
function fillTestUser() {
  email.value = 'test@example.com';
  password.value = 'test1234';
}

// Enterキーでログイン
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && isFormValid.value) {
    handleLogin();
  }
}
</script>

<template>
  <main class="login">
    <div class="login__container">
      <div class="login__card">
        <div class="login__header">
          <h1 class="login__title">ログイン</h1>
          <p class="login__subtitle">技術ブログへようこそ</p>
        </div>

        <form class="login__form" @submit.prevent="handleLogin">
          <!-- メールアドレス -->
          <div class="login__field">
            <label for="email" class="login__label">
              メールアドレス
              <span class="login__required">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="login__input"
              :class="{ 'login__input--error': email && !isEmailValid }"
              placeholder="example@email.com"
              autocomplete="email"
              required
              @keydown="handleKeydown"
            />
            <p v-if="email && !isEmailValid" class="login__error-text">
              有効なメールアドレスを入力してください
            </p>
          </div>

          <!-- パスワード -->
          <div class="login__field">
            <label for="password" class="login__label">
              パスワード
              <span class="login__required">*</span>
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="login__input"
              :class="{ 'login__input--error': password && !isPasswordValid }"
              placeholder="6文字以上"
              autocomplete="current-password"
              required
              @keydown="handleKeydown"
            />
            <p v-if="password && !isPasswordValid" class="login__error-text">
              パスワードは6文字以上で入力してください
            </p>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="error" class="login__error" role="alert">
            <p class="login__error-text" style="white-space: pre-line">{{ error }}</p>
          </div>

          <!-- ログインボタン -->
          <button
            type="submit"
            class="login__button"
            :disabled="!isFormValid || isSubmitting"
            :aria-busy="isSubmitting"
          >
            <span v-if="isSubmitting">ログイン中...</span>
            <span v-else>ログイン</span>
          </button>
        </form>

        <div class="login__footer">
          <div class="login__test-user">
            <p class="login__test-user-title">🧪 テストユーザー</p>
            <div class="login__test-user-info">
              <p><strong>Email:</strong> test@example.com</p>
              <p><strong>Password:</strong> test1234</p>
            </div>
            <button type="button" class="login__test-user-button" @click="fillTestUser">
              テストユーザーで入力
            </button>
          </div>
          <p class="login__footer-text">
            アカウントをお持ちでない場合は、Supabase Dashboardから作成してください
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/styles/base/variables' as *;

.login {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: $space-8 $space-4;

  &__container {
    width: 100%;
    max-width: 420px;
  }

  &__card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-md;
    box-shadow: $shadow-lg;
    padding: $space-8;

    @media (max-width: 767px) {
      padding: $space-6;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: $space-8;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: $space-2;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-text-muted);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__required {
    color: var(--color-error);
  }

  &__input {
    width: 100%;
    padding: $space-3;
    font-size: 1rem;
    background-color: var(--color-background);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: $border-radius-sm;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
    }

    &--error {
      border-color: var(--color-error);

      &:focus {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(209, 50, 18, 0.1);
      }
    }

    &::placeholder {
      color: var(--color-text-muted);
      opacity: 0.6;
    }
  }

  &__error {
    padding: $space-3;
    background-color: rgba(209, 50, 18, 0.1);
    border: 1px solid var(--color-error);
    border-radius: $border-radius-sm;
  }

  &__error-text {
    font-size: 0.875rem;
    color: var(--color-error);
    margin: 0;
  }

  &__button {
    width: 100%;
    padding: $space-3;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-secondary);
    background-color: var(--color-primary);
    border: none;
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;

    &:hover:not(:disabled) {
      background-color: #ec7211;
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.3);
    }
  }

  &__footer {
    margin-top: $space-6;
    text-align: center;
  }

  &__test-user {
    background-color: rgba(59, 130, 246, 0.05);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: $border-radius-sm;
    padding: $space-4;
    margin-bottom: $space-4;
  }

  &__test-user-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: $space-2;
  }

  &__test-user-info {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: $space-3;
    text-align: left;

    p {
      margin: $space-1 0;
    }

    strong {
      color: var(--color-text);
    }
  }

  &__test-user-button {
    width: 100%;
    padding: $space-2 $space-3;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    background-color: #3b82f6;
    border: none;
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #2563eb;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__footer-text {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
  }
}
</style>
