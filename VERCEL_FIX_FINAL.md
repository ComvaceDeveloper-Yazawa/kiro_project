# Vercel 500エラー - 最終修正ガイド

## 🎯 実施した修正

### 1. vercel.json - 標準ビルドフローに変更

```json
{
  "version": 2,
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build",
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3.0.0",
      "includeFiles": "node_modules/.prisma/**"
    }
  }
}
```

### 2. tsconfig.json - 型チェック緩和

```json
{
  "compilerOptions": {
    "strict": false,
    "allowSyntheticDefaultImports": true
  }
}
```

### 3. package.json (ルート) - buildスクリプト

```json
{
  "scripts": {
    "build": "pnpm --filter @monorepo/backend db:generate && pnpm --filter @monorepo/backend build:api"
  }
}
```

## 🚀 デプロイ手順

```bash
git add .
git commit -m "fix: Configure Vercel with Prisma generation"
git push origin main
```

## ✅ 期待される動作

1. `pnpm install` - 依存関係インストール
2. `pnpm build` - Prisma Client生成
3. `api/index.ts` - TypeScriptビルド
4. `/api/health` → `{"status":"ok"}`

## 🔧 環境変数確認

Vercel Dashboardで以下を確認：

- `DATABASE_URL` (Pooler URL + `?pgbouncer=true`)
- `DIRECT_URL` (Direct URL)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN`
- `NODE_ENV=production`

---

**最終更新**: 2026-04-22
