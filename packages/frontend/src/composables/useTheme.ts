import { ref, watch, onMounted } from 'vue';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme-preference';

/**
 * テーマ管理 Composable
 *
 * ライトモード・ダークモードの切り替えを管理する。
 * ユーザーの選択を localStorage に保存し、次回訪問時に復元する。
 */
export function useTheme() {
  const theme = ref<Theme>('light');

  // テーマを適用
  function applyTheme(newTheme: Theme) {
    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }

  // テーマを切り替え
  function toggleTheme() {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }

  // テーマを初期化
  function initializeTheme() {
    // localStorage から復元
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // システムの設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    // システムの設定変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // コンポーネントマウント時に初期化
  onMounted(() => {
    initializeTheme();
  });

  return {
    theme,
    toggleTheme,
    applyTheme,
  };
}
