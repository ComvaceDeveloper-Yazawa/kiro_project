# Units of Work ストーリーマップ

## 概要

このプロジェクトはユーザー向け機能開発ではなく「開発基盤・標準整備」が目的のため、
従来のユーザーストーリー（User Stories フェーズ）はスキップしています。

代わりに、要件定義書（FR-01〜07）の各機能要件を「開発タスク」として各ユニットにマッピングします。

---

## 要件 → ユニット マッピング

| 要件ID | 要件名                 | 担当ユニット                                       | 成果物                                                      |
| ------ | ---------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| FR-01  | ディレクトリ構成       | 全ユニット                                         | 各パッケージのディレクトリ構成・tree                        |
| FR-02  | shared 設計            | Unit 1: shared                                     | CODING_STANDARDS.md・index.ts                               |
| FR-03  | コーディング規約       | Unit 3: backend / Unit 4: frontend                 | CODING_STANDARDS.md（各パッケージ）                         |
| FR-04  | ESLint / Prettier 方針 | Unit 3: backend / Unit 4: frontend                 | .eslintrc.cjs・.prettierrc・CODING_STANDARDS.md             |
| FR-05  | テスト方針             | Unit 3: backend / Unit 4: frontend / Unit 5: ci-cd | vitest.config.ts・CODING_STANDARDS.md・playwright.config.ts |
| FR-06  | SCSS 運用ルール        | Unit 4: frontend                                   | styles/・CODING_STANDARDS.md                                |
| FR-07  | アーキテクチャ責務整理 | Unit 3: backend                                    | CODING_STANDARDS.md（責務整理セクション）                   |

---

## 非機能要件 → ユニット マッピング

| 要件ID | 要件名                          | 担当ユニット                       | 成果物                                                 |
| ------ | ------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| NFR-01 | テストカバレッジ 100%           | Unit 3: backend / Unit 4: frontend | vitest.config.ts（coverage 設定）・CODING_STANDARDS.md |
| NFR-02 | セキュリティ（SECURITY-01〜15） | Unit 3: backend / Unit 4: frontend | CODING_STANDARDS.md（セキュリティセクション）          |
| NFR-03 | CI/CD（GitHub Actions）         | Unit 5: ci-cd                      | lint-test.yml・deploy.yml                              |
| NFR-04 | Prisma 接続方式                 | Unit 2: supabase / Unit 3: backend | config.toml・CODING_STANDARDS.md・schema.prisma        |
| NFR-05 | Vue Router SPA                  | Unit 4: frontend                   | router/index.ts・routes.ts                             |
| NFR-06 | Edge Functions 不使用           | Unit 2: supabase                   | CODING_STANDARDS.md（方針記載）                        |

---

## ユニット別タスク一覧

### Unit 1: shared

| タスク                                            | 対応要件 | 優先度 |
| ------------------------------------------------- | -------- | ------ |
| ディレクトリ構成・tsconfig・package.json 生成     | FR-01    | 必須   |
| Zod スキーマ配置ルール定義（CODING_STANDARDS.md） | FR-02    | 必須   |
| API 型定義方法の文書化                            | FR-02    | 必須   |
| 循環依存防止ルールの文書化                        | FR-02    | 必須   |
| 空の index.ts 生成                                | FR-01    | 必須   |

### Unit 2: supabase

| タスク                                                  | 対応要件              | 優先度 |
| ------------------------------------------------------- | --------------------- | ------ |
| config.toml 雛形生成                                    | NFR-04                | 必須   |
| マイグレーション命名規則の文書化（CODING_STANDARDS.md） | FR-07                 | 必須   |
| RLS ポリシーの書き方文書化                              | NFR-02（SECURITY-06） | 必須   |
| Direct / Pooler 接続方式の文書化                        | NFR-04                | 必須   |
| Edge Functions 不使用方針の文書化                       | NFR-06                | 必須   |

### Unit 3: backend

| タスク                                               | 対応要件      | 優先度 |
| ---------------------------------------------------- | ------------- | ------ |
| ディレクトリ構成・設定ファイル一式生成               | FR-01         | 必須   |
| DDD 4層コーディング規約文書化（CODING_STANDARDS.md） | FR-03・FR-07  | 必須   |
| ESLint all ベース設定（.eslintrc.cjs）生成           | FR-04         | 必須   |
| Prettier 設定（.prettierrc）生成                     | FR-04         | 必須   |
| Vitest 設定（vitest.config.ts・coverage 100%）生成   | FR-05・NFR-01 | 必須   |
| AppError クラス定義生成                              | FR-03         | 必須   |
| Prisma 空スキーマ生成                                | NFR-04        | 必須   |
| セキュリティ対応方針文書化（SECURITY-01〜15）        | NFR-02        | 必須   |

### Unit 4: frontend

| タスク                                              | 対応要件      | 優先度 |
| --------------------------------------------------- | ------------- | ------ |
| ディレクトリ構成・設定ファイル一式生成              | FR-01         | 必須   |
| Vue 3 コーディング規約文書化（CODING_STANDARDS.md） | FR-03         | 必須   |
| ESLint all ベース設定（.eslintrc.cjs）生成          | FR-04         | 必須   |
| Prettier 設定（.prettierrc）生成                    | FR-04         | 必須   |
| Vitest 設定（vitest.config.ts・coverage 100%）生成  | FR-05・NFR-01 | 必須   |
| SCSS 変数・mixin・リセット・グローバル CSS 生成     | FR-06         | 必須   |
| SCSS 運用ルール文書化（SMACSS ベース）              | FR-06         | 必須   |
| useApiClient.ts 雛形生成                            | FR-01         | 必須   |
| useAuthStore.ts 雛形生成（Setup 記法）              | FR-01         | 必須   |
| Vue Router 設定・ナビゲーションガード雛形生成       | NFR-05        | 必須   |

### Unit 5: ci-cd

| タスク                                      | 対応要件 | 優先度 |
| ------------------------------------------- | -------- | ------ |
| lint-test.yml 生成（PR 時 Lint + Vitest）   | NFR-03   | 必須   |
| deploy.yml 生成（main マージ時デプロイ）    | NFR-03   | 必須   |
| Playwright 設定（playwright.config.ts）生成 | FR-05    | 必須   |
| E2E テスト方針文書化（CODING_STANDARDS.md） | FR-05    | 必須   |

---

## 完了基準

全ユニットの以下が揃った状態を「Units Generation 完了」とします:

- [ ] 各パッケージのディレクトリ構成が確定している
- [ ] 各パッケージに CODING_STANDARDS.md が存在する
- [ ] 設定ファイル（ESLint・Prettier・Vitest・tsconfig 等）の雛形が存在する
- [ ] 依存関係が unit-of-work-dependency.md に記録されている
- [ ] 全要件（FR-01〜07・NFR-01〜06）がいずれかのユニットにマッピングされている
