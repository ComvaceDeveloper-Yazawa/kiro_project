# Units of Work 依存関係

## 依存マトリクス

| ユニット | shared | supabase | backend            | frontend           | ci-cd |
| -------- | ------ | -------- | ------------------ | ------------------ | ----- |
| shared   | —      | なし     | なし               | なし               | なし  |
| supabase | なし   | —        | なし               | なし               | なし  |
| backend  | 依存   | 依存     | —                  | なし               | なし  |
| frontend | 依存   | なし     | 依存（API仕様）    | —                  | なし  |
| ci-cd    | なし   | なし     | 依存（テスト対象） | 依存（テスト対象） | —     |

**凡例:** 依存 = 行のユニットが列のユニットの完了を必要とする

---

## 依存関係の詳細

### shared への依存

| 依存元   | 依存内容                         | 依存種別                       |
| -------- | -------------------------------- | ------------------------------ |
| backend  | Zod スキーマで入力検証・型利用   | ビルド時依存（pnpm workspace） |
| frontend | Zod スキーマで型利用・API 型参照 | ビルド時依存（pnpm workspace） |

### supabase への依存

| 依存元  | 依存内容                             | 依存種別                |
| ------- | ------------------------------------ | ----------------------- |
| backend | Prisma が Supabase PostgreSQL に接続 | 実行時依存（接続先 DB） |

### backend への依存

| 依存元   | 依存内容                                                | 依存種別                           |
| -------- | ------------------------------------------------------- | ---------------------------------- |
| frontend | API エンドポイント仕様（URL・リクエスト・レスポンス型） | 開発時依存（API 仕様確定後に実装） |
| ci-cd    | Vitest テスト実行・デプロイ対象                         | CI 依存                            |

### frontend への依存

| 依存元 | 依存内容                                        | 依存種別 |
| ------ | ----------------------------------------------- | -------- |
| ci-cd  | Vitest テスト実行・Playwright E2E・デプロイ対象 | CI 依存  |

---

## 実行順序（クリティカルパス）

```
[shared] ──────────────────────────────────────────┐
    │                                               │
    ▼                                               ▼
[supabase]                                      [frontend] ──┐
    │                                               ▲         │
    ▼                                               │         │
[backend] ──────────────────────────────────────────         │
                                                              ▼
                                                          [ci-cd]
```

**クリティカルパス:** shared → supabase → backend → frontend → ci-cd

**並行化の可能性:**

- shared と supabase は互いに独立しているため並行開発可能
- ただし今回は順番に実行（Q1: A）

---

## パッケージ間の技術的依存

### pnpm workspace 依存宣言

```json
// packages/backend/package.json
{
  "dependencies": {
    "@monorepo/shared": "workspace:*"
  }
}

// packages/frontend/package.json
{
  "dependencies": {
    "@monorepo/shared": "workspace:*"
  }
}
```

### 循環依存の防止

以下の依存は禁止（循環依存を引き起こす）:

| 禁止パターン                | 理由                                   |
| --------------------------- | -------------------------------------- |
| shared → backend            | shared は依存の起点。何にも依存しない  |
| shared → frontend           | 同上                                   |
| backend → frontend          | 相互依存禁止                           |
| frontend → backend          | 相互依存禁止                           |
| supabase → backend/frontend | CLI 管理パッケージはアプリに依存しない |

---

## 統合テスト境界

| テスト種別             | 対象                          | タイミング                          |
| ---------------------- | ----------------------------- | ----------------------------------- |
| Unit Test（Vitest）    | 各ユニット内部                | 各ユニットの Code Generation 完了後 |
| Integration Test       | backend ↔ supabase（DB）      | backend 完了後                      |
| E2E Test（Playwright） | frontend ↔ backend ↔ supabase | 全ユニット完了後（ci-cd フェーズ）  |
