import { defineWorkspace } from 'vitest/config';

/**
 * vitest ワークスペース設定
 *
 * pnpm test:all でモノレポ全パッケージのテストを一括実行する。
 * 各パッケージの vitest.config.ts / vite.config.ts の設定を継承する。
 */
export default defineWorkspace(['packages/shared', 'packages/backend', 'packages/frontend']);
