# GUIDEBOOK — このリポジトリの全ファイル解説

このドキュメントは、リポジトリに存在するすべてのファイルが「何を定義しているか」「なぜ存在するのか」を学習目的で詳細に説明したガイドブックです。

---

## ファイル全体マップ

```
kiro_project/
├── README.md
├── GUIDEBOOK.md                                     # このファイル
│
├── .kiro/                                           # Kiro IDE の設定・ルール
│   ├── steering/aws-aidlc-rules/
│   │   └── core-workflow.md                        # AI への行動指示（ステアリング）
│   └── aws-aidlc-rule-details/                     # 各ステージの詳細ルール
│       ├── common/                                  # 全ステージ共通ルール（11ファイル）
│       ├── inception/                               # INCEPTION フェーズのルール（7ファイル）
│       ├── construction/                            # CONSTRUCTION フェーズのルール（6ファイル）
│       ├── operations/                              # OPERATIONS フェーズのルール（1ファイル）
│       └── extensions/security/baseline/           # セキュリティ拡張ルール（1ファイル）
│
├── packages/                                        # アプリケーションコード（AI-DLC が生成）
│   ├── shared/                                      # Unit 1: 共通 Zod スキーマ・型
│   │   ├── src/
│   │   │   ├── schemas/api/
│   │   │   │   ├── response.schema.ts              # ApiResponse<T> 共通ラッパー型
│   │   │   │   └── error.schema.ts                 # ErrorCode 共通エラーコード
│   │   │   └── index.ts                            # 公開エントリポイント
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── CODING_STANDARDS.md                     # shared のコーディング規約
│   │
│   └── supabase/                                    # Unit 2: DB・RLS・CLI 設定
│       ├── migrations/                              # マイグレーションファイル置き場
│       ├── seed.sql                                 # 開発用シードデータ雛形
│       ├── config.toml                              # Supabase CLI 設定
│       └── CODING_STANDARDS.md                     # supabase のコーディング規約
│
└── aidlc-docs/                                      # AI-DLC が生成したドキュメント群
    ├── aidlc-state.md                               # ワークフロー進捗トラッカー
    ├── audit.md                                     # 全インタラクションの監査ログ
    ├── inception/
    │   ├── requirements/
    │   │   ├── requirement-verification-questions.md
    │   │   └── requirements.md
    │   ├── plans/
    │   │   ├── execution-plan.md
    │   │   ├── application-design-plan.md
    │   │   └── unit-of-work-plan.md
    │   └── application-design/
    │       ├── application-design.md               # 統合設計書
    │       ├── components.md
    │       ├── component-methods.md
    │       ├── services.md
    │       ├── component-dependency.md
    │       ├── unit-of-work.md
    │       ├── unit-of-work-dependency.md
    │       └── unit-of-work-story-map.md
    └── construction/
        ├── plans/
        │   ├── shared-functional-design-plan.md
        │   ├── shared-code-generation-plan.md
        │   ├── supabase-functional-design-plan.md
        │   ├── supabase-code-generation-plan.md
        │   ├── backend-functional-design-plan.md  # Unit 3 Functional Design 計画（完了）
        │   ├── backend-code-generation-plan.md    # Unit 3 Code Generation 計画（完了）
        │   ├── frontend-functional-design-plan.md # Unit 4 Functional Design 計画（完了）
        │   ├── frontend-code-generation-plan.md   # Unit 4 Code Generation 計画（Part 1 完了・Part 2 進行中）
        │   └── ci-cd-code-generation-plan.md      # Unit 5 Code Generation 計画（未着手）
        ├── build-and-test/
        │   └── build-instructions.md              # 全パッケージのビルド手順書
        ├── shared/
        │   ├── functional-design/
        │   │   ├── business-logic-model.md
        │   │   ├── business-rules.md
        │   │   └── domain-entities.md
        │   └── code/summary.md
        ├── supabase/
        │   ├── functional-design/
        │   │   ├── business-logic-model.md
        │   │   └── business-rules.md
        │   └── code/summary.md
        └── backend/
            ├── functional-design/
            │   └── business-logic-model.md         # Unit 3 backend アーキテクチャ・設計モデル
            └── code/summary.md                     # Unit 3 backend 生成ファイル一覧・完了チェックリスト
```

---

## 第1章: ルートファイル

---

### `README.md`

**何を定義しているか:**
リポジトリ全体の説明書です。以下の内容が含まれています:

- **プロジェクト概要**: AWS Kiro学習用リポジトリ（Vercel対応）・AI-DLC ワークフローの説明
- **技術ブログ機能**: 実装済みの技術ブログ機能の概要（記事管理・画像アップロード・タグ・サンドボックス埋め込み・レスポンシブ・アクセシビリティ）
- **技術スタック**: Backend（Fastify + Prisma + Supabase）・Frontend（Vue 3 + Pinia + Vue Router）・Shared（Zod schemas）
- **開発状況**: Phase 1-11完了（Backend・Frontend・スタイリング）・Phase 12-16進行中（テスト・ドキュメント）
- **ディレクトリ構造**: packages/（backend・frontend・shared・supabase・e2e）・.kiro/（specs・steering・rule-details）
- **セットアップ手順**: 前提条件・インストール・環境変数・Prismaセットアップ・開発サーバー起動
- **AI-DLC ワークフロー概要**: 3フェーズ構成（INCEPTION・CONSTRUCTION・OPERATIONS）・各ステージの実行条件
- **共通ルールファイル**: common/の11ファイルの役割説明
- **セキュリティ拡張**: SECURITY-01〜15の概要
- **生成されるドキュメント**: aidlc-docs/の構造
- **主要な設計原則**: 適応的実行・透明性・ユーザーコントロール・監査証跡・コードとドキュメントの分離
- **セッション記録**: 2026-04-15のINCEPTIONフェーズ前半の実行記録

**なぜ存在するか:**
このプロジェクトに初めて触れる人が「何のためのリポジトリか」「どんな構造か」「今どこまで進んでいるか」を把握するための玄関口です。特に以下の目的があります:

1. **プロジェクト全体像の把握**: AI-DLC ワークフローを使った開発プロジェクトであることを明示し、技術ブログ機能が実装済みであることを示す
2. **技術スタックの明示**: Backend・Frontend・Sharedの技術選定を一覧化し、新規メンバーが技術構成を素早く理解できるようにする
3. **セットアップ手順の提供**: 初めてプロジェクトに参加する開発者が、ローカル環境を構築するための手順を明文化する
4. **AI-DLC ワークフローの説明**: 3フェーズ構成・各ステージの役割・実行条件を説明し、AI-DLC の仕組みを理解できるようにする
5. **Vercel対応の明示**: タイトルに「Vercel対応」を追加し、このプロジェクトがVercelにデプロイ可能であることを明示する（2026-04-22更新）

**いつ使われるか:**

- **プロジェクト参加時**: 新しい開発者がプロジェクトに参加し、全体像を把握するとき
- **セットアップ時**: ローカル環境を構築する際に、インストール・環境変数・Prismaセットアップの手順を確認するとき
- **技術スタック確認時**: 使用している技術（Fastify・Vue 3・Prisma・Supabase等）を確認するとき
- **AI-DLC ワークフロー学習時**: AI-DLC の3フェーズ構成・各ステージの役割を学習するとき
- **デプロイ時**: Vercel対応であることを確認し、デプロイ手順を参照するとき

**関連ファイル:**

- `GUIDEBOOK.md` - このファイル（全ファイルの詳細解説）
- `.kiro/steering/aws-aidlc-rules/core-workflow.md` - AI-DLC ワークフロー全体のルール定義
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書
- `.kiro/specs/tech-blog/tasks.md` - 技術ブログ機能の実装タスク
- `docs/TECH_BLOG_API.md` - 技術ブログAPIの仕様書
- `docs/VERCEL_QUICK_START.md` - Vercelデプロイのクイックスタートガイド
- `aidlc-docs/aidlc-state.md` - ワークフロー進捗トラッカー
- `aidlc-docs/inception/requirements/requirements.md` - プロジェクト全体の要件定義書

---

### `GUIDEBOOK.md`（このファイル）

**何を定義しているか:**
リポジトリ内の全ファイルについて、定義内容・存在理由・具体的な使い方を詳細に説明した学習用ガイドブックです。

**なぜ存在するか:**
AI-DLC ワークフローが自動生成するファイルは多く、初見では意味が分かりにくいです。各ファイルの意味を体系的に理解するための補助資料として作成しました。

---

## 第2章: `.kiro/` — Kiro IDE のルール・設定ファイル群

`.kiro/` は Kiro IDE が自動的に読み込む設定・ルールファイルの置き場所です。「AI がどう振る舞うか」を制御します。

---

### `.kiro/steering/aws-aidlc-rules/core-workflow.md`

**何を定義しているか:**
AI-DLC ワークフロー全体の行動規範です。3フェーズの構造、各ステージの実行条件、ユーザー承認ゲート、監査ログの記録ルール、チェックボックストラッキングの義務、ルール詳細ファイルの読み込み手順、セキュリティ拡張の適用ルールを定義しています。

**なぜ存在するか:**
Kiro IDE の「ステアリング」機能により、すべての会話でこのファイルが自動的に AI に読み込まれます。このファイルがなければ AI は通常の会話モードで動作し、AI-DLC ワークフローは機能しません。冒頭の `# PRIORITY: This workflow OVERRIDES all other built-in workflows` により、他のすべての組み込みワークフローより優先されます。

---

### `.kiro/aws-aidlc-rule-details/common/` （11ファイル）

すべてのフェーズ・ステージで横断的に使われる共通ルールファイル群です。

| ファイル                       | 定義内容                                                             | なぜ必要か                                                  |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| `process-overview.md`          | ワークフロー全体の技術的リファレンス（Mermaid フロー図付き）         | AI がワークフロー全体像を把握するための地図                 |
| `welcome-message.md`           | ワークフロー開始時のウェルカムメッセージ本文                         | 毎回 AI がゼロから文章を考えなくて済むよう固定化            |
| `session-continuity.md`        | セッション再開時の手順・コンテキスト復元ルール                       | 前回の続きから再開するときに AI が迷わないための手順書      |
| `content-validation.md`        | ファイル作成前のコンテンツ検証ルール（Mermaid 構文チェック等）       | 壊れた図や不正な Markdown を生成しないための品質ゲート      |
| `ascii-diagram-standards.md`   | ASCII アート図の標準規格                                             | 図の見た目が崩れないよう文字種と幅を統一                    |
| `question-format-guide.md`     | 質問ファイルのフォーマットルール（A/B/C/D 選択肢・`[Answer]:` タグ） | AI がチャットで直接質問せず専用ファイルに整理するための規約 |
| `depth-levels.md`              | 適応的な詳細度レベルの説明（Minimal / Standard / Comprehensive）     | プロジェクトの複雑さに応じて設計の深さを変えるための基準    |
| `terminology.md`               | AI-DLC 用語集                                                        | AI とユーザーが同じ言葉で話せるよう用語を統一               |
| `error-handling.md`            | エラー発生時の回復手順                                               | アーティファクトが壊れた場合の対処法                        |
| `overconfidence-prevention.md` | AI の過信防止ガイドライン                                            | 不明点は必ず質問するよう促す                                |
| `workflow-changes.md`          | ワークフロー変更履歴                                                 | ルール変更の経緯を追跡するための変更ログ                    |

---

### `.kiro/aws-aidlc-rule-details/inception/` （7ファイル）

INCEPTION フェーズの各ステージの詳細な実行手順です。`core-workflow.md` が「何をするか」を定義するのに対し、これらは「どうやってするか」を定義します。

| ファイル                   | 定義内容                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| `workspace-detection.md`   | ワークスペースをスキャンして Greenfield/Brownfield を判定する手順                 |
| `requirements-analysis.md` | 要件収集・質問ファイル作成・回答分析・要件定義書生成の手順                        |
| `workflow-planning.md`     | 実行計画作成の手順。スコープ分析・リスク評価・ステージ選択の判断基準              |
| `application-design.md`    | コンポーネント設計・メソッド定義・サービス設計の手順                              |
| `units-generation.md`      | システムをユニットに分解する手順。依存関係マトリクス・ストーリーマップの生成      |
| `user-stories.md`          | ユーザーストーリーとペルソナを作成する手順（今回はスキップ）                      |
| `reverse-engineering.md`   | 既存コードを解析してドキュメントを生成する手順（Brownfield のみ・今回はスキップ） |

---

### `.kiro/aws-aidlc-rule-details/construction/` （6ファイル）

CONSTRUCTION フェーズの各ステージの詳細な実行手順です。

| ファイル                   | 定義内容                                                             |
| -------------------------- | -------------------------------------------------------------------- |
| `functional-design.md`     | ビジネスロジック・ドメインモデル・ビジネスルールの詳細設計手順       |
| `code-generation.md`       | 実際のコードを生成する手順（Part 1: 計画 → Part 2: 生成の2段階）     |
| `build-and-test.md`        | ビルド手順・テスト実行手順の文書化手順                               |
| `nfr-requirements.md`      | 非機能要件の評価・技術スタック選定手順（今回はスキップ）             |
| `nfr-design.md`            | NFR パターンの設計への組み込み手順（今回はスキップ）                 |
| `infrastructure-design.md` | クラウドリソース・デプロイアーキテクチャの設計手順（今回はスキップ） |

---

### `.kiro/aws-aidlc-rule-details/operations/operations.md`

**何を定義しているか:**
デプロイ・監視・運用フェーズのプレースホルダーです。現時点では「将来拡張予定」という宣言のみです。

---

### `.kiro/aws-aidlc-rule-details/extensions/security/baseline/security-baseline.md`

**何を定義しているか:**
全フェーズに横断的に適用される15のセキュリティルール（SECURITY-01〜15）を定義しています。

| ルール      | 守るもの                                                             |
| ----------- | -------------------------------------------------------------------- |
| SECURITY-01 | 保存データ・転送データの暗号化（TLS 1.2+）                           |
| SECURITY-02 | ネットワーク中継点のアクセスログ                                     |
| SECURITY-03 | 構造化ログ（タイムスタンプ・リクエストID・ログレベル必須）           |
| SECURITY-04 | HTTP セキュリティヘッダー（CSP・HSTS・X-Frame-Options 等）           |
| SECURITY-05 | 全 API パラメータの入力バリデーション                                |
| SECURITY-06 | 最小権限アクセスポリシー（ワイルドカード禁止）                       |
| SECURITY-07 | 制限的なネットワーク設定（deny-by-default）                          |
| SECURITY-08 | アプリケーションレベルのアクセス制御（認証・認可・IDOR 防止）        |
| SECURITY-09 | セキュリティハードニング（デフォルト認証情報禁止・エラー詳細非公開） |
| SECURITY-10 | ソフトウェアサプライチェーン（依存関係ピン留め・脆弱性スキャン）     |
| SECURITY-11 | セキュアデザイン原則（レート制限・多層防御）                         |
| SECURITY-12 | 認証・クレデンシャル管理（パスワードハッシュ・MFA・セッション管理）  |
| SECURITY-13 | ソフトウェア・データ整合性（安全なデシリアライズ・SRI）              |
| SECURITY-14 | アラートとモニタリング（認証失敗アラート・ログ保持90日以上）         |
| SECURITY-15 | 例外処理とフェイルセーフ（fail closed・グローバルエラーハンドラー）  |

**なぜ存在するか:**
セキュリティルールを各ステージのルールファイルに分散させると管理が難しくなります。このファイルに集約することで、各ステージ完了時に AI がコンプライアンスチェックを行えます。今回は Requirements Analysis で「全ルール適用（Yes）」と回答したため、すべてのステージでブロッキング制約として機能します。

---

## 第3章: `packages/` — アプリケーションコード

`packages/` はアプリケーションの実装コードを置く場所です。AI-DLC の Code Generation ステージで生成されます。`aidlc-docs/` とは完全に分離されています。

---

## Unit 1: `packages/shared/`

フロントエンド・バックエンド両方が依存する共通パッケージです。**Zod スキーマと推論型のみ**を提供し、ビジネスロジックは一切含みません。

---

### `packages/shared/package.json`

**何を定義しているか:**
パッケージの基本情報です。

- 名前: `@monorepo/shared`（他パッケージから `import { ... } from '@monorepo/shared'` で参照）
- 依存: `zod` のみ（backend・frontend は含めない）
- ビルド出力: `dist/index.js`（型定義 `dist/index.d.ts` も生成）

**なぜ存在するか:**
pnpm workspaces でモノレポ管理するために必要です。`@monorepo/shared` という名前で他パッケージから参照できるようにします。

---

### `packages/shared/tsconfig.json`

**何を定義しているか:**
TypeScript コンパイラの設定です。

- `strict: true` — 型安全を最大化
- `noUncheckedIndexedAccess: true` — 配列アクセスの安全性強化
- `exactOptionalPropertyTypes: true` — optional プロパティの厳格化
- `moduleResolution: bundler` — Vite・esbuild との互換性

**なぜ存在するか:**
shared は frontend（Vite）と backend（esbuild）の両方から使われるため、両方のビルドツールと互換性のある設定が必要です。

---

### `packages/shared/src/index.ts`

**何を定義しているか:**
パッケージの公開エントリポイントです。外部から `import` できるものをここで明示的に列挙します。

```typescript
// 現在公開しているもの
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };
export { createApiSuccessSchema, ApiErrorSchema };
export type { ErrorCode };
export { ErrorCodeSchema };

// リソース追加時のテンプレートコメントも含む
```

**なぜ存在するか:**
ワイルドカード export（`export * from ...`）を禁止し、何が公開されているかを明示するためです。意図しない内部実装の公開を防ぎます。

---

### `packages/shared/src/schemas/api/response.schema.ts`

**何を定義しているか:**
全 API エンドポイントが使う共通レスポンス型です。

```typescript
// 成功レスポンスのジェネリックファクトリ
createApiSuccessSchema<T>(dataSchema: T)
// → { success: true, data: T, message: string }

// エラーレスポンス（固定形式）
ApiErrorSchema
// → { success: false, error: { code: string, message: string } }

// ユニオン型
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

**なぜ存在するか:**
API レスポンス形式はプロジェクト全体で統一されています（確定済み仕様）。この型を shared に置くことで、frontend・backend の両方が同じ型を参照でき、型の乖離が起きません。

---

### `packages/shared/src/schemas/api/error.schema.ts`

**何を定義しているか:**
共通エラーコードの列挙型です。

```typescript
ErrorCodeSchema = z.enum([
  'VALIDATION_ERROR', // 400
  'NOT_FOUND', // 404
  'UNAUTHORIZED', // 401
  'FORBIDDEN', // 403
  'CONFLICT', // 409
  'INTERNAL_SERVER_ERROR', // 500
]);
type ErrorCode = z.infer<typeof ErrorCodeSchema>;
```

**なぜ存在するか:**
backend の `AppError` クラスと frontend のエラーハンドリングで同じエラーコードを使うためです。shared に置くことで、backend でエラーコードを追加したときに frontend 側の型も自動的に更新されます。

---

### `packages/shared/CODING_STANDARDS.md`

**何を定義しているか:**
shared パッケージ固有のコーディング規約です。7つのセクションで構成されています。

1. ファイル命名規則（`kebab-case.schema.ts`・操作ごとのファイル分割）
2. スキーマ・型の命名規則（`PascalCase + Schema`・用途サフィックス一覧）
3. スキーマ設計ルール5項目（全フィールド必須・`.partial()` 派生・UUID・ISO 8601 等）
4. エクスポートルール（ワイルドカード禁止・明示的列挙）
5. 循環依存防止ルール（zod 以外の依存禁止・クロスインポート禁止）
6. バリデーションメッセージ標準文言（日本語統一・9パターン）
7. 新しいリソースを追加する手順（5ステップ）

**なぜ存在するか:**
「新しいリソースを追加するときに何をどう書くか」の判断基準を提供するためです。特に「推奨 / 非推奨 / 理由」形式でルールを示すことで、実装者が自己判断できます。

---

## Unit 2: `packages/supabase/`

Supabase CLI で管理する DB マイグレーション・RLS ポリシー・プロジェクト設定のパッケージです。アプリケーションコードは含みません。

---

### `packages/supabase/config.toml`

**何を定義しているか:**
Supabase CLI のプロジェクト設定ファイルです。

- API・DB・Studio のローカルポート設定
- 認証設定（JWT 有効期限・リフレッシュトークン設定）
- Edge Functions: `enabled = false`（不使用方針を明示）
- メール確認: 開発中は `false`、本番では `true` に変更するコメント付き

**なぜ存在するか:**
`supabase link` でリモートプロジェクトに接続する際の設定ファイルです。Edge Functions を無効化することで、誤って Edge Functions を使い始めることを防ぎます。

---

### `packages/supabase/migrations/`（空ディレクトリ）

**何を定義しているか:**
Supabase CLI が管理するマイグレーションファイルの置き場所です。現時点では空です（`.gitkeep` のみ）。

**なぜ存在するか:**
`supabase migration new <name>` コマンドで新しいマイグレーションファイルを作成すると、このディレクトリに `YYYYMMDDHHMMSS_<name>.sql` 形式で保存されます。空ディレクトリを Git で管理するために `.gitkeep` を置いています。

---

### `packages/supabase/seed.sql`

**何を定義しているか:**
開発・テスト環境用のシードデータファイルです。現時点ではコメントのみ（テンプレート）です。

**なぜ存在するか:**
`supabase db reset` 実行時に自動的に適用されます。開発環境を素早くリセットして初期データを投入するためのファイルです。本番環境では実行しないよう警告コメントを冒頭に記載しています。

---

### `packages/supabase/CODING_STANDARDS.md`

**何を定義しているか:**
supabase パッケージのコーディング規約です。6つのセクションで構成されています。

1. 開発ワークフロー（初回セットアップ・スキーマ変更の手順）
2. マイグレーションファイルの命名規則（タイムスタンプ形式・3つのルール）
3. RLS ポリシーの書き方（標準パターン・命名規則・禁止事項）
4. Prisma との接続方式（Direct / Pooler の使い分け・環境変数設定例）
5. seed.sql のルール（開発専用・冪等性）
6. セキュリティ対応（接続文字列管理・RLS 必須化・本番設定）

**なぜ存在するか:**
「新しいテーブルを追加するときに何をすべきか」の手順を提供するためです。特に Prisma との連携フロー（`supabase db push` → `prisma db pull` → `prisma generate`）を明文化することで、スキーマ変更時の手順を統一します。

---

## 第4章: `aidlc-docs/` — AI-DLC が生成したドキュメント群

`aidlc-docs/` はアプリケーションコードを一切含まない「ドキュメント専用ディレクトリ」です。

---

### `aidlc-docs/aidlc-state.md`

**何を定義しているか:**
ワークフローの「現在地」を記録するステート管理ファイルです。

- プロジェクト種別（Greenfield）・開始日時
- セキュリティ拡張の有効/無効設定（Security Baseline: Yes）
- 全ステージの進捗（完了 `[x]` / スキップ / 実行予定）
- 現在のフェーズ・ステージ・次のステップ

**現在の状態:**

```
INCEPTION:    Workspace Detection [x] / Requirements Analysis [x] /
              Workflow Planning [x] / Application Design [x] / Units Generation [x]
CONSTRUCTION: Functional Design (shared [x], supabase [x], backend 未着手) /
              Code Generation (shared [x], supabase [x], backend 未着手)
```

**なぜ存在するか:**
セッションをまたいで作業を再開するとき、AI はまずこのファイルを読み込みます。「どこまで終わったか」「次は何をすべきか」がここに書かれているため、毎回ゼロから状態を推測する必要がなくなります。

---

### `aidlc-docs/audit.md`

**何を定義しているか:**
ユーザーと AI のすべてのやり取りを時系列で記録した監査ログです。各エントリにはタイムスタンプ・ユーザーの完全な入力（要約なし）・AI の対応内容が含まれます。

**現在記録されている最新エントリ（2026-04-16）:**

- `Functional Design (frontend) - User Approval`: ユーザーが frontend ユニットの Functional Design 完了を「承認」と承認。これを受けて Code Generation (Unit 4: frontend) が開始されたことを記録。CONSTRUCTION PHASE - Code Generation Unit 4: frontend のコンテキストで記録。
- `Code Generation (frontend) - Plan Approved`: ユーザーが frontend ユニットの Code Generation 計画（Part 1）を「承認」と承認。これを受けて Part 2 Generation（実際のコードファイル生成）が開始されたことを記録。CONSTRUCTION PHASE - Code Generation Unit 4: frontend のコンテキストで記録。

**なぜ存在するか:**
意思決定の追跡・セッション再開時のコンテキスト復元・チーム共有の3つの目的があります。AI-DLC のルールでは「ユーザー入力を絶対に要約しない・完全な原文を記録する」ことが義務付けられています。

---

## 第5章: `aidlc-docs/inception/` — INCEPTION フェーズの成果物

---

### `aidlc-docs/inception/requirements/requirement-verification-questions.md`

**何を定義しているか:**
Requirements Analysis ステージで AI がユーザーに投げかけた10問の質問と回答が記録されたファイルです。

| 質問                   | 回答                                         |
| ---------------------- | -------------------------------------------- |
| プロジェクトフェーズ   | 社内ツール・小規模本番                       |
| セキュリティルール適用 | Yes（全ルール適用）                          |
| モノレポ管理ツール     | pnpm workspaces                              |
| Edge Functions 用途    | 不使用（Fastify で完結）                     |
| Prisma 接続方式        | Direct（マイグレーション）+ Pooler（アプリ） |
| フロントルーティング   | Vue Router SPA                               |
| テストカバレッジ目標   | 100%（厳格運用）                             |
| E2E テスト             | Playwright（主要フローのみ）                 |
| SCSS 命名規則          | SMACSS ベース                                |
| CI/CD                  | GitHub Actions（Lint+Test+Deploy）           |

**なぜ存在するか:**
AI-DLC のルールでは「質問はチャットで直接行わず、専用ファイルに整理する」ことが義務付けられています。回答がそのままドキュメントとして残り、後から「なぜこの設計にしたか」を確認できます。

---

### `aidlc-docs/inception/requirements/requirements.md`

**何を定義しているか:**
プロジェクトの正式な要件定義書です。確定済み技術選定・機能要件 FR-01〜07・非機能要件 NFR-01〜06・API レスポンス形式・CSS 方針・成功基準が含まれます。

**なぜ存在するか:**
後続のすべての設計・実装フェーズで「判断の根拠」となるファイルです。「なぜこのディレクトリ構成にしたか」という問いに対して、常にこのファイルが答えを持っています。

---

### `aidlc-docs/inception/plans/execution-plan.md`

**何を定義しているか:**
「どのステージを実行し、どのステージをスキップするか」の根拠付き計画書です。変更インパクト評価・リスク評価・ワークフロー可視化・5ユニットの構成と実行順序が含まれます。

**なぜ存在するか:**
AI-DLC は適応的にステージを選択します。このファイルがあることで「なぜ User Stories をスキップしたか」「なぜ NFR Requirements をスキップしたか」という判断の根拠が明確になります。

---

### `aidlc-docs/inception/plans/application-design-plan.md`

**何を定義しているか:**
Application Design ステージの実行計画と設計判断の質問・回答が記録されたファイルです。チェックリストがすべて `[x]` で完了を示しています。

主な設計判断:

- バックエンドレイヤー: DDD 寄り 4 層
- フロント composables: ビジネスロジック担当、UI は components
- Pinia: Setup 記法
- Fastify: 機能ごとにプラグイン分割
- エラーハンドリング: setErrorHandler でグローバル集約

---

### `aidlc-docs/inception/plans/unit-of-work-plan.md`

**何を定義しているか:**
Units Generation ステージの実行計画と質問・回答が記録されたファイルです。

主な決定事項:

- 実行順序: 順番に実行（backend 完了後に frontend）
- コード生成粒度: スキャフォールディング + コーディング規約ドキュメント
- Prisma 初期スキーマ: 空のスキーマのみ

---

### `aidlc-docs/inception/application-design/application-design.md`

**何を定義しているか:**
アプリケーション設計書の統合ドキュメントです。設計方針サマリー・モノレポの完全なディレクトリ構成（tree 形式）・パッケージ間依存関係・データフロー・セキュリティ設計が含まれます。

**なぜ存在するか:**
設計の全体像を1ファイルで把握できるようにするためです。新しいチームメンバーへの説明資料として最適です。

---

### `aidlc-docs/inception/application-design/components.md`

**何を定義しているか:**
全パッケージのコンポーネント一覧と各コンポーネントの責務を定義しています。

frontend の責務分担（重要な設計決定）:

- `composables/` — ビジネスロジック・フォームバリデーション（UI 描画は含まない）
- `components/` — UI の描画・ユーザーインタラクション（ビジネスロジックは composables に委譲）
- `stores/` — 認証状態・サーバーデータの永続保持
- `composables/api/` — fetch API を使った API 通信

---

### `aidlc-docs/inception/application-design/component-methods.md`

**何を定義しているか:**
各コンポーネントのメソッドシグネチャ（関数名・引数の型・戻り値の型）と高レベルの目的を定義しています。backend の4層・frontend の composables/stores/router のメソッド定義が含まれます。

---

### `aidlc-docs/inception/application-design/services.md`

**何を定義しているか:**
Application Service（Usecase）と Domain Service の違い・Fastify プラグインの構成と登録順序・エラーハンドリングフローを定義しています。

---

### `aidlc-docs/inception/application-design/component-dependency.md`

**何を定義しているか:**
コンポーネント間・パッケージ間の依存関係ルールを定義しています。循環依存防止の禁止事項が明記されています。

主な禁止事項:

- `backend` ↔ `frontend` の相互依存
- `domain` 層が `infrastructure` 層をインポート
- `composables/api` が `stores` を参照（循環依存）
- `components` が `stores` を直接参照
- `components` にビジネスロジックを直接書く

---

### `aidlc-docs/inception/application-design/unit-of-work.md`

**何を定義しているか:**
5つのユニット（shared / supabase / backend / frontend / ci-cd）それぞれの定義・責務・成果物・完了条件を定義しています。

---

### `aidlc-docs/inception/application-design/unit-of-work-dependency.md`

**何を定義しているか:**
5ユニット間の依存マトリクス・クリティカルパス（shared → supabase → backend → frontend → ci-cd）・テスト境界を定義しています。

---

### `aidlc-docs/inception/application-design/unit-of-work-story-map.md`

**何を定義しているか:**
要件定義書の各要件（FR-01〜07・NFR-01〜06）が、どのユニットで実装されるかのマッピングを定義しています。要件の抜け漏れを防ぐ役割があります。

---

## 第6章: `aidlc-docs/construction/` — CONSTRUCTION フェーズの成果物

---

### `aidlc-docs/construction/plans/shared-functional-design-plan.md`

**何を定義しているか:**
Unit 1: shared の Functional Design ステージの実行計画と質問・回答が記録されたファイルです。チェックリストがすべて `[x]` で完了を示しています。

主な設計決定:

- スキーマ分割: 操作ごとにファイル分割（`create-user.schema.ts` / `update-user.schema.ts`）
- `ApiResponse<T>`: shared で定義し frontend・backend 両方で使用
- バリデーションメッセージ: 日本語統一
- 型の export: スキーマと同一ファイルに同居

---

### `aidlc-docs/construction/plans/shared-code-generation-plan.md`

**何を定義しているか:**
Unit 1: shared の Code Generation ステージの実行計画です。8ステップすべてが `[x]` で完了を示しています。

---

### `aidlc-docs/construction/plans/supabase-functional-design-plan.md`

**何を定義しているか:**
Unit 2: supabase の Functional Design ステージの実行計画と質問・回答が記録されたファイルです。

主な設計決定:

- ローカル開発: リモート直接接続（Docker 不要）
- RLS 管理: マイグレーションファイルで管理
- profiles テーブル: 作成しない（`auth.users` のみ）

---

### `aidlc-docs/construction/plans/supabase-code-generation-plan.md`

**何を定義しているか:**
Unit 2: supabase の Code Generation ステージの実行計画です。6ステップすべてが `[x]` で完了を示しています。

---

### `aidlc-docs/construction/plans/backend-code-generation-plan.md`

**何を定義しているか:**
Unit 3: backend の Code Generation ステージの実行計画ファイルです。19ステップを6つのパートに分けて構成されています。

| パート | 内容                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------ |
| Part 1 | プロジェクト構造セットアップ（ディレクトリ・package.json・tsconfig.json・.env.example・schema.prisma） |
| Part 2 | Domain 層生成（AppError 7種類）                                                                        |
| Part 3 | Infrastructure 層生成（Prisma シングルトン・Supabase Auth サービス）                                   |
| Part 4 | Fastify プラグイン生成（db・auth・cors・helmet・rate-limit・routes の6プラグイン）                     |
| Part 5 | エラーハンドラー・エントリポイント生成（error.handler.ts・app.ts・index.ts）                           |
| Part 6 | ドキュメント生成（CODING_STANDARDS.md・code/summary.md）                                               |

**現在の状態（最新）:** Part 1〜5（Step 1〜17）が完了済み `[x]`。Part 6（ドキュメント生成）が未着手。具体的には以下が完了:

- Step 1〜5: プロジェクト構造・package.json・tsconfig.json・.env.example・schema.prisma
- Step 6: `app.error.ts`（AppError 7種類）
- Step 7: `src/infrastructure/prisma/client.ts`（Prisma シングルトン）
- Step 8: `src/infrastructure/supabase/auth.service.ts`（Supabase Auth サービス）
- Step 9: `src/plugins/db.plugin.ts`（Prisma DI）
- Step 10: `src/plugins/auth.plugin.ts`（JWT 検証）
- Step 11: `src/plugins/cors.plugin.ts`
- Step 12: `src/plugins/helmet.plugin.ts`
- Step 13: `src/plugins/rate-limit.plugin.ts`
- Step 14: `src/plugins/routes.plugin.ts`（空のルート登録）
- Step 15: `src/hooks/error.handler.ts`（グローバルエラーハンドラー）
- Step 16: `src/app.ts`（プラグイン登録・起動）
- Step 17: `src/index.ts`（エントリポイント）

次のステップは Step 18〜19（CODING_STANDARDS.md・code/summary.md 生成）。

各ステップの詳細仕様も記載されています:

- `package.json`: `@monorepo/backend` として `fastify` / `@fastify/cors` / `@fastify/helmet` / `@fastify/rate-limit` / `@supabase/supabase-js` / `@prisma/client` / `zod` / `@monorepo/shared` を依存に持つ
- `tsconfig.json`: `strict: true` / `target: ES2022` / `moduleResolution: bundler` / `@monorepo/shared` のパスエイリアス設定
- `schema.prisma`: `DATABASE_URL` 環境変数のみ使用・空スキーマ
- `app.error.ts`: AppError 基底クラス + 7サブクラス（NotFoundError / ValidationError / UnauthorizedError / ForbiddenError / ConflictError / InternalServerError / ServiceUnavailableError）
- `app.ts`: プラグイン登録順序 `cors → helmet → rate-limit → db → auth → routes → errorHandler`
- `CODING_STANDARDS.md`: 4層アーキテクチャ責務分担・命名規則・エラーハンドリング・テスト方針・新リソース追加手順

**なぜ存在するか:**
shared・supabase の Code Generation 計画ファイルと同様に、backend ユニットのコード生成を2段階（Part 1: 計画 → Part 2: 生成）で管理するためのファイルです。AI-DLC のルールに従い、コード生成前に計画をユーザーが確認・承認できるようにします。チェックボックスにより各ステップの完了状況をリアルタイムで追跡します。

**いつ使われるか:**
Unit 3: backend の Functional Design ステージ（business-logic-model.md・business-rules.md・domain-entities.md）が完了した後、Code Generation ステージの開始時に AI が作成します。ユーザーが計画を承認した後、AI がチェックボックスを順番に `[x]` に更新しながら `packages/backend/` 以下のファイルを生成します。現在の状態: Step 1〜17（Part 1〜5）が完了済み `[x]`。Step 18〜19（Part 6）が未着手。

---

### `aidlc-docs/construction/plans/backend-functional-design-plan.md`

**何を定義しているか:**
Unit 3: backend の Functional Design ステージの実行計画ファイルです。設計判断質問（5問）とその回答がすべて記入済みの状態です。

チェックリストは5ステップで構成されています:

1. 設計判断事項をユーザーに確認
2. 回答を分析・曖昧点の解消
3. business-logic-model.md 生成
4. business-rules.md 生成
5. domain-entities.md 生成

確定済みの前提として以下が記録されています:

- アーキテクチャ: Fastify + Prisma + Supabase Auth による API サーバー
- レイヤー構成: DDD 寄り 4 層（Interface / Application / Domain / Infrastructure）
- エラーハンドリング: Fastify の `setErrorHandler` でグローバル集約
- プラグイン構成: 機能ごとに分割（auth / db / routes）
- Prisma 接続: マイグレーション用 Direct / アプリ用 Pooler（Pgbouncer）
- 型共有: shared の `ApiResponse<T>` / Zod スキーマを使用
- セキュリティ: SECURITY-01〜15 全ルール適用

**回答状況（5問すべて回答済み）:**

| 質問       | 内容                                                               | 回答                                                                               |
| ---------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Question 1 | セキュリティ系プラグイン（cors・helmet・rate-limit）の初期組み込み | A: cors・helmet・rate-limit を初期から含める                                       |
| Question 2 | JWT 検証方式                                                       | A: `@supabase/supabase-js` の `supabase.auth.getUser(token)` を使用                |
| Question 3 | Prisma クライアントの DI 方法                                      | A: `fastify.decorate('prisma', prismaClient)` でシングルトンとして装飾             |
| Question 4 | `AppError` サブクラス構成                                          | C: 基本5種類 + InternalServerError + ServiceUnavailableError（外部サービス障害用） |
| Question 5 | `schema.prisma` の datasource 接続方式                             | A: `DATABASE_URL` 環境変数のみ（1つの接続文字列で管理）                            |

**なぜ存在するか:**
shared・supabase と同様に、backend ユニットの Functional Design ステージを進める前に設計上の判断事項をユーザーから収集するためのファイルです。AI-DLC のルールに従い、チャットで直接質問するのではなく専用ファイルに整理することで、回答がそのままドキュメントとして残ります。ユーザーが `[Answer]:` タグに回答を記入することで、後続の business-logic-model.md・business-rules.md・domain-entities.md の生成に使われます。

**いつ使われるか:**
Unit 3: backend の Functional Design ステージ開始時に AI が作成し、ユーザーが全質問に回答を記入した後に AI が読み込んで設計ドキュメントを生成します。現在の状態: Step 1（設計判断事項の確認）と Step 2（回答分析・曖昧点の解消）が完了済み `[x]`。次のステップは Step 3〜5（business-logic-model.md・business-rules.md・domain-entities.md の生成）です。

---

### `aidlc-docs/construction/plans/frontend-functional-design-plan.md`

**何を定義しているか:**
Unit 4: frontend の Functional Design ステージの実行計画ファイルです。設計判断質問（6問）とその回答がすべて記入済みの状態です。

チェックリストは5ステップで構成されています:

1. 設計判断事項をユーザーに確認
2. 回答を分析・曖昧点の解消
3. business-logic-model.md 生成
4. business-rules.md 生成
5. frontend-components.md 生成

確定済みの前提として以下が記録されています:

- フレームワーク: Vue 3（script setup）+ TypeScript + Vite
- 状態管理: Pinia（Setup 記法）
- ルーティング: Vue Router（SPA）
- composables = ビジネスロジック・フォームバリデーション・API 通信
- components = UI 描画・ユーザーインタラクション（ビジネスロジックは composables に委譲）
- stores = 認証状態・サーバーデータの永続保持
- スタイル: SCSS + SMACSS ベース命名規則
- デザイン方針: Apple.com スタイル（シンプル・ホワイトベース・大きなタイポグラフィ・余白重視）
- セキュリティ: SECURITY-01〜15 全ルール適用

**回答状況（6問すべて回答済み）:**

| 質問       | 内容                                         | 回答                                                                                   |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Question 1 | SCSS の設計構成                              | B: SMACSS 準拠の階層構成（`base/` / `layout/` / `module/` / `state/` / `theme/` 分割） |
| Question 2 | デザイントークンの管理方法                   | A: SCSS 変数のみ（`$color-primary: #000` 形式）                                        |
| Question 3 | ベースフォント                               | A: システムフォントスタック（`-apple-system, BlinkMacSystemFont, ...`）                |
| Question 4 | Vue Router のルート構成                      | B: 機能ごとにルートファイルを分割して `routes.ts` でまとめる                           |
| Question 5 | `useApiClient.ts` の認証トークン取得方法     | A: `useAuthStore` から Supabase セッショントークンを取得                               |
| Question 6 | フォームバリデーションのエラー表示タイミング | C: リアルタイム（入力のたびに検証）                                                    |

**なぜ存在するか:**
shared・supabase・backend と同様に、frontend ユニットの Functional Design ステージを進める前に設計上の判断事項をユーザーから収集するためのファイルです。AI-DLC のルールに従い、チャットで直接質問するのではなく専用ファイルに整理することで、回答がそのままドキュメントとして残ります。ユーザーが `[Answer]:` タグに回答を記入することで、後続の business-logic-model.md・business-rules.md・frontend-components.md の生成に使われます。

**いつ使われるか:**
Unit 4: frontend の Functional Design ステージ開始時に AI が作成し、ユーザーが全質問に回答を記入した後に AI が読み込んで設計ドキュメントを生成します。現在の状態: 全5ステップが完了済み `[x]`。Step 1〜5（設計判断事項の確認・回答分析・business-logic-model.md・business-rules.md・frontend-components.md の生成）がすべて完了しており、Unit 4: frontend の Functional Design ステージは完了しています。次のステップは Code Generation ステージへの移行です。

---

### `aidlc-docs/construction/plans/frontend-code-generation-plan.md`

**何を定義しているか:**
Unit 4: frontend の Code Generation ステージの実行計画ファイルです。24ステップを6つのパートに分けて構成されています。

| パート | 内容                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| Part 1 | プロジェクト構造セットアップ（package.json・tsconfig.json・vite.config.ts・index.html・.env.example）                  |
| Part 2 | SCSS スタイル生成（SMACSS 準拠の5ディレクトリ構成：variables・reset・typography・grid・button・states・theme・global） |
| Part 3 | Stores・Composables 生成（useAuthStore・useApiClient・useAuth）                                                        |
| Part 4 | Router 生成（routes.ts・index.ts）                                                                                     |
| Part 5 | Views・App エントリポイント生成（HomeView・NotFoundView・App.vue・main.ts）                                            |
| Part 6 | ドキュメント生成（CODING_STANDARDS.md・code/summary.md）                                                               |

**現在の状態:** Part 1〜4（Step 1〜18）が完了済み `[x]`。具体的には以下が完了:

- Step 1: `packages/frontend/package.json`
- Step 2: `packages/frontend/tsconfig.json`
- Step 3: `packages/frontend/vite.config.ts`
- Step 4: `packages/frontend/index.html`
- Step 5: `packages/frontend/.env.example`
- Step 6: `src/styles/base/_variables.scss`（デザイントークン）
- Step 7: `src/styles/base/_reset.scss`
- Step 8: `src/styles/base/_typography.scss`
- Step 9: `src/styles/layout/_grid.scss`
- Step 10: `src/styles/module/_button.scss`
- Step 11: `src/styles/state/_states.scss`
- Step 12: `src/styles/theme/_apple.scss`
- Step 13: `src/styles/global.scss`
- Step 14: `src/stores/useAuthStore.ts`（Pinia Setup 記法）
- Step 15: `src/composables/api/useApiClient.ts`
- Step 16: `src/composables/useAuth.ts`
- Step 17: `src/router/routes.ts`
- Step 18: `src/router/index.ts`

Part 5〜6（Step 19〜24）が未着手。次のステップは Step 19（`src/views/HomeView.vue` 生成）。

**なぜ存在するか:**
shared・supabase・backend の Code Generation 計画ファイルと同様に、frontend ユニットのコード生成を2段階（Part 1: 計画 → Part 2: 生成）で管理するためのファイルです。AI-DLC のルールに従い、コード生成前に計画をユーザーが確認・承認できるようにします。チェックボックスにより各ステップの完了状況をリアルタイムで追跡します。

**いつ使われるか:**
Unit 4: frontend の Functional Design ステージ（business-logic-model.md・business-rules.md・frontend-components.md）が完了した後、Code Generation ステージの開始時に AI が作成します。ユーザーが計画を承認した後、AI がチェックボックスを順番に `[x]` に更新しながら `packages/frontend/` 以下のファイルを生成します。現在の状態: Part 1（Step 1〜5）・Part 2（Step 6〜13）・Part 3（Step 14〜16）・Part 4（Step 17〜18）が完了済み `[x]`。具体的には以下が完了:

- Step 1〜5: プロジェクト構造セットアップ（`package.json` / `tsconfig.json` / `vite.config.ts` / `index.html` / `.env.example`）
- Step 6: `src/styles/base/_variables.scss`（デザイントークン）
- Step 7: `src/styles/base/_reset.scss`
- Step 8: `src/styles/base/_typography.scss`
- Step 9: `src/styles/layout/_grid.scss`
- Step 10: `src/styles/module/_button.scss`
- Step 11: `src/styles/state/_states.scss`
- Step 12: `src/styles/theme/_apple.scss`
- Step 13: `src/styles/global.scss`
- Step 14: `src/stores/useAuthStore.ts`（Pinia Setup 記法）
- Step 15: `src/composables/api/useApiClient.ts`
- Step 16: `src/composables/useAuth.ts`
- Step 17: `src/router/routes.ts`
- Step 18: `src/router/index.ts`

Part 5〜6（Step 19〜24）が未着手。次のステップは Step 19（`src/views/HomeView.vue` 生成）。

---

### `aidlc-docs/construction/plans/ci-cd-code-generation-plan.md`

**何を定義しているか:**
Unit 5: ci-cd の Code Generation ステージの実行計画ファイルです。9ステップを4つのパートに分けて構成されています。

| パート | 内容                                                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| Part 1 | GitHub Actions ワークフロー生成（`lint-test.yml`：PR 時 Lint + Vitest / `deploy.yml`：main マージ時 Deploy）         |
| Part 2 | pnpm ワークスペース設定（`pnpm-workspace.yaml` / ルート `package.json`）                                             |
| Part 3 | Playwright E2E スキャフォールディング（`packages/e2e/` の `package.json` / `playwright.config.ts` / サンプルテスト） |
| Part 4 | ドキュメント生成（`packages/e2e/CODING_STANDARDS.md` / `aidlc-docs/construction/ci-cd/code/summary.md`）             |

**現在の状態:** Part 1（Step 1〜2）・Part 2（Step 3〜4）・Part 3（Step 5〜7）が完了済み `[x]`。Part 4（Step 8〜9）が未着手。具体的には以下が完了:

- Step 1: `.github/workflows/lint-test.yml`（PR 時: Lint + Vitest）
- Step 2: `.github/workflows/deploy.yml`（main マージ時: Deploy）
- Step 3: `pnpm-workspace.yaml`（ルート）
- Step 4: ルート `package.json`（モノレポ管理スクリプト）
- Step 5: `packages/e2e/package.json`
- Step 6: `packages/e2e/playwright.config.ts`
- Step 7: `packages/e2e/tests/example.spec.ts`（スキャフォールディング）

次のステップは Step 8（`packages/e2e/CODING_STANDARDS.md` 生成）。

**なぜ存在するか:**
shared・supabase・backend・frontend の Code Generation 計画ファイルと同様に、ci-cd ユニットのコード生成を2段階（Part 1: 計画 → Part 2: 生成）で管理するためのファイルです。AI-DLC のルールに従い、コード生成前に計画をユーザーが確認・承認できるようにします。チェックボックスにより各ステップの完了状況をリアルタイムで追跡します。

**いつ使われるか:**
Unit 5: ci-cd は全ユニット（shared / supabase / backend / frontend）の完了後に着手する最終ユニットです。このファイルは ci-cd ユニットの Code Generation ステージ開始時に AI が作成します。ユーザーが計画を承認した後、AI がチェックボックスを順番に `[x]` に更新しながら `.github/workflows/` および `packages/e2e/` 以下のファイルを生成します。

---

### `aidlc-docs/construction/shared/functional-design/business-logic-model.md`

**何を定義しているか:**
shared パッケージのスキーマ設計モデルです。ディレクトリ構成・スキーマ分割モデル・`ApiResponse<T>` の完全な型定義・`index.ts` の公開ルールが含まれます。

**なぜ存在するか:**
Code Generation ステージでこのファイルを参照して実際のファイルを生成します。設計判断の根拠がここに記録されています。

---

### `aidlc-docs/construction/shared/functional-design/business-rules.md`

**何を定義しているか:**
shared パッケージのスキーマ設計に関する9つのルールです。「推奨 / 非推奨 / 理由」形式で定義されており、バリデーションメッセージの標準文言一覧も含みます。

---

### `aidlc-docs/construction/shared/functional-design/domain-entities.md`

**何を定義しているか:**
shared パッケージの型定義テンプレートです。`ApiResponse<T>` と `ErrorCode` の完全な実装コード・新しいリソースを追加するときのテンプレート（作成・更新・レスポンスの3ファイル）が含まれます。

---

### `aidlc-docs/construction/shared/code/summary.md`

**何を定義しているか:**
Unit 1: shared の Code Generation で生成したファイルの一覧・使い方サンプル・完了条件チェックリストです。

---

### `aidlc-docs/construction/supabase/functional-design/business-logic-model.md`

**何を定義しているか:**
supabase パッケージの設計モデルです。確定した設計方針・ディレクトリ構成・開発ワークフロー（`supabase link` → `db pull` → `db push`）・Prisma 連携フロー・RLS 標準パターン・`auth.users` のみ使用する設計が含まれます。

---

### `aidlc-docs/construction/supabase/functional-design/business-rules.md`

**何を定義しているか:**
supabase パッケージのルールです。マイグレーション命名規則・RLS 10ルール・Prisma 接続方式の使い分け（Direct / Pooler）・seed.sql ルール・SECURITY 対応表が含まれます。

---

### `aidlc-docs/construction/supabase/code/summary.md`

**何を定義しているか:**
Unit 2: supabase の Code Generation で生成したファイルの一覧と完了条件チェックリストです。

---

### `aidlc-docs/construction/backend/code/summary.md`

**何を定義しているか:**
Unit 3: backend の Code Generation で生成したファイルの一覧・完了条件チェックリストです。生成されたすべてのファイルを4つのカテゴリ（設定ファイル・Domain 層・Infrastructure 層・Fastify プラグイン・エントリポイント・ドキュメント）に分類して記録しています。

**内容:**

- 設定ファイル（`package.json` / `tsconfig.json` / `.env.example` / `schema.prisma`）
- Domain 層（`app.error.ts`：AppError 基底クラス + 7サブクラス）
- Infrastructure 層（Prisma シングルトン・Supabase Auth JWT 検証サービス）
- Fastify プラグイン（db / auth / cors / helmet / rate-limit / routes の6プラグイン）
- エントリポイント（`error.handler.ts` / `app.ts` / `index.ts`）
- ドキュメント（`CODING_STANDARDS.md`）
- 完了条件チェックリスト（17項目すべて `[x]` で完了済み）

**なぜ存在するか:**
shared・supabase の `code/summary.md` と同様に、Unit 3: backend の Code Generation ステージで生成したすべてのファイルを一覧化するためのサマリーファイルです。どのファイルが生成済みか・何が完了しているかをひと目で確認できます。セッションをまたいで作業を再開するときに、backend ユニットのコード生成が完了していることを確認する際に参照されます。

**いつ使われるか:**
Unit 3: backend の Code Generation ステージ（Step 19）で生成されます。backend ユニットの完了確認・次ユニット（frontend）への移行判断・Build and Test ステージでの成果物確認に使われます。

---

### `aidlc-docs/construction/frontend/code/summary.md`

**何を定義しているか:**
Unit 4: frontend の Code Generation で生成したファイルの一覧・完了条件チェックリストです。生成されたすべてのファイルを5つのカテゴリに分類して記録しています。

| カテゴリ                            | 内容                                                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 設定ファイル                        | `package.json` / `tsconfig.json` / `vite.config.ts` / `index.html` / `.env.example`                                                                 |
| SCSS（SMACSS 階層・Apple スタイル） | `_variables.scss` / `_reset.scss` / `_typography.scss` / `_grid.scss` / `_button.scss` / `_states.scss` / `_apple.scss` / `global.scss` の8ファイル |
| Stores / Composables                | `useAuthStore.ts`（Pinia Setup 記法）/ `useApiClient.ts`（認証ヘッダー自動付与）/ `useAuth.ts`                                                      |
| Router                              | `routes.ts`（機能別分割構成）/ `index.ts`（ナビゲーションガード・SECURITY-08 対応）                                                                 |
| Views / エントリポイント            | `HomeView.vue`（Apple スタイルヒーロー）/ `NotFoundView.vue`（404）/ `App.vue`（セッション復元）/ `main.ts`                                         |
| ドキュメント                        | `CODING_STANDARDS.md`                                                                                                                               |

完了条件チェックリストは全10項目が `[x]` で完了済みです。

**なぜ存在するか:**
shared・supabase・backend の `code/summary.md` と同様に、Unit 4: frontend の Code Generation ステージで生成したすべてのファイルを一覧化するためのサマリーファイルです。どのファイルが生成済みか・何が完了しているかをひと目で確認できます。セッションをまたいで作業を再開するときに、frontend ユニットのコード生成が完了していることを確認する際に参照されます。

**いつ使われるか:**
Unit 4: frontend の Code Generation ステージ（最終ステップ）で生成されます。frontend ユニットの完了確認・次ユニット（ci-cd）への移行判断・Build and Test ステージでの成果物確認に使われます。

---

### `aidlc-docs/construction/ci-cd/code/summary.md`

**何を定義しているか:**
Unit 5: ci-cd の Code Generation で生成したファイルの一覧・完了条件チェックリスト・デプロイ前に必要な作業です。生成されたすべてのファイルを4つのカテゴリに分類して記録しています。

| カテゴリ       | 内容                                                                                                                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Actions | `lint-test.yml`（PR 時: 全パッケージ Lint + Vitest + Build）/ `deploy.yml`（main マージ時: E2E → Deploy）                                                                                                             |
| モノレポ設定   | `pnpm-workspace.yaml`（pnpm workspaces 設定）/ ルート `package.json`（dev / build / test / lint スクリプト）                                                                                                          |
| Playwright E2E | `packages/e2e/package.json`（Playwright 依存関係）/ `packages/e2e/playwright.config.ts`（Chromium のみ・BASE_URL 環境変数）/ `packages/e2e/tests/example.spec.ts`（認証フローテンプレート付きスキャフォールディング） |
| ドキュメント   | `packages/e2e/CODING_STANDARDS.md`（E2E テスト方針・CI/CD 変更ルール・必要な Secrets 一覧）                                                                                                                           |

完了条件チェックリストは全6項目が `[x]` で完了済みです。

また、デプロイ前に必要な作業として以下が明記されています:

1. GitHub リポジトリの Settings > Secrets に `VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `STAGING_URL` を登録
2. `deploy.yml` の `Deploy (placeholder)` ステップを実際のデプロイコマンドに置き換える

**なぜ存在するか:**
shared・supabase・backend・frontend の `code/summary.md` と同様に、Unit 5: ci-cd の Code Generation ステージで生成したすべてのファイルを一覧化するためのサマリーファイルです。どのファイルが生成済みか・何が完了しているかをひと目で確認できます。また、実際に CI/CD を動かすために必要な GitHub Secrets の設定やデプロイステップのカスタマイズ手順を「デプロイ前に必要な作業」として明記することで、コード生成後の次のアクションが明確になります。

**いつ使われるか:**
Unit 5: ci-cd の Code Generation ステージ（最終ステップ）で生成されます。ci-cd ユニットの完了確認・全ユニット完了後の Build and Test ステージへの移行判断・実際の CI/CD パイプライン稼働前のセットアップ確認に使われます。このファイルが `[x]` で埋まっていれば、5ユニットすべての Code Generation が完了したことを意味します。

---

### `aidlc-docs/construction/build-and-test/build-instructions.md`

**何を定義しているか:**
全パッケージを対象としたビルド手順書です。以下の6セクションで構成されています。

| セクション          | 内容                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- |
| 前提条件            | Node.js v20 以上・pnpm v9 以上・対応 OS（macOS / Linux / Windows WSL2 推奨）          |
| 初回セットアップ    | `git clone` → `pnpm install`（全パッケージ一括インストール）                          |
| 環境変数の設定      | `backend/.env.example` → `.env` / `frontend/.env.example` → `.env.local` のコピー手順 |
| Prisma セットアップ | `pnpm db:generate`（クライアント生成）→ `pnpm db:migrate`（マイグレーション実行）     |
| 全パッケージビルド  | `pnpm build`（shared → backend → frontend の順）・個別ビルドコマンド                  |
| 開発サーバー起動    | `pnpm dev:backend`（ポート 3000）/ `pnpm dev:frontend`（ポート 5173）                 |

また、よくあるエラーへのトラブルシューティングとして以下が記載されています:

- `pnpm install` 失敗時: Node.js / pnpm バージョン確認・`node_modules` 削除と再インストール手順
- `prisma generate` 失敗時: `DATABASE_URL` 環境変数と `.env` ファイルの存在確認
- TypeScript ビルドエラー時: `@monorepo/shared` を先にビルドする手順（他パッケージが依存するため）

**なぜ存在するか:**
AI-DLC の Build and Test ステージで生成される成果物の一つです。5ユニット（shared / supabase / backend / frontend / ci-cd）のコード生成が完了した後、実際にプロジェクトをビルド・起動するための手順を一箇所にまとめます。特に pnpm workspaces のモノレポ構成では「どのパッケージをどの順番でビルドするか」が重要であり（shared が他すべてに依存されるため最初にビルドが必要）、その手順を明文化することで初めてプロジェクトに触れる開発者でも迷わずセットアップできます。

**いつ使われるか:**
Build and Test ステージ（全ユニットの Code Generation 完了後）で生成されます。新しいメンバーがプロジェクトに参加したとき・CI/CD 環境を構築するとき・ローカル開発環境をリセットするときに参照します。`pnpm build` や `pnpm db:migrate` などのコマンドは、ルート `package.json` のスクリプト定義（Unit 5: ci-cd で生成）と対応しています。

---

### `aidlc-docs/construction/backend/functional-design/business-logic-model.md`

**何を定義しているか:**
Unit 3: backend パッケージのビジネスロジックモデルです。DDD 寄り 4 層アーキテクチャの設計全体を定義しており、以下の内容が含まれます。

- 確定ディレクトリ構成（`packages/backend/` 以下の全ファイル・フォルダ）
- 4 層アーキテクチャモデル（Interface / Application / Domain / Infrastructure の責務と依存方向）
- Fastify プラグイン登録順序（セキュリティ系 → インフラ系 → 認証 → ルート → エラーハンドラー）
- セキュリティプラグイン設定方針（`@fastify/cors` / `@fastify/helmet` / `@fastify/rate-limit` の設定内容）
- JWT 検証モデル（`supabase.auth.getUser(token)` を使った認証フロー）
- Prisma クライアント DI モデル（`fastify.decorate('prisma', ...)` によるシングルトン管理）
- AppError 階層モデル（7種類のエラークラス構成と `setErrorHandler` での変換フロー）
- Prisma 接続モデル（`DATABASE_URL` 環境変数の用途別切り替え方針）
- リクエスト処理の全体データフロー（Client → Interface → Application → Domain → Infrastructure → Client）

**なぜ存在するか:**
backend-functional-design-plan.md の設計判断質問（5問）への回答を受けて生成される設計ドキュメントです。shared・supabase の `business-logic-model.md` と同様に、後続の Code Generation ステージでこのファイルを参照して実際のコードファイルを生成します。「なぜこのディレクトリ構成にしたか」「なぜこのプラグイン登録順序か」という設計判断の根拠がここに集約されています。

**いつ使われるか:**
Unit 3: backend の Functional Design ステージ（Step 3）で生成されます。続く Step 4（business-rules.md）・Step 5（domain-entities.md）の生成時にも参照され、最終的に Code Generation ステージで `packages/backend/` 以下のファイルを生成する際の設計仕様書として機能します。

---

### `aidlc-docs/construction/frontend/functional-design/business-logic-model.md`

**何を定義しているか:**
Unit 4: frontend パッケージのビジネスロジックモデルです。Vue 3（script setup）+ Pinia（Setup 記法）+ Vue Router（SPA）による フロントエンドアーキテクチャ全体を定義しており、以下の内容が含まれます。

- 確定ディレクトリ構成（`packages/frontend/` 以下の全ファイル・フォルダ）
- 責務分離モデル（View/Component 層 → Composables 層 → Stores 層 → API Client 層の4層構成と依存方向）
- SCSS 設計モデル（SMACSS 準拠の5ディレクトリ構成：`base/` / `layout/` / `module/` / `state/` / `theme/`）
- デザイントークン定義（SCSS 変数によるカラー・タイポグラフィ・スペーシング・ボーダー・シャドウ・トランジション・ブレークポイントの完全な変数セット）
- フォント設定モデル（システムフォントスタックによる Apple スタイル実現方針）
- Vue Router モデル（機能ごとにルートファイルを分割して `routes.ts` でまとめる構成）
- API クライアントモデル（`useAuthStore` からトークンを取得して `fetch` に付与するフロー）
- フォームバリデーションモデル（Zod の `safeParse` + `watch` によるリアルタイムバリデーションパターン）

**なぜ存在するか:**
frontend-functional-design-plan.md の設計判断質問（6問）への回答を受けて生成される設計ドキュメントです。shared・supabase・backend の `business-logic-model.md` と同様に、後続の Code Generation ステージでこのファイルを参照して実際のコードファイルを生成します。「なぜ SMACSS を採用したか」「なぜシステムフォントを使うか」「なぜリアルタイムバリデーションか」といった設計判断の根拠がここに集約されています。Apple.com スタイル（シンプル・ホワイトベース・大きなタイポグラフィ・余白重視）というデザイン方針も具体的な SCSS 変数値として定義されています。

**いつ使われるか:**
Unit 4: frontend の Functional Design ステージ（Step 3）で生成されます。続く Step 4（business-rules.md）・Step 5（frontend-components.md）の生成時にも参照され、最終的に Code Generation ステージで `packages/frontend/` 以下のファイルを生成する際の設計仕様書として機能します。

---

### `aidlc-docs/construction/frontend/functional-design/business-rules.md`

**何を定義しているか:**
Unit 4: frontend パッケージの実装ルールを「推奨 / 非推奨 / 理由」形式で定義したファイルです。9つのカテゴリで構成されています。

| カテゴリ                        | 内容                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 責務分離ルール               | components / composables / stores の責務境界。ビジネスロジックは composables、UI 描画は components、状態保持は stores に限定                 |
| 2. Vue 3 script setup ルール    | `<script setup lang="ts">` の使用・`defineProps<{...}>()` / `defineEmits<{...}>()` のジェネリック型定義・`watch` vs `watchEffect` の使い分け |
| 3. Pinia Setup 記法ルール       | `defineStore('id', () => { ... })` の Setup 記法・store ID のケバブケース・`storeToRefs()` による分割代入・循環依存防止                      |
| 4. SCSS ルール（SMACSS ベース） | `l-` / `is-` プレフィックス・`<style scoped lang="scss">` の使用・`$space-*` / `$color-*` 変数による統一・Apple スタイルの余白設計           |
| 5. Vue Router ルール            | `meta: { requiresAuth: true }` による認証設定・遅延ロード・名前付きルートの使用                                                              |
| 6. API クライアントルール       | `useAuthStore` からのトークン取得・`ApiResponse<T>` 型での受け取り・環境変数によるベース URL 管理                                            |
| 7. フォームバリデーションルール | `watch` によるリアルタイム検証・Zod の `safeParse().error.flatten().fieldErrors` の使用・日本語エラーメッセージ・インラインエラー表示        |
| 8. セキュリティルール           | SECURITY-04（CSP）/ SECURITY-08（認証チェック）/ SECURITY-09（エラー詳細非公開）/ SECURITY-12（トークン管理）の適用内容                      |
| 9. アクセシビリティルール       | `data-testid` の付与・命名規則（`{component}-{element-role}`）・`aria-label` の使用                                                          |

**なぜ存在するか:**
shared・supabase・backend の `business-rules.md` と同様に、frontend ユニットの実装者が「何をどう書くか」を判断するための規約ファイルです。特に Vue 3 の script setup・Pinia Setup 記法・SMACSS ベースの SCSS という3つの技術的選択について、具体的な推奨・非推奨パターンを示すことで、チーム全員が一貫した実装を行えるようにします。Apple.com スタイルのデザイン方針（余白重視・変数統一）も SCSS ルールとして明文化されています。

**いつ使われるか:**
Unit 4: frontend の Functional Design ステージ（Step 4）で生成されます。Code Generation ステージで `packages/frontend/` 以下のファイルを生成する際の実装規約として参照されます。また、新しいコンポーネント・composable・store を追加するときに「このコードは規約に沿っているか」を確認するチェックリストとしても機能します。

---

## 第7章: ファイル間の関係性まとめ

### ルールファイルとドキュメントの関係

```
.kiro/steering/core-workflow.md
  └── AI の行動を制御（すべての会話で自動読み込み）
        │
        ├── .kiro/aws-aidlc-rule-details/common/
        ├── .kiro/aws-aidlc-rule-details/inception/
        ├── .kiro/aws-aidlc-rule-details/construction/
        └── .kiro/aws-aidlc-rule-details/extensions/
              │
              ▼ AI がルールに従って生成
        aidlc-docs/
          ├── aidlc-state.md    ← 進捗管理（AI が最初に読む）
          ├── audit.md          ← 監査ログ
          ├── inception/        ← INCEPTION フェーズの成果物
          └── construction/     ← CONSTRUCTION フェーズの成果物
                │
                ▼ Code Generation で生成
        packages/
          ├── shared/           ← Unit 1 完了
          └── supabase/         ← Unit 2 完了
```

### 次に生成されるファイル（次回セッション以降）

```
aidlc-docs/construction/
  ├── backend/functional-design/   ← 完了
  │   ├── business-rules.md        ← 完了
  │   └── domain-entities.md       ← 完了
  ├── backend/code/summary.md      ← 完了
  ├── frontend/functional-design/
  │   ├── business-logic-model.md  ← 完了
  │   ├── business-rules.md        ← 完了
  │   └── frontend-components.md  ← 完了
  ├── frontend/code/summary.md      ← 完了
  ├── ci-cd/functional-design/
  └── ci-cd/code/

packages/
  ├── backend/                     ← Unit 3 完了（DDD 4層・Fastify・Prisma）
  ├── frontend/                    ← Unit 4 完了（プロジェクト構造・SCSS・Stores/Composables・Router・Views・エントリポイント）
  └── e2e/                         ← Unit 5（Playwright）← 計画作成済み・生成待ち

.github/workflows/                 ← Unit 5（GitHub Actions）← 計画作成済み・生成待ち
```

---

## 付録: AI-DLC ワークフローの学習ポイント

### なぜ「質問ファイル」方式を採用しているか

AI-DLC では、AI がチャットで直接質問するのではなく、専用の `.md` ファイルに質問を整理してユーザーに回答してもらいます。

- 記録が残る（回答がそのままドキュメントになる）
- 落ち着いて回答できる（チャットの流れに追われない）
- 矛盾チェックが容易（AI が全回答を一覧で確認できる）
- セッション再開時に参照できる

### なぜ「承認ゲート」があるか

各ステージの完了時にユーザーの明示的な承認を求めます。

- ユーザーコントロール（AI が勝手に進まない）
- 品質確認（次のステージに進む前に成果物を確認できる）
- 方向修正（「この設計は違う」と気づいたときに止められる）

### なぜ `aidlc-docs/` とアプリコードを分離するか

- 混在防止（ドキュメントとコードが混ざると管理が複雑になる）
- CI/CD の分離（アプリのビルドにドキュメントが影響しない）
- 明確な責務（`aidlc-docs/` を見れば設計の全体像が分かる）

### composables と components の責務分担（重要）

このプロジェクトでは以下の責務分担を採用しています。

```
components  → UI の描画・イベント受付のみ
composables → ビジネスロジック・フォームバリデーション・API 通信
stores      → 認証状態・サーバーデータの永続保持（Pinia Setup 記法）
```

components にビジネスロジックを書くことは禁止されています。ロジックは必ず composables に委譲します。

---

## 第8章: プロジェクトドキュメント

---

### `docs/TECH_BLOG_API.md`

**何を定義しているか:**
技術ブログ機能のREST APIエンドポイント一覧を定義したAPIドキュメントです。以下の内容が含まれます。

- ベースURL（`http://localhost:3000/api`）
- 認証方式（Bearer トークン）
- 記事エンドポイント（8つ）:
  - `GET /articles` - 公開記事一覧取得（ページネーション対応）
  - `GET /articles/:id` - 記事詳細取得
  - `POST /articles` - 記事作成（認証必要）
  - `PUT /articles/:id` - 記事更新（作成者のみ）
  - `PATCH /articles/:id/publish` - 記事公開/非公開（作成者のみ）
  - `DELETE /articles/:id` - 記事削除（作成者のみ）
  - `GET /articles/my` - 自分の記事一覧（認証必要）
  - `GET /articles/search` - タグ検索
- タグエンドポイント（1つ）:
  - `GET /tags` - タグ一覧取得
- 画像エンドポイント（2つ）:
  - `POST /images` - 画像アップロード（multipart/form-data、最大5MB）
  - `DELETE /images/:id` - 画像削除（作成者のみ）
- エラーレスポンス形式（統一された `{ error, code, statusCode }` 形式）
- 主なエラーコード（400/401/403/404/409/500）

各エンドポイントには以下の情報が含まれます:

- 認証要否
- クエリパラメータ/リクエストボディの仕様
- レスポンス例（JSON形式）
- ページネーション形式（`{ page, limit, total, totalPages }`）

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の実装が完了した後、フロントエンド開発者・バックエンド開発者・API利用者が参照するためのAPIリファレンスとして作成されました。以下の目的があります:

1. **フロントエンド開発の参照資料**: `packages/frontend/` の composables（`useArticleApi.ts` / `useTagApi.ts` / `useImageUpload.ts`）を実装する際に、正確なエンドポイント・リクエスト形式・レスポンス形式を確認できる
2. **バックエンド実装の仕様書**: `packages/backend/src/routes/` のルート実装（`article.route.ts` / `tag.route.ts` / `image.route.ts`）が仕様通りか確認できる
3. **API契約の明文化**: フロントエンド・バックエンド間のAPI契約を一箇所に集約し、認識齟齬を防ぐ
4. **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が技術ブログ機能のAPI全体像を素早く把握できる

**いつ使われるか:**

- フロントエンドの composables 実装時（API呼び出しコードを書くとき）
- バックエンドのルート実装時（エンドポイント仕様を確認するとき）
- 統合テスト作成時（リクエスト/レスポンス形式を確認するとき）
- E2Eテスト作成時（実際のAPIフローを確認するとき）
- APIの変更・拡張時（既存エンドポイントとの整合性を確認するとき）

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 要件定義（このAPIドキュメントの元となる機能要件）
- `.kiro/specs/tech-blog/design.md` - 設計書（APIエンドポイントの設計根拠）
- `.kiro/specs/tech-blog/tasks.md` - 実装タスク（Phase 6: Backend — Interface 層でルート実装）
- `packages/backend/src/routes/article.route.ts` - 記事エンドポイントの実装
- `packages/backend/src/routes/tag.route.ts` - タグエンドポイントの実装
- `packages/backend/src/routes/image.route.ts` - 画像エンドポイントの実装
- `packages/frontend/src/composables/useArticleApi.ts` - 記事API呼び出しロジック
- `packages/frontend/src/composables/useTagApi.ts` - タグAPI呼び出しロジック
- `packages/frontend/src/composables/useImageUpload.ts` - 画像アップロードロジック

---

### `docs/AUTHENTICATION_SETUP.md`

**何を定義しているか:**
技術ブログアプリケーションの認証機能（Supabase Auth）のセットアップ手順・トラブルシューティング・セキュリティ対策を定義した運用ドキュメントです。以下の内容が含まれます。

- **環境変数の設定**:
  - バックエンド（`packages/backend/.env`）: `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
  - フロントエンド（`packages/frontend/.env`）: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_API_BASE_URL`
- **テストユーザーの作成**:
  - スクリプト実行手順（`pnpm create-test-user`）
  - テストユーザー情報（Email: `test@example.com` / Password: `test1234`）
- **アプリケーションの起動**:
  - バックエンド起動（`pnpm dev`）
  - フロントエンド起動（`pnpm dev`）
  - ログイン手順（「テストユーザーで入力」ボタン → 「ログイン」ボタン）
- **認証の仕組み**:
  - トークンの保存（LocalStorage に `auth_token` / `supabase.auth.token` を保存）
  - トークンの使用（API リクエスト時に `Authorization: Bearer <access_token>` ヘッダーを自動付与）
  - セッションの復元（アプリケーション起動時に Supabase セッションを自動復元）
- **トラブルシューティング**:
  - ログインできない場合の3つの確認項目（環境変数・テストユーザー・ネットワークエラー）
  - 画像アップロードで 401 エラーが出る場合の3つの確認項目（トークン・セッション・バックエンドログ）
- **新しいユーザーの作成**:
  - 方法1: Supabase Dashboard から手動作成
  - 方法2: `create-test-user.ts` スクリプトを編集して作成
- **セキュリティ**:
  - 本番環境での注意事項（テストユーザー削除・環境変数保護・パスワードポリシー・トークン有効期限）
- **API エンドポイント**:
  - 認証が必要なエンドポイント（記事作成・更新・削除・公開・自分の記事一覧・画像アップロード・画像削除）
  - 認証が不要なエンドポイント（公開記事一覧・記事詳細・タグ検索・タグ一覧）

**なぜ存在するか:**
技術ブログ機能の実装が完了した後、以下の目的で作成されました:

1. **初回セットアップの手順書**: 新しい開発者がプロジェクトに参加し、ローカル環境で認証機能を動かすための手順を明文化する
2. **テストユーザー作成の自動化**: `pnpm create-test-user` スクリプトの使い方を説明し、手動でのユーザー作成を不要にする
3. **トラブルシューティングガイド**: ログインできない・画像アップロードで 401 エラーが出るなどの問題が発生したときに、原因を素早く特定できるようにする
4. **認証の仕組みの理解**: トークンの保存場所（LocalStorage）・API リクエスト時のヘッダー付与・セッション復元の仕組みを明確にし、開発者が認証フローを理解できるようにする
5. **セキュリティ対策の明文化**: 本番環境でのテストユーザー削除・環境変数保護・パスワードポリシー・トークン有効期限などのセキュリティ対策を明示し、本番デプロイ前に確認できるようにする
6. **API エンドポイントの認証要否の明確化**: どのエンドポイントが認証必要か・不要かを一覧化し、フロントエンド開発者が認証ヘッダーの付与要否を判断できるようにする

**いつ使われるか:**

- **初回セットアップ時**: 新しい開発者がプロジェクトに参加し、ローカル環境で認証機能を動かすとき
- **テストユーザー作成時**: 開発・テスト用のユーザーアカウントを作成するとき
- **トラブルシューティング時**: ログインできない・認証エラーが出るなどの問題が発生したとき
- **本番環境構築時**: 本番デプロイ前にセキュリティ対策（テストユーザー削除・環境変数保護）を確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が認証機能の全体像を素早く把握するとき
- **API 実装時**: フロントエンド・バックエンド開発者が「このエンドポイントは認証必要か」を確認するとき

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 要件16「セキュリティとアクセス制御」の定義（認証・認可の要件）
- `.kiro/specs/tech-blog/design.md` - 認証機能の設計（Supabase Auth・JWT 検証・セッション管理）
- `packages/backend/scripts/create-test-user.ts` - テストユーザー作成スクリプト
- `packages/backend/src/infrastructure/supabase/auth.service.ts` - Supabase Auth との通信実装（JWT 検証）
- `packages/backend/src/plugins/auth.plugin.ts` - Fastify 認証プラグイン（JWT 検証ミドルウェア）
- `packages/frontend/src/stores/useAuthStore.ts` - 認証状態管理（Pinia Store）
- `packages/frontend/src/composables/useAuth.ts` - 認証ビジネスロジック（ログイン・ログアウト・セッション復元）
- `packages/frontend/src/composables/api/useApiClient.ts` - API クライアント（認証ヘッダー自動付与）
- `packages/frontend/src/views/auth/LoginView.vue` - ログイン画面
- `docs/TECH_BLOG_API.md` - API エンドポイント一覧（認証要否の記載）

---

### `docs/IMAGE_UPLOAD_SETUP.md`

**何を定義しているか:**
技術ブログ機能の画像アップロード機能のセットアップ手順・トラブルシューティング・使い方を定義した運用ドキュメントです。以下の内容が含まれます。

- **Supabase Storage バケット設定**:
  - バケット作成手順（`images` バケット・Public bucket ON）
  - RLS ポリシー設定（SELECT: 全ユーザー / INSERT: 認証済みユーザー / DELETE: 作成者のみ）
  - 環境変数設定（`SUPABASE_URL` / `SUPABASE_ANON_KEY`）
- **トラブルシューティング**:
  - 画像アップロード失敗時の5つの確認項目（認証トークン・バケット存在・RLS ポリシー・ネットワークエラー・バックエンドログ）
  - デバッグモード（フロントエンドコンソールログの見方）
- **画像アップロードの仕組み**:
  - 一時的な画像アップロード（記事作成時・articleId なし）: `articles/temp-{userId}/{timestamp}-{filename}`
  - 記事に紐づく画像アップロード（記事編集時・articleId あり）: `articles/{articleId}/{timestamp}-{filename}`
- **対応画像形式**: JPEG / PNG / GIF / WebP
- **画像サイズ制限**: 最大5MB・最大幅高さ10000px
- **使い方**:
  - カバー画像のアップロード手順
  - 本文への画像挿入（3つの方法: ドラッグ&ドロップ / ツールバーから挿入 / Markdown 記法で直接入力）

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の要件9「画像アップロード」の実装が完了した後、以下の目的で作成されました:

1. **初回セットアップの手順書**: Supabase Dashboard での `images` バケット作成・RLS ポリシー設定・環境変数設定の手順を明文化し、開発者が迷わずセットアップできるようにする
2. **トラブルシューティングガイド**: 画像アップロードが失敗したときに「どこを確認すべきか」を5つのステップで示し、問題を素早く特定できるようにする
3. **仕組みの理解**: 一時的な画像アップロード（記事作成時）と記事に紐づく画像アップロード（記事編集時）の違いを明確にし、ストレージパスの命名規則を理解できるようにする
4. **エンドユーザー向け使い方**: 記事作成・編集画面での画像アップロード方法（カバー画像・本文への画像挿入）を3つの方法で説明し、ユーザーが迷わず画像を追加できるようにする
5. **運用時の参照資料**: 本番環境で画像アップロードに問題が発生したときに、運用チームが参照するトラブルシューティングマニュアルとして機能する

**いつ使われるか:**

- **初回セットアップ時**: 新しい開発者がプロジェクトに参加し、ローカル環境で画像アップロード機能を動かすとき
- **本番環境構築時**: Supabase の本番プロジェクトで `images` バケットと RLS ポリシーを設定するとき
- **トラブルシューティング時**: 画像アップロードが失敗し、原因を特定するとき（認証エラー・権限エラー・ネットワークエラーの切り分け）
- **ユーザーサポート時**: エンドユーザーから「画像がアップロードできない」という問い合わせがあったときに、サポートチームが参照する
- **機能拡張時**: 画像アップロード機能を拡張する際に、現在の仕組み（一時的アップロード vs 記事紐づけアップロード）を理解するため

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 要件9「画像アップロード」の定義（この運用ドキュメントの元となる要件）
- `.kiro/specs/tech-blog/design.md` - 画像アップロードの設計（Supabase Storage・RLS ポリシー・ストレージパス命名規則）
- `.kiro/specs/tech-blog/tasks.md` - Task 3「Supabase Storage 設定」/ Task 13「Image Usecases 作成」/ Task 17「Image Routes 作成」
- `packages/backend/src/routes/image.route.ts` - 画像アップロード API エンドポイントの実装
- `packages/backend/src/application/usecases/upload-image.usecase.ts` - 画像アップロードのビジネスロジック
- `packages/backend/src/application/usecases/delete-image.usecase.ts` - 画像削除のビジネスロジック
- `packages/backend/src/infrastructure/supabase/storage.service.impl.ts` - Supabase Storage との通信実装
- `packages/frontend/src/composables/useImageUpload.ts` - フロントエンドの画像アップロードロジック
- `packages/frontend/src/components/ImageUploader.vue` - 画像アップロード UI コンポーネント
- `docs/TECH_BLOG_API.md` - 画像アップロード API エンドポイントの仕様（`POST /api/images` / `DELETE /api/images/:id`）

---

### `docs/NEXT_ARTICLE_FEATURE.md`

**何を定義しているか:**
技術ブログ機能の「次に読むべき記事」機能のセットアップ手順・使い方・データベーススキーマ変更・API変更を定義した機能ドキュメントです。以下の内容が含まれます。

- **機能概要**:
  - 記事の連結（記事に「次の記事」を設定可能）
  - 記事詳細画面での「次に読む」セクション表示
  - 記事編集画面での次の記事選択ドロップダウン
- **セットアップ手順**:
  - データベースマイグレーション実行（`npx prisma migrate deploy` または `npx prisma migrate dev`）
  - Prismaクライアントの再生成（`npx prisma generate`）
  - アプリケーションの再起動
- **使い方**:
  - 記事編集画面での次の記事設定手順（ドロップダウンから選択 → 保存）
  - 記事詳細画面での次の記事確認手順（記事下部の「次に読む」セクション → クリックで移動）
- **データベーススキーマ変更**:
  - `articles` テーブルに `next_article_id` カラム追加（UUID型・NULL許可）
  - 外部キー制約追加（`articles.next_article_id` → `articles.id`・ON DELETE SET NULL・ON UPDATE CASCADE）
  - インデックス追加（`idx_articles_next_article_id`）
- **API変更**:
  - `CreateArticleInput` に `nextArticleId?: string | null` フィールド追加
  - `UpdateArticleInput` に `nextArticleId?: string | null` フィールド追加
  - `Article` 型に `nextArticleId?: string | null` と `nextArticle?: { id: string; title: string } | null` フィールド追加
- **実装ファイル一覧**:
  - バックエンド（6ファイル）: `schema.prisma` / マイグレーションSQL / `article.entity.ts` / `article.repository.impl.ts` / `create-article.usecase.ts` / `update-article.usecase.ts`
  - 共有（1ファイル）: `article.schema.ts`
  - フロントエンド（3ファイル）: `ArticleForm.vue` / `ArticleEditView.vue` / `ArticleDetailView.vue`
- **注意事項**:
  - 循環参照（A→B→A）は現在チェックしていない
  - 次の記事は同じ作成者の公開記事のみ選択可能

**なぜ存在するか:**
技術ブログ機能の拡張として「次に読むべき記事」機能が追加された際に、以下の目的で作成されました:

1. **機能追加の記録**: 既存の技術ブログ機能に新しい機能が追加されたことを明文化し、どのような変更が行われたかを記録する
2. **セットアップ手順の提供**: データベーススキーマ変更（マイグレーション実行）・Prismaクライアント再生成・アプリケーション再起動の手順を明確にし、開発者が迷わず機能を有効化できるようにする
3. **使い方の説明**: エンドユーザー（記事作成者）が記事編集画面で次の記事を設定する方法・読者が記事詳細画面で次の記事に移動する方法を説明する
4. **技術的変更の詳細**: データベーススキーマ変更（`next_article_id` カラム追加・外部キー制約・インデックス）・API変更（`CreateArticleInput` / `UpdateArticleInput` / `Article` 型の拡張）を明文化し、フロントエンド・バックエンド開発者が変更内容を理解できるようにする
5. **実装ファイルの一覧化**: この機能追加で変更されたファイル（バックエンド6ファイル・共有1ファイル・フロントエンド3ファイル）を一覧化し、コードレビュー・テスト・デバッグの際に参照できるようにする

**いつ使われるか:**

- **機能追加後の初回セットアップ時**: 開発者がローカル環境で「次に読むべき記事」機能を有効化するとき（マイグレーション実行・Prismaクライアント再生成）
- **本番環境へのデプロイ時**: 本番環境でマイグレーションを実行し、機能を有効化するとき
- **エンドユーザーへの説明時**: 記事作成者に「次の記事を設定する方法」を説明するとき
- **機能拡張時**: 「次に読むべき記事」機能をさらに拡張する際に、現在の実装（データベーススキーマ・API仕様・実装ファイル）を理解するため
- **トラブルシューティング時**: 「次の記事」が表示されない・設定できないなどの問題が発生したときに、実装ファイルを特定するため

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（この機能追加の元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（この機能追加の設計根拠）
- `packages/backend/prisma/schema.prisma` - Prismaスキーマ（`next_article_id` カラム定義）
- `packages/backend/prisma/migrations/` - マイグレーションファイル（`next_article_id` カラム追加SQL）
- `packages/backend/src/domain/entities/article.entity.ts` - Article エンティティ（`nextArticleId` フィールド追加）
- `packages/backend/src/infrastructure/repositories/article.repository.impl.ts` - Article リポジトリ（`nextArticle` の取得ロジック）
- `packages/backend/src/application/usecases/create-article.usecase.ts` - 記事作成ユースケース（`nextArticleId` の処理）
- `packages/backend/src/application/usecases/update-article.usecase.ts` - 記事更新ユースケース（`nextArticleId` の処理）
- `packages/shared/src/schemas/article.schema.ts` - Article スキーマ（`nextArticleId` フィールド追加）
- `packages/frontend/src/components/ArticleForm.vue` - 記事フォームコンポーネント（次の記事選択ドロップダウン）
- `packages/frontend/src/views/ArticleEditView.vue` - 記事編集画面（次の記事設定UI）
- `packages/frontend/src/views/ArticleDetailView.vue` - 記事詳細画面（次の記事表示セクション）

---

### `VERCEL_FIX_FINAL.md`

**何を定義しているか:**
Vercelデプロイ時の500エラーを解決するための最終修正ガイドです。以下の内容が含まれます。

- **実施した修正**:
  1. `vercel.json` - 標準ビルドフローへの変更（`installCommand: pnpm install` / `buildCommand: pnpm build` / `functions` 設定で `@vercel/node@3.0.0` ランタイム指定・Prismaファイル含有）
  2. `tsconfig.json` - 型チェック緩和（`strict: false` / `allowSyntheticDefaultImports: true`）
  3. ルート `package.json` - buildスクリプト追加（`pnpm --filter @monorepo/backend db:generate && pnpm --filter @monorepo/backend build:api`）
- **デプロイ手順**:
  - Git コミット・プッシュ手順（`git add .` → `git commit -m "fix: Configure Vercel with Prisma generation"` → `git push origin main`）
- **期待される動作**:
  1. `pnpm install` - 依存関係インストール
  2. `pnpm build` - Prisma Client生成
  3. `api/index.ts` - TypeScriptビルド
  4. `/api/health` → `{"status":"ok"}` レスポンス
- **環境変数確認**:
  - Vercel Dashboardで設定すべき環境変数一覧（`DATABASE_URL` / `DIRECT_URL` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `CORS_ORIGIN` / `NODE_ENV=production`）
  - `DATABASE_URL` の注意事項（Pooler URL + `?pgbouncer=true` パラメータ）
  - `DIRECT_URL` の注意事項（Direct URL）

**なぜ存在するか:**
技術ブログアプリケーションをVercelにデプロイする際に500エラーが発生し、その原因がPrisma Clientの生成タイミング・TypeScriptビルド設定・Vercelのビルドフロー設定にあったため、以下の目的で作成されました:

1. **修正内容の記録**: Vercelデプロイ時の500エラーを解決するために行った3つの修正（`vercel.json` / `tsconfig.json` / ルート `package.json`）を明文化し、同じ問題が再発したときに参照できるようにする
2. **デプロイ手順の明確化**: 修正後のGitコミット・プッシュ手順を示し、開発者が迷わずデプロイできるようにする
3. **期待される動作の明示**: Vercelのビルドフローが正しく動作したときの4つのステップ（依存関係インストール → Prisma Client生成 → TypeScriptビルド → ヘルスチェック成功）を明示し、デプロイ成功の判断基準を提供する
4. **環境変数設定の確認リスト**: Vercel Dashboardで設定すべき7つの環境変数を一覧化し、デプロイ前に設定漏れがないか確認できるようにする
5. **トラブルシューティングの起点**: Vercelデプロイで問題が発生したときに、まずこのファイルを参照して修正内容・環境変数設定を確認できるようにする

**いつ使われるか:**

- **Vercelデプロイ時**: 技術ブログアプリケーションをVercelにデプロイする際に、ビルド設定・環境変数設定を確認するとき
- **500エラー発生時**: Vercelデプロイ後に500エラーが発生し、原因を特定するとき（Prisma Client生成・TypeScriptビルド・環境変数の確認）
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者がVercelデプロイの仕組みを理解するとき
- **デプロイ設定の変更時**: `vercel.json` / `tsconfig.json` / ルート `package.json` を変更する際に、現在の設定内容を確認するとき
- **本番環境のトラブルシューティング**: 本番環境で問題が発生し、Vercelのビルドログ・環境変数設定を確認するとき

**関連ファイル:**

- `vercel.json` - Vercelのビルド設定（このガイドで修正された設定ファイル）
- `tsconfig.json` - TypeScriptコンパイラ設定（このガイドで修正された設定ファイル）
- ルート `package.json` - モノレポのビルドスクリプト（このガイドで修正された設定ファイル）
- `api/index.ts` - Vercel Serverless Functionsのエントリポイント
- `packages/backend/prisma/schema.prisma` - Prismaスキーマ（Prisma Client生成の元となるファイル）
- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの詳細ガイド（このガイドの補完資料）
- `docs/VERCEL_QUICK_START.md` - Vercelデプロイのクイックスタートガイド
- `docs/VERCEL_TROUBLESHOOTING.md` - Vercelデプロイのトラブルシューティングガイド
- `docs/VERCEL_ENV_VARS.md` - Vercel環境変数の設定ガイド
- `README.md` - プロジェクト全体の説明書（Vercel対応の明示）

---著者の記事のみ選択可能

- 次の記事が削除された場合は自動的に `null` に設定される（ON DELETE SET NULL）

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の実装完了後、記事を連載形式で繋げる「次に読むべき記事」機能が追加実装されました。以下の目的で作成されました:

1. **機能追加のドキュメント化**: 既存の技術ブログ機能に新しく追加された「次に読むべき記事」機能の仕様・使い方・実装詳細を一箇所にまとめ、開発者が機能全体を理解できるようにする
2. **セットアップ手順の明文化**: データベースマイグレーション実行・Prismaクライアント再生成・アプリケーション再起動の手順を明示し、既存環境に機能を追加する際の手順を明確にする
3. **データベーススキーマ変更の記録**: `articles` テーブルへの `next_article_id` カラム追加・外部キー制約・インデックス追加の詳細を記録し、データベース構造の変更履歴を残す
4. **API変更の明示**: `CreateArticleInput` / `UpdateArticleInput` / `Article` 型への `nextArticleId` / `nextArticle` フィールド追加を明示し、フロントエンド・バックエンド開発者が型定義の変更を把握できるようにする
5. **実装ファイルの一覧化**: バックエンド・共有・フロントエンドの各層で変更されたファイルを一覧化し、機能追加に伴うコード変更の全体像を把握できるようにする
6. **注意事項の明記**: 循環参照チェックの未実装・同じ著者の記事のみ選択可能・削除時の自動NULL設定などの制約を明記し、運用時の注意点を明確にする

**いつ使われるか:**

- **機能追加時**: 既存環境に「次に読むべき記事」機能を追加する際に、セットアップ手順を確認するとき
- **データベースマイグレーション実行時**: `next_article_id` カラム追加のマイグレーションを実行する際に、スキーマ変更の詳細を確認するとき
- **API実装時**: フロントエンド・バックエンド開発者が `nextArticleId` / `nextArticle` フィールドの型定義を確認するとき
- **機能拡張時**: 「次に読むべき記事」機能を拡張する際に、現在の実装ファイル・制約・注意事項を確認するとき
- **トラブルシューティング時**: 次の記事が表示されない・選択できないなどの問題が発生したときに、実装詳細を確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が「次に読むべき記事」機能の全体像を素早く把握するとき

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（この機能の元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（アーキテクチャ・データモデル）
- `.kiro/specs/tech-blog/tasks.md` - 技術ブログ機能の実装タスク
- `packages/backend/prisma/schema.prisma` - Prismaスキーマ（`next_article_id` カラム定義）
- `packages/backend/prisma/migrations/20260421000000_add_next_article/migration.sql` - マイグレーションSQL
- `packages/backend/src/domain/entities/article.entity.ts` - Article エンティティ（`nextArticleId` / `nextArticle` フィールド定義）
- `packages/backend/src/infrastructure/prisma/article.repository.impl.ts` - Article リポジトリ実装（`nextArticle` の取得ロジック）
- `packages/backend/src/application/usecases/create-article.usecase.ts` - 記事作成ユースケース（`nextArticleId` の保存）
- `packages/backend/src/application/usecases/update-article.usecase.ts` - 記事更新ユースケース（`nextArticleId` の更新）
- `packages/shared/src/schemas/article.schema.ts` - Article スキーマ（`nextArticleId` / `nextArticle` フィールド定義）
- `packages/frontend/src/components/ArticleForm.vue` - 記事フォームコンポーネント（次の記事選択ドロップダウン）
- `packages/frontend/src/views/ArticleEditView.vue` - 記事編集画面（次の記事設定）
- `packages/frontend/src/views/ArticleDetailView.vue` - 記事詳細画面（次に読むセクション表示）
- `docs/MIGRATION_INSTRUCTIONS.md` - マイグレーション実行手順（データベース更新の手順書）

---

### `docs/MIGRATION_INSTRUCTIONS.md`

**何を定義しているか:**
「次に読むべき記事」機能のデータベースマイグレーション実行手順を定義した運用ドキュメントです。以下の内容が含まれます。

- **マイグレーション実行方法**:
  - 方法1: Supabase Dashboard から SQL Editor で実行（推奨）
  - 方法2: psql コマンドラインから実行
- **実行する SQL**:
  - `articles` テーブルに `next_article_id` カラム追加（UUID型・NULL許可）
  - 外部キー制約追加（`articles_next_article_id_fkey`・ON DELETE SET NULL・ON UPDATE CASCADE）
  - インデックス追加（`idx_articles_next_article_id`）
  - すべて `IF NOT EXISTS` 句を使用（冪等性を保証）
- **確認 SQL**:
  - `next_article_id` カラムの存在確認
  - インデックスの存在確認
  - 外部キー制約の存在確認
- **完了後の手順**:
  - バックエンドサーバーの再起動
  - フロントエンドの開発サーバーの再起動
  - ブラウザキャッシュのクリア（Cmd+Shift+R）
- **トラブルシューティング**:
  - 「column "next_article_id" already exists」エラー → 問題なし（既に存在）
  - 「constraint "articles_next_article_id_fkey" already exists」エラー → 問題なし（既に存在）
  - 「relation "idx_articles_next_article_id" already exists」エラー → 問題なし（既に存在）

**なぜ存在するか:**
「次に読むべき記事」機能（`docs/NEXT_ARTICLE_FEATURE.md`）の実装に伴い、データベーススキーマ変更が必要になりました。以下の目的で作成されました:

1. **マイグレーション実行の手順書**: 既存環境（開発環境・本番環境）に「次に読むべき記事」機能を追加する際に、データベース更新の手順を明文化し、開発者・運用チームが迷わずマイグレーションを実行できるようにする
2. **冪等性の保証**: `IF NOT EXISTS` 句を使用することで、マイグレーションを複数回実行してもエラーにならず、既に適用済みの場合はスキップされることを明示する
3. **確認手順の提供**: マイグレーション実行後に「正しく適用されたか」を確認する SQL を提供し、開発者が自己確認できるようにする
4. **トラブルシューティングガイド**: よくあるエラーメッセージ（「already exists」エラー）に対して「問題なし」と明示し、開発者が不安にならないようにする
5. **完了後の手順の明示**: マイグレーション実行後にアプリケーションを再起動する必要があることを明示し、開発者が忘れずに再起動できるようにする
6. **Supabase Dashboard 推奨**: Supabase Dashboard の SQL Editor から実行する方法を推奨することで、psql コマンドラインに不慣れな開発者でも GUI で実行できるようにする

**いつ使われるか:**

- **機能追加時**: 既存環境（開発環境・ステージング環境・本番環境）に「次に読むべき記事」機能を追加する際に、データベースマイグレーションを実行するとき
- **新規環境構築時**: 新しい開発者がプロジェクトに参加し、ローカル環境をセットアップする際に、最新のデータベーススキーマに更新するとき
- **本番環境デプロイ時**: 本番環境に「次に読むべき記事」機能をデプロイする際に、本番データベースにマイグレーションを適用するとき
- **トラブルシューティング時**: マイグレーション実行時にエラーが発生し、原因を特定するとき（「already exists」エラーの確認）
- **確認作業時**: マイグレーションが正しく適用されたかを確認する際に、確認 SQL を実行するとき
- **ロールバック検討時**: マイグレーションを元に戻す必要がある場合に、どのカラム・制約・インデックスを削除すべきかを確認するとき

**関連ファイル:**

- `docs/NEXT_ARTICLE_FEATURE.md` - 「次に読むべき記事」機能の仕様・使い方・実装詳細（このマイグレーションの目的）
- `packages/backend/add_next_article.sql` - マイグレーション SQL ファイル（psql コマンドから実行する場合に使用）
- `packages/backend/prisma/schema.prisma` - Prisma スキーマ（`next_article_id` カラム定義）
- `packages/backend/prisma/migrations/20260421000000_add_next_article/migration.sql` - Prisma マイグレーションファイル（Prisma Migrate を使用する場合）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（データベーススキーマ設計）
- `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ手順（環境変数設定・データベース接続の参考）
- `aidlc-docs/construction/supabase/functional-design/business-rules.md` - Supabase パッケージのルール（マイグレーション命名規則・RLS ポリシー）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - ビルド手順書（Prisma セットアップ・マイグレーション実行の参考）rticleエンティティ（`nextArticleId` / `nextArticle` フィールド追加）
- `packages/backend/src/infrastructure/prisma/article.repository.impl.ts` - リポジトリ実装（`nextArticle` の取得ロジック）
- `packages/backend/src/application/usecases/create-article.usecase.ts` - 記事作成ユースケース（`nextArticleId` の保存）
- `packages/backend/src/application/usecases/update-article.usecase.ts` - 記事更新ユースケース（`nextArticleId` の更新）
- `packages/shared/src/schemas/article.schema.ts` - スキーマ定義（`nextArticleId` フィールド追加）
- `packages/frontend/src/components/ArticleForm.vue` - 記事フォーム（次の記事選択ドロップダウン）
- `packages/frontend/src/views/ArticleEditView.vue` - 記事編集画面（次の記事設定UI）
- `packages/frontend/src/views/ArticleDetailView.vue` - 記事詳細画面（「次に読む」セクション表示）
- `docs/TECH_BLOG_API.md` - 技術ブログAPI仕様（記事作成・更新APIの `nextArticleId` パラメータ）

---

### `docs/VERCEL_DEPLOYMENT.md`

**何を定義しているか:**
技術ブログアプリケーションのフロントエンドとバックエンドを**別々のVercelプロジェクト**としてデプロイする完全な手順・設定・トラブルシューティング・パフォーマンス最適化・コスト管理を定義した包括的な運用ドキュメントです。以下の内容が含まれます。

- **デプロイ戦略**:
  - フロントエンドとバックエンドを別々のVercelプロジェクトとしてデプロイする理由（独立したスケーリング・明確な責任分離・デプロイの柔軟性・環境変数の管理）
- **1. バックエンドのデプロイ**:
  - Vercelプロジェクト作成（プロジェクト名: `tech-blog-backend`）
  - ビルド設定（Framework Preset: Other / Root Directory: `packages/backend` / Build Command: `pnpm install && pnpm --filter @monorepo/backend db:generate` / Output Directory: 空欄（Serverless Functions使用））
  - 環境変数設定（`NODE_ENV` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `DATABASE_URL`（Pooler URL・ポート6543） / `DIRECT_URL`（Direct URL・ポート5432） / `CORS_ORIGIN` / `RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX`）
  - Supabase接続情報の取得方法（Supabase Dashboard → Project Settings → Database → Connection string → Transaction mode（Pooler）→ `DATABASE_URL` / Direct connection → `DIRECT_URL`）
  - 動作確認（`curl https://tech-blog-backend.vercel.app/health` → `{"status":"ok"}`）
- **2. フロントエンドのデプロイ**:
  - Vercelプロジェクト作成（同じGitHubリポジトリを再度選択・プロジェクト名: `tech-blog-frontend`）
  - ビルド設定（Framework Preset: Other / Root Directory: `./`（モノレポのルート） / Build Command: `pnpm build:frontend` / Output Directory: `packages/frontend/dist` / Install Command: `pnpm install`）
  - 環境変数設定（`VITE_API_BASE_URL`（バックエンドURL） / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`）
- **3. CORS設定の更新**:
  - バックエンドの環境変数`CORS_ORIGIN`をフロントエンドURLに更新（`https://tech-blog-frontend.vercel.app` / 複数オリジン許可: `https://tech-blog-frontend.vercel.app,https://tech-blog-frontend-*.vercel.app`）
  - バックエンドの再デプロイ（Deployments → "..." → "Redeploy"）
- **4. 動作確認**:
  - フロントエンド確認（ログインページ表示・記事一覧表示）
  - バックエンド確認（`curl https://tech-blog-backend.vercel.app/api/articles` / 認証が必要なエンドポイントのテスト）
- **自動デプロイ**:
  - Production環境（`main`ブランチへのプッシュで両プロジェクトが自動デプロイ）
  - Preview環境（プルリクエストの作成・更新で各プロジェクトにプレビューデプロイメント作成・URL: `https://tech-blog-frontend-git-branch-name.vercel.app`）
- **Vercel CLIテスト**:
  - インストール（`npm i -g vercel`）
  - ログイン（`vercel login`）
  - バックエンドのテスト（`cd packages/backend` → `vercel dev`）
  - フロントエンドのテスト（ルートディレクトリで `vercel dev`）
  - デプロイ（プレビュー環境: `vercel` / 本番環境: `vercel --prod`）
- **トラブルシューティング**:
  - バックエンド: "Module not found" エラー → Prisma Clientが生成されていない → Build Commandに`db:generate`が含まれているか確認・環境変数`DATABASE_URL`と`DIRECT_URL`が正しく設定されているか確認
  - バックエンド: データベース接続エラー → DATABASE_URLの設定が間違っている → Supabase Dashboardで接続文字列を再確認・`DATABASE_URL`にはPooler URL（ポート6543）を使用・`DIRECT_URL`にはDirect URL（ポート5432）を使用・`?pgbouncer=true`パラメータが`DATABASE_URL`に含まれているか確認
  - バックエンド: "Function timeout" エラー → Serverless Functionの実行時間が10秒を超えた → データベースクエリを最適化・不要な処理を削除・Vercel Proプランにアップグレード（タイムアウト60秒）
  - フロントエンド: APIリクエストが失敗する → CORS設定が正しくない → バックエンドの`CORS_ORIGIN`にフロントエンドのURLが含まれているか確認・ブラウザの開発者ツールでCORSエラーを確認・バックエンドを再デプロイ
  - フロントエンド: 環境変数が反映されない → 環境変数の変更後に再ビルドしていない → 環境変数名が`VITE_`プレフィックスで始まっているか確認・Vercel Dashboardで環境変数を確認・再デプロイを実行
  - SPAルーティングが動作しない → リライトルールが設定されていない → ルートの`vercel.json`に`{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`が含まれているか確認
- **パフォーマンス最適化**:
  - Vercelの自動最適化（CDNによるグローバル配信・自動画像最適化・エッジキャッシング・Gzip/Brotli圧縮）
  - フロントエンド追加最適化（コード分割: Vue Routerの遅延ローディング / 画像最適化: WebP形式 / キャッシング: 静的アセットに長期キャッシュ）
  - バックエンド追加最適化（コールドスタート対策: 不要な依存関係削除・初期化処理最小化・アプリケーションインスタンス再利用（`api/index.ts`で実装済み） / データベースクエリ最適化: インデックス設定・N+1問題回避・Prismaクエリ最適化 / レスポンスキャッシング: 頻繁にアクセスされるデータをキャッシュ・Vercel Edge Cache活用）
- **セキュリティ考慮事項**:
  - フロントエンド（環境変数に機密情報を含めない（ビルド時にバンドルされる）・Supabase Anon Keyは公開されても安全（RLSで保護）・APIキーは使用しない）
  - バックエンド（`SUPABASE_SERVICE_ROLE_KEY`は環境変数で管理・CORS設定を適切に制限・レート制限を有効化・Helmetでセキュリティヘッダーを設定・入力値のバリデーション（Zodで実装済み））
  - データベース（Row Level Security（RLS）を有効化・最小権限の原則を適用・接続文字列を環境変数で管理）
- **モニタリング**:
  - Vercel Dashboard（各プロジェクトで Deployments: デプロイメント履歴 / Functions: Serverless Functionsの実行ログ（バックエンドのみ） / Analytics: トラフィック分析（Pro以上） / Logs: リアルタイムログ（Pro以上））
  - Supabase Dashboard（Database: クエリパフォーマンス / Storage: ストレージ使用量 / Auth: 認証ログ / Logs: APIログ）
- **コスト管理**:
  - Vercel無料プラン（帯域幅: 100GB/月 / Serverless Functions実行時間: 100時間/月 / ビルド時間: 6,000分/月）
  - 使用量の確認（Vercel Dashboard → Settings → Usage → 各メトリクスの使用状況を確認）
  - コスト削減のヒント（画像を最適化してサイズを削減・不要なAPIリクエストを削減・キャッシングを活用・Serverless Functionsの実行時間を最適化）
- **環境別の設定**:
  - Development（フロントエンド: `VITE_API_BASE_URL=http://localhost:3000` / バックエンド: `CORS_ORIGIN=http://localhost:5173`）
  - Preview（Vercelが自動的にプレビューURLを生成・環境変数は本番と同じ設定を使用するか、Preview専用の値を設定可能）
  - Production（本番環境の環境変数を使用）
- **よくある質問**:
  - Q: モノレポで1つのプロジェクトとしてデプロイできますか？ → A: 技術的には可能ですが、推奨しません。別々のプロジェクトとしてデプロイする方が、管理が簡単で柔軟性が高いです。
  - Q: バックエンドのServerless Functionsは常に起動していますか？ → A: いいえ。リクエストがあるときのみ起動します（コールドスタート）。頻繁にアクセスされる場合は、インスタンスが再利用されます。
  - Q: データベースマイグレーションはどうすればいいですか？ → A: ローカルまたはCI/CDパイプラインで実行してください。Vercel Serverless Functionsでは実行しないでください。（`cd packages/backend` → `pnpm db:migrate`）
  - Q: 複数の環境（staging、production）を管理できますか？ → A: はい。Vercelプロジェクトを複数作成するか、環境変数で環境を切り替えることができます。
  - Q: カスタムドメインを使用できますか？ → A: はい。Vercel Dashboard → Settings → Domains でカスタムドメインを追加できます。
- **参考リンク**:
  - Vercel Documentation / Vercel CLI / Environment Variables / Monorepo Support / Serverless Functions / Supabase + Vercel

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の実装が完了し、ローカル環境での動作確認が完了した後、以下の目的で作成されました:

1. **フロントエンドとバックエンドの別々デプロイ戦略の明文化**: モノレポ構成でフロントエンドとバックエンドを**別々のVercelプロジェクト**としてデプロイする理由（独立したスケーリング・明確な責任分離・デプロイの柔軟性・環境変数の管理）を説明し、開発者が適切なデプロイ戦略を理解できるようにする
2. **バックエンドのServerless Functions化の手順書**: FastifyアプリケーションをVercel Serverless Functionsとしてデプロイする完全な手順を提供する。特にモノレポ構成でのバックエンド設定（Root Directory: `packages/backend` / Build Command: `pnpm install && pnpm --filter @monorepo/backend db:generate` / Output Directory: 空欄）を明示することで、設定ミスを防ぐ
3. **Supabase接続情報の取得方法の明示**: `DATABASE_URL`（Pooler URL・ポート6543・`?pgbouncer=true`パラメータ付き）と`DIRECT_URL`（Direct URL・ポート5432）の違いを説明し、Supabase Dashboardでの取得方法（Project Settings → Database → Connection string → Transaction mode / Direct connection）を明示することで、データベース接続エラーを防ぐ
4. **CORS設定の更新フローの明確化**: フロントエンドデプロイ完了後にバックエンドの`CORS_ORIGIN`環境変数を更新し、バックエンドを再デプロイする必要があることを明示する。この手順を忘れるとAPIリクエストがCORSエラーで失敗するため、重要な手順として強調する
5. **包括的なトラブルシューティングの提供**: バックエンド（"Module not found"・データベース接続エラー・"Function timeout"）とフロントエンド（APIリクエスト失敗・環境変数が反映されない・SPAルーティングが動作しない）の両方のトラブルシューティングを一箇所にまとめ、問題が発生したときに素早く解決できるようにする
6. **パフォーマンス最適化の具体的な提案**: Vercelの自動最適化に加えて、バックエンドのコールドスタート対策（不要な依存関係削除・初期化処理最小化・アプリケーションインスタンス再利用）・データベースクエリ最適化（インデックス設定・N+1問題回避）・レスポンスキャッシング（Vercel Edge Cache活用）という具体的な最適化手法を提案する
7. **セキュリティ対策の3層での明文化**: フロントエンド（環境変数に機密情報を含めない）・バックエンド（`SUPABASE_SERVICE_ROLE_KEY`は環境変数で管理・CORS設定を適切に制限・レート制限を有効化・Helmetでセキュリティヘッダーを設定）・データベース（Row Level Security（RLS）を有効化・最小権限の原則を適用）という3層でのセキュリティ対策を明示する
8. **コスト管理の提供**: Vercel無料プランの制限（帯域幅: 100GB/月・Serverless Functions実行時間: 100時間/月・ビルド時間: 6,000分/月）を明示し、使用量の確認方法（Vercel Dashboard → Settings → Usage）とコスト削減のヒント（画像最適化・不要なAPIリクエスト削減・キャッシング活用・Serverless Functions実行時間最適化）を提供する
9. **よくある質問の集約**: モノレポで1つのプロジェクトとしてデプロイできるか・Serverless Functionsは常に起動しているか・データベースマイグレーションはどうすればいいか・複数の環境を管理できるか・カスタムドメインを使用できるかという5つのよくある質問に対する回答を提供し、開発者の疑問を解消する

**いつ使われるか:**

- **本番環境デプロイ時**: 技術ブログアプリケーションを本番環境にデプロイする際に、バックエンドとフロントエンドの両方のVercelプロジェクト作成・設定・環境変数設定・CORS設定更新の手順を確認するとき（最優先で参照するドキュメント）
- **ステージング環境構築時**: プレビュー環境やステージング環境をVercelに構築する際に、環境変数の設定方法（Development / Preview / Production）を確認するとき
- **トラブルシューティング時**: Vercelデプロイ時にバックエンドのビルドエラー（"Module not found"）・データベース接続エラー・"Function timeout"エラー・フロントエンドのAPIリクエスト失敗（CORSエラー）・環境変数エラー・ルーティングエラーが発生したときに、原因と解決策を確認するとき
- **パフォーマンス改善時**: アプリケーションのパフォーマンスを改善する際に、バックエンドのコールドスタート対策・データベースクエリ最適化・レスポンスキャッシング・フロントエンドのコード分割・画像最適化を確認するとき
- **コスト管理時**: Vercel無料プランの使用量を確認し、制限を超えないようにコスト削減のヒント（画像最適化・不要なAPIリクエスト削減・キャッシング活用）を実施するとき
- **セキュリティ監査時**: フロントエンド・バックエンド・データベースの3層でのセキュリティ対策（環境変数管理・CORS設定・レート制限・Helmet・RLS・最小権限）を確認するとき
- **データベースマイグレーション実行時**: ローカルまたはCI/CDパイプラインでマイグレーションを実行する際に、Vercel Serverless Functionsでは実行しないという注意事項を確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、本番環境のデプロイ方法（フロントエンドとバックエンドの別々デプロイ戦略）を理解するとき

**関連ファイル:**

- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（このデプロイガイドの元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（フロントエンドアーキテクチャ・Vue 3 + Vite構成）
- `.kiro/specs/tech-blog/tasks.md` - 実装タスク一覧（Phase 10: Frontend — Views層でデプロイ対象のコンポーネント実装）
- `packages/frontend/package.json` - フロントエンドのビルドスクリプト（`pnpm build:frontend`の定義）
- `packages/frontend/vite.config.ts` - Viteビルド設定（出力ディレクトリ`dist`の定義）
- `packages/frontend/.env.example` - フロントエンド環境変数のテンプレート（Vercelで設定する環境変数の参考）
- `packages/frontend/src/router/index.ts` - Vue Routerの設定（SPAルーティング・`vercel.json`のリライトルールと関連）
- `.github/workflows/deploy.yml` - GitHub Actionsデプロイワークフロー（Vercelの自動デプロイと連携）
- `aidlc-docs/construction/ci-cd/code/summary.md` - CI/CDユニットの成果物一覧（GitHub Actionsワークフロー・デプロイ前に必要な作業）
- `aidlc-docs/construction/frontend/code/summary.md` - フロントエンドユニットの成果物一覧（Vercelにデプロイされるファイル）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - ビルド手順書（ローカルでのビルド確認・Vercelビルドの参考）
- `docs/QUICK_START.md` - クイックスタートガイド（ローカル環境セットアップ・Vercelデプロイ前の動作確認）
- `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ手順（Vercelの環境変数`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`の設定参考）
- `README.md` - プロジェクト全体の説明書（デプロイ手順へのリンクを含む可能性）

---

## 第9章: クイックスタートガイド

---

### `QUICK_START.md`

**何を定義しているか:**
技術ブログアプリケーションを5分でセットアップするための初心者向けクイックスタートガイドです。以下の内容が含まれます。

- **前提条件**: Node.js 20以上・pnpm・Supabase アカウント
- **Supabase プロジェクトの作成**:
  - プロジェクト作成手順（プロジェクト名・データベースパスワード・リージョン選択）
  - 認証情報の取得（Project URL・Anon Key・Service Role Key）
- **データベースのセットアップ**:
  - マイグレーション実行（`pnpm db:push`）
  - Supabase Storage バケット作成（`images` バケット・Public bucket ON）
  - RLS ポリシー設定（SQL Editor で実行）
- **環境変数の設定**:
  - バックエンド（`packages/backend/.env`）: `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `DATABASE_URL` / `PORT` / `HOST` / `CORS_ORIGIN` / `RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX`
  - フロントエンド（`packages/frontend/.env`）: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_API_BASE_URL`
  - `DATABASE_URL` の取得方法（Supabase Dashboard → Settings → Database → Connection string → URI）
- **テストユーザーの作成**:
  - スクリプト実行（`pnpm create-test-user`）
  - テストユーザー情報（Email: `test@example.com` / Password: `test1234`）
- **アプリケーションの起動**:
  - バックエンド起動（`pnpm dev`）
  - フロントエンド起動（`pnpm dev`）
  - ログイン手順（「テストユーザーで入力」ボタン → 「ログイン」ボタン）
- **動作確認**:
  - 記事の作成（タイトル・本文・タグ入力 → 「公開」ボタン）
  - 画像のアップロード（方法1: ドラッグ&ドロップ / 方法2: カバー画像）
- **トラブルシューティング**:
  - ログインできない（Invalid login credentials）: テストユーザー作成手順
  - 画像アップロードで 401 エラー: 認証トークン保存確認手順
  - データベース接続エラー: `DATABASE_URL` 修正手順
  - Supabase Storage エラー: `images` バケット作成・RLS ポリシー設定手順
- **詳細ドキュメントへのリンク**:
  - `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ
  - `docs/IMAGE_UPLOAD_SETUP.md` - 画像アップロード機能のセットアップ
  - `docs/TECH_BLOG_API.md` - 技術ブログAPI仕様
- **次のステップ**: 記事作成・画像アップロード・タグ検索・Notion風エディタ体験
- **ヒント**: フルスクリーンモード・プレビュー表示・キーボードショートカット（Ctrl/Cmd + B: 太字 / Ctrl/Cmd + I: 斜体 / Ctrl/Cmd + K: リンク / Ctrl/Cmd + E: コード / ESC: フルスクリーン解除）
- **サポート**: 問題が解決しない場合の5つの確認項目（Node.js バージョン・pnpm インストール・Supabase プロジェクト有効性・環境変数設定・ポート使用可能性）

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の実装が完了した後、以下の目的で作成されました:

1. **初心者向けの最短セットアップ手順**: 新しい開発者がプロジェクトに参加し、「5分で動かす」ことを目標とした最短手順を提供する。詳細な説明は省略し、必要最小限のコマンドと設定のみを記載することで、迷わずセットアップできるようにする
2. **Supabase プロジェクト作成の手順書**: Supabase Dashboard でのプロジェクト作成・認証情報取得・バケット作成・RLS ポリシー設定の手順を画面遷移に沿って説明し、初めて Supabase を使う開発者でも迷わず設定できるようにする
3. **環境変数の完全な設定例**: バックエンド・フロントエンドの `.env` ファイルに必要な全環境変数を一覧化し、コピー&ペーストで設定できるようにする。特に `DATABASE_URL` の取得方法を明示することで、接続エラーを防ぐ
4. **テストユーザー作成の自動化**: `pnpm create-test-user` スクリプトの使い方を説明し、手動でのユーザー作成を不要にする。テストユーザー情報（Email / Password）を明示することで、ログイン時に迷わない
5. **トラブルシューティングの集約**: よくあるエラー（ログインできない・画像アップロードで 401 エラー・データベース接続エラー・Supabase Storage エラー）の原因と解決策を一箇所にまとめ、問題が発生したときに素早く解決できるようにする
6. **詳細ドキュメントへの誘導**: クイックスタートで基本的なセットアップを完了した後、より詳細な情報が必要な場合に `docs/AUTHENTICATION_SETUP.md` / `docs/IMAGE_UPLOAD_SETUP.md` / `docs/TECH_BLOG_API.md` へ誘導する
7. **エンドユーザー向けヒント**: 記事作成・編集画面でのキーボードショートカット（太字・斜体・リンク・コード・フルスクリーン解除）を提供し、Notion風エディタの使い方を素早く理解できるようにする

**いつ使われるか:**

- **初回セットアップ時**: 新しい開発者がプロジェクトに参加し、ローカル環境で技術ブログアプリケーションを動かすとき（最優先で参照するドキュメント）
- **デモ環境構築時**: プロジェクトのデモを素早く準備する必要があるとき（5分でセットアップ完了）
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が「まず動かしてみる」ための最初のステップとして参照する
- **トラブルシューティング時**: セットアップ中に問題が発生し、よくあるエラーの解決策を確認するとき
- **本番環境構築時**: 本番環境でのセットアップ手順を確認するとき（環境変数の設定例・RLS ポリシー設定を参照）
- **ユーザーサポート時**: エンドユーザーから「アプリケーションの使い方が分からない」という問い合わせがあったときに、キーボードショートカットやヒントを案内する

**関連ファイル:**

- `README.md` - プロジェクト全体の説明書（クイックスタートへのリンクを含む）
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（このクイックスタートガイドの元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（アーキテクチャ・データモデル・セキュリティ設計）
- `.kiro/specs/tech-blog/tasks.md` - 実装タスク一覧（Phase 1〜16の全タスク）
- `docs/AUTHENTICATION_SETUP.md` - 認証機能の詳細セットアップ手順（クイックスタートから誘導）
- `docs/IMAGE_UPLOAD_SETUP.md` - 画像アップロード機能の詳細セットアップ手順（クイックスタートから誘導）
- `docs/TECH_BLOG_API.md` - 技術ブログAPI仕様（クイックスタートから誘導）
- `docs/CREATE_USER_MANUALLY.md` - Supabase Dashboard でのユーザー手動作成手順（スクリプトが動作しない場合の代替手順）
- `packages/backend/scripts/create-test-user.ts` - テストユーザー作成スクリプト（クイックスタートで使用）
- `packages/backend/.env.example` - バックエンド環境変数のテンプレート（クイックスタートで参照）
- `packages/frontend/.env.example` - フロントエンド環境変数のテンプレート（クイックスタートで参照）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - 全パッケージのビルド手順書（より詳細なセットアップ手順）

---

### `docs/CREATE_USER_MANUALLY.md`

**何を定義しているか:**
`packages/backend/scripts/create-test-user.ts` スクリプトがうまく動作しない場合の代替手段として、Supabase Dashboard から直接ユーザーを手動作成する手順を定義したトラブルシューティングドキュメントです。以下の内容が含まれます。

- **手動作成の手順**:
  - Supabase Dashboard へのアクセス（https://supabase.com/dashboard）
  - プロジェクト選択
  - Authentication → Users セクションへの移動
  - ユーザー作成（Email: `test@example.com` / Password: `test1234` / Auto Confirm User: ✅ チェック必須）
  - ユーザー作成の確認（Users リストに表示されることを確認）
  - ログインテスト（http://localhost:5173 でログイン）
- **確認事項**:
  - ユーザーのステータス確認（Email Confirmed: ✅ Yes が重要）
  - Email Confirmed が No の場合の対処法（「Confirm email」ボタンをクリック）
- **それでもログインできない場合の対処法**:
  - パスワードリセット（「Reset password」ボタン → 新しいパスワード設定）
  - ユーザー削除と再作成（「Delete user」ボタン → 再度作成）
  - 別のメールアドレスで試す（`testuser@example.com` など）
- **よくある問題**:
  - 問題1: "Email not confirmed" → 原因: メール確認が完了していない → 解決策: 「Auto Confirm User」にチェック or 「Confirm email」ボタンをクリック
  - 問題2: "Invalid login credentials" → 原因: パスワードが間違っている / ユーザーが存在しない / メール確認が完了していない → 解決策: ユーザー存在確認・Email Confirmed 確認・パスワードリセット
  - 問題3: "User already registered" → 原因: 同じメールアドレスのユーザーが既に存在する → 解決策: 既存ユーザー削除 or パスワードリセット
- **セキュリティ設定の確認**:
  - Email Auth が有効か確認（Authentication → Providers → Email が Enabled）
  - Confirm email が無効か確認（Authentication → Settings → Enable email confirmations が無効・開発環境では無効推奨）
- **サポート**:
  - Supabase プロジェクトのステータス確認（https://status.supabase.com/）
  - ブラウザのコンソールエラー確認（開発者ツール → Console）
  - ネットワークタブのエラー確認（開発者ツール → Network）
- **次のステップ**: ユーザー作成完了後の動作確認（ログイン → 記事作成 → 画像アップロード → Notion風エディタ体験）

**なぜ存在するか:**
技術ブログ機能の実装が完了し、`packages/backend/scripts/create-test-user.ts` スクリプトが提供された後、以下の目的で作成されました:

1. **スクリプト実行失敗時の代替手段**: `pnpm create-test-user` スクリプトが環境変数の設定ミス・Supabase 接続エラー・権限エラーなどで動作しない場合に、Supabase Dashboard から直接ユーザーを作成する手順を提供する
2. **初心者向けの GUI 操作手順**: CLI スクリプトに不慣れな開発者でも、Supabase Dashboard の GUI 操作でユーザーを作成できるようにする。画面遷移に沿った手順を提供することで、迷わず操作できる
3. **よくあるエラーのトラブルシューティング**: "Email not confirmed" / "Invalid login credentials" / "User already registered" という3つの典型的なエラーについて、原因と解決策を明示する。特に「Auto Confirm User にチェックを入れる」という重要な設定を強調することで、メール確認エラーを防ぐ
4. **セキュリティ設定の確認手順**: Email Auth が有効か・Confirm email が無効か（開発環境では無効推奨）を確認する手順を提供し、認証設定の問題を素早く特定できるようにする
5. **サポート情報の集約**: Supabase プロジェクトのステータス確認・ブラウザのコンソールエラー確認・ネットワークタブのエラー確認という3つのデバッグ手順を提供し、問題が解決しない場合の次のアクションを明確にする
6. **AUTHENTICATION_SETUP.md の補完**: `docs/AUTHENTICATION_SETUP.md` では `pnpm create-test-user` スクリプトの使い方を説明しているが、このドキュメントはスクリプトが動作しない場合の代替手段として機能する。両ドキュメントを組み合わせることで、あらゆる状況でユーザー作成が可能になる

**いつ使われるか:**

- **スクリプト実行失敗時**: `pnpm create-test-user` スクリプトが環境変数エラー・Supabase 接続エラー・権限エラーで動作しないとき（最優先で参照するドキュメント）
- **初回セットアップ時**: CLI スクリプトに不慣れな開発者が、GUI 操作でユーザーを作成したいとき
- **トラブルシューティング時**: ログインできない・"Email not confirmed" エラーが出る・"Invalid login credentials" エラーが出るなどの問題が発生したとき
- **本番環境構築時**: 本番環境で管理者ユーザーを手動作成する必要があるとき（スクリプトではなく Dashboard から作成する方が安全な場合）
- **ユーザーサポート時**: エンドユーザーから「ログインできない」という問い合わせがあったときに、サポートチームが Supabase Dashboard でユーザーのステータス（Email Confirmed）を確認する
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、スクリプトではなく GUI 操作でユーザーを作成したいとき

**関連ファイル:**

- `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ手順（`pnpm create-test-user` スクリプトの使い方を説明・このドキュメントはその代替手段）
- `docs/QUICK_START.md` - クイックスタートガイド（テストユーザー作成手順を含む・スクリプトが動作しない場合はこのドキュメントへ誘導）
- `packages/backend/scripts/create-test-user.ts` - テストユーザー作成スクリプト（このドキュメントはスクリプトが動作しない場合の代替手段）
- `packages/backend/.env.example` - バックエンド環境変数のテンプレート（スクリプト実行に必要な環境変数を定義）
- `packages/frontend/src/views/auth/LoginView.vue` - ログイン画面（ユーザー作成後にログインテストを行う画面）
- `packages/frontend/src/stores/useAuthStore.ts` - 認証状態管理（ログイン処理の実装）
- `packages/frontend/src/composables/useAuth.ts` - 認証ビジネスロジック（ログイン・ログアウト・セッション復元）
- `.kiro/specs/tech-blog/requirements.md` - 要件16「セキュリティとアクセス制御」の定義（認証・認可の要件）
- `.kiro/specs/tech-blog/design.md` - 認証機能の設計（Supabase Auth・JWT 検証・セッション管理）

---

### `docs/VERCEL_ENV_VARS.md`

**何を定義しているか:**
技術ブログアプリケーションをVercelにデプロイする際に設定する環境変数の完全なリストと設定手順を定義したクイックリファレンスガイドです。以下の内容が含まれます。

- **バックエンド環境変数**（9個）:
  - `NODE_ENV=production`
  - Supabase接続情報（`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`）
  - データベース接続（`DATABASE_URL`（Pooler URL・ポート6543・`?pgbouncer=true`） / `DIRECT_URL`（Direct URL・ポート5432））
  - CORS設定（`CORS_ORIGIN`：フロントエンドURL + プレビュー環境のワイルドカード）
  - レート制限（`RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX`）
- **フロントエンド環境変数**（3個）:
  - バックエンドAPI（`VITE_API_BASE_URL`：バックエンドURL）
  - Supabase接続情報（`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`）
- **設定手順**:
  - Vercel Dashboard → Settings → Environment Variables → 1つずつ追加
  - 適用環境の選択（Production / Preview / Development）
- **チェックリスト**:
  - バックエンド設定確認（7項目：`NODE_ENV` / Supabase接続情報 / `DATABASE_URL`にPooler URL / `DIRECT_URL`にDirect URL / `?pgbouncer=true`パラメータ / `CORS_ORIGIN`にフロントエンドURL / レート制限）
  - フロントエンド設定確認（3項目：`VITE_API_BASE_URL`がバックエンドURL / Supabase接続情報 / `VITE_`プレフィックス）
- **環境変数の更新方法**:
  - Vercel Dashboardで更新（Settings → Environment Variables → Edit → Save）
  - 再デプロイ（Deployments → "..." → "Redeploy" または 新しいコミットをプッシュ）
- **トラブルシューティング**:
  - バックエンド: データベース接続エラー（`DATABASE_URL`と`DIRECT_URL`を確認・パスワードのURLエンコード）
  - バックエンド: CORSエラー（`CORS_ORIGIN`にフロントエンドURLが含まれているか確認・バックエンドを再デプロイ）
  - フロントエンド: APIリクエストが失敗（`VITE_API_BASE_URL`が正しいか確認・バックエンドがデプロイされているか確認）
  - フロントエンド: 環境変数が反映されない（`VITE_`プレフィックス確認・再デプロイ・ブラウザキャッシュクリア）
- **セキュリティ注意事項**:
  - 公開してはいけない情報（`SUPABASE_SERVICE_ROLE_KEY` / データベースパスワード / シークレットキー）
  - 公開しても安全な情報（`SUPABASE_URL` / `SUPABASE_ANON_KEY`（RLSで保護） / `VITE_API_BASE_URL`）
  - ベストプラクティス（環境変数の分離・最小権限の原則・定期的なローテーション・監査ログ）
- **ヒント**:
  - ローカル開発との切り替え（`.env`ファイルでの設定例）
  - プレビュー環境の活用（プルリクエストごとにプレビューURL作成・環境変数の別途設定可能）
- **完了確認**（6項目）:
  - バックエンドが正常にデプロイされている
  - フロントエンドが正常にデプロイされている
  - フロントエンドからバックエンドAPIにアクセスできる
  - ログインが正常に動作する
  - 記事の作成・編集・削除が正常に動作する
  - 画像のアップロードが正常に動作する

**なぜ存在するか:**
技術ブログ機能（`.kiro/specs/tech-blog/`）の実装が完了し、Vercelへのデプロイ手順（`docs/VERCEL_DEPLOYMENT.md`）が作成された後、以下の目的で作成されました:

1. **環境変数の一覧化**: `docs/VERCEL_DEPLOYMENT.md`では環境変数の設定が手順の一部として説明されているが、このドキュメントでは環境変数のみに特化した完全なリストを提供する。バックエンド9個・フロントエンド3個の環境変数を一箇所にまとめることで、設定漏れを防ぐ
2. **コピー&ペースト可能な形式**: 各環境変数を`bash`コードブロックで提供することで、Vercel Dashboardに直接コピー&ペーストできるようにする。特に長い値（JWT・データベース接続文字列）を手入力するとミスが発生しやすいため、コピー&ペーストで正確に設定できることが重要
3. **チェックリストによる設定確認**: バックエンド7項目・フロントエンド3項目のチェックリストを提供することで、設定完了後に「何を確認すべきか」を明確にする。特に`DATABASE_URL`にPooler URL（ポート6543）を使用・`DIRECT_URL`にDirect URL（ポート5432）を使用・`?pgbouncer=true`パラメータの確認は重要な設定ポイント
4. **トラブルシューティングの集約**: 環境変数に関連する4つの典型的なエラー（データベース接続エラー・CORSエラー・APIリクエスト失敗・環境変数が反映されない）について、原因と解決策を明示する。特にCORSエラーは環境変数設定後の再デプロイを忘れると発生するため、再デプロイの必要性を強調する
5. **セキュリティ対策の明文化**: 公開してはいけない情報（`SUPABASE_SERVICE_ROLE_KEY`）と公開しても安全な情報（`SUPABASE_ANON_KEY`はRLSで保護）を明確に区別し、開発者が誤って機密情報をフロントエンドの環境変数に設定しないようにする。特にViteは`VITE_`プレフィックスの環境変数をビルド時にバンドルするため、機密情報を含めてはいけないことを強調する
6. **ローカル開発との切り替え**: ローカル開発時の`.env`ファイル設定例（`CORS_ORIGIN=http://localhost:5173` / `VITE_API_BASE_URL=http://localhost:3000`）を提供することで、開発者がローカル環境とVercel環境を素早く切り替えられるようにする
7. **プレビュー環境の活用**: プルリクエストごとにプレビュー環境が作成されること・プレビュー環境用の環境変数を別途設定できることを説明し、開発者がプレビュー環境を効果的に活用できるようにする
8. **完了確認の提供**: 環境変数設定完了後に「何を確認すべきか」を6項目のチェックリストで明示する。特にログイン・記事の作成・編集・削除・画像のアップロードという主要機能の動作確認を促すことで、デプロイ後の動作確認漏れを防ぐ
9. **VERCEL_DEPLOYMENT.mdの補完**: `docs/VERCEL_DEPLOYMENT.md`は包括的なデプロイガイドだが、このドキュメントは環境変数のみに特化したクイックリファレンスとして機能する。両ドキュメントを組み合わせることで、初回デプロイ時は`VERCEL_DEPLOYMENT.md`を参照し、環境変数の更新時は`VERCEL_ENV_VARS.md`を参照するという使い分けが可能になる

**いつ使われるか:**

- **初回デプロイ時**: Vercelへの初回デプロイ時に、バックエンド・フロントエンドの環境変数を設定するとき（`VERCEL_DEPLOYMENT.md`と併用）
- **環境変数の更新時**: 既存のVercelプロジェクトで環境変数を更新する必要があるとき（例: データベース接続文字列の変更・CORS設定の追加・レート制限の調整）
- **トラブルシューティング時**: デプロイ後にデータベース接続エラー・CORSエラー・APIリクエスト失敗・環境変数が反映されないなどの問題が発生したとき
- **チェックリスト確認時**: 環境変数設定完了後に「設定漏れがないか」をチェックリストで確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、Vercelの環境変数設定を理解するとき
- **ローカル開発との切り替え時**: ローカル開発環境とVercel環境を切り替える際に、`.env`ファイルの設定例を参照するとき
- **プレビュー環境構築時**: プルリクエストのプレビュー環境で異なる環境変数を設定する必要があるとき
- **セキュリティ監査時**: 環境変数に機密情報が誤って含まれていないか（特にフロントエンドの`VITE_`プレフィックス変数）を確認するとき
- **完了確認時**: デプロイ完了後に主要機能（ログイン・記事作成・画像アップロード）が正常に動作するかを確認するとき

**関連ファイル:**

- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの包括的なガイド（このドキュメントは環境変数のみに特化したクイックリファレンス）
- `docs/VERCEL_QUICK_START.md` - Vercelデプロイのクイックスタートガイド（最短手順・環境変数設定を含む）
- `packages/backend/.env.example` - バックエンド環境変数のテンプレート（ローカル開発用・Vercel設定の参考）
- `packages/frontend/.env.example` - フロントエンド環境変数のテンプレート（ローカル開発用・Vercel設定の参考）
- `packages/backend/.env` - バックエンド環境変数の実際の設定（ローカル開発用・Vercelとは異なる値を使用）
- `packages/frontend/.env` - フロントエンド環境変数の実際の設定（ローカル開発用・Vercelとは異なる値を使用）
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（環境変数設定の元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（Supabase接続・CORS設定・レート制限の設計）
- `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ手順（Supabase接続情報の取得方法を含む）
- `docs/QUICK_START.md` - クイックスタートガイド（ローカル環境での環境変数設定を含む）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - ビルド手順書（環境変数設定の参考）
- `README.md` - プロジェクト全体の説明書（環境変数設定へのリンクを含む可能性）

---

### `VERCEL_500_ERROR_FIX.md`

**何を定義しているか:**
Vercelデプロイ時に発生する500 Internal Server Error（特に`/api/health`エンドポイントへのアクセス時）の根本原因・実施した修正・デプロイ手順・トラブルシューティングを定義した問題解決ガイドです。以下の内容が含まれます。

- **問題の診断**:
  - アクセスURL: `https://kiro-project-backend-nine.vercel.app/api/health`
  - エラー: `GET https://kiro-project-backend-nine.vercel.app/api/health 500 (Internal Server Error)`
- **根本原因**（3つ）:
  - ビルドプロセスの問題: `builds`設定を使用すると、カスタム`buildCommand`が無視される
  - 間接的なインポート: `api/index.js`が`dist/api/index.js`を経由していたため、ビルドが複雑化
  - TypeScriptのビルド不足: Vercelデプロイ時にTypeScriptファイルが正しくビルドされていない
- **実施した修正**:
  - 直接TypeScriptエントリーポイントを使用: `api/index.js` → `dist/api/index.js`（変更前）から `api/index.ts` → 直接バックエンドコードをインポート（変更後）。`@vercel/node`は自動的にTypeScriptをビルドするため、中間ビルドステップが不要
  - 新しいファイル構成: `api/index.ts`（TypeScriptエントリーポイント・新規作成）/ `tsconfig.json`（TypeScript設定・新規作成）/ `vercel.json`（`api/index.ts`を参照するように更新）/ `package.json`（`@vercel/node`依存関係を追加）/ `api/index.js`（削除・不要）
- **デプロイ手順**（5ステップ）:
  - ステップ1: 依存関係のインストール（`pnpm install`）
  - ステップ2: 変更をコミット＆プッシュ（`git add .` → `git commit -m "fix: Use TypeScript entry point for Vercel deployment"` → `git push origin main`）
  - ステップ3: Vercelで自動デプロイ（GitHubにプッシュすると、Vercelが自動的に再デプロイを開始）
  - ステップ4: 環境変数の確認（Vercel Dashboardで必須環境変数が設定されているか確認: `NODE_ENV=production` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `DATABASE_URL`（Pooler URL with `?pgbouncer=true`）/ `DIRECT_URL`（Direct connection URL）/ `CORS_ORIGIN` / `RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX`）
  - ステップ5: デプロイの確認（`curl https://kiro-project-backend-nine.vercel.app/api/health` → 期待される応答: `{"status":"ok"}`）
- **新しいビルドプロセスの流れ**（4ステップ）:
  - ステップ1: Vercelが`api/index.ts`を検出 → `@vercel/node`が自動的にTypeScriptをビルド
  - ステップ2: `packages/backend/src/app.js`をインポート → Fastifyアプリケーションを初期化
  - ステップ3: Prisma Clientの生成 → ルートの`build`スクリプトで実行（`pnpm --filter @monorepo/backend db:generate`）
  - ステップ4: Serverless Functionとして実行 → リクエストごとにFastifyアプリを再利用
- **ローカルでの動作確認**:
  - Vercel CLIをインストール（`npm i -g vercel`）
  - ローカルでVercel環境を起動（`vercel dev`）
  - ブラウザで確認（`http://localhost:3000/api/health`）
- **トラブルシューティング**（4つの問題と解決策）:
  - ビルドが失敗する場合: "Module not found"エラー → 確認事項（`pnpm-workspace.yaml`が正しく設定されているか / `packages/backend/src/app.ts`が存在するか / TypeScriptの型エラーがないか）→ 解決策（ローカルでTypeScriptの型チェック: `cd packages/backend` → `pnpm tsc --noEmit`）
  - Prisma Clientエラー: `@prisma/client`が見つからない → 確認事項（ルートの`build`スクリプトに`db:generate`が含まれているか / Vercel環境変数に`DATABASE_URL`と`DIRECT_URL`が設定されているか）→ 解決策（Vercel Dashboardの Settings → General → Build & Development Settings → Build Command: `pnpm build` / Output Directory: 空欄）
  - データベース接続エラー: `P1001: Can't reach database server` → 確認事項（`DATABASE_URL`が正しく設定されているか / `DIRECT_URL`が設定されているか / Supabaseのデータベースが起動しているか）→ 解決策（Vercel Dashboardで環境変数を再確認 / Supabase Dashboardで接続文字列を確認）
  - CORSエラー: フロントエンドから`Access-Control-Allow-Origin`エラー → 解決策（Vercel環境変数に設定: `CORS_ORIGIN=https://kiro-project-frontend.vercel.app,https://kiro-project-frontend-*.vercel.app`）
- **チェックリスト**:
  - デプロイ前の確認（6項目: `api/index.ts`が作成されている / `vercel.json`が`api/index.ts`を参照している / ルートに`tsconfig.json`が存在する / ルート`package.json`に`@vercel/node`依存関係がある / `pnpm install`を実行済み / すべての環境変数がVercelに設定されている）
  - デプロイ後の確認（4項目: Vercelのビルドログでエラーがない / `/api/health`エンドポイントが200を返す / フロントエンドからAPIにアクセスできる / 認証が正常に動作する）
- **重要な変更点まとめ**（表形式）:
  - エントリーポイント: `api/index.js` → `api/index.ts`
  - ビルド方法: 手動ビルド → dist → `@vercel/node`自動ビルド
  - インポート: `dist/api/index.js` → `src/app.js`直接
  - 設定ファイル: なし → `tsconfig.json`追加

**なぜ存在するか:**
技術ブログアプリケーションのバックエンドをVercelにデプロイした際に、`/api/health`エンドポイントへのアクセス時に500 Internal Server Errorが発生しました。以下の目的で作成されました:

1. **根本原因の記録**: 500エラーの根本原因（`builds`設定によるカスタム`buildCommand`の無視・間接的なインポート・TypeScriptのビルド不足）を明文化し、同じ問題が再発した際に素早く原因を特定できるようにする
2. **修正内容の文書化**: 実施した修正（`api/index.js` → `api/index.ts`への変更・`@vercel/node`による自動TypeScriptビルド・中間ビルドステップの削除）を詳細に記録し、なぜこの修正が有効だったかを説明する
3. **デプロイ手順の提供**: 修正後のデプロイ手順（依存関係のインストール・コミット＆プッシュ・Vercelで自動デプロイ・環境変数の確認・デプロイの確認）を5ステップで明示し、開発者が迷わずデプロイできるようにする
4. **新しいビルドプロセスの説明**: `@vercel/node`による自動TypeScriptビルド → Fastifyアプリケーションの初期化 → Prisma Clientの生成 → Serverless Functionとして実行という新しいビルドプロセスの流れを図解し、開発者がビルドプロセスを理解できるようにする
5. **ローカルでの動作確認方法の提供**: Vercel CLIを使ってローカルでVercel環境をシミュレートする方法（`vercel dev`）を提供し、デプロイ前にローカルで動作確認できるようにする
6. **包括的なトラブルシューティングの提供**: ビルドが失敗する場合・Prisma Clientエラー・データベース接続エラー・CORSエラーという4つの典型的な問題について、確認事項と解決策を明示する
7. **チェックリストによる確認**: デプロイ前の確認（6項目）とデプロイ後の確認（4項目）のチェックリストを提供し、設定漏れや動作確認漏れを防ぐ
8. **変更点の一覧化**: エントリーポイント・ビルド方法・インポート・設定ファイルという4つの観点で変更前と変更後を表形式で比較し、何が変わったかを一目で把握できるようにする

**いつ使われるか:**

- **500エラー発生時**: Vercelデプロイ後に`/api/health`エンドポイントへのアクセス時に500 Internal Server Errorが発生したとき（最優先で参照するドキュメント）
- **ビルドエラー発生時**: Vercelのビルドログで"Module not found"エラー・Prisma Clientエラー・TypeScriptビルドエラーが発生したとき
- **デプロイ手順確認時**: 修正後のデプロイ手順（依存関係のインストール・コミット＆プッシュ・環境変数の確認）を確認するとき
- **ローカルテスト時**: Vercel CLIを使ってローカルでVercel環境をシミュレートし、デプロイ前に動作確認するとき
- **トラブルシューティング時**: データベース接続エラー・CORSエラーが発生し、原因と解決策を確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、Vercelデプロイ時の500エラーの修正履歴を理解するとき
- **同様の問題が再発した際**: 将来的に同じ500エラーが発生した場合に、過去の修正内容を参照して素早く解決するとき
- **ビルドプロセスの理解**: `@vercel/node`による自動TypeScriptビルドの仕組みを理解するとき

**関連ファイル:**

- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの包括的なガイド（このドキュメントは500エラーの修正に特化）
- `docs/VERCEL_TROUBLESHOOTING.md` - Vercel環境変数のトラブルシューティング（このドキュメントは500エラーのトラブルシューティング）
- `docs/VERCEL_ENV_VARS.md` - Vercel環境変数の完全なリスト（環境変数の確認に使用）
- `api/index.ts` - TypeScriptエントリーポイント（この修正で新規作成されたファイル）
- `tsconfig.json` - TypeScript設定（この修正で新規作成されたファイル）
- `vercel.json` - Vercel設定（`api/index.ts`を参照するように更新）
- `package.json` - ルートのpackage.json（`@vercel/node`依存関係を追加）
- `packages/backend/src/app.ts` - Fastifyアプリケーション（`api/index.ts`から直接インポート）
- `packages/backend/prisma/schema.prisma` - Prismaスキーマ（Prisma Clientの生成元）
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（デプロイ要件を含む）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（バックエンドアーキテクチャ・Fastify構成）
- `aidlc-docs/construction/backend/code/summary.md` - バックエンドユニットの成果物一覧（Vercelにデプロイされるファイル）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - ビルド手順書（ローカルでのビルド確認・Vercelビルドの参考）
- `README.md` - プロジェクト全体の説明書（Vercel対応を明示・デプロイ手順へのリンクを含む）

---

### `docs/VERCEL_TROUBLESHOOTING.md`

**何を定義しているか:**
Vercel環境で環境変数が正しく読み込まれない問題（特に`supabaseUrl is required`エラー）のトラブルシューティング手順を定義した問題解決ガイドです。以下の内容が含まれます。

- **問題の症状**:
  - `Uncaught Error: supabaseUrl is required.` エラー
  - フロントエンドで環境変数が正しく読み込まれていない状態
- **解決手順**（4ステップ）:
  - ステップ1: Vercel Dashboardで環境変数を確認（Settings → Environment Variables → `VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`の存在確認）
  - ステップ2: 環境変数が設定されていない場合の追加方法（Name / Value / Environmentsの入力・Production / Preview / Developmentすべてにチェック）
  - ステップ3: 環境変数が設定されている場合の再デプロイ方法（オプション1: Vercel Dashboardから "Redeploy" / オプション2: GitHubから空コミットをプッシュ）
  - ステップ4: デプロイログの確認（Deployments → Building セクション → `✓ 471 modules transformed.` の確認）
- **デバッグ方法**:
  - ブラウザのコンソールで確認（開発者ツール → Console → 環境変数チェックログの確認）
  - 正常な場合: `🔍 Supabase環境変数チェック: { url: "✅ 設定済み", key: "✅ 設定済み", urlValue: "https://...", keyPreview: "eyJ..." }`
  - 異常な場合: `🔍 Supabase環境変数チェック: { url: "❌ 未設定", key: "❌ 未設定", urlValue: undefined, keyPreview: "なし" }`
- **よくある原因と解決策**（5つ）:
  - 原因1: 環境変数名が間違っている（`VITE_`プレフィックスがない・スペルミス・大文字小文字が違う）
  - 原因2: 環境が選択されていない（Production / Preview / Developmentのチェック漏れ）
  - 原因3: 再デプロイしていない（環境変数はビルド時に埋め込まれるため、既存のデプロイには反映されない）
  - 原因4: ビルドキャッシュの問題（"Use existing Build Cache"のチェックを外して再デプロイ）
  - **原因5: Viteが環境変数を認識しない（モノレポ特有の問題）** — **2026-04-22追加**
    - **症状**: Vercel Dashboardで環境変数が正しく設定されている・再デプロイも実行した・ブラウザのコンソールで環境変数が`undefined`または`${VITE_SUPABASE_URL}`のような文字列になっている
    - **原因**: モノレポ構成の場合、Vercelの環境変数がViteのビルドプロセスに正しく渡されないことがある
    - **解決策**: `vercel.json`のビルドコマンドで環境変数を明示的にエクスポートする
      - **修正前**: `{ "buildCommand": "pnpm build:frontend" }`
      - **修正後**: `{ "buildCommand": "export VITE_API_BASE_URL=\"$VITE_API_BASE_URL\" && export VITE_SUPABASE_URL=\"$VITE_SUPABASE_URL\" && export VITE_SUPABASE_ANON_KEY=\"$VITE_SUPABASE_ANON_KEY\" && pnpm build:frontend" }`
    - **効果**: Vercelの環境変数がシェル環境変数として明示的にエクスポートされ、Viteが確実に読み込めるようになる
    - **注意**: `.env.production`ファイルで`${VAR}`構文を使った変数置換は**機能しない**（Vercelは`.env`ファイル内の変数置換をサポートしていない）
- **チェックリスト**（7項目）:
  - Vercel Dashboardで環境変数が設定されている
  - 環境変数名が`VITE_`で始まっている
  - すべての環境（Production / Preview / Development）が選択されている
  - 環境変数の値が正しい（コピペミスがない）
  - 再デプロイを実行した
  - デプロイが成功している（緑色のチェックマーク）
  - ブラウザのコンソールでデバッグログを確認した

**なぜ存在するか:**
技術ブログ機能のVercelデプロイ後、フロントエンドで環境変数が正しく読み込まれない問題（特に`supabaseUrl is required`エラー）が発生したため、以下の目的で作成されました:

1. **環境変数エラーの特定と解決**: Vercel環境で環境変数が正しく読み込まれない問題の原因を5つのパターンに分類し、それぞれの解決策を提供する
2. **デバッグ方法の提供**: ブラウザのコンソールで環境変数の状態を確認する方法を提供し、問題が環境変数の設定ミスかビルドプロセスの問題かを素早く特定できるようにする
3. **モノレポ特有の問題への対応**: モノレポ構成でVercelの環境変数がViteのビルドプロセスに正しく渡されない問題（原因5）を明示し、`vercel.json`のビルドコマンドで環境変数を明示的にエクスポートする解決策を提供する（2026-04-22追加）
4. **チェックリストによる確認**: 環境変数設定の7項目チェックリストを提供し、設定漏れを防ぐ

**いつ使われるか:**

- **Vercelデプロイ後のトラブルシューティング時**: フロントエンドで`supabaseUrl is required`エラーが発生したとき
- **環境変数設定確認時**: Vercel Dashboardで環境変数を設定した後、正しく反映されているかを確認するとき
- **モノレポ構成のデプロイ時**: モノレポ構成でViteの環境変数が正しく読み込まれない問題が発生したとき（原因5の確認）
- **デバッグ時**: ブラウザのコンソールで環境変数の状態を確認し、問題の原因を特定するとき

**関連ファイル:**

- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの包括的なガイド
- `docs/VERCEL_ENV_VARS.md` - 環境変数の設定ガイド
- `docs/VERCEL_500_ERROR_FIX.md` - バックエンドの500エラー修正ガイド（2026-04-22追加）
- `packages/frontend/.env.example` - フロントエンド環境変数のテンプレート
- `vercel.json` - Vercelビルド設定（ビルドコマンドで環境変数をエクスポート）

---

### `VERCEL_500_ERROR_FIX.md`

**何を定義しているか:**
Vercelにデプロイしたバックエンドで500エラー（Internal Server Error）が発生する問題の診断・根本原因・修正手順・トラブルシューティングを定義した問題解決ガイドです。以下の内容が含まれます。

- **問題の診断**:
  - アクセスURL: `https://kiro-project-backend-nine.vercel.app/api/health`
  - エラー: `GET https://kiro-project-backend-nine.vercel.app/api/health 500 (Internal Server Error)`
- **根本原因**（3つ）:
  - ビルドコマンドの欠如: `vercel.json`にビルドコマンドが設定されていなかった
  - ビルド成果物の不在: `packages/backend/dist/api/index.js`が生成されていない
  - インポートエラー: `api/index.js`が存在しないファイルをインポートしようとしている
- **実施した修正**（2つ）:
  - **修正1: vercel.json の更新** — ビルドコマンドを追加
    - `pnpm install`: 依存関係のインストール
    - `pnpm --filter @monorepo/backend db:generate`: Prismaクライアントの生成
    - `pnpm --filter @monorepo/backend build:api`: APIのビルド（`dist/api/index.js`を生成）
  - **修正2: .vercelignore の更新** — `dist`フォルダを除外リストから削除（ビルド成果物をVercelにアップロードする必要があるため）
- **デプロイ手順**（4ステップ）:
  - ステップ1: 変更をコミット＆プッシュ（`git add vercel.json packages/backend/.vercelignore` → `git commit` → `git push origin main`）
  - ステップ2: Vercelで自動デプロイ（GitHubにプッシュすると自動的に再デプロイ開始）
  - ステップ3: 環境変数の確認（9個の必須環境変数: `NODE_ENV` / Supabase接続情報 / データベース接続 / CORS設定 / レート制限）
  - ステップ4: デプロイの確認（`curl https://kiro-project-backend-nine.vercel.app/api/health` → `{"status":"ok"}`）
- **ローカルでのビルド確認**:
  - `cd packages/backend` → `pnpm db:generate` → `pnpm build:api` → `ls -la dist/api/`（`index.js`が存在することを確認）
- **ビルドプロセスの流れ**（4ステップ）:
  - ステップ1: `pnpm install` → `node_modules/`にパッケージをインストール
  - ステップ2: `pnpm --filter @monorepo/backend db:generate` → Prismaクライアントを生成（`node_modules/.prisma/client/`）
  - ステップ3: `pnpm --filter @monorepo/backend build:api` → esbuildでTypeScriptをバンドル（`packages/backend/dist/api/index.js`を生成）
  - ステップ4: Vercel Deployment → `api/index.js`が`dist/api/index.js`をインポート → Fastifyアプリケーションが起動
- **トラブルシューティング**（3つの問題）:
  - **問題1: ビルドが失敗する場合**
    - 症状: Vercelのビルドログでエラーが表示される
    - 確認事項: `package.json`に`build:api`スクリプトが存在するか / TypeScriptの型エラーがないか / 依存関係が正しくインストールされているか
    - 解決策: ローカルでビルドを試す（`cd packages/backend` → `pnpm install` → `pnpm db:generate` → `pnpm build:api`）
  - **問題2: データベース接続エラー**
    - 症状: `P1001: Can't reach database server`
    - 確認事項: `DATABASE_URL`が正しく設定されているか / `DIRECT_URL`が設定されているか / Supabaseのデータベースが起動しているか
    - 解決策: Vercel Dashboardで環境変数を再確認 / Supabase Dashboardで接続文字列を確認 / `docs/VERCEL_ENV_VARS.md`を参照
  - **問題3: CORSエラー**
    - 症状: フロントエンドから`Access-Control-Allow-Origin`エラー
    - 確認事項: `CORS_ORIGIN`にフロントエンドURLが含まれているか / プレビュー環境のワイルドカードが設定されているか
    - 解決策: Vercel環境変数に`CORS_ORIGIN=https://kiro-project-frontend.vercel.app,https://kiro-project-frontend-*.vercel.app`を設定
- **関連ドキュメント**（3つ）:
  - `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイ全般のガイド
  - `docs/VERCEL_ENV_VARS.md` - 環境変数の設定ガイド
  - `docs/VERCEL_TROUBLESHOOTING.md` - トラブルシューティング
- **チェックリスト**（9項目）:
  - デプロイ前の確認（5項目）: `vercel.json`にビルドコマンドが設定されている / `.vercelignore`から`dist`が削除されている / ローカルで`pnpm build:api`が成功する / `packages/backend/dist/api/index.js`が生成される / すべての環境変数がVercelに設定されている
  - デプロイ後の確認（4項目）: Vercelのビルドログでエラーがない / `/api/health`エンドポイントが200を返す / フロントエンドからAPIにアクセスできる / 認証が正常に動作する

**なぜ存在するか:**
技術ブログ機能のバックエンドをVercelにデプロイした後、`/api/health`エンドポイントにアクセスすると500エラー（Internal Server Error）が発生する問題が発生しました。以下の目的で作成されました:

1. **500エラーの根本原因の明確化**: ビルドコマンドの欠如・ビルド成果物の不在・インポートエラーという3つの根本原因を明示し、開発者が問題の本質を理解できるようにする
2. **修正手順の提供**: `vercel.json`へのビルドコマンド追加・`.vercelignore`からの`dist`削除という2つの修正を具体的なコード例とともに提供し、開発者が迷わず修正できるようにする
3. **ビルドプロセスの可視化**: `pnpm install` → `db:generate` → `build:api` → Vercel Deploymentという4ステップのビルドプロセスを図解し、各ステップで何が生成されるかを明確にする
4. **ローカルでのビルド確認手順**: デプロイ前にローカルでビルドが成功するかを確認する手順を提供し、Vercelデプロイ前に問題を発見できるようにする
5. **包括的なトラブルシューティング**: ビルド失敗・データベース接続エラー・CORSエラーという3つの典型的な問題について、症状・確認事項・解決策を明示する
6. **チェックリストによる確認**: デプロイ前5項目・デプロイ後4項目のチェックリストを提供し、デプロイ作業の完了確認を体系化する
7. **関連ドキュメントへの誘導**: `docs/VERCEL_DEPLOYMENT.md`（包括的なデプロイガイド）・`docs/VERCEL_ENV_VARS.md`（環境変数設定）・`docs/VERCEL_TROUBLESHOOTING.md`（フロントエンドのトラブルシューティング）への参照を提供し、問題解決のための情報源を明確にする

**いつ使われるか:**

- **バックエンドの500エラー発生時**: Vercelにデプロイしたバックエンドで`/api/health`エンドポイントにアクセスすると500エラーが発生するとき（最優先で参照するドキュメント）
- **ビルドエラー発生時**: Vercelのビルドログで「Module not found」エラーや「Cannot find module」エラーが表示されるとき
- **デプロイ前の確認時**: ローカルでビルドが成功するかを確認し、Vercelデプロイ前に問題を発見するとき
- **データベース接続エラー発生時**: バックエンドで`P1001: Can't reach database server`エラーが発生するとき
- **CORSエラー発生時**: フロントエンドからバックエンドAPIにアクセスすると`Access-Control-Allow-Origin`エラーが発生するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、バックエンドのVercelデプロイで発生する典型的な問題と解決策を理解するとき
- **本番環境デプロイ時**: 本番環境へのデプロイ前に、ビルドコマンド・`.vercelignore`・環境変数の設定を確認するとき

**関連ファイル:**

- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの包括的なガイド（このドキュメントはバックエンドの500エラーに特化した問題解決ガイド）
- `docs/VERCEL_ENV_VARS.md` - 環境変数の設定ガイド（バックエンドの9個の必須環境変数を参照）
- `docs/VERCEL_TROUBLESHOOTING.md` - フロントエンドのトラブルシューティング（環境変数が正しく読み込まれない問題）
- `vercel.json` - Vercelビルド設定（ビルドコマンドの追加が必要）
- `packages/backend/.vercelignore` - Vercel除外設定（`dist`フォルダを除外リストから削除が必要）
- `packages/backend/package.json` - バックエンドのビルドスクリプト（`build:api`スクリプトの定義）
- `packages/backend/api/index.ts` - バックエンドのエントリポイント（`dist/api/index.js`をインポート）
- `packages/backend/src/app.ts` - Fastifyアプリケーション（プラグイン登録・起動）
- `aidlc-docs/construction/backend/code/summary.md` - バックエンドユニットの成果物一覧（ビルド成果物の確認）
- `aidlc-docs/construction/build-and-test/build-instructions.md` - ビルド手順書（ローカルでのビルド確認の参考）
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（バックエンドAPIの要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（バックエンドアーキテクチャ・Fastify + Prisma + Supabase Auth）

--- **完全なリセット手順**（4ステップ）:

- ステップ1: 環境変数を削除（Settings → Environment Variables → すべて削除）
- ステップ2: 環境変数を再追加（`VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / すべての環境にチェック）
- ステップ3: キャッシュなしで再デプロイ（"Use existing Build Cache"のチェックを外す）
- ステップ4: 確認（デプロイ完了 → ブラウザでアクセス → コンソールでデバッグログ確認）
- **ローカルでの確認方法**（3ステップ）:
  - ステップ1: `.env`ファイルを確認（`packages/frontend/.env`の存在・`VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`の確認）
  - ステップ2: ローカルでビルド（`cd packages/frontend` → `pnpm build` → エラーがないことを確認）
  - ステップ3: ローカルでプレビュー（`pnpm preview` → http://localhost:4173 でアクセス → 動作確認）
- **サポート**:
  - 問題が解決しない場合に提供すべき情報（Vercel Dashboardのスクリーンショット・デプロイログ・ブラウザのコンソールログ・エラーメッセージの全文）
- **参考リンク**:
  - Vercel Environment Variables
  - Vite Environment Variables
  - Supabase JavaScript Client

**なぜ存在するか:**
技術ブログアプリケーションをVercelにデプロイした後、フロントエンドで環境変数が正しく読み込まれず`supabaseUrl is required`エラーが発生するという問題が報告されました。以下の目的で作成されました:

1. **特定のエラーに特化したトラブルシューティング**: `docs/VERCEL_DEPLOYMENT.md`は包括的なデプロイガイドだが、このドキュメントは「環境変数が読み込まれない」という特定の問題に特化したトラブルシューティングガイドとして機能する。問題が発生したときに素早く解決策を見つけられるようにする
2. **段階的な解決手順の提供**: 4ステップの解決手順（環境変数確認 → 追加 → 再デプロイ → ログ確認）を提供することで、開発者が順番に確認し、問題を特定できるようにする。特に「環境変数が設定されているのにエラーが出る場合は再デプロイが必要」という重要なポイントを強調する
3. **デバッグ方法の明示**: ブラウザのコンソールで環境変数チェックログを確認する方法を提供し、開発者が「環境変数が実際に読み込まれているか」を視覚的に確認できるようにする。正常な場合と異常な場合のログ出力例を示すことで、問題の有無を素早く判断できる
4. **よくある原因の集約**: 環境変数名が間違っている（`VITE_`プレフィックスがない）・環境が選択されていない・再デプロイしていない・ビルドキャッシュの問題という4つの典型的な原因を明示し、開発者が自己診断できるようにする
5. **チェックリストによる確認**: 7項目のチェックリストを提供することで、開発者が「何を確認すべきか」を明確にする。特に「環境変数名が`VITE_`で始まっている」「すべての環境が選択されている」「再デプロイを実行した」という3つの重要なポイントを強調する
6. **完全なリセット手順の提供**: それでも解決しない場合の最終手段として、環境変数を削除 → 再追加 → キャッシュなしで再デプロイという完全なリセット手順を提供する。この手順により、設定ミスや古いキャッシュの問題を確実に解消できる
7. **ローカルでの確認方法の提供**: Vercelにデプロイする前に、ローカル環境で環境変数が正しく読み込まれるかを確認する方法を提供する。ローカルでビルド → プレビューという手順により、Vercelデプロイ前に問題を発見できる
8. **サポート情報の明示**: 問題が解決しない場合に提供すべき情報（Vercel Dashboardのスクリーンショット・デプロイログ・ブラウザのコンソールログ・エラーメッセージの全文）を明示し、サポートチームが問題を素早く診断できるようにする
9. **VERCEL_DEPLOYMENT.mdとVERCEL_ENV_VARS.mdの補完**: `docs/VERCEL_DEPLOYMENT.md`は包括的なデプロイガイド、`docs/VERCEL_ENV_VARS.md`は環境変数のクイックリファレンスだが、このドキュメントは「環境変数が読み込まれない」という特定の問題に特化したトラブルシューティングガイドとして機能する。3つのドキュメントを組み合わせることで、初回デプロイ → 環境変数設定 → トラブルシューティングという一連のフローをカバーできる

**いつ使われるか:**

- **環境変数エラー発生時**: Vercelデプロイ後に`supabaseUrl is required`エラーが発生したとき（最優先で参照するドキュメント）
- **環境変数が反映されない時**: 環境変数を設定したのにアプリケーションで読み込まれないとき
- **再デプロイ後の確認時**: 環境変数を更新して再デプロイした後に、正しく反映されたかを確認するとき
- **デバッグ時**: ブラウザのコンソールで環境変数チェックログを確認し、問題を診断するとき
- **チェックリスト確認時**: 環境変数設定完了後に「設定漏れがないか」をチェックリストで確認するとき
- **完全なリセット時**: 何をしても解決しない場合に、環境変数を削除 → 再追加 → キャッシュなしで再デプロイという最終手段を実行するとき
- **ローカル確認時**: Vercelにデプロイする前に、ローカル環境で環境変数が正しく読み込まれるかを確認するとき
- **サポート依頼時**: 問題が解決せず、サポートチームに依頼する際に、提供すべき情報（スクリーンショット・ログ・エラーメッセージ）を確認するとき
- **新規メンバーへのオンボーディング**: プロジェクトに参加した開発者が、Vercelの環境変数トラブルシューティング方法を理解するとき

**関連ファイル:**

- `docs/VERCEL_DEPLOYMENT.md` - Vercelデプロイの包括的なガイド（このドキュメントは環境変数エラーに特化したトラブルシューティング）
- `docs/VERCEL_ENV_VARS.md` - 環境変数のクイックリファレンス（このドキュメントは環境変数が読み込まれない問題の解決策）
- `docs/VERCEL_QUICK_START.md` - Vercelデプロイのクイックスタートガイド（最短手順・環境変数設定を含む）
- `packages/frontend/.env.example` - フロントエンド環境変数のテンプレート（ローカル開発用・Vercel設定の参考）
- `packages/frontend/.env` - フロントエンド環境変数の実際の設定（ローカル開発用・Vercelとは異なる値を使用）
- `packages/frontend/vite.config.ts` - Viteビルド設定（環境変数の読み込み方法を定義）
- `packages/frontend/src/lib/supabase.ts` - Supabaseクライアント初期化（環境変数を使用してSupabaseクライアントを作成）
- `packages/frontend/src/stores/useAuthStore.ts` - 認証状態管理（Supabaseクライアントを使用）
- `.kiro/specs/tech-blog/requirements.md` - 技術ブログ機能の要件定義（環境変数設定の元となる要件）
- `.kiro/specs/tech-blog/design.md` - 技術ブログ機能の設計書（Supabase接続・環境変数の設計）
- `docs/AUTHENTICATION_SETUP.md` - 認証機能のセットアップ手順（Supabase接続情報の取得方法を含む）
- `docs/QUICK_START.md` - クイックスタートガイド（ローカル環境での環境変数設定を含む）
- `README.md` - プロジェクト全体の説明書（トラブルシューティングへのリンクを含む可能性）
