# Code Generation 計画 - Unit 4: frontend

## ユニット概要

- **目的**: Vue 3 + Pinia + Vue Router による SPA のスキャフォールディング（Apple スタイル）
- **生成場所**: `packages/frontend/`
- **依存**: `@monorepo/shared`（Unit 1）、backend API（Unit 3）

## 実行チェックリスト

### Part 1: プロジェクト構造セットアップ

- [x] Step 1: `packages/frontend/package.json` 生成
- [x] Step 2: `packages/frontend/tsconfig.json` 生成
- [x] Step 3: `packages/frontend/vite.config.ts` 生成
- [x] Step 4: `packages/frontend/index.html` 生成
- [x] Step 5: `packages/frontend/.env.example` 生成

### Part 2: SCSS スタイル生成

- [x] Step 6: `src/styles/base/_variables.scss` 生成（デザイントークン）
- [x] Step 7: `src/styles/base/_reset.scss` 生成
- [x] Step 8: `src/styles/base/_typography.scss` 生成
- [x] Step 9: `src/styles/layout/_grid.scss` 生成
- [x] Step 10: `src/styles/module/_button.scss` 生成
- [x] Step 11: `src/styles/state/_states.scss` 生成
- [x] Step 12: `src/styles/theme/_apple.scss` 生成
- [x] Step 13: `src/styles/global.scss` 生成

### Part 3: Stores・Composables 生成

- [x] Step 14: `src/stores/useAuthStore.ts` 生成（Pinia Setup 記法）
- [x] Step 15: `src/composables/api/useApiClient.ts` 生成
- [x] Step 16: `src/composables/useAuth.ts` 生成

### Part 4: Router 生成

- [x] Step 17: `src/router/routes.ts` 生成
- [x] Step 18: `src/router/index.ts` 生成

### Part 5: Views・App エントリポイント生成

- [x] Step 19: `src/views/HomeView.vue` 生成
- [x] Step 20: `src/views/NotFoundView.vue` 生成
- [x] Step 21: `src/App.vue` 生成
- [x] Step 22: `src/main.ts` 生成

### Part 6: ドキュメント生成

- [x] Step 23: `packages/frontend/CODING_STANDARDS.md` 生成
- [x] Step 24: `aidlc-docs/construction/frontend/code/summary.md` 生成
