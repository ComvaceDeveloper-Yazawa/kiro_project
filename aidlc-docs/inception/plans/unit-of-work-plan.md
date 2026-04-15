# Units Generation 計画

## 実行チェックリスト

- [x] Step 1: ユニット分解の判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: unit-of-work.md 生成
- [x] Step 4: unit-of-work-dependency.md 生成
- [x] Step 5: unit-of-work-story-map.md 生成

---

## 前提（確定済み）

実行計画で既に決定済みのユニット構成:

| ユニット         | 内容                                           | 実行順序                  |
| ---------------- | ---------------------------------------------- | ------------------------- |
| Unit 1: shared   | Zod スキーマ・推論型                           | 1番目（他が依存）         |
| Unit 2: supabase | DB マイグレーション・RLS・CLI 設定             | 2番目                     |
| Unit 3: backend  | Fastify・Prisma・ESLint/Prettier・Vitest       | 3番目                     |
| Unit 4: frontend | Vue 3・Pinia・Vue Router・SCSS・Vitest         | 3番目（backend と並行可） |
| Unit 5: ci-cd    | GitHub Actions（Lint+Test+Deploy）・Playwright | 5番目（全ユニット完了後） |

---

## 設計判断質問

以下の点について確認が必要です。
各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

backend と frontend の Code Generation は並行して進めますか？

A) 順番に進める（backend 完了後に frontend）：依存関係が明確で安全
B) 並行して進める（shared 完了後に同時着手）：開発速度優先
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2

各ユニットのコード生成粒度はどうしますか？

A) スキャフォールディングのみ（ディレクトリ構成・設定ファイル・空のファイル）
B) スキャフォールディング + コーディング規約ドキュメント（規約を .md で出力）
C) スキャフォールディング + 規約ドキュメント + サンプル実装（1リソース分の実装例）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3

Prisma schema.prisma の初期テーブル定義はどうしますか？

A) 空のスキーマのみ（テーブル定義なし）
B) User テーブルのみ（Supabase Auth と連携する基本構成）
C) Other (please describe after [Answer]: tag below)

[Answer]: A
