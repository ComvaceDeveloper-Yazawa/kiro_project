# kiro_project

AWS Kiro学習用のリポジトリ（Vercel対応）

---

## このリポジトリについて

このリポジトリは **AI-DLC (AI-Driven Development Life Cycle)** というAI駆動のソフトウェア開発ワークフローを Kiro IDE 上で学習・実践するための環境です。

AI-DLCは、AIがソフトウェア開発の各フェーズを構造的にガイドしながら、プロジェクトの複雑さや状況に応じて柔軟に適応するワークフローです。

---

## 技術ブログ機能

このプロジェクトには技術ブログ機能が実装されています。

### 機能概要

- **記事管理**: Markdown形式での記事作成・編集・公開・削除
- **画像アップロード**: 記事内に画像を挿入可能（最大5MB）
- **タグ機能**: 記事にタグを付けて分類・検索
- **サンドボックス埋め込み**: StackBlitz/CodeSandboxのコード実行環境を記事内に埋め込み
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: WCAG AA準拠

### 技術スタック

**Backend:**

- Fastify + TypeScript
- Prisma (ORM)
- Supabase (Database + Storage + Auth)
- Zod (Validation)

**Frontend:**

- Vue 3 (Composition API)
- TypeScript
- Pinia (State Management)
- Vue Router
- Marked + DOMPurify (Markdown処理)

**Shared:**

- Zod schemas
- TypeScript types

### API ドキュメント

詳細なAPI仕様は [docs/TECH_BLOG_API.md](docs/TECH_BLOG_API.md) を参照してください。

### 開発状況

- ✅ Phase 1-6: Backend完成（Domain, Infrastructure, Application, Interface層）
- ✅ Phase 7-10: Frontend完成（Composables, Stores, Components, Views, Router）
- ✅ Phase 11: スタイリング（レスポンシブ・アクセシビリティ対応）
- ✅ Phase 12-16: テスト・ドキュメント作成完了
- ✅ Vercel デプロイ設定完了（モノレポ対応）

### デプロイ情報

**フロントエンド**: https://kiro-project-frontend.vercel.app  
**バックエンド**: https://kiro-project-backend-nine.vercel.app

> 最終更新: 2026-04-23 - Vercel Serverless Functions対応完了

#### Vercel設定概要

**フロントエンド**:

- Root Directory: `packages/frontend`
- Build Command: `pnpm build`
- Output Directory: `dist`

**バックエンド**:

- Root Directory: ルート（モノレポ全体）
- Build Command: `vercel.json`で制御
- Install Command: `pnpm install --no-frozen-lockfile`
- API: `/api/index.ts`経由でServerless Function化

詳細なデプロイ手順は [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) を参照してください。

---

## ディレクトリ構造

```
.
├── README.md                          # このファイル
├── docs/
│   └── TECH_BLOG_API.md              # 技術ブログAPI仕様書
├── packages/
│   ├── backend/                      # Fastify + Prisma
│   ├── frontend/                     # Vue 3 + TypeScript
│   ├── shared/                       # 共通型定義・Zodスキーマ
│   ├── supabase/                     # Supabaseマイグレーション
│   └── e2e/                          # E2Eテスト（Playwright）
└── .kiro/
    ├── specs/
    │   └── tech-blog/                # 技術ブログ機能のSpec
    ├── steering/
    │   └── aws-aidlc-rules/
    │       └── core-workflow.md      # ワークフロー全体のルール定義
    └── aws-aidlc-rule-details/       # 各フェーズ・ステージの詳細ルール
        ├── common/                   # 全フェーズ共通ルール
        ├── inception/                # インセプションフェーズのルール
        ├── construction/             # コンストラクションフェーズのルール
        ├── operations/               # オペレーションフェーズのルール（将来拡張用）
        └── extensions/
            └── security/
                └── baseline/         # セキュリティベースラインルール
```

---

## セットアップ

### 前提条件

- Node.js >= 20
- pnpm >= 9
- Supabase CLI

### インストール

```bash
# 依存関係のインストール
pnpm install

# Supabaseプロジェクトとリンク
cd packages/supabase
supabase link --project-ref <your-project-ref>

# マイグレーション適用
supabase db push

# Prisma Client生成
cd ../backend
pnpm db:generate
```

### 環境変数

`packages/backend/.env`:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
```

`packages/frontend/.env`:

```
VITE_API_BASE_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://..."
VITE_SUPABASE_ANON_KEY="..."
```

### 開発サーバー起動

```bash
# Backend
pnpm dev:backend

# Frontend
pnpm dev:frontend
```

---

## AI-DLC ワークフロー概要

AI-DLCは3つのフェーズで構成されています。

```
ユーザーリクエスト
        |
        v
+---------------------------------------+
|  INCEPTION PHASE（インセプション）      |
|  「何を作るか・なぜ作るか」を決める      |
+---------------------------------------+
        |
        v
+---------------------------------------+
|  CONSTRUCTION PHASE（コンストラクション）|
|  「どのように作るか」を実装する          |
+---------------------------------------+
        |
        v
+---------------------------------------+
|  OPERATIONS PHASE（オペレーション）     |
|  デプロイ・運用（将来拡張予定）          |
+---------------------------------------+
```

詳細は元のREADME内容を参照してください。

---

## ライセンス

MIT

```
.
├── README.md                          # このファイル
└── .kiro/
    ├── steering/
    │   └── aws-aidlc-rules/
    │       └── core-workflow.md       # ワークフロー全体のルール定義（ステアリングファイル）
    └── aws-aidlc-rule-details/        # 各フェーズ・ステージの詳細ルール
        ├── common/                    # 全フェーズ共通ルール
        ├── inception/                 # インセプションフェーズのルール
        ├── construction/              # コンストラクションフェーズのルール
        ├── operations/                # オペレーションフェーズのルール（将来拡張用）
        └── extensions/
            └── security/
                └── baseline/          # セキュリティベースラインルール
```

### `.kiro/steering/aws-aidlc-rules/core-workflow.md`

Kiro IDE のステアリング機能によって自動的に読み込まれるルールファイルです。AIがソフトウェア開発リクエストを受けた際に従うべきワークフロー全体（フェーズ・ステージの実行条件、進行ルール、監査ログの記録方法など）を定義しています。

### `.kiro/aws-aidlc-rule-details/`

各フェーズ・ステージの詳細な実行手順が格納されています。`core-workflow.md` から参照され、AIが各ステージを実行する際に読み込みます。

---

## AI-DLC ワークフロー概要

AI-DLCは3つのフェーズで構成されています。

```
ユーザーリクエスト
        |
        v
+---------------------------------------+
|  INCEPTION PHASE（インセプション）      |
|  「何を作るか・なぜ作るか」を決める      |
|                                       |
|  ・Workspace Detection  [常時実行]     |
|  ・Reverse Engineering  [条件付き]     |
|  ・Requirements Analysis[常時実行]     |
|  ・User Stories         [条件付き]     |
|  ・Workflow Planning    [常時実行]     |
|  ・Application Design   [条件付き]     |
|  ・Units Generation     [条件付き]     |
+---------------------------------------+
        |
        v
+---------------------------------------+
|  CONSTRUCTION PHASE（コンストラクション）|
|  「どのように作るか」を実装する          |
|                                       |
|  ユニットごとに繰り返し:               |
|  ・Functional Design    [条件付き]     |
|  ・NFR Requirements     [条件付き]     |
|  ・NFR Design           [条件付き]     |
|  ・Infrastructure Design[条件付き]     |
|  ・Code Generation      [常時実行]     |
|                                       |
|  ・Build and Test       [常時実行]     |
+---------------------------------------+
        |
        v
+---------------------------------------+
|  OPERATIONS PHASE（オペレーション）     |
|  デプロイ・運用（将来拡張予定）          |
+---------------------------------------+
        |
        v
     完了
```

---

## 各フェーズの詳細

### INCEPTION PHASE（インセプション）

プロジェクトの計画・要件定義・アーキテクチャ設計を行うフェーズです。

| ステージ              | 実行条件                 | 概要                                                                                    |
| --------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| Workspace Detection   | 常時実行                 | ワークスペースを分析し、新規(Greenfield)か既存(Brownfield)かを判定する                  |
| Reverse Engineering   | Brownfieldのみ           | 既存コードベースを解析し、アーキテクチャ・コンポーネント・API等のドキュメントを生成する |
| Requirements Analysis | 常時実行（深度は適応的） | 要件を収集・整理する。リクエストの複雑さに応じて詳細度が変わる                          |
| User Stories          | 条件付き                 | ユーザーストーリーとペルソナを作成する。ユーザー影響がある機能変更時に実行              |
| Workflow Planning     | 常時実行                 | どのステージを実行・スキップするかの実行計画を作成する                                  |
| Application Design    | 条件付き                 | 新しいコンポーネントやサービス層の設計が必要な場合に実行                                |
| Units Generation      | 条件付き                 | システムを複数の作業単位(Unit of Work)に分解する必要がある場合に実行                    |

### CONSTRUCTION PHASE（コンストラクション）

詳細設計・コード生成・ビルド・テストを行うフェーズです。各ユニットに対してループ処理で実行されます。

| ステージ              | 実行条件                 | 概要                                                                               |
| --------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| Functional Design     | 条件付き（ユニットごと） | データモデルや複雑なビジネスロジックの詳細設計                                     |
| NFR Requirements      | 条件付き（ユニットごと） | 非機能要件（性能・セキュリティ・スケーラビリティ）の評価とTech Stack選定           |
| NFR Design            | 条件付き（ユニットごと） | NFRパターンの設計への組み込み                                                      |
| Infrastructure Design | 条件付き（ユニットごと） | クラウドリソースやデプロイアーキテクチャの設計                                     |
| Code Generation       | 常時実行（ユニットごと） | 計画(Part 1)と生成(Part 2)の2段階でコードを生成する                                |
| Build and Test        | 常時実行                 | 全ユニットのビルド手順・ユニットテスト・統合テスト・性能テスト等の指示書を生成する |

### OPERATIONS PHASE（オペレーション）

デプロイ・監視・運用のフェーズです。現時点ではプレースホルダーであり、将来的に拡張予定です。

---

## 共通ルールファイル（`common/`）

| ファイル                       | 役割                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| `process-overview.md`          | ワークフロー全体の技術的リファレンス（Mermaidフロー図含む）   |
| `welcome-message.md`           | ワークフロー開始時にユーザーへ表示するウェルカムメッセージ    |
| `terminology.md`               | AI-DLC用語集（Phase/Stage/Unit/Componentなどの定義）          |
| `depth-levels.md`              | 適応的な詳細度レベルの説明（Minimal/Standard/Comprehensive）  |
| `session-continuity.md`        | セッション再開時の手順とコンテキスト復元ルール                |
| `content-validation.md`        | ファイル作成前のコンテンツ検証ルール（Mermaid構文チェック等） |
| `ascii-diagram-standards.md`   | ASCIIアート図の標準規格                                       |
| `question-format-guide.md`     | 質問ファイルのフォーマットルール（A/B/C/D選択肢形式）         |
| `error-handling.md`            | エラー発生時の回復手順                                        |
| `overconfidence-prevention.md` | AIの過信防止ガイドライン                                      |
| `workflow-changes.md`          | ワークフロー変更履歴                                          |

---

## セキュリティ拡張（`extensions/security/`）

`security-baseline.md` には、全フェーズに横断的に適用される **15のセキュリティルール** が定義されています。これらはオプションではなく、有効化された場合はブロッキング制約として機能します。

| ルールID    | 概要                                     |
| ----------- | ---------------------------------------- |
| SECURITY-01 | 保存データ・転送データの暗号化           |
| SECURITY-02 | ネットワーク中継点のアクセスログ         |
| SECURITY-03 | アプリケーションレベルの構造化ログ       |
| SECURITY-04 | WebアプリのHTTPセキュリティヘッダー      |
| SECURITY-05 | 全APIパラメータの入力バリデーション      |
| SECURITY-06 | 最小権限アクセスポリシー                 |
| SECURITY-07 | 制限的なネットワーク設定                 |
| SECURITY-08 | アプリケーションレベルのアクセス制御     |
| SECURITY-09 | セキュリティハードニングと設定ミス防止   |
| SECURITY-10 | ソフトウェアサプライチェーンセキュリティ |
| SECURITY-11 | セキュアデザイン原則                     |
| SECURITY-12 | 認証とクレデンシャル管理                 |
| SECURITY-13 | ソフトウェア・データ整合性の検証         |
| SECURITY-14 | アラートとモニタリング                   |
| SECURITY-15 | 例外処理とフェイルセーフデフォルト       |

セキュリティルールの適用有無は、Requirements Analysisステージの質問で決定されます（本番グレードのアプリには推奨、PoC・プロトタイプはスキップ可）。

---

## ワークフロー実行時に生成されるドキュメント

AI-DLCワークフローを実行すると、以下の構造でドキュメントが生成されます（アプリケーションコードはワークスペースルートに配置）。

```
aidlc-docs/
├── aidlc-state.md              # ワークフローの進捗状態トラッキング
├── audit.md                    # 全インタラクションの監査ログ
├── inception/
│   ├── plans/
│   │   └── execution-plan.md   # 実行計画
│   ├── requirements/
│   │   └── requirements.md     # 要件定義書
│   ├── user-stories/           # ユーザーストーリー（条件付き）
│   ├── application-design/     # アプリケーション設計（条件付き）
│   └── reverse-engineering/    # リバースエンジニアリング成果物（Brownfieldのみ）
└── construction/
    ├── plans/                  # コード生成計画
    ├── {unit-name}/            # ユニットごとの設計・コードサマリー
    └── build-and-test/         # ビルド・テスト手順書
```

---

## 主要な設計原則

- **適応的実行**: 各ステージはプロジェクトの必要性に応じて実行・スキップが判断される
- **透明性**: 実行計画をユーザーが確認・承認してから作業が進む
- **ユーザーコントロール**: ユーザーはステージの追加・除外を要求できる
- **完全な監査証跡**: 全ての意思決定とユーザー入力が `audit.md` に記録される
- **コードとドキュメントの分離**: アプリケーションコードはワークスペースルート、ドキュメントは `aidlc-docs/` のみ
- **チェックボックストラッキング**: 計画の各ステップ完了時に即座にチェックボックスを更新する

---

## セッション記録（2026-04-15）

### 概要

このセッションでは、技術選定確定済みのモノレポプロジェクトに対して、AI-DLC ワークフローの **INCEPTION フェーズ前半**（Workspace Detection → Requirements Analysis → Workflow Planning）を実行しました。

### ユーザーリクエスト

実務レベルのテックリードとして、以下の技術スタックを前提に開発基盤・標準を整理するよう依頼しました。

**確定済み技術選定:**

| レイヤー       | 技術                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| 基盤           | Supabase（DB + Auth）、Supabase CLI                                                            |
| バックエンド   | Fastify、TypeScript、esbuild、Vitest、Prisma、Zod、ESLint、Prettier                            |
| フロントエンド | Vue 3（script setup）、TypeScript、Vite、Vitest、Pinia、fetch API、Zod、SCSS、ESLint、Prettier |
| 共通           | Zod スキーマを shared ディレクトリで管理                                                       |

**依頼内容（7項目）:**

1. ディレクトリ構成（モノレポ・tree形式）
2. shared 設計（Zod スキーマ・API 型・循環依存防止）
3. コーディング規約（推奨/非推奨/理由形式）
4. ESLint / Prettier 方針
5. テスト方針（カバレッジ100%の現実的運用）
6. SCSS 運用ルール
7. Supabase + Prisma + Fastify の責務整理

### セッションのやり取り記録

| 時刻（JST目安） | ステージ              | 内容                                                                                                                                                                                               |
| --------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| セッション開始  | Workspace Detection   | ワークスペースをスキャン。README.md・structure.md のみ存在。アプリコードなし → Greenfield 判定                                                                                                     |
| 自動進行        | Requirements Analysis | 要件確認質問ファイル（10問）を作成。プロジェクトフェーズ・セキュリティ適用・モノレポツール・Edge Functions 用途・Prisma 接続方式・ルーティング・カバレッジ目標・E2E・SCSS 命名・CI/CD について確認 |
| ユーザー回答    | Requirements Analysis | 10問すべてに回答。矛盾なし。要件定義書を生成                                                                                                                                                       |
| ユーザー承認    | Requirements Analysis | 要件定義書を承認                                                                                                                                                                                   |
| 自動進行        | Workflow Planning     | スコープ分析・リスク評価を実施。実行計画（5ユニット構成）を作成                                                                                                                                    |
| セッション終了  | Workflow Planning     | 実行計画の承認待ちで本日の作業終了                                                                                                                                                                 |

### ユーザー回答サマリー

| 質問                   | 回答                                             |
| ---------------------- | ------------------------------------------------ |
| プロジェクトフェーズ   | 社内ツール・小規模本番                           |
| セキュリティルール適用 | Yes（SECURITY-01〜15 全適用）                    |
| モノレポ管理ツール     | pnpm workspaces                                  |
| Edge Functions 用途    | 不使用（Fastify で完結する方針）                 |
| Prisma 接続方式        | Direct（マイグレーション）+ Pooler（アプリ実行） |
| フロントルーティング   | Vue Router（SPA）                                |
| テストカバレッジ目標   | 100%（厳格運用）                                 |
| E2E テスト             | Playwright（主要フローのみ）                     |
| SCSS 命名規則          | SMACSS ベース                                    |
| CI/CD                  | GitHub Actions（Lint + Test + Deploy）           |

### 現在の進捗状態

```
[x] Workspace Detection   - 完了
[ ] Reverse Engineering   - SKIP（Greenfield のため）
[x] Requirements Analysis - 完了・承認済み
[ ] User Stories          - SKIP（開発基盤整備のため不要）
[ ] Workflow Planning     - 完了・承認待ち ← 次回はここから
[ ] Application Design    - 未着手
[ ] Units Generation      - 未着手
```

**次回セッションの開始点:** Workflow Planning の承認 → Application Design へ進む

---

## 本セッションで作成したファイル

### ファイル一覧と必要性

#### `aidlc-docs/aidlc-state.md`

**なぜ必要か:**
AI-DLC ワークフローの「現在地」を記録するファイルです。セッションをまたいで作業を再開するとき、AIはまずこのファイルを読み込み、どのステージまで完了しているか・次に何をすべきかを把握します。これがないと毎回ゼロから状態を推測することになり、誤った再開や重複作業が発生します。

**内容:**

- プロジェクト種別（Greenfield/Brownfield）
- 各ステージの進捗（完了/スキップ/実行予定）
- セキュリティ拡張の有効/無効設定
- 現在のフェーズ・ステージ・次のステップ

---

#### `aidlc-docs/audit.md`

**なぜ必要か:**
ユーザーとAIのすべてのやり取りを時系列で記録する監査ログです。「なぜこの設計判断をしたのか」「ユーザーが何を承認したか」を後から追跡できます。チーム開発では意思決定の根拠が重要であり、このログがあることで「誰がいつ何を決めたか」が明確になります。また、セッション再開時にAIがコンテキストを復元する際の補助情報にもなります。

**内容:**

- 各ステージの開始・完了タイムスタンプ
- ユーザーの完全な入力（要約なし）
- AIの対応内容
- 承認・却下の記録

---

#### `aidlc-docs/inception/requirements/requirement-verification-questions.md`

**なぜ必要か:**
要件定義に必要な補足情報をユーザーから収集するための質問ファイルです。AIがチャット内でインラインに質問するのではなく、専用ファイルに整理することで、ユーザーが落ち着いて回答でき、回答内容がそのままドキュメントとして残ります。また、回答の矛盾チェックや後からの参照が容易になります。

**内容（10問）:**

- プロジェクトフェーズ・セキュリティ適用有無
- モノレポ管理ツール・Edge Functions 用途
- Prisma 接続方式・ルーティング方式
- テストカバレッジ目標・E2E 導入有無
- SCSS 命名規則・CI/CD 構成

---

#### `aidlc-docs/inception/requirements/requirements.md`

**なぜ必要か:**
プロジェクトの「何を作るか・どんな制約があるか」を一箇所にまとめた要件定義書です。技術選定・機能要件・非機能要件・API レスポンス形式・CSS 方針・成功基準がすべてここに集約されています。後続の設計・実装フェーズでは常にこのファイルを参照することで、判断の一貫性が保たれます。チームメンバーが増えたときのオンボーディング資料としても機能します。

**内容:**

- 確定済み技術選定の一覧（フロント・バック・共通）
- 機能要件 FR-01〜07（ディレクトリ構成・shared設計・規約・Lint・テスト・SCSS・責務整理）
- 非機能要件 NFR-01〜06（カバレッジ・セキュリティ・CI/CD・Prisma接続・ルーティング・Edge Functions）
- 確定済み API レスポンス形式・CSS 方針
- 成功基準

---

#### `aidlc-docs/inception/plans/execution-plan.md`

**なぜ必要か:**
「どのステージを実行しどのステージをスキップするか」の根拠付き計画書です。AI-DLC はすべてのステージを機械的に実行するのではなくプロジェクトの性質に応じて適応的に実行します。このファイルがあることでスキップの理由が明確になり、ユーザーが「なぜこのステージはやらないのか」を確認・変更できます。また、5ユニットの実行順序（shared → supabase → backend → frontend → ci-cd）の依存関係も記録されています。

**内容:**

- 変更インパクト評価・リスク評価
- ワークフロー可視化（ASCII図）
- 各ステージの EXECUTE/SKIP 判定と理由
- 5ユニットの構成と実行順序
- 成功基準
