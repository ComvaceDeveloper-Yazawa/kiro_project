# ビルド手順

## 前提条件

| 項目    | 要件                                 |
| ------- | ------------------------------------ |
| Node.js | v20 以上                             |
| pnpm    | v9 以上                              |
| OS      | macOS / Linux / Windows（WSL2 推奨） |

---

## 1. 初回セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd <repository-name>

# 依存関係をインストール（全パッケージ一括）
pnpm install
```

---

## 2. 環境変数の設定

各パッケージの `.env.example` をコピーして `.env` / `.env.local` を作成します。

```bash
# backend
cp packages/backend/.env.example packages/backend/.env

# frontend
cp packages/frontend/.env.example packages/frontend/.env.local
```

`.env` / `.env.local` に実際の値を設定してください（`.gitignore` に含まれています）。

---

## 3. Prisma セットアップ

```bash
# Prisma クライアントを生成
pnpm db:generate

# マイグレーションを実行（DATABASE_URL に Direct URL を設定してから実行）
pnpm db:migrate
```

---

## 4. 全パッケージをビルド

```bash
# shared → backend → frontend の順でビルド
pnpm build
```

個別にビルドする場合:

```bash
pnpm --filter @monorepo/shared build
pnpm --filter @monorepo/backend build
pnpm --filter @monorepo/frontend build
```

---

## 5. ビルド成果物の確認

| パッケージ          | 成果物                           |
| ------------------- | -------------------------------- |
| `packages/shared`   | `packages/shared/dist/`          |
| `packages/backend`  | `packages/backend/dist/index.js` |
| `packages/frontend` | `packages/frontend/dist/`        |

---

## 6. 開発サーバーの起動

```bash
# backend（ポート 3000）
pnpm dev:backend

# frontend（ポート 5173）
pnpm dev:frontend
```

---

## トラブルシューティング

### `pnpm install` が失敗する

- Node.js / pnpm のバージョンを確認してください
- `node_modules` を削除して再実行: `rm -rf node_modules packages/*/node_modules && pnpm install`

### `prisma generate` が失敗する

- `DATABASE_URL` 環境変数が設定されているか確認してください
- `packages/backend/.env` が存在するか確認してください

### TypeScript のビルドエラー

- `pnpm --filter @monorepo/shared build` を先に実行してください（他パッケージが依存）
