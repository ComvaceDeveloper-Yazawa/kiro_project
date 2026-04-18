import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
  // Vue ファイル（eslint-plugin-vue のフラット設定を展開）
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript ルール（Vue ファイル）
      ...tseslint.configs['recommended'].rules,
      ...tseslint.configs['strict'].rules,

      // Vue script setup では単語コンポーネント名を許可
      'vue/multi-word-component-names': 'off',

      // console は警告
      'no-console': 'warn',

      // Prettier との競合ルールを無効化
      ...prettier.rules,
    },
  },
  // TypeScript ファイル
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript all ルールを有効化
      ...tseslint.configs['eslint-recommended'].rules,
      ...tseslint.configs['recommended'].rules,
      ...tseslint.configs['recommended-type-checked'].rules,
      ...tseslint.configs['strict'].rules,
      ...tseslint.configs['strict-type-checked'].rules,
      ...tseslint.configs['stylistic-type-checked'].rules,

      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',

      // Prettier との競合ルールを無効化
      ...prettier.rules,
    },
  },
  {
    // テストファイルは一部ルールを緩める
    files: ['src/**/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // stores / composables / router は外部ライブラリの型が any になるため緩和
    files: ['src/stores/**/*.ts', 'src/composables/**/*.ts', 'src/router/**/*.ts', 'src/main.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
