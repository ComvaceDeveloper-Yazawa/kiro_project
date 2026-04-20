# Commit Message Convention

このプロジェクトでは、明確で一貫性のあるコミットメッセージを維持するために、以下の規約に従います。

## フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（必須）

コミットの種類を示します：

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響しない変更（空白、フォーマット、セミコロンなど）
- **refactor**: バグ修正や機能追加を伴わないコードの変更
- **perf**: パフォーマンス改善
- **test**: テストの追加や修正
- **chore**: ビルドプロセスやツールの変更
- **ci**: CI/CD 設定の変更
- **build**: ビルドシステムや依存関係の変更
- **revert**: 以前のコミットの取り消し

### Scope（オプション）

変更の影響範囲を示します：

- **tech-blog**: 技術ブログ機能
- **backend**: バックエンド
- **frontend**: フロントエンド
- **shared**: 共有パッケージ
- **supabase**: Supabase 設定
- **e2e**: E2E テスト
- **ci-cd**: CI/CD

### Subject（必須）

- 変更内容を簡潔に記述（50文字以内推奨）
- 命令形を使用（例: "add" not "added" or "adds"）
- 最初の文字は小文字
- 末尾にピリオドを付けない

### Body（オプション）

- 変更の理由や詳細を記述
- 72文字で改行

### Footer（オプション）

- Breaking changes や Issue への参照を記述
- 例: `Closes #123`, `BREAKING CHANGE: ...`

## 例

### 新機能追加

```
feat(tech-blog): add article creation API

- POST /api/articles endpoint
- Zod validation for article input
- RLS policy enforcement

Closes #45
```

### バグ修正

```
fix(backend): resolve Prisma connection timeout

The connection pool was exhausted under high load.
Increased pool size from 10 to 20.

Fixes #78
```

### ドキュメント更新

```
docs(readme): update setup instructions

Add Supabase configuration steps
```

### リファクタリング

```
refactor(frontend): extract article card component

Improve code reusability and maintainability
```

### テスト追加

```
test(tech-blog): add property-based tests for article validation

Implement Property 1: article validation with fast-check
```

### データベースマイグレーション

```
feat(supabase): add articles table and RLS policies

- Create articles, tags, article_tags, article_images tables
- Add RLS policies for access control
- Configure Storage bucket for images
```

## Breaking Changes

Breaking changes は以下のように記述します：

```
feat(backend): change API response format

BREAKING CHANGE: API responses now use ApiResponse<T> wrapper.
All clients must update to handle the new format.

Before:
{ id: "123", title: "..." }

After:
{ success: true, data: { id: "123", title: "..." } }
```

## Revert

以前のコミットを取り消す場合：

```
revert: feat(tech-blog): add article creation API

This reverts commit abc123def456.
Reason: Performance regression detected.
```

## ツール

コミットメッセージの検証には [commitlint](https://commitlint.js.org/) を使用することを推奨します。

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```
