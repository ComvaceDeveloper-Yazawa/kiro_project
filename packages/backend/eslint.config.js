import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
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

      // backend では console を警告（logger を使うべき）
      'no-console': 'warn',

      // any 禁止
      '@typescript-eslint/no-explicit-any': 'error',

      // Fastify の req/reply パターンで必要な緩和
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { arguments: false } },
      ],

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
    // Fastify プラグイン・インフラ層は外部ライブラリの型が any になるため緩和
    files: [
      'src/plugins/**/*.ts',
      'src/hooks/**/*.ts',
      'src/app.ts',
      'src/index.ts',
      'src/infrastructure/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
