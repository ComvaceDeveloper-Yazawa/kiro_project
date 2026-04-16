# ビジネスロジックモデル - Unit 4: frontend

## アーキテクチャ概要

Vue 3（script setup）+ Pinia（Setup 記法）+ Vue Router（SPA）による フロントエンドアプリケーションです。
責務を明確に分離した 4 層構成を採用します。

---

## ディレクトリ構成（確定）

```
packages/frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   ├── index.ts                    # Vue Router インスタンス・ナビゲーションガード
│   │   ├── routes.ts                   # 全ルートのまとめ（機能別ファイルを import）
│   │   └── {feature}/
│   │       └── {feature}.routes.ts     # 機能ごとのルート定義
│   ├── stores/
│   │   └── useAuthStore.ts             # 認証状態（Pinia Setup 記法）
│   ├── composables/
│   │   ├── api/
│   │   │   └── useApiClient.ts         # 共通 fetch ラッパー
│   │   └── useAuth.ts                  # 認証ビジネスロジック
│   ├── views/
│   │   └── {Feature}View.vue           # ページ単位コンポーネント
│   ├── components/
│   │   └── {Feature}/
│   │       └── {ComponentName}.vue     # UI コンポーネント
│   └── styles/
│       ├── base/
│       │   ├── _reset.scss             # リセット CSS
│       │   ├── _typography.scss        # タイポグラフィ基本設定
│       │   └── _variables.scss         # SCSS 変数（デザイントークン）
│       ├── layout/
│       │   └── _grid.scss              # グリッド・レイアウト
│       ├── module/
│       │   └── _button.scss            # 再利用可能な UI モジュール
│       ├── state/
│       │   └── _states.scss            # is-active / is-hidden 等の状態クラス
│       ├── theme/
│       │   └── _apple.scss             # Apple スタイルテーマ変数
│       └── global.scss                 # 全ファイルの import エントリポイント
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── CODING_STANDARDS.md
```

---

## 責務分離モデル

```
[User Interaction]
      |
      v
+---------------------------+
|  View / Component 層      |  src/views/ + src/components/
|  - UI 描画                |
|  - イベント受付           |
|  - ビジネスロジックは     |
|    composables に委譲     |
+---------------------------+
      |
      v (イベント・データバインディング)
+---------------------------+
|  Composables 層           |  src/composables/
|  - ビジネスロジック       |
|  - フォームバリデーション |
|  - API 通信               |
+---------------------------+
      |
      v (状態の読み書き)
+---------------------------+
|  Stores 層                |  src/stores/
|  - 認証状態の永続保持     |
|  - サーバーデータキャッシュ|
+---------------------------+
      |
      v (HTTP Request)
+---------------------------+
|  API Client 層            |  src/composables/api/
|  - fetch ラッパー         |
|  - 認証ヘッダー付与       |
|  - ApiResponse<T> 変換    |
+---------------------------+
```

---

## SCSS 設計モデル（Q1: B — SMACSS 階層）

### ディレクトリ責務

| ディレクトリ | SMACSS カテゴリ | 内容                                                 |
| ------------ | --------------- | ---------------------------------------------------- |
| `base/`      | Base            | リセット・タイポグラフィ・SCSS 変数                  |
| `layout/`    | Layout          | グリッド・ページレイアウト（`l-` プレフィックス）    |
| `module/`    | Module          | 再利用可能な UI パーツ（ボタン・カード・フォーム等） |
| `state/`     | State           | 状態クラス（`is-` プレフィックス）                   |
| `theme/`     | Theme           | Apple スタイルテーマ変数・カラーパレット             |

### デザイントークン（Q2: A — SCSS 変数）

```scss
// styles/base/_variables.scss

// --- カラー（Apple スタイル） ---
$color-primary: #000000; // ブラック
$color-secondary: #1d1d1f; // ダークグレー（Apple の本文色）
$color-accent: #0071e3; // Apple ブルー
$color-background: #ffffff; // ホワイト
$color-surface: #f5f5f7; // ライトグレー（Apple のセクション背景）
$color-border: #d2d2d7; // ボーダー色
$color-text: #1d1d1f; // 本文テキスト
$color-text-muted: #6e6e73; // サブテキスト
$color-error: #ff3b30; // エラー（Apple レッド）
$color-success: #34c759; // 成功（Apple グリーン）

// --- タイポグラフィ ---
$font-family-base:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.25rem; // 20px
$font-size-2xl: 1.5rem; // 24px
$font-size-3xl: 2rem; // 32px
$font-size-4xl: 2.5rem; // 40px
$font-size-hero: 3.5rem; // 56px（ヒーローセクション用）
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$line-height-tight: 1.2;
$line-height-base: 1.5;
$line-height-loose: 1.8;

// --- スペーシング（8px グリッド） ---
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-12: 3rem; // 48px
$space-16: 4rem; // 64px
$space-24: 6rem; // 96px

// --- ボーダー ---
$border-radius-sm: 0.25rem; // 4px
$border-radius-md: 0.5rem; // 8px
$border-radius-lg: 0.75rem; // 12px
$border-radius-xl: 1rem; // 16px
$border-radius-full: 9999px;

// --- シャドウ ---
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);

// --- トランジション ---
$transition-fast: 150ms ease;
$transition-base: 250ms ease;
$transition-slow: 400ms ease;

// --- ブレークポイント ---
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1440px;
```

---

## フォント設定モデル（Q3: A — システムフォント）

```scss
// styles/base/_typography.scss

html {
  font-family: $font-family-base;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

**採用理由:**

- 追加の HTTP リクエストなし（パフォーマンス優先）
- macOS / iOS では `-apple-system` が SF Pro を使用し、Apple.com と同じ見た目になる
- Windows では Segoe UI、Android では Roboto にフォールバック

---

## Vue Router モデル（Q4: B — 機能ごとに分割）

```typescript
// router/routes.ts — 全ルートのまとめ
import type { RouteRecordRaw } from "vue-router";
import { authRoutes } from "./{feature}/{feature}.routes";

export const routes: RouteRecordRaw[] = [
  ...authRoutes,
  // 機能追加時はここに追加
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },
];
```

```typescript
// router/{feature}/{feature}.routes.ts — 機能ごとのルート
import type { RouteRecordRaw } from 'vue-router';

export const {feature}Routes: RouteRecordRaw[] = [
  {
    path: '/{feature}',
    name: '{Feature}',
    component: () => import('../../views/{Feature}View.vue'),
    meta: { requiresAuth: true },
  },
];
```

---

## API クライアントモデル（Q5: A — useAuthStore からトークン取得）

```typescript
// composables/api/useApiClient.ts の動作フロー

useAuthStore().session?.access_token
  → Authorization: Bearer <token> ヘッダーに付与
  → fetch(url, { headers })
  → ApiResponse<T> 型に変換して返却
```

**採用理由:**

- `localStorage` 直接アクセスより型安全
- Supabase のトークンリフレッシュが store 経由で自動反映される
- テスト時に store をモックすることで API クライアントのテストが容易

---

## フォームバリデーションモデル（Q6: C — リアルタイム）

```typescript
// composables/use{Feature}.ts のバリデーションパターン

const formData = ref<FormData>({ ... })
const errors = ref<Partial<Record<keyof FormData, string>>>({})

// watch でリアルタイムバリデーション
watch(formData, (newVal) => {
  const result = FormSchema.safeParse(newVal)
  if (!result.success) {
    // フィールドごとにエラーを格納
    errors.value = result.error.flatten().fieldErrors as typeof errors.value
  } else {
    errors.value = {}
  }
}, { deep: true })
```

**採用理由:**

- ユーザーが入力しながら即座にフィードバックを受けられる（Apple スタイルの UX）
- Zod の `safeParse` + `flatten()` でフィールドごとのエラーを効率的に取得
