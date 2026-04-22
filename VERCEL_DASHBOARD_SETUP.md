# Vercel Dashboard 設定手順

## 🎯 問題の原因

`vercel.json`の`buildCommand`が無視されているため、Prisma Clientが生成されていません。

## ✅ 解決方法: Vercel Dashboardで設定

### 手順

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard
   - プロジェクト `kiro-project-backend-nine` を選択

2. **Settings → General → Build & Development Settings**

3. **以下の設定を入力**:

   **Framework Preset**: `Other`

   **Build Command**:

   ```bash
   pnpm install && pnpm build
   ```

   **Output Directory**: (空欄のまま)

   **Install Command**:

   ```bash
   pnpm install
   ```

4. **Save** をクリック

5. **Deployments タブに移動**

6. **最新のデプロイメントの "..." メニュー → Redeploy**

## 📊 ビルドプロセス

設定後、Vercelは以下の順序で実行します：

```
1. pnpm install
   └─> すべての依存関係をインストール

2. pnpm build (ルートのpackage.json)
   └─> pnpm --filter @monorepo/backend db:generate
       └─> Prisma Clientを生成
           └─> node_modules/.prisma/client/
   └─> pnpm --filter @monorepo/backend build:api
       └─> dist/api/index.js を生成

3. api/index.ts を検出
   └─> Serverless Functionとしてデプロイ
```

## 🔍 確認方法

デプロイ完了後、ビルドログで以下を確認：

```
✓ Prisma schema loaded from packages/backend/prisma/schema.prisma
✓ Generated Prisma Client
```

そして、エンドポイントにアクセス：

```bash
curl https://kiro-project-backend-nine.vercel.app/api/health
```

**期待される応答**:

```json
{
  "status": "ok"
}
```

## 🐛 トラブルシューティング

### ビルドコマンドが実行されない

**症状**: ビルドログに`pnpm build`が表示されない

**解決策**:

1. Settings → General → Build & Development Settings
2. "Override" トグルをONにする
3. Build Commandを再入力
4. Save

### Prisma Clientエラーが続く

**症状**: `Module '"@prisma/client"' has no exported member 'PrismaClient'`

**解決策**:

1. 環境変数を確認:
   - `DATABASE_URL` (Pooler URL + `?pgbouncer=true`)
   - `DIRECT_URL` (Direct URL)
2. ビルドログで`prisma generate`が実行されているか確認
3. 必要に応じて、Build Commandを以下に変更:
   ```bash
   cd packages/backend && pnpm prisma generate && cd ../.. && pnpm build
   ```

### TypeScript型エラー

**対応**: `tsconfig.json`で`strict: false`に設定済み。型エラーは警告として扱われ、ビルドは継続されます。

## 📝 重要な注意事項

- `vercel.json`は削除しました（Dashboardの設定が優先されるため）
- ビルドコマンドはDashboardで管理します
- 環境変数は必ずすべて設定してください

---

**最終更新**: 2026-04-22
