# Application Design 計画

## 実行チェックリスト

- [x] Step 1: 設計上の判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: components.md 生成
- [x] Step 4: component-methods.md 生成
- [x] Step 5: services.md 生成
- [x] Step 6: component-dependency.md 生成
- [x] Step 7: application-design.md（統合ドキュメント）生成

---

## 設計判断質問

要件定義書の内容は明確ですが、以下の点について設計判断が必要です。
各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

バックエンドのレイヤー構成はどれを採用しますか？

A) シンプル 2 層（routes → services）：小規模向け、ボイラープレート少
B) 標準 3 層（routes → services → repositories）：テスタビリティ高、Prisma をリポジトリ層に閉じ込める
C) DDD 寄り 4 層（routes → usecases → domain → infrastructure）：複雑なビジネスロジック向け
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2

フロントエンドの composables と Pinia store の責務分担はどうしますか？

A) API 通信は composables のみ、store は状態保持のみ（シンプル）
B) API 通信は store の actions に集約、composables は UI ロジックのみ
C) API 通信用の composables（useXxxApi）と UI ロジック用の composables（useXxx）を分離し、store は永続状態のみ
D) Other (please describe after [Answer]: tag below)

[Answer]: A:PiniaはSetup記法としてください

## Question 3

shared パッケージの公開範囲はどうしますか？

A) Zod スキーマと推論型（z.infer）のみ公開（最小限）
B) Zod スキーマ・推論型・API レスポンス型・共通エラーコード定数を公開
C) B に加えて、フロント・バック共通のユーティリティ関数も公開
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

Fastify のプラグイン構成はどうしますか？

A) 機能ごとにプラグイン分割（auth plugin, db plugin, routes plugin など）
B) 単一エントリポイントにすべて登録（小規模向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5

エラーハンドリングの集約方法はどうしますか？

A) Fastify の setErrorHandler でグローバルに集約、各ルートは throw するだけ
B) 各サービス層でエラーをキャッチして ApiResponse 形式に変換
C) カスタムエラークラス（AppError, ValidationError など）を定義し、setErrorHandler で型判定して変換
D) Other (please describe after [Answer]: tag below)

[Answer]: A
