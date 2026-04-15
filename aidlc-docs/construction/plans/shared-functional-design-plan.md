# Functional Design 計画 - Unit 1: shared

## 実行チェックリスト

- [x] Step 1: 設計判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: business-logic-model.md 生成
- [x] Step 4: business-rules.md 生成
- [x] Step 5: domain-entities.md 生成

---

## 前提（確定済み）

- shared は Zod スキーマと `z.infer<>` 推論型のみを公開
- ビジネスロジック・ユーティリティ・副作用なし
- backend・frontend の両方が依存する

---

## 設計判断質問

以下の点について確認が必要です。
各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

Zod スキーマのファイル分割粒度はどうしますか？

A) リソースごとに 1 ファイル（例: `user.schema.ts`, `post.schema.ts`）
B) 操作ごとに分割（例: `create-user.schema.ts`, `update-user.schema.ts`）
C) リソースごとに 1 ファイルで、その中に create/update/response 用スキーマをまとめる
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

API レスポンスの共通ラッパー型（`ApiResponse<T>`）は shared で定義しますか？

A) Yes — shared で定義し、frontend・backend 両方で使う
B) No — backend で定義し、frontend は型推論で使う（shared は純粋なドメインスキーマのみ）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

スキーマのバリデーションメッセージ（エラーメッセージ）は日本語にしますか？

A) 日本語（例: `z.string().min(1, "必須項目です")`）
B) 英語（例: `z.string().min(1, "Required")`）
C) メッセージなし（デフォルトの Zod メッセージを使用）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

`z.infer<>` で生成した型の export 方法はどうしますか？

A) スキーマと同じファイルで `export type UserType = z.infer<typeof UserSchema>` として export
B) 型定義専用ファイル（`types.ts`）にまとめて export
C) Other (please describe after [Answer]: tag below)

[Answer]: A
