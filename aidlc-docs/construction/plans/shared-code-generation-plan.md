# Code Generation 計画 - Unit 1: shared

## ユニット概要

- **目的**: フロント・バック共通の Zod スキーマと推論型を提供
- **生成場所**: `packages/shared/`（ワークスペースルート配下）
- **依存**: なし（他全ユニットがこのユニットに依存）

## 実行チェックリスト

### Part 1: プロジェクト構造セットアップ

- [x] Step 1: `packages/shared/` ディレクトリ構成作成
- [x] Step 2: `packages/shared/package.json` 生成
- [x] Step 3: `packages/shared/tsconfig.json` 生成
- [x] Step 4: `packages/shared/src/index.ts` 生成（空のエントリポイント）

### Part 2: API スキーマ生成

- [x] Step 5: `packages/shared/src/schemas/api/response.schema.ts` 生成（ApiResponse<T>）
- [x] Step 6: `packages/shared/src/schemas/api/error.schema.ts` 生成（ErrorCode）

### Part 3: ドキュメント生成

- [x] Step 7: `packages/shared/CODING_STANDARDS.md` 生成
- [x] Step 8: `aidlc-docs/construction/shared/code/summary.md` 生成（コードサマリー）

## ステップ詳細

### Step 1: ディレクトリ構成

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── api/
│   │   └── domain/       # 空（リソース追加時に使用）
│   └── index.ts
├── package.json
├── tsconfig.json
└── CODING_STANDARDS.md
```

### Step 2: package.json

- パッケージ名: `@monorepo/shared`
- main: `dist/index.js`
- types: `dist/index.d.ts`
- 依存: `zod` のみ

### Step 3: tsconfig.json

- strict: true
- target: ES2020
- module: ESNext
- moduleResolution: bundler

### Step 4: index.ts

- API スキーマの re-export
- ドメインスキーマのコメントアウトテンプレート

### Step 5: response.schema.ts

- `createApiSuccessSchema` ジェネリックファクトリ
- `ApiErrorSchema`
- `ApiSuccessResponse<T>` 型
- `ApiErrorResponse` 型
- `ApiResponse<T>` ユニオン型

### Step 6: error.schema.ts

- `ErrorCodeSchema`（z.enum）
- `ErrorCode` 型

### Step 7: CODING_STANDARDS.md

- Zod スキーマ命名規則
- ファイル分割ルール（操作ごと）
- 型エクスポートルール
- 循環依存防止ルール
- バリデーションメッセージ標準文言
- リソース追加手順

### Step 8: summary.md

- 生成ファイル一覧
- 使い方サンプル
