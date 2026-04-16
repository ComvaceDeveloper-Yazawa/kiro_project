# Code Generation サマリー - Unit 4: frontend

## 生成ファイル一覧

### 設定ファイル

| ファイル                           | 内容                                        |
| ---------------------------------- | ------------------------------------------- |
| `packages/frontend/package.json`   | 依存関係・スクリプト定義                    |
| `packages/frontend/tsconfig.json`  | TypeScript 設定（strict / @/\* エイリアス） |
| `packages/frontend/vite.config.ts` | Vite 設定（SCSS 自動 import・vitest 設定）  |
| `packages/frontend/index.html`     | HTML エントリポイント                       |
| `packages/frontend/.env.example`   | 環境変数テンプレート                        |

### SCSS（SMACSS 階層・Apple スタイル）

| ファイル                           | 内容                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| `src/styles/base/_variables.scss`  | デザイントークン（カラー・タイポグラフィ・スペーシング）   |
| `src/styles/base/_reset.scss`      | CSS リセット                                               |
| `src/styles/base/_typography.scss` | タイポグラフィユーティリティクラス                         |
| `src/styles/layout/_grid.scss`     | コンテナ・セクション・フレックスユーティリティ             |
| `src/styles/module/_button.scss`   | ボタンモジュール（primary / secondary / ghost / danger）   |
| `src/styles/state/_states.scss`    | 状態クラス（is-active / is-loading / is-error 等）         |
| `src/styles/theme/_apple.scss`     | Apple スタイルテーマ（カード・フォーム入力・ディバイダー） |
| `src/styles/global.scss`           | 全ファイルの import エントリポイント                       |

### Stores / Composables

| ファイル                              | 内容                                          |
| ------------------------------------- | --------------------------------------------- |
| `src/stores/useAuthStore.ts`          | 認証ストア（Pinia Setup 記法・Supabase Auth） |
| `src/composables/api/useApiClient.ts` | 共通 fetch ラッパー（認証ヘッダー自動付与）   |
| `src/composables/useAuth.ts`          | 認証ビジネスロジック composable               |

### Router

| ファイル               | 内容                                          |
| ---------------------- | --------------------------------------------- |
| `src/router/routes.ts` | 全ルートのまとめ（機能別ファイルを import）   |
| `src/router/index.ts`  | Vue Router インスタンス・ナビゲーションガード |

### Views / エントリポイント

| ファイル                     | 内容                                         |
| ---------------------------- | -------------------------------------------- |
| `src/views/HomeView.vue`     | ホームページ（Apple スタイルヒーロー）       |
| `src/views/NotFoundView.vue` | 404 ページ                                   |
| `src/App.vue`                | ルートコンポーネント（セッション復元）       |
| `src/main.ts`                | アプリエントリポイント（Pinia・Router 登録） |

### ドキュメント

| ファイル                                | 内容                             |
| --------------------------------------- | -------------------------------- |
| `packages/frontend/CODING_STANDARDS.md` | コーディング規約・新機能追加手順 |

---

## 完了条件チェックリスト

- [x] package.json / tsconfig.json / vite.config.ts / index.html / .env.example
- [x] SCSS 全8ファイル（SMACSS 階層・Apple デザイントークン）
- [x] useAuthStore（Pinia Setup 記法・Supabase Auth 連携）
- [x] useApiClient（認証ヘッダー自動付与・ApiResponse<T> 型変換）
- [x] useAuth（composable・storeToRefs 使用）
- [x] router/routes.ts（機能別分割構成）
- [x] router/index.ts（ナビゲーションガード・SECURITY-08 対応）
- [x] HomeView.vue / NotFoundView.vue（Apple スタイル）
- [x] App.vue（セッション復元）/ main.ts（Pinia・Router 登録）
- [x] CODING_STANDARDS.md
