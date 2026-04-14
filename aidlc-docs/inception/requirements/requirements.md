# 要件定義書

## インテント分析サマリー

| 項目                 | 内容                                                             |
| -------------------- | ---------------------------------------------------------------- |
| リクエスト種別       | 新規プロジェクト（Greenfield）の開発基盤・標準整理               |
| リクエストタイプ     | 開発標準定義（コーディング規約・アーキテクチャ設計・ツール設定） |
| スコープ             | モノレポ全体（frontend / backend / shared / supabase）           |
| 複雑度               | Moderate（複数コンポーネント・複数関心事にまたがる）             |
| プロジェクトフェーズ | 社内ツール・小規模本番（セキュリティは厳格適用）                 |

---

## 確定済み技術選定

### 基盤

- Supabase（DB + Auth）
- Supabase CLI（DB・Edge Functions 管理）
- バックエンド本体: Fastify

### フロントエンド

| 項目              | 技術                       |
| ----------------- | -------------------------- |
| FW                | Vue 3（script setup）      |
| 言語              | TypeScript                 |
| ビルド            | Vite                       |
| テスト            | Vitest                     |
| 状態管理          | Pinia                      |
| HTTP クライアント | fetch API                  |
| Linter            | ESLint（all ルールベース） |
| Formatter         | Prettier                   |
| スキーマ          | Zod                        |
| スタイル          | SCSS                       |

### バックエンド

| 項目           | 技術                       |
| -------------- | -------------------------- |
| FW             | Fastify                    |
| 言語           | TypeScript                 |
| ビルド         | esbuild                    |
| テスト         | Vitest                     |
| ORM            | Prisma                     |
| Linter         | ESLint（all ルールベース） |
| Formatter      | Prettier                   |
| 認証           | Supabase Auth              |
| バリデーション | Zod（フロントと共通）      |

### 共通

- Zod スキーマは `shared/` ディレクトリで管理
- モノレポ管理: **pnpm workspaces**

---

## 機能要件

### FR-01: ディレクトリ構成

- モノレポ前提で `frontend / backend / shared / supabase` を分離
- tree 形式で各ディレクトリの役割を明示
- 「何をどこに置くか」のルールを明確化

### FR-02: shared 設計

- Zod スキーマの配置ルールを定義
- API 型の定義方法を定義
- フロント・バックでの使い方を定義
- 循環依存を防ぐルールを定義

### FR-03: コーディング規約

- 命名規約（変数 / 関数 / コンポーネント / 型）
- boolean 命名規則
- 非同期処理の書き方
- エラーハンドリング方針
- 共通化の基準
- ファイル分割ルール
- 各項目を「推奨 / 非推奨 / 理由」形式で定義

### FR-04: ESLint / Prettier 方針

- ESLint all ベースの運用方針
- 緩めるべきルールの特定
- Prettier との競合対策
- import 順の扱い
- `any` / `console.log` の扱い

### FR-05: テスト方針

- カバレッジ 100% の現実的な運用方法
- フロントのテスト粒度
- バックエンドのテスト粒度
- モックの扱い
- E2E: **Playwright で主要フローのみ**

### FR-06: SCSS 運用ルール

- `styles/` の構成
- 変数 / mixin の分け方
- グローバル CSS の最小範囲
- コンポーネント内 SCSS のルール
- 命名規則: **SMACSS ベース**

### FR-07: アーキテクチャ責務整理

- Supabase の役割
- Fastify の役割
- Prisma の役割
- Edge Functions の役割（方針: 認証・DB 通信が Fastify で完結するなら不使用）
- 各責務の明確な分離

---

## 非機能要件

### NFR-01: テストカバレッジ

- 目標: **100%**（厳格運用）
- ただし「カバレッジ 100% の現実的な運用」として、除外対象ルールを明示する

### NFR-02: セキュリティ

- **SECURITY-01〜15 全ルールを適用**（ブロッキング制約）
- 社内ツール・小規模本番であっても厳格適用

### NFR-03: CI/CD

- **GitHub Actions で Lint + Test + Deploy まで**構築
- スコープ: Lint チェック・Vitest 実行・Playwright E2E・デプロイ

### NFR-04: Prisma 接続方式

- マイグレーション用: Supabase PostgreSQL への **Direct connection**
- アプリ実行用: Supabase **Connection Pooler（Pgbouncer）** 経由

### NFR-05: ルーティング

- フロントエンド: **Vue Router（SPA）**

### NFR-06: Edge Functions

- 原則 **不使用**
- Fastify バックエンドで認証・DB 通信が完結する設計を採用
- 将来的に Webhook 等で必要になった場合のみ追加検討

---

## API レスポンス形式（確定）

```typescript
// 成功時
{
  success: true,
  data: {},
  message: ""
}

// 失敗時
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "エラーメッセージ"
  }
}
```

---

## CSS 方針（確定）

- 基本: `<style scoped lang="scss">`
- 共通変数・mixin: `styles/` に配置
- リセット CSS・共通クラスのみグローバル
- それ以外はコンポーネントに閉じる
- 命名規則: **SMACSS ベース**

---

## 成功基準

- チーム全員が迷わず実装できる「統一された基準」が文書化されている
- ディレクトリ構成・命名規則・テスト方針が具体例付きで定義されている
- ESLint / Prettier 設定の根拠が明確になっている
- セキュリティ要件（SECURITY-01〜15）が各設計に反映されている
