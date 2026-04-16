# ユニットテスト実行手順

## テスト方針

- フレームワーク: **Vitest**
- カバレッジ目標: **100%**（厳格運用）
- 除外対象: エントリポイント（`src/index.ts` / `src/main.ts`）、型定義のみのファイル

---

## 1. 全パッケージのテストを実行

```bash
pnpm test
```

---

## 2. パッケージ別に実行

```bash
# shared
pnpm --filter @monorepo/shared test

# backend
pnpm --filter @monorepo/backend test

# frontend
pnpm --filter @monorepo/frontend test
```

---

## 3. カバレッジレポートを生成

```bash
# backend
pnpm --filter @monorepo/backend test:coverage

# frontend
pnpm --filter @monorepo/frontend test:coverage
```

レポートは各パッケージの `coverage/` ディレクトリに生成されます。

---

## 4. ウォッチモード（開発中）

```bash
pnpm --filter @monorepo/backend test:watch
pnpm --filter @monorepo/frontend test:watch
```

---

## 5. テスト作成ガイドライン

### backend（Vitest）

```typescript
// src/domain/errors/__tests__/app.error.test.ts
import { describe, it, expect } from "vitest";
import { NotFoundError, ValidationError } from "../app.error";

describe("AppError", () => {
  it("NotFoundError は statusCode 404 を持つ", () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });
});
```

```typescript
// ルートテスト（fastify.inject を使用）
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildApp } from "../../app";

describe("GET /health", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("200 を返す", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
  });
});
```

### frontend（Vitest + @vue/test-utils）

```typescript
// src/composables/__tests__/useAuth.test.ts
import { describe, it, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初期状態では未認証", () => {
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(false);
  });
});
```

---

## 6. カバレッジ 100% の現実的な運用

### 除外設定（vitest.config.ts）

```typescript
coverage: {
  exclude: [
    "src/main.ts", // エントリポイント
    "src/index.ts", // エントリポイント
    "**/*.d.ts", // 型定義のみ
    "src/env.d.ts", // 環境変数型定義
    "**/__tests__/**", // テストファイル自体
  ];
}
```

### カバレッジが 100% にならない場合

1. `/* v8 ignore next */` コメントで意図的に除外（例: 到達不能コード）
2. テストが難しいコードは設計を見直す（テスタビリティの問題）
3. 外部サービス依存は `vi.mock` でモックする
