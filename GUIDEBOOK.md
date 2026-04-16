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
