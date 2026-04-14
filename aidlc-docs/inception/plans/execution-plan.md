# 実行計画

## 詳細分析サマリー

### 変更インパクト評価

- **ユーザー向け変更**: なし（開発基盤・標準の整備）
- **構造的変更**: あり（モノレポ構成・ディレクトリ設計）
- **データモデル変更**: なし（スキーマ設計は別途）
- **API 変更**: なし（レスポンス形式は確定済み）
- **NFR インパクト**: あり（セキュリティ SECURITY-01〜15 全適用）

### リスク評価

- **リスクレベル**: Low
- **ロールバック複雑度**: Easy（ドキュメント・設定ファイルのみ）
- **テスト複雑度**: Moderate（カバレッジ 100% 厳格運用）

---

## ワークフロー可視化

```
[User Request]
      |
      v
+------------------------------------------+
|  INCEPTION PHASE                         |
|                                          |
|  [x] Workspace Detection   COMPLETED     |
|  [ ] Reverse Engineering   SKIP          |
|  [x] Requirements Analysis COMPLETED     |
|  [ ] User Stories          SKIP          |
|  [ ] Workflow Planning     IN PROGRESS   |
|  [ ] Application Design    EXECUTE       |
|  [ ] Units Generation      EXECUTE       |
+------------------------------------------+
      |
      v
+------------------------------------------+
|  CONSTRUCTION PHASE                      |
|                                          |
|  Per-Unit Loop:                          |
|  [ ] Functional Design     EXECUTE       |
|  [ ] NFR Requirements      SKIP          |
|  [ ] NFR Design            SKIP          |
|  [ ] Infrastructure Design SKIP          |
|  [ ] Code Generation       EXECUTE       |
|                                          |
|  [ ] Build and Test        EXECUTE       |
+------------------------------------------+
      |
      v
+------------------------------------------+
|  OPERATIONS PHASE                        |
|  [ ] Operations            PLACEHOLDER   |
+------------------------------------------+
      |
      v
   [Complete]
```

---

## 実行ステージ一覧

### 🔵 INCEPTION PHASE

- [x] Workspace Detection - COMPLETED
- [x] Reverse Engineering - SKIP（Greenfield のため）
- [x] Requirements Analysis - COMPLETED
- [ ] User Stories - **SKIP**
  - 理由: ユーザー向け機能変更ではなく、開発基盤・標準整備のため
- [ ] Workflow Planning - **IN PROGRESS**
- [ ] Application Design - **EXECUTE**
  - 理由: モノレポ構成・各パッケージの責務・コンポーネント設計が必要
- [ ] Units Generation - **EXECUTE**
  - 理由: frontend / backend / shared / supabase / CI-CD の 5 ユニットに分解が必要

### 🟢 CONSTRUCTION PHASE（ユニットごとに繰り返し）

- [ ] Functional Design - **EXECUTE**（各ユニット）
  - 理由: ディレクトリ構成・命名規則・設定ファイルの詳細設計が必要
- [ ] NFR Requirements - **SKIP**
  - 理由: 技術選定・NFR は要件定義書に確定済み
- [ ] NFR Design - **SKIP**
  - 理由: NFR Requirements をスキップするため
- [ ] Infrastructure Design - **SKIP**
  - 理由: Supabase・GitHub Actions は確定済み。詳細インフラ設計不要
- [ ] Code Generation - **EXECUTE**（各ユニット）
  - 理由: 実際のファイル・設定・コードを生成する
- [ ] Build and Test - **EXECUTE**
  - 理由: ビルド手順・テスト実行手順の文書化が必要

### 🟡 OPERATIONS PHASE

- [ ] Operations - PLACEHOLDER

---

## ユニット構成（Units Generation で詳細化）

| ユニット         | 内容                                                           | 優先度                   |
| ---------------- | -------------------------------------------------------------- | ------------------------ |
| Unit 1: shared   | Zod スキーマ・API 型定義・共通ユーティリティ                   | 最高（他ユニットが依存） |
| Unit 2: supabase | DB マイグレーション・RLS ポリシー・Supabase CLI 設定           | 高                       |
| Unit 3: backend  | Fastify アプリ・Prisma 設定・ESLint/Prettier・Vitest           | 高                       |
| Unit 4: frontend | Vue 3 アプリ・Pinia・Vue Router・SCSS・ESLint/Prettier・Vitest | 高                       |
| Unit 5: ci-cd    | GitHub Actions ワークフロー・Playwright E2E                    | 中                       |

### ユニット更新順序

```
shared → supabase → backend → frontend → ci-cd
```

- shared は他全ユニットが依存するため最初に実装
- supabase は backend の Prisma マイグレーションに必要
- backend・frontend は並行開発可能（shared 完了後）
- ci-cd は全ユニット完了後に統合

---

## 推定タイムライン

- **総ステージ数**: 実行 7 ステージ（スキップ 5 ステージ）
- **推定作業量**: Medium（設定ファイル・ドキュメント・スキャフォールディング中心）

## 成功基準

- **主目標**: チームが迷わず開発できる統一基準の確立
- **主要成果物**: モノレポ構成・コーディング規約・ESLint/Prettier 設定・テスト方針・SCSS ルール・アーキテクチャ責務整理
- **品質ゲート**: SECURITY-01〜15 全ルール準拠・カバレッジ 100% 運用方針の確立
