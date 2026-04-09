# kiro_project

AWS Kiro学習用のリポジトリ

---

## このリポジトリについて

このリポジトリは **AI-DLC (AI-Driven Development Life Cycle)** というAI駆動のソフトウェア開発ワークフローを Kiro IDE 上で学習・実践するための環境です。

AI-DLCは、AIがソフトウェア開発の各フェーズを構造的にガイドしながら、プロジェクトの複雑さや状況に応じて柔軟に適応するワークフローです。

---

## ディレクトリ構造

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

# Vue 3 UIライブラリ比較（Kiro使用前提）

```tsv
カテゴリ	評価項目	Bootstrap (bootstrap-vue-next)	Vuetify 3	Element Plus
基本情報	Vue 3 対応	bootstrap-vue-nextで対応。旧bootstrap-vueはVue 2のみ	正式対応	Vue 3専用設計
基本情報	ライセンス	MIT	MIT	MIT
コンポーネント	コンポーネント数	約40以上	約80以上	約70以上
コンポーネント	データテーブル	基本的なテーブル。ソート、ページネーション対応	v-data-tableが高機能。仮想スクロール、サーバーサイド対応	el-tableが高機能。固定列、ツリー構造、ソート対応
コンポーネント	フォーム / バリデーション	基本的なフォーム。バリデーションは外部ライブラリ依存	内蔵バリデーションルールあり	内蔵バリデーション(async-validator)が充実
開発体験	TypeScript	対応	完全対応。TypeScriptで実装されている	完全対応。TypeScriptで実装されている
開発体験	ドキュメント充実度	発展途上	非常に充実	充実
開発体験	日本語ドキュメント	公式なし	公式なし。コミュニティ翻訳あり	公式で日本語対応
デザイン	デザインシステム	Bootstrap独自。実績豊富だがやや古典的	Material Design 3準拠	独自デザインシステム。業務向けで落ち着いた印象
デザイン	テーマカスタマイズ	SCSS変数でカスタマイズ	SASS + Blueprintによるきめ細かいカスタマイズ	SCSS変数 / CSS Variablesでカスタマイズ
デザイン	レスポンシブ	最も得意。グリッドシステムが定番	グリッド、ブレークポイント対応	基本対応だがBootstrap/Vuetifyほど手厚くない
エコシステム	GitHub Stars	Bootstrap本体 約170k / bootstrap-vue-next 約1k	約40k	約24k
エコシステム	npm 週間ダウンロード数	約15k	約500k	約400k
エコシステム	メンテナンス頻度	コミュニティ主導。更新頻度にムラあり	活発。Vuetify社が開発	活発。Elementチームが継続開発
エコシステム	サードパーティ連携	Bootstrapエコシステムが豊富	Material Design Icons等	独自エコシステム
パフォーマンス	Tree-shaking	対応	対応	対応。unplugin-element-plusで自動インポート可
パフォーマンス	バンドルサイズ	比較的軽量	やや大きい	中程度
パフォーマンス	SSR / Nuxt 3	限定的	Nuxtモジュール公式対応	Nuxt対応。nuxt-element-plus
AI駆動開発（Kiro）との親和性	LLM学習データ量	Bootstrap本体は膨大だがbootstrap-vue-nextのデータは極めて少ない	非常に多い。Vue UIライブラリとして最大の普及度	多い。中国語圏含めコード例が豊富
AI駆動開発（Kiro）との親和性	コード生成の正確性	AIがVue 2版のコードを生成するリスクが高い	v-プレフィックスで統一された命名規則。AIが正しいpropsを推測しやすい	el-プレフィックスで統一。API設計が直感的
AI駆動開発（Kiro）との親和性	Spec to Code変換の親和性	CSSユーティリティクラス中心のためSpecから宣言的UIへの変換がしにくい	最も高い。宣言的APIでprops駆動のためSpecの記述と1対1で対応しやすい	高い。宣言的API設計
AI駆動開発（Kiro）との親和性	ドキュメントの構造化度	ドキュメントに未整備箇所あり	各コンポーネントにAPI表、Playground、例が体系的に整理されている	APIリファレンスが構造的
AI駆動開発（Kiro）との親和性	型定義の厳密さ	一部不完全	非常に厳密。global component型も提供	厳密。TypeScriptで全コンポーネント定義
AI駆動開発（Kiro）との親和性	API安定性	bootstrap-vueからbootstrap-vue-nextでAPIが大きく変更。AIが旧APIを生成する可能性が非常に高い	Vuetify 2から3で破壊的変更あり。Steeringでv3を明記すれば緩和可能	Element UIからElement PlusでAPIの一貫性が比較的高い
AI駆動開発（Kiro）との親和性	サンプルコードの豊富さ	少ない	最多。Stack Overflow、ブログ記事、公式例が豊富	豊富。中国語圏含めると膨大
総合評価	コンポーネント充実度	やや不足	非常に充実	充実
総合評価	デザイン品質	標準的	非常に高い	標準的
総合評価	ドキュメント	不十分	非常に充実	充実
総合評価	エコシステム / 安定性	やや不安	非常に安定	安定
総合評価	パフォーマンス	軽量	やや重い	標準的
総合評価	Kiro（AI生成）との親和性	低い	高い	高い
総合評価	総合	非推奨	推奨	推奨
```
