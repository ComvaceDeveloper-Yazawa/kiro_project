# インテグレーションテスト手順

## テスト対象

ユニット間の連携を検証します。

| シナリオ                    | 検証内容                             |
| --------------------------- | ------------------------------------ |
| frontend → backend          | API リクエスト・レスポンスの型整合性 |
| backend → Supabase Auth     | JWT 検証フロー                       |
| backend → Prisma            | DB 接続・クエリ実行                  |
| shared → backend / frontend | Zod スキーマの共有                   |

---

## 1. 環境準備

```bash
# backend を起動（別ターミナル）
pnpm dev:backend

# frontend を起動（別ターミナル）
pnpm dev:frontend
```

---

## 2. シナリオ 1: frontend → backend API 疎通確認

### 目的

frontend の `useApiClient` が backend の `/health` エンドポイントに正常にアクセスできることを確認します。

### 手順

```bash
# backend が起動していることを確認
curl http://localhost:3000/health
# 期待値: { "status": "ok" }
```

### frontend からの確認

ブラウザの DevTools > Network タブで API リクエストを確認します。

---

## 3. シナリオ 2: backend → Supabase Auth 疎通確認

### 目的

`auth.plugin.ts` が Supabase Auth と正常に通信できることを確認します。

### 手順

```bash
# 無効なトークンで 401 が返ることを確認
curl -H "Authorization: Bearer invalid-token" http://localhost:3000/api/v1/[protected-route]
# 期待値: { "success": false, "error": { "code": "UNAUTHORIZED", ... } }
```

---

## 4. シナリオ 3: backend → Prisma DB 接続確認

### 目的

Prisma が Supabase PostgreSQL に正常に接続できることを確認します。

### 手順

```bash
# Prisma Studio でDB接続を確認
cd packages/backend
npx prisma studio
# ブラウザで http://localhost:5555 が開けば接続成功
```

---

## 5. シナリオ 4: shared スキーマの型整合性確認

### 目的

`@monorepo/shared` の `ApiResponse<T>` 型が backend・frontend 両方で正しく使われていることを確認します。

### 手順

```bash
# TypeScript の型チェックを実行
pnpm --filter @monorepo/backend build
pnpm --filter @monorepo/frontend build
# ビルドエラーがなければ型整合性 OK
```

---

## 6. CI でのインテグレーションテスト

現時点では手動確認が主体です。将来的に以下を追加することを推奨します:

- `vitest` の `integration` テストスイートを追加
- `docker-compose` でテスト用 DB を起動してテスト実行
- GitHub Actions の `lint-test.yml` にインテグレーションテストジョブを追加
