# 要件確認質問

技術選定は確定済みのため、開発基盤・標準整理に関する補足情報を確認します。
各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

このプロジェクトの想定フェーズはどれですか？

A) PoC・プロトタイプ（動作確認が目的）
B) 社内ツール・小規模本番（セキュリティ要件は最低限）
C) 本番グレードのプロダクト（セキュリティ・品質要件を厳格に適用）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

セキュリティ拡張ルール（SECURITY-01〜15）を本ワークフローに適用しますか？
本番グレードのアプリには推奨、PoC・プロトタイプはスキップ可能です。

A) Yes — 全SECURITYルールをブロッキング制約として適用する（本番グレード推奨）
B) No — SECURITYルールをスキップする（PoC・プロトタイプ向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

モノレポの管理ツールはどれを使用しますか？

A) pnpm workspaces（推奨：高速・ディスク効率良好）
B) npm workspaces
C) Turborepo + pnpm
D) Nx
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

Supabase Edge Functions の用途はどれですか？

A) 使用しない（Fastify バックエンドのみ）
B) 軽量なWebhook・イベントハンドラのみ
C) 認証フック（Supabase Auth のカスタムロジック）
D) B と C の両方
E) Other (please describe after [Answer]: tag below)

[Answer]: E：使用しなくても認証ロジックやDB通信が可能であればEdgeFunctionsは使わない方針でよい。

## Question 5

Prisma の接続先はどれですか？

A) Supabase の PostgreSQL に直接接続（Direct connection）
B) Supabase の Connection Pooler（Pgbouncer）経由
C) 両方（マイグレーション用に Direct、アプリ用に Pooler）
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 6

フロントエンドのルーティング方式はどれですか？

A) Vue Router（SPA）
B) Vue Router（SSR / Nuxt は使わない）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7

テストカバレッジの目標はどれですか？

A) カバレッジ計測なし（テストは書くが数値目標なし）
B) 重要ロジックのみ 80% 以上
C) 全体 80% 以上（現実的な運用ライン）
D) 全体 100%（厳格運用）
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 8

E2E テストを導入しますか？

A) 導入しない（Unit + Integration のみ）
B) Playwright で主要フローのみ
C) Cypress で主要フローのみ
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9

SCSS の命名規則はどれを採用しますか？

A) BEM（Block\_\_Element--Modifier）
B) SMACSS ベース
C) 命名規則なし（コンポーネントスコープで管理）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 10

CI/CD パイプラインは構築しますか？

A) 今回のスコープ外（手動デプロイ）
B) GitHub Actions で Lint + Test のみ
C) GitHub Actions で Lint + Test + Deploy まで
D) Other (please describe after [Answer]: tag below)

[Answer]: C
