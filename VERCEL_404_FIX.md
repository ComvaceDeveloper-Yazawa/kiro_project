# Vercel 404エラー修正

## 🔍 問題

- Prisma Clientは正常に生成されている ✅
- しかし、エンドポイントが404を返す ❌

## 🎯 原因

Vercelが`api/index.ts`をServerless Functionとして認識していない。

## ✅ 修正内容

`vercel.json`を作成して、明示的にルーティングを設定：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## 🚀 デプロイ

```bash
git add vercel.json
git commit -m "fix: Add vercel.json for proper routing"
git push origin main
```

## 📊 期待される動作

- `/api/health` → `api/index.ts` → `{"status":"ok"}`
- すべてのリクエストが`api/index.ts`にルーティングされる

## ✅ 確認

デプロイ後：

```bash
curl https://kiro-project-backend-nine.vercel.app/api/health
```

**期待される応答**:

```json
{
  "status": "ok"
}
```

---

**最終更新**: 2026-04-22
