# E2E テスト手順（Playwright）

## テスト対象

主要フローのみを対象とします。

| フロー                             | 優先度               |
| ---------------------------------- | -------------------- |
| ホームページの表示                 | 高                   |
| 認証フロー（ログイン・ログアウト） | 高（認証機能実装後） |
| コアユーザーフロー                 | 中（機能実装後）     |

---

## 1. ローカルでの実行

```bash
# frontend dev サーバーを起動（別ターミナル）
pnpm dev:frontend

# E2E テストを実行（Playwright が自動でブラウザを起動）
pnpm test:e2e
```

---

## 2. UI モードで実行（デバッグ用）

```bash
pnpm --filter @monorepo/e2e test:ui
```

ブラウザで Playwright の UI が開き、テストをステップ実行できます。

---

## 3. ヘッドフルモードで実行（ブラウザを表示）

```bash
pnpm --filter @monorepo/e2e test:headed
```

---

## 4. テストレポートの確認

```bash
pnpm --filter @monorepo/e2e report
```

`packages/e2e/playwright-report/index.html` がブラウザで開きます。

---

## 5. 新しい E2E テストの追加

```typescript
// packages/e2e/tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("認証フロー", () => {
  test("ログインできる", async ({ page }) => {
    await page.goto("/login");

    // data-testid セレクターを使用
    await page.getByTestId("login-form-email-input").fill("test@example.com");
    await page.getByTestId("login-form-password-input").fill("password");
    await page.getByTestId("login-form-submit-button").click();

    // ログイン後のリダイレクトを確認
    await expect(page).toHaveURL("/");
  });

  test("ログアウトできる", async ({ page }) => {
    // 認証済み状態でテスト開始
    await page.goto("/");
    await page.getByTestId("header-logout-button").click();
    await expect(page).toHaveURL("/login");
  });
});
```

---

## 6. CI での実行

`deploy.yml` の E2E ジョブが main マージ時に自動実行されます。

必要な GitHub Secrets:

- `STAGING_URL` — E2E テストの対象 URL
- `VITE_API_BASE_URL` / `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — frontend ビルド用

失敗時は `playwright-report` アーティファクトをダウンロードして確認できます。
