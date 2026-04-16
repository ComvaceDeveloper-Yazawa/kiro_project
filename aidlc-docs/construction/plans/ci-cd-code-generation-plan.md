# Code Generation 計画 - Unit 5: ci-cd

## ユニット概要

- **目的**: GitHub Actions（Lint + Test + Deploy）と Playwright E2E のスキャフォールディング
- **生成場所**: `.github/workflows/` + `packages/e2e/`
- **依存**: 全ユニット完了後（shared / supabase / backend / frontend）

## 実行チェックリスト

### Part 1: GitHub Actions ワークフロー

- [x] Step 1: `.github/workflows/lint-test.yml` 生成（PR 時: Lint + Vitest）
- [x] Step 2: `.github/workflows/deploy.yml` 生成（main マージ時: Deploy）

### Part 2: pnpm ワークスペース設定

- [x] Step 3: `pnpm-workspace.yaml` 生成（ルート）
- [x] Step 4: ルート `package.json` 生成（モノレポ管理スクリプト）

### Part 3: Playwright E2E

- [x] Step 5: `packages/e2e/package.json` 生成
- [x] Step 6: `packages/e2e/playwright.config.ts` 生成
- [x] Step 7: `packages/e2e/tests/example.spec.ts` 生成（スキャフォールディング）

### Part 4: ドキュメント生成

- [x] Step 8: `packages/e2e/CODING_STANDARDS.md` 生成
- [x] Step 9: `aidlc-docs/construction/ci-cd/code/summary.md` 生成
