# Build and Test サマリー

## プロジェクト概要

| 項目                 | 内容                                 |
| -------------------- | ------------------------------------ |
| モノレポ管理         | pnpm workspaces                      |
| ビルドツール         | esbuild（backend）/ Vite（frontend） |
| テストフレームワーク | Vitest（unit）/ Playwright（E2E）    |
| CI/CD                | GitHub Actions                       |

---

## ビルド手順サマリー

```bash
pnpm install          # 依存関係インストール
pnpm db:generate      # Prisma クライアント生成
pnpm build            # 全パッケージビルド（shared → backend → frontend）
```

詳細: `build-instructions.md`

---

## テスト実行サマリー

| テスト種別     | コマンド                                        | 対象                        |
| -------------- | ----------------------------------------------- | --------------------------- |
| ユニットテスト | `pnpm test`                                     | shared / backend / frontend |
| カバレッジ     | `pnpm --filter @monorepo/backend test:coverage` | 目標 100%                   |
| E2E テスト     | `pnpm test:e2e`                                 | 主要フロー（Playwright）    |

---

## カバレッジ目標

| パッケージ | 目標 | 除外対象                      |
| ---------- | ---- | ----------------------------- |
| shared     | 100% | なし                          |
| backend    | 100% | `src/index.ts`                |
| frontend   | 100% | `src/main.ts`、`src/env.d.ts` |

---

## CI/CD パイプライン

```
PR 作成
  └── lint-test.yml
        ├── Lint（shared / backend / frontend）
        ├── Test（shared / backend / frontend）
        └── Build（shared / backend / frontend）

main マージ
  └── deploy.yml
        ├── E2E テスト（Playwright）
        └── Deploy（プレースホルダー → 実装が必要）
```

---

## 次のステップ（実装時に必要な作業）

### 必須

- [ ] GitHub Secrets の登録（`VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `STAGING_URL`）
- [ ] `deploy.yml` のデプロイステップを実際のコマンドに置き換え
- [ ] 各パッケージのユニットテストを実装（スキャフォールディングに合わせて）

### 推奨

- [ ] ESLint / Prettier 設定ファイルを追加（`.eslintrc.cjs` / `.prettierrc`）
- [ ] `vitest.config.ts` をルートに追加（ワークスペース全体のテスト設定）
- [ ] E2E テストに認証フローを追加（機能実装後）

---

## 全体ステータス

| フェーズ                      | ステータス       |
| ----------------------------- | ---------------- |
| INCEPTION                     | ✅ 完了          |
| CONSTRUCTION - shared         | ✅ 完了          |
| CONSTRUCTION - supabase       | ✅ 完了          |
| CONSTRUCTION - backend        | ✅ 完了          |
| CONSTRUCTION - frontend       | ✅ 完了          |
| CONSTRUCTION - ci-cd          | ✅ 完了          |
| CONSTRUCTION - Build and Test | ✅ 手順書完了    |
| OPERATIONS                    | プレースホルダー |
