# Functional Design 計画 - Unit 4: frontend

## 実行チェックリスト

- [x] Step 1: 設計判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: business-logic-model.md 生成
- [x] Step 4: business-rules.md 生成
- [x] Step 5: frontend-components.md 生成

---

## 前提（確定済み）

- Vue 3（script setup）+ TypeScript + Vite + Pinia（Setup 記法）+ Vue Router（SPA）
- composables = ビジネスロジック・フォームバリデーション・API 通信
- components = UI 描画・ユーザーインタラクション（ビジネスロジックは composables に委譲）
- stores = 認証状態・サーバーデータの永続保持
- SCSS + SMACSS ベース命名規則
- デザイン方針: Apple.com スタイル（シンプル・ホワイトベース・大きなタイポグラフィ・余白重視）
- セキュリティ: SECURITY-01〜15 全ルール適用

---

## 設計判断質問

各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

SCSS の設計構成はどうしますか？

A) フラット構成（`_variables.scss` / `_mixins.scss` / `_reset.scss` / `global.scss` のみ）
B) SMACSS 準拠の階層構成（`base/` / `layout/` / `module/` / `state/` / `theme/` ディレクトリ分割）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

デザイントークン（カラー・タイポグラフィ・スペーシング）の管理方法はどうしますか？

A) SCSS 変数のみ（`$color-primary: #000` 形式）
B) CSS カスタムプロパティ（`--color-primary: #000`）+ SCSS 変数でラップ
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

Apple.com スタイルのベースフォントはどうしますか？

A) システムフォントスタック（`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`）
B) Google Fonts から Inter を読み込む
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

Vue Router のルート構成はどうしますか？

A) フラット構成（全ルートを `routes.ts` に列挙）
B) 機能ごとにルートファイルを分割して `routes.ts` でまとめる
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5

`useApiClient.ts` の認証トークン取得方法はどうしますか？

A) `useAuthStore` から `user` の Supabase セッショントークンを取得
B) `localStorage` から直接トークンを取得
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6

フォームバリデーションのエラー表示タイミングはどうしますか？

A) submit 時のみ（送信ボタンを押したときに全フィールドを検証）
B) blur 時（フォーカスが外れたタイミングで各フィールドを検証）
C) リアルタイム（入力のたびに検証）
D) Other (please describe after [Answer]: tag below)

[Answer]: C
