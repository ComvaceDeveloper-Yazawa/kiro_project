# Code Generation サマリー - Unit 5: ci-cd

## 生成ファイル一覧

### GitHub Actions

| ファイル                          | 内容                                                              |
| --------------------------------- | ----------------------------------------------------------------- |
| `.github/workflows/lint-test.yml` | PR 時: 全パッケージの Lint + Vitest + Build                       |
| `.github/workflows/deploy.yml`    | main マージ時: E2E → Deploy（デプロイステップはプレースホルダー） |

### モノレポ設定

| ファイル                 | 内容                                                |
| ------------------------ | --------------------------------------------------- |
| `pnpm-workspace.yaml`    | pnpm workspaces 設定                                |
| `package.json`（ルート） | モノレポ管理スクリプト（dev / build / test / lint） |

### Playwright E2E

| ファイル                             | 内容                                                       |
| ------------------------------------ | ---------------------------------------------------------- |
| `packages/e2e/package.json`          | Playwright 依存関係                                        |
| `packages/e2e/playwright.config.ts`  | Playwright 設定（Chromium のみ・BASE_URL 環境変数）        |
| `packages/e2e/tests/example.spec.ts` | テストスキャフォールディング（認証フローテンプレート付き） |

### ドキュメント

| ファイル                           | 内容                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| `packages/e2e/CODING_STANDARDS.md` | E2E テスト方針・CI/CD 変更ルール・必要な Secrets 一覧 |

---

## 完了条件チェックリスト

- [x] lint-test.yml（PR 時: 全パッケージ Lint + Test + Build）
- [x] deploy.yml（E2E → Deploy の順序保証）
- [x] pnpm-workspace.yaml
- [x] ルート package.json（モノレポスクリプト）
- [x] e2e/package.json / playwright.config.ts / example.spec.ts
- [x] CODING_STANDARDS.md

---

## デプロイ前に必要な作業

1. GitHub リポジトリの Settings > Secrets に以下を登録:
   - `VITE_API_BASE_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `STAGING_URL`
2. `deploy.yml` の `Deploy (placeholder)` ステップを実際のデプロイコマンドに置き換える
