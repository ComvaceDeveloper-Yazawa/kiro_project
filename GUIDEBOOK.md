このドキュメントは、リポジトリに存在するすべてのファイルが「何を定義しているか」「なぜ存在するのか」を学習目的で詳細に説明したガイドブックです。

AI-DLC ワークフローを実際に動かしながら生成されたファイル群を、ファイルごとに丁寧に解説します。

---

## ファイル全体マップ

```
kiro_project/
├── README.md                                        # リポジトリ概要・セッション記録
├── GUIDEBOOK.md                                     # このファイル
├── structure.md                                     # 旧来の構成メモ（参考資料）
│
├── .kiro/                                           # Kiro IDE の設定・ルール
│   ├── steering/
│   │   └── aws-aidlc-rules/
│   │       └── core-workflow.md                    # AIへの行動指示（ステアリング）
│   └── aws-aidlc-rule-details/                     # 各ステージの詳細ルール
│       ├── common/                                  # 全ステージ共通ルール（11ファイル）
│       ├── inception/                               # インセプションフェーズのルール（7ファイル）
│       ├── construction/                            # コンストラクションフェーズのルール（6ファイル）
│       ├── operations/                              # オペレーションフェーズのルール（1ファイル）
│       └── extensions/security/baseline/           # セキュリティ拡張ルール（1ファイル）
│
└── aidlc-docs/                                      # AI-DLC が生成したドキュメント群
    ├── aidlc-state.md                               # ワークフロー進捗トラッカー
    ├── audit.md                                     # 全インタラクションの監査ログ
    ├── inception/
    │   ├── requirements/
    │   │   ├── requirement-verification-questions.md  # 要件確認質問（回答済み）
    │   │   └── requirements.md                        # 要件定義書
    │   ├── plans/
    │   │   ├── execution-plan.md                      # ワークフロー実行計画
    │   │   ├── application-design-plan.md             # Application Design の実行計画
    │   │   └── unit-of-work-plan.md                   # Units Generation の実行計画
    │   └── application-design/
    │       ├── application-design.md                  # アプリケーション設計書（統合）
    │       ├── components.md                          # コンポーネント定義
    │       ├── component-methods.md                   # メソッドシグネチャ定義
    │       ├── services.md                            # サービス・プラグイン定義
    │       ├── component-dependency.md                # 依存関係定義
    │       ├── unit-of-work.md                        # ユニット定義
    │       ├── unit-of-work-dependency.md             # ユニット間依存関係
    │       └── unit-of-work-story-map.md              # 要件↔ユニット マッピング
    └── construction/
        ├── plans/
        │   └── shared-functional-design-plan.md       # shared の Functional Design 計画
        └── shared/functional-design/
            ├── business-logic-model.md                # shared のスキーマ設計モデル
            ├── business-rules.md                      # shared のスキーマ設計ルール
            └── domain-entities.md                     # shared の型定義テンプレート
```

---

## 第1章: ルートファイル

---

### `README.md`

**何を定義しているか:**
リポジトリ全体の説明書です。AI-DLC とは何か、ワークフローの3フェーズ構成、各ステージの役割、セキュリティ拡張ルール一覧、そして本セッションのやり取り記録とファイルの必要性説明が含まれています。

**なぜ存在するか:**
GitHub などでリポジトリを開いたときに最初に表示される「玄関」です。このプロジェクトに初めて触れる人が「何のためのリポジトリか」「どんな構造か」「今どこまで進んでいるか」を把握できるようにするために存在します。セッション記録を追記したことで、過去の意思決定の経緯も読み取れます。

---

### `GUIDEBOOK.md`（このファイル）

**何を定義しているか:**
リポジトリ内の全ファイルについて、定義内容・存在理由・具体的な使い方を詳細に説明した学習用ガイドブックです。

**なぜ存在するか:**
AI-DLC ワークフローが自動生成するファイルは多く、初見では「このファイルは何のためにあるのか」が分かりにくいです。学習目的でワークフローを実践している場合に、各ファイルの意味を体系的に理解するための補助資料として作成しました。

---

### `structure.md`

**何を定義しているか:**
このリポジトリで想定するフロントエンド（Vue 3 + TypeScript）とバックエンド（Hono + TypeScript）の構造、ファイル命名規則、コードスタイル、DDD 優先の設計方針などを定義した旧来のメモファイルです。

**なぜ存在するか:**
AI-DLC ワークフローを開始する前から存在していたファイルです。当初の技術スタック想定（Hono）と現在の確定スタック（Fastify）で差異がありますが、命名規則や設計思想の参考資料として残っています。AI-DLC の要件定義書（`requirements.md`）が正式な仕様書となったため、このファイルは参考資料の位置づけです。

---

## 第2章: `.kiro/` — Kiro IDE のルール・設定ファイル群

`.kiro/` ディレクトリは Kiro IDE が自動的に読み込む設定・ルールファイルの置き場所です。アプリケーションコードとは完全に分離されており、「AI がどう振る舞うか」を制御します。

---

### `.kiro/steering/aws-aidlc-rules/core-workflow.md`

**何を定義しているか:**
AI-DLC ワークフロー全体の「行動規範」です。以下を定義しています。

- ワークフローの3フェーズ（INCEPTION / CONSTRUCTION / OPERATIONS）の構造
- 各ステージの実行条件（常時実行 / 条件付き / スキップ）
- ステージ間の進行ルール（ユーザー承認が必要なゲート）
- 監査ログ（audit.md）への記録ルール
- チェックボックストラッキングの義務
- ルール詳細ファイル（`aws-aidlc-rule-details/`）の読み込み手順
- セキュリティ拡張（extensions/）の適用ルール

**なぜ存在するか:**
Kiro IDE の「ステアリング」機能により、このファイルはすべての会話で自動的に AI に読み込まれます。つまり「ユーザーが何かを依頼するたびに、AI はまずこのファイルのルールに従って動く」という仕組みです。このファイルがなければ AI は通常の会話モードで動作し、AI-DLC ワークフローは機能しません。

**重要なポイント:**
`# PRIORITY: This workflow OVERRIDES all other built-in workflows` という宣言が冒頭にあり、他のすべての組み込みワークフローより優先されます。

---

### `.kiro/aws-aidlc-rule-details/common/` （11ファイル）

`core-workflow.md` から参照される共通ルールファイル群です。すべてのフェーズ・ステージで横断的に使われます。

| ファイル                       | 定義内容                                                                 | なぜ必要か                                                                      |
| ------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `process-overview.md`          | ワークフロー全体の技術的リファレンス。Mermaid フロー図付き               | AI がワークフロー全体像を把握するための地図                                     |
| `welcome-message.md`           | ワークフロー開始時にユーザーへ表示するウェルカムメッセージの本文         | 毎回 AI がゼロから文章を考えなくて済むよう、表示内容を固定化                    |
| `session-continuity.md`        | セッション再開時の手順・コンテキスト復元ルール                           | 前回の続きから再開するときに AI が迷わないための手順書                          |
| `content-validation.md`        | ファイル作成前のコンテンツ検証ルール（Mermaid 構文チェック等）           | 壊れた図や不正な Markdown を生成しないための品質ゲート                          |
| `ascii-diagram-standards.md`   | ASCII アート図の標準規格（使用可能文字・整列ルール）                     | 図の見た目が崩れないよう文字種と幅を統一するための規格                          |
| `question-format-guide.md`     | 質問ファイルのフォーマットルール（A/B/C/D 選択肢形式・`[Answer]:` タグ） | AI がチャットで直接質問するのではなく、専用ファイルに整理して質問するための規約 |
| `depth-levels.md`              | 適応的な詳細度レベルの説明（Minimal / Standard / Comprehensive）         | プロジェクトの複雑さに応じて設計の深さを変えるための基準                        |
| `terminology.md`               | AI-DLC 用語集（Phase / Stage / Unit / Component などの定義）             | AI とユーザーが同じ言葉で話せるよう用語を統一                                   |
| `error-handling.md`            | エラー発生時の回復手順                                                   | アーティファクトが壊れたり欠損したりした場合の対処法                            |
| `overconfidence-prevention.md` | AI の過信防止ガイドライン                                                | AI が「分かったつもり」で進まないよう、不明点は必ず質問するよう促す             |
| `workflow-changes.md`          | ワークフロー変更履歴                                                     | ルールが変更された経緯を追跡するための変更ログ                                  |

---

### `.kiro/aws-aidlc-rule-details/inception/` （7ファイル）

INCEPTION フェーズの各ステージの詳細な実行手順が格納されています。`core-workflow.md` が「何をするか」を定義するのに対し、これらのファイルは「どうやってするか」を定義します。

| ファイル                   | 定義内容                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| `workspace-detection.md`   | ワークスペースをスキャンして Greenfield/Brownfield を判定する手順                 |
| `requirements-analysis.md` | 要件を収集・整理する手順。質問ファイルの作成・回答分析・要件定義書生成まで        |
| `workflow-planning.md`     | 実行計画を作成する手順。スコープ分析・リスク評価・ステージ選択の判断基準          |
| `application-design.md`    | コンポーネント設計・メソッド定義・サービス設計を行う手順                          |
| `units-generation.md`      | システムをユニットに分解する手順。依存関係マトリクス・ストーリーマップの生成      |
| `user-stories.md`          | ユーザーストーリーとペルソナを作成する手順（今回はスキップ）                      |
| `reverse-engineering.md`   | 既存コードを解析してドキュメントを生成する手順（Brownfield のみ・今回はスキップ） |

**なぜ存在するか:**
`core-workflow.md` だけでは「何をすべきか」の概要しか分かりません。実際に各ステージを実行するとき、AI はこれらのファイルを読み込んで「具体的に何をどの順番でやるか」を把握します。ルールを分離することで、特定のステージだけルールを更新したいときに他のステージに影響しません。

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
デプロイ・監視・運用フェーズのプレースホルダーです。現時点では「将来拡張予定」という宣言のみが書かれています。

**なぜ存在するか:**
将来的にデプロイ自動化・監視設定・インシデント対応などのワークフローを追加するための「場所取り」です。

---

### `.kiro/aws-aidlc-rule-details/extensions/security/baseline/security-baseline.md`

**何を定義しているか:**
全フェーズに横断的に適用される15のセキュリティルール（SECURITY-01〜15）を定義しています。各ルールには「何を守るか」「どう検証するか」が明記されています。

| ルール      | 守るもの                                                                      |
| ----------- | ----------------------------------------------------------------------------- |
| SECURITY-01 | 保存データ・転送データの暗号化（TLS 1.2+・暗号化ストレージ）                  |
| SECURITY-02 | ネットワーク中継点（LB・API GW・CDN）のアクセスログ                           |
| SECURITY-03 | 構造化ログ（タイムスタンプ・リクエストID・ログレベル必須）                    |
| SECURITY-04 | HTTP セキュリティヘッダー（CSP・HSTS・X-Frame-Options 等）                    |
| SECURITY-05 | 全 API パラメータの入力バリデーション（型・長さ・形式・インジェクション防止） |
| SECURITY-06 | 最小権限アクセスポリシー（ワイルドカード禁止）                                |
| SECURITY-07 | 制限的なネットワーク設定（deny-by-default）                                   |
| SECURITY-08 | アプリケーションレベルのアクセス制御（認証・認可・IDOR 防止・CORS）           |
| SECURITY-09 | セキュリティハードニング（デフォルト認証情報禁止・エラー詳細非公開）          |
| SECURITY-10 | ソフトウェアサプライチェーン（依存関係ピン留め・脆弱性スキャン）              |
| SECURITY-11 | セキュアデザイン原則（レート制限・多層防御・誤用シナリオの考慮）              |
| SECURITY-12 | 認証・クレデンシャル管理（パスワードハッシュ・MFA・セッション管理）           |
| SECURITY-13 | ソフトウェア・データ整合性（安全なデシリアライズ・SRI・CI/CD 保護）           |
| SECURITY-14 | アラートとモニタリング（認証失敗アラート・ログ保持90日以上）                  |
| SECURITY-15 | 例外処理とフェイルセーフ（fail closed・グローバルエラーハンドラー）           |

**なぜ存在するか:**
セキュリティルールを各ステージのルールファイルに分散させると管理が難しくなります。このファイルに集約することで「セキュリティ要件の一覧」として機能し、各ステージ完了時に AI がこのファイルを参照してコンプライアンスチェックを行います。今回のプロジェクトでは Requirements Analysis で「全ルール適用（Yes）」と回答したため、すべてのステージでブロッキング制約として機能します。

---

## 第3章: `aidlc-docs/` — AI-DLC が生成したドキュメント群

`aidlc-docs/` はアプリケーションコードを一切含まない「ドキュメント専用ディレクトリ」です。AI-DLC ワークフローが各ステージを実行するたびに、ここにファイルが追加されていきます。

---

### `aidlc-docs/aidlc-state.md`

**何を定義しているか:**
ワークフローの「現在地」を記録するステート管理ファイルです。以下の情報が含まれています。

- プロジェクト種別（Greenfield）・開始日時
- ワークスペースの状態（既存コードの有無）
- セキュリティ拡張の有効/無効設定
- 全ステージの進捗（完了 `[x]` / スキップ / 実行予定 / 未着手）
- 現在のフェーズ・ステージ・次のステップ

**現在の状態（このセッション終了時点）:**

```
INCEPTION PHASE:
  [x] Workspace Detection    - 完了
  [ ] Reverse Engineering    - SKIP（Greenfield）
  [x] Requirements Analysis  - 完了
  [ ] User Stories           - SKIP
  [x] Workflow Planning      - 完了
  [x] Application Design     - 完了
  [x] Units Generation       - 完了

CONSTRUCTION PHASE:
  [ ] Functional Design      - 実行中（Unit 1: shared まで完了）
  [ ] Code Generation        - 未着手
  [ ] Build and Test         - 未着手
```

**なぜ存在するか:**
セッションをまたいで作業を再開するとき、AI はまずこのファイルを読み込みます。「どこまで終わったか」「次は何をすべきか」がここに書かれているため、毎回ゼロから状態を推測する必要がなくなります。このファイルがないと、AI は前回の作業を知らずに重複作業や誤った再開をしてしまいます。

---

### `aidlc-docs/audit.md`

**何を定義しているか:**
ユーザーと AI のすべてのやり取りを時系列で記録した監査ログです。各エントリには以下が含まれます。

- ISO 8601 形式のタイムスタンプ
- ユーザーの完全な入力（要約なし・そのまま記録）
- AI の対応内容
- ステージ・アクションのコンテキスト

**なぜ存在するか:**
3つの目的があります。

1. **意思決定の追跡**: 「なぜこの設計にしたか」「ユーザーが何を承認したか」を後から確認できる
2. **セッション再開の補助**: AI がコンテキストを復元する際の参照資料になる
3. **チーム共有**: 複数人で開発する場合、誰がいつ何を決めたかが明確になる

AI-DLC のルールでは「ユーザー入力を絶対に要約しない・完全な原文を記録する」ことが義務付けられています。

---

## 第4章: `aidlc-docs/inception/` — INCEPTION フェーズの成果物

---

### `aidlc-docs/inception/requirements/requirement-verification-questions.md`

**何を定義しているか:**
Requirements Analysis ステージで AI がユーザーに投げかけた10問の質問と、ユーザーの回答が記録されたファイルです。

質問内容と回答:

| 質問                   | 回答                                            |
| ---------------------- | ----------------------------------------------- |
| プロジェクトフェーズ   | B: 社内ツール・小規模本番                       |
| セキュリティルール適用 | A: Yes（全ルール適用）                          |
| モノレポ管理ツール     | A: pnpm workspaces                              |
| Edge Functions 用途    | E: 不使用（Fastify で完結）                     |
| Prisma 接続方式        | C: Direct（マイグレーション）+ Pooler（アプリ） |
| フロントルーティング   | A: Vue Router SPA                               |
| テストカバレッジ目標   | D: 100%（厳格運用）                             |
| E2E テスト             | B: Playwright（主要フローのみ）                 |
| SCSS 命名規則          | B: SMACSS ベース                                |
| CI/CD                  | C: GitHub Actions（Lint+Test+Deploy）           |

**なぜ存在するか:**
AI-DLC のルールでは「質問はチャットで直接行わず、専用ファイルに整理する」ことが義務付けられています。理由は3つあります。

1. ユーザーが落ち着いて回答できる（チャットの流れに追われない）
2. 回答がそのままドキュメントとして残る（後から参照できる）
3. 回答の矛盾チェックが容易になる（AI が全回答を一覧で確認できる）

---

### `aidlc-docs/inception/requirements/requirements.md`

**何を定義しているか:**
プロジェクトの「何を作るか・どんな制約があるか」を一箇所にまとめた正式な要件定義書です。以下が含まれます。

- インテント分析サマリー（リクエスト種別・スコープ・複雑度）
- 確定済み技術選定の完全な一覧（フロント・バック・共通）
- 機能要件 FR-01〜07（ディレクトリ構成・shared設計・コーディング規約・ESLint/Prettier・テスト・SCSS・責務整理）
- 非機能要件 NFR-01〜06（カバレッジ・セキュリティ・CI/CD・Prisma接続・ルーティング・Edge Functions）
- 確定済み API レスポンス形式
- 確定済み CSS 方針
- 成功基準

**なぜ存在するか:**
後続のすべての設計・実装フェーズで「判断の根拠」となるファイルです。「なぜこのディレクトリ構成にしたか」「なぜこのテスト方針か」という問いに対して、常にこのファイルが答えを持っています。チームメンバーが増えたときのオンボーディング資料としても機能します。

---

### `aidlc-docs/inception/plans/execution-plan.md`

**何を定義しているか:**
Workflow Planning ステージで作成した「どのステージを実行し、どのステージをスキップするか」の根拠付き計画書です。

- 変更インパクト評価（ユーザー向け変更なし・構造的変更あり・リスク Low）
- ワークフロー可視化（ASCII 図）
- 各ステージの EXECUTE/SKIP 判定と理由
- 5ユニットの構成と実行順序（shared → supabase → backend → frontend → ci-cd）
- 成功基準

**なぜ存在するか:**
AI-DLC はすべてのステージを機械的に実行するのではなく、プロジェクトの性質に応じて適応的に実行します。このファイルがあることで「なぜ User Stories をスキップしたか」「なぜ NFR Requirements をスキップしたか」という判断の根拠が明確になります。ユーザーはこのファイルを見て「このステージを追加してほしい」と要求することもできます。

---

### `aidlc-docs/inception/plans/application-design-plan.md`

**何を定義しているか:**
Application Design ステージの実行計画と、設計判断のための質問・回答が記録されたファイルです。

質問内容と回答:

| 質問                            | 回答                                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| バックエンドレイヤー構成        | C: DDD 寄り 4 層（routes → usecases → domain → infrastructure）   |
| フロント composables/store 責務 | A: API通信は composables、store は状態保持 ＋ Pinia は Setup 記法 |
| shared 公開範囲                 | A: Zod スキーマと推論型のみ                                       |
| Fastify プラグイン構成          | A: 機能ごとにプラグイン分割                                       |
| エラーハンドリング集約          | A: setErrorHandler でグローバル集約                               |

チェックリストがすべて `[x]` になっており、このステージが完了していることを示しています。

**なぜ存在するか:**
設計判断の「なぜ」を記録するためです。「なぜ DDD 4層を採用したか」「なぜ Pinia は Setup 記法か」という問いに対して、このファイルがユーザーの意思決定を証明します。また、チェックリストにより「どのアーティファクトが生成済みか」が一目で分かります。

---

### `aidlc-docs/inception/plans/unit-of-work-plan.md`

**何を定義しているか:**
Units Generation ステージの実行計画と、ユニット分解の判断事項に関する質問・回答が記録されたファイルです。

質問内容と回答:

| 質問                        | 回答                                                     |
| --------------------------- | -------------------------------------------------------- |
| backend/frontend の実行順序 | A: 順番に実行（backend 完了後に frontend）               |
| コード生成粒度              | B: スキャフォールディング + コーディング規約ドキュメント |
| Prisma 初期スキーマ         | A: 空のスキーマのみ                                      |

**なぜ存在するか:**
`application-design-plan.md` と同じ理由です。ユニット分解の判断根拠を記録し、チェックリストで進捗を管理します。

---

## 第5章: `aidlc-docs/inception/application-design/` — アプリケーション設計成果物

Application Design ステージと Units Generation ステージで生成された設計ドキュメント群です。

---

### `aidlc-docs/inception/application-design/application-design.md`

**何を定義しているか:**
アプリケーション設計書の「統合ドキュメント」です。以下をすべて一箇所にまとめています。

- 設計方針サマリー（6つの決定事項と理由）
- モノレポの完全なディレクトリ構成（tree 形式）
- パッケージ間依存関係（shared ← backend/frontend の一方向）
- backend レイヤー依存関係（DDD 4層の依存方向）
- frontend 依存関係（views → composables → stores の流れ）
- データフロー（リクエスト処理の流れ・フロントのユーザー操作の流れ）
- セキュリティ設計（SECURITY ルールとの対応表）
- 詳細ドキュメントへのリンク

**なぜ存在するか:**
設計の全体像を1ファイルで把握できるようにするためです。詳細は各ファイルに分散していますが、「まず全体を理解したい」というときにこのファイルを読めば十分です。新しいチームメンバーへの説明資料としても最適です。

---

### `aidlc-docs/inception/application-design/components.md`

**何を定義しているか:**
全パッケージのコンポーネント一覧と各コンポーネントの責務を定義しています。

- shared パッケージのコンポーネント（schemas/api/・schemas/domain/・index.ts）
- backend パッケージの4層コンポーネント（plugins/・hooks/・routes/・usecases/・domain/・infrastructure/）
- frontend パッケージのコンポーネント（composables/api/・composables/・stores/・views/・components/・router/）
- supabase パッケージのコンポーネント（migrations/・seed.sql・config.toml）

**なぜ存在するか:**
「このファイルはどの層に属するか」「このコンポーネントは何をするか」を迷わず判断できるようにするためです。新しいファイルを作るときに「どこに置くべきか」の答えがここにあります。

---

### `aidlc-docs/inception/application-design/component-methods.md`

**何を定義しているか:**
各コンポーネントのメソッドシグネチャ（関数名・引数の型・戻り値の型）と高レベルの目的を定義しています。

例えば:

- `setErrorHandler` の型シグネチャと役割
- `{Resource}Repository` インターフェースの CRUD メソッド一覧
- `useApiClient` の get/post/put/delete メソッドの型
- Pinia Setup 記法の `use{Resource}Store` の state/actions 構造

**なぜ存在するか:**
実装前に「どんな関数を作るか」の設計図を持つためです。詳細なビジネスロジックは Construction フェーズの Functional Design で定義しますが、「インターフェース（外から見た形）」はここで確定させます。これにより、実装者が「この関数は何を受け取って何を返すか」を迷わず実装できます。

---

### `aidlc-docs/inception/application-design/services.md`

**何を定義しているか:**
サービスレイヤーの設計を定義しています。

- Application Service（Usecase）と Domain Service の違いと使い分け
- Usecase の命名規則（`{Action}{Resource}Usecase`）と標準的な構造
- 標準的なユースケース一覧（Create/Get/List/Update/Delete）
- Fastify プラグインの構成と登録順序（db → auth → routes → error.handler）
- エラーハンドリングフロー（throw → setErrorHandler → ApiResponse 変換）
- Zod バリデーションエラーの扱い方

**なぜ存在するか:**
「どこにビジネスロジックを書くか」「エラーはどこで処理するか」という実装時の迷いをなくすためです。特にエラーハンドリングフローは「各ルートは throw するだけ、変換は setErrorHandler に任せる」という方針を明確にしており、実装の一貫性を保ちます。

---

### `aidlc-docs/inception/application-design/component-dependency.md`

**何を定義しているか:**
コンポーネント間・パッケージ間の依存関係ルールを定義しています。

- パッケージ間依存マトリクス（shared は何にも依存しない・backend↔frontend の相互依存禁止）
- backend 内レイヤー依存ルール（domain 層は上位層を知らない・依存性逆転の原則）
- frontend 内依存ルール（composables/api は stores を参照しない・components は stores を直接参照しない）
- 型の流れ（shared → backend routes → usecases → domain の型変換フロー）
- データフロー（HTTP リクエストからレスポンスまでの完全な流れ）
- 循環依存防止の5つのルール

**なぜ存在するか:**
循環依存はビルドエラーや予期しない動作の原因になります。「何が何に依存してよいか」を明文化することで、実装時に「このインポートは許可されているか」を即座に判断できます。特に「禁止事項」の列挙が重要で、やってはいけないことを明確にしています。

---

### `aidlc-docs/inception/application-design/unit-of-work.md`

**何を定義しているか:**
5つのユニット（shared / supabase / backend / frontend / ci-cd）それぞれの定義・責務・成果物・完了条件を定義しています。

各ユニットについて:

- 目的（1行の説明）
- 責務の箇条書き
- 生成されるファイルの tree 構造
- コーディング規約ドキュメント（CODING_STANDARDS.md）の内容概要
- 完了条件のチェックリスト

**なぜ存在するか:**
「このユニットで何を作るか」の設計図です。Code Generation ステージでは、このファイルを参照して「何を生成すべきか」を判断します。完了条件のチェックリストにより、「このユニットは本当に終わったか」を客観的に判断できます。

---

### `aidlc-docs/inception/application-design/unit-of-work-dependency.md`

**何を定義しているか:**
5ユニット間の依存関係を定義しています。

- 依存マトリクス（行のユニットが列のユニットの完了を必要とするか）
- 各依存の詳細（何に依存しているか・ビルド時依存か実行時依存か）
- 実行順序のクリティカルパス（shared → supabase → backend → frontend → ci-cd）
- pnpm workspace の依存宣言例
- 循環依存の禁止パターン
- テスト境界（Unit Test / Integration Test / E2E Test の対象と実行タイミング）

**なぜ存在するか:**
「なぜ shared を最初に作るのか」「なぜ frontend は backend の後なのか」という実行順序の根拠を明文化するためです。また、CI/CD パイプラインを設計するときに「どのユニットのテストをどの順番で実行するか」の参考資料になります。

---

### `aidlc-docs/inception/application-design/unit-of-work-story-map.md`

**何を定義しているか:**
要件定義書の各要件（FR-01〜07・NFR-01〜06）が、どのユニットで実装されるかのマッピングを定義しています。

- 要件 → ユニット マッピング表
- 非機能要件 → ユニット マッピング表
- ユニット別タスク一覧（各ユニットで何をするかの具体的なタスク）
- 全ユニットの完了基準

**なぜ存在するか:**
「コーディング規約（FR-03）はどのユニットで作るのか」「セキュリティ要件（NFR-02）はどこで対応するのか」という問いに答えるためです。要件の「抜け漏れ」を防ぐ役割もあります。全要件がいずれかのユニットにマッピングされていることを確認することで、「実装されない要件」がないことを保証します。

---

## 第6章: `aidlc-docs/construction/` — CONSTRUCTION フェーズの成果物

CONSTRUCTION フェーズは現在進行中です。Unit 1: shared の Functional Design まで完了しています。

---

### `aidlc-docs/construction/plans/shared-functional-design-plan.md`

**何を定義しているか:**
Unit 1: shared の Functional Design ステージの実行計画と、設計判断の質問・回答が記録されたファイルです。

質問内容と回答:

| 質問                                  | 回答                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| Zod スキーマのファイル分割粒度        | B: 操作ごとに分割（create-user.schema.ts / update-user.schema.ts 等） |
| ApiResponse<T> を shared で定義するか | A: Yes（frontend・backend 両方で使う）                                |
| バリデーションメッセージの言語        | A: 日本語（"必須項目です" 等）                                        |
| z.infer<> 型の export 方法            | A: スキーマと同一ファイルで export                                    |

チェックリストがすべて `[x]` になっており、このステージが完了していることを示しています。

**なぜ存在するか:**
INCEPTION フェーズの計画ファイルと同じ理由です。設計判断の根拠を記録し、チェックリストで進捗を管理します。

---

### `aidlc-docs/construction/shared/functional-design/business-logic-model.md`

**何を定義しているか:**
shared パッケージのスキーマ設計モデルを定義しています。

- shared パッケージの性質（ビジネスロジックを持たない型・スキーマ定義専用）
- 確定したディレクトリ構成（schemas/api/ と schemas/domain/ の分離）
- スキーマ分割モデル（操作ごとのファイル分割の理由と構造）
- 型の同居ルール（スキーマと推論型を同一ファイルに定義する理由）
- `ApiResponse<T>` の完全な型定義（ジェネリックファクトリ・成功/エラーのユニオン型）
- `index.ts` の公開ルール（禁止事項含む）

**なぜ存在するか:**
「shared パッケージをどう設計するか」の詳細設計書です。Code Generation ステージでは、このファイルを参照して実際のファイルを生成します。「なぜ ApiResponse<T> を shared に置くのか」「なぜ index.ts はワイルドカード export を禁止するのか」という設計判断の根拠がここに記録されています。

---

### `aidlc-docs/construction/shared/functional-design/business-rules.md`

**何を定義しているか:**
shared パッケージのスキーマ設計に関する9つのルールを定義しています。

| ルール   | 内容                                                   |
| -------- | ------------------------------------------------------ |
| ルール 1 | 作成スキーマは全フィールド必須                         |
| ルール 2 | 更新スキーマは `.partial()` で部分更新対応             |
| ルール 3 | レスポンススキーマはサーバー生成フィールドを含む       |
| ルール 4 | ID フィールドは UUID 形式で統一                        |
| ルール 5 | 日時フィールドは ISO 8601 文字列                       |
| ルール 6 | スキーマと型は必ずペアで export                        |
| ルール 7 | index.ts は明示的 re-export のみ（ワイルドカード禁止） |
| ルール 8 | shared は何にも依存しない（zod 以外の依存禁止）        |
| ルール 9 | shared 内でのクロスインポート禁止                      |

また、バリデーションメッセージの標準文言一覧（「必須項目です」「100文字以内で入力してください」等）も定義しています。

**なぜ存在するか:**
「推奨 / 非推奨 / 理由」形式でルールを定義することで、実装者が「このコードは正しいか」を自己判断できるようにするためです。特に「非推奨」の例を示すことで、よくある間違いを事前に防ぎます。バリデーションメッセージの標準文言を定義することで、チーム全体でメッセージの表現が統一されます。

---

### `aidlc-docs/construction/shared/functional-design/domain-entities.md`

**何を定義しているか:**
shared パッケージの型定義テンプレートを定義しています。

- shared がドメインエンティティ（クラス）を持たない理由の説明
- `ApiResponse<T>` と `ApiError` の完全な TypeScript 実装コード
- 新しいリソースを追加するときのテンプレート（作成・更新・レスポンスの3ファイル）
- ディレクトリ構成のルール（リソース名は kebab-case）
- `index.ts` の公開エントリポイント構成例

**なぜ存在するか:**
「新しいリソース（例: Post, Comment）を追加するときに何をどう書くか」のテンプレートを提供するためです。テンプレートがあることで、チームメンバーが「どう書けばいいか分からない」という状況を防ぎます。また、`ApiResponse<T>` の実装コードは Code Generation ステージで実際のファイルに転記されます。

---

## 第7章: ファイル間の関係性まとめ

### ルールファイルとドキュメントの関係

```
.kiro/steering/core-workflow.md
  └── AI の行動を制御（すべての会話で自動読み込み）
        │
        ├── .kiro/aws-aidlc-rule-details/common/     ← 共通ルール
        ├── .kiro/aws-aidlc-rule-details/inception/  ← INCEPTION の手順
        ├── .kiro/aws-aidlc-rule-details/construction/ ← CONSTRUCTION の手順
        └── .kiro/aws-aidlc-rule-details/extensions/ ← セキュリティ制約
              │
              ▼ AI がルールに従って生成
        aidlc-docs/
          ├── aidlc-state.md    ← 進捗管理（AI が最初に読む）
          ├── audit.md          ← 監査ログ（すべての会話を記録）
          ├── inception/        ← INCEPTION フェーズの成果物
          └── construction/     ← CONSTRUCTION フェーズの成果物
```

### ドキュメント間の参照関係

```
requirements.md（要件定義書）
  └── 参照される → execution-plan.md（実行計画）
        └── 参照される → application-design-plan.md（設計計画）
              └── 参照される → application-design.md（設計書）
                    └── 参照される → unit-of-work.md（ユニット定義）
                          └── 参照される → shared-functional-design-plan.md
                                └── 参照される → business-logic-model.md
                                               business-rules.md
                                               domain-entities.md
```

### 次に生成されるファイル（次回セッション以降）

```
aidlc-docs/construction/
  ├── shared/functional-design/  ← 完了済み
  ├── supabase/functional-design/  ← 次のユニット
  ├── backend/functional-design/
  ├── frontend/functional-design/
  └── ci-cd/functional-design/

packages/                        ← Code Generation で生成（アプリコード）
  ├── shared/
  ├── supabase/
  ├── backend/
  ├── frontend/
  └── e2e/
```

---

## 付録: AI-DLC ワークフローの学習ポイント

### なぜ「質問ファイル」方式を採用しているか

AI-DLC では、AI がチャットで直接質問するのではなく、専用の `.md` ファイルに質問を整理してユーザーに回答してもらいます。この方式の利点:

1. **記録が残る**: 回答がそのままドキュメントになる
2. **落ち着いて回答できる**: チャットの流れに追われない
3. **矛盾チェックが容易**: AI が全回答を一覧で確認できる
4. **セッション再開時に参照できる**: 「なぜこの設計にしたか」が後から分かる

### なぜ「承認ゲート」があるか

各ステージの完了時にユーザーの明示的な承認を求めます。理由:

1. **ユーザーコントロール**: AI が勝手に進まない
2. **品質確認**: 次のステージに進む前に成果物を確認できる
3. **方向修正**: 「この設計は違う」と気づいたときに止められる

### なぜ `aidlc-docs/` とアプリコードを分離するか

AI-DLC の鉄則として「ドキュメントは `aidlc-docs/` のみ、アプリコードはワークスペースルート」があります。理由:

1. **混在防止**: ドキュメントとコードが混ざると管理が複雑になる
2. **CI/CD の分離**: アプリのビルドにドキュメントが影響しない
3. **明確な責務**: `aidlc-docs/` を見れば設計の全体像が分かる
