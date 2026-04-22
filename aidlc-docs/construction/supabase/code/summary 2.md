# Code Generation サマリー — Unit 2: supabase

## 生成ファイル一覧

| ファイル                                | 種別         | 内容                                                                  |
| --------------------------------------- | ------------ | --------------------------------------------------------------------- |
| `packages/supabase/config.toml`         | 設定         | Supabase CLI プロジェクト設定（Edge Functions 無効化済み）            |
| `packages/supabase/migrations/.gitkeep` | 管理         | 空ディレクトリ保持用                                                  |
| `packages/supabase/seed.sql`            | データ       | 開発用シードデータ雛形（コメントのみ）                                |
| `packages/supabase/CODING_STANDARDS.md` | ドキュメント | 開発ワークフロー・マイグレーション規則・RLS パターン・Prisma 接続方式 |

## 完了条件チェック

- [x] ディレクトリ構成・設定ファイル生成
- [x] CODING_STANDARDS.md 生成
- [x] config.toml 雛形生成（Edge Functions 無効化・開発設定済み）
