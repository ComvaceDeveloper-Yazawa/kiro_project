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
        │   └── supabase-code-generation-plan.md
        ├── shared/
        │   ├── functional-design/
        │   │   ├── business-logic-model.md
        │   │   ├── business-rules.md
        │   │   └── domain-entities.md
        │   └── code/summary.md
        └── supabase/
            ├── functional-design/
            │   ├── business-logic-model.md
            │   └── business-rules.md
            └── code/summary.md
```

---

## 第1章: ルートファイル

---

### `README.md`

**何を定義しているか:**
リポジトリ全体の説明書です。AI-DLC とは何か、ワークフローの3フェーズ構成、各ステージの役割、セキュリティ拡張ルール一覧、セッション記録、作成ファイルの必要性説明が含まれています。

**なぜ存在するか:**
このプロジェクトに初めて触れる人が「何のためのリポジトリか」「どんな構造か」「今どこまで進んでいるか」を把握するための玄関口です。

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
  "VALIDATION_ERROR", // 400
  "NOT_FOUND", // 404
  "UNAUTHORIZED", // 401
  "FORBIDDEN", // 403
  "CONFLICT", // 409
  "INTERNAL_SERVER_ERROR", // 500
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
  ├── backend/functional-design/   ← 次のユニット
  ├── backend/code/
  ├── frontend/functional-design/
  ├── frontend/code/
  ├── ci-cd/functional-design/
  └── ci-cd/code/

packages/
  ├── backend/                     ← Unit 3（DDD 4層・Fastify・Prisma）
  ├── frontend/                    ← Unit 4（Vue 3・Pinia・SCSS）
  └── e2e/                         ← Unit 5（Playwright）

.github/workflows/                 ← Unit 5（GitHub Actions）
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
