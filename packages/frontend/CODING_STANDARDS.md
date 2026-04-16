# Frontend コーディング規約

## 責務分離（4層）

```
View / Component 層  src/views/ + src/components/   UI 描画・イベント受付のみ
Composables 層       src/composables/               ビジネスロジック・バリデーション・API 通信
Stores 層            src/stores/                    認証状態・サーバーデータの永続保持
API Client 層        src/composables/api/           fetch ラッパー・認証ヘッダー付与
```

---

## 1. Vue 3 script setup ルール

| 推奨                                      | 非推奨                                         |
| ----------------------------------------- | ---------------------------------------------- |
| `<script setup lang="ts">`                | Options API / `defineComponent`                |
| `defineProps<{...}>()` ジェネリック型定義 | `defineProps({ prop: String })` ランタイム定義 |
| `defineEmits<{...}>()` ジェネリック型定義 | `defineEmits(['update'])` 文字列配列           |
| `computed` で派生状態を定義               | template 内に複雑な式を書く                    |
| ビジネスロジックは composables に委譲     | `<script setup>` 内に直接ロジックを書く        |

---

## 2. Pinia Setup 記法ルール

| 推奨                                          | 非推奨                                       |
| --------------------------------------------- | -------------------------------------------- |
| `defineStore('id', () => { ... })` Setup 記法 | Options 記法                                 |
| store ID はケバブケース（`'auth-store'`）     | スペースや大文字を含む ID                    |
| `storeToRefs()` で state を分割代入           | store を直接分割代入（リアクティビティ消失） |

---

## 3. SCSS ルール（SMACSS）

| プレフィックス | 用途                    | 例                          |
| -------------- | ----------------------- | --------------------------- |
| `l-`           | レイアウト              | `l-container`, `l-section`  |
| `m-`           | モジュール（再利用 UI） | `m-button`, `m-card`        |
| `is-`          | 状態                    | `is-active`, `is-loading`   |
| `t-`           | タイポグラフィ          | `t-hero`, `t-heading-1`     |
| `theme-`       | テーマ固有              | `theme-card`, `theme-input` |

- コンポーネント固有スタイルは `<style scoped lang="scss">`
- グローバルスタイルは `src/styles/` のみ
- スペーシングは `$space-*` 変数を使用（マジックナンバー禁止）
- カラーは `$color-*` 変数を使用（カラーコード直書き禁止）

---

## 4. ファイル命名規則

| 種別            | 規則                   | 例                |
| --------------- | ---------------------- | ----------------- |
| コンポーネント  | PascalCase.vue         | `UserCard.vue`    |
| View            | `{Feature}View.vue`    | `HomeView.vue`    |
| Composable      | `use{Feature}.ts`      | `useAuth.ts`      |
| Store           | `use{Feature}Store.ts` | `useAuthStore.ts` |
| ルートファイル  | `{feature}.routes.ts`  | `auth.routes.ts`  |
| SCSS（partial） | `_{name}.scss`         | `_variables.scss` |

---

## 5. テスト方針（Vitest）

- カバレッジ目標: **100%**（`vitest --coverage`）
- 除外対象: `src/main.ts`、型定義のみのファイル
- テストファイル配置: `src/**/__tests__/{filename}.test.ts`
- コンポーネントテスト: `@vue/test-utils` の `mount` を使用
- Pinia テスト: `createTestingPinia()` でストアをモック
- API テスト: `useApiClient` を `vi.mock` でモック

---

## 6. アクセシビリティ・テスト自動化

- インタラクティブ要素に `data-testid` を付与
- 命名規則: `{component}-{element-role}`（例: `login-form-submit-button`）
- アイコンのみのボタンには `aria-label` を設定

---

## 7. 新しい機能を追加する手順

1. `src/router/{feature}/{feature}.routes.ts` にルートを定義
2. `src/router/routes.ts` に import して展開
3. `src/views/{Feature}View.vue` にページコンポーネントを作成
4. `src/composables/use{Feature}.ts` にビジネスロジックを実装
5. `src/composables/api/use{Feature}Api.ts` に API 通信を実装
6. `src/components/{Feature}/` に UI コンポーネントを作成
7. 必要に応じて `src/stores/use{Feature}Store.ts` に状態管理を追加
