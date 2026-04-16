# Functional Design 計画 - Unit 2: supabase

## 実行チェックリスト

- [x] Step 1: 設計判断事項をユーザーに確認
- [x] Step 2: 回答を分析・曖昧点の解消
- [x] Step 3: business-logic-model.md 生成
- [x] Step 4: business-rules.md 生成

---

## 前提（確定済み）

- Supabase CLI でマイグレーション・RLS・設定を管理
- Prisma 接続: マイグレーション用 Direct / アプリ用 Pooler（Pgbouncer）
- Edge Functions: 不使用（Fastify で完結）
- Prisma 初期スキーマ: 空（テーブル定義なし）

---

## 設計判断質問

各質問の `[Answer]:` タグの後に回答を記入してください。

---

## Question 1

Supabase プロジェクトのローカル開発環境はどう管理しますか？

A) `supabase start` でローカル Supabase を起動（Docker 必須・完全ローカル）
B) リモートの Supabase プロジェクトに直接接続（Docker 不要）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

RLS（Row Level Security）ポリシーの管理方法はどうしますか？

A) マイグレーションファイルに SQL で記述（Supabase CLI 管理）
B) Supabase ダッシュボードで手動管理（マイグレーションには含めない）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

`auth.users` テーブルと連携するアプリ独自のユーザープロファイルテーブルは作りますか？

A) Yes — `profiles` テーブルを作成し `auth.users.id` を外部キーとして参照する
B) No — `auth.users` のみ使用し、追加プロファイル情報は持たない
C) Other (please describe after [Answer]: tag below)

[Answer]: B
