import { test, expect } from "@playwright/test";

/**
 * E2E テストのスキャフォールディング
 *
 * 実際のテストを追加するときは:
 * 1. 主要フローのみを対象にする（認証・コアユーザーフロー）
 * 2. data-testid セレクターを使用する（CSS クラスや DOM 構造に依存しない）
 * 3. テストは独立して実行できるようにする（前のテストの状態に依存しない）
 */

test("ホームページが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/App/);
});

// 認証フローのテンプレート
// test('ログインできる', async ({ page }) => {
//   await page.goto('/login');
//   await page.getByTestId('login-form-email-input').fill('test@example.com');
//   await page.getByTestId('login-form-password-input').fill('password');
//   await page.getByTestId('login-form-submit-button').click();
//   await expect(page).toHaveURL('/');
// });
