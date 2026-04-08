# Project Structure and Coding Guidelines

## Purpose

この `structure.md` は、このリポジトリで想定するフロントエンドとバックエンドの構造、およびコードスタイル／命名規則を定義します。

想定スタック:

- フロントエンド: Vue.js 3 + TypeScript
- バックエンド: TypeScript

---

## 1. 推奨ディレクトリ構成（ポリレポ）

```
frontend-repo/
├── README.md
├── package.json
├── tsconfig.json
├── public/
├── src/
│   ├── components/
│   ├── composables/
│   ├── views/
│   ├── layouts/
│   ├── router/
│   ├── store/
│   ├── assets/
│   ├── styles/
│   ├── types/
│   └── tests/

backend-repo/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── dtos/
│   ├── utils/
│   ├── types/
│   └── tests/

tests/
```

### 1.1 役割

- `frontend-repo/`: Vue 3 + TypeScript のフロントエンドアプリケーション
- `backend-repo/`: TypeScript API / サーバーコード
- `tests/`: E2E や統合テストの高レベルテスト

---

## 1.2 DDD 優先の設計方針

- 各リポジトリはそれぞれ独立した境界コンテキストとして扱う
- バックエンドでは「Domain / Application / Infrastructure / Interface」のレイヤーを意識し、ドメインモデルとユースケースを中心に設計する
- フロントエンドでも単に UI を組み立てるのではなく、Use Case やドメイン状態を反映した設計を優先する
- `shared-repo` なし前提では、フロントとバックは API DTO を契約として連携し、共有ドメインライブラリに依存しない
- バックエンドの DTO はドメインモデルから変換し、フロントは受け取った DTO を自身のドメイン表現にマッピングする
- ドメインルール、集約ルート、ドメインサービスは明確に分離して管理する
- 可能であれば、ユースケースを表す `services/` や `usecases/` という層を設ける
- UI 側ではプレゼンテーションロジックを `composables/` や `store/` に分離し、ドメイン状態の責務を明確にする

---

## 2. ファイル命名規則

### 2.1 フロントエンド

- Vue コンポーネント: `PascalCase.vue`
  - 例: `UserProfileCard.vue`, `LoginForm.vue`
- Composition API composable: `useXxx.ts`
  - 例: `useAuth.ts`, `useFetchUser.ts`
- Vue store: `useXStore.ts`
  - 例: `useUserStore.ts`
- ビュー（ページ）: `PascalCase.vue`
  - 例: `HomeView.vue`, `SettingsView.vue`
- レイアウト: `PascalCase.vue`
  - 例: `DefaultLayout.vue`
- ルーター定義: `router.ts` または `index.ts`
- スタイル: `xxx.css`, `xxx.scss` など、必要に応じて `kebab-case`
- テストファイル: `xxx.spec.ts` または `xxx.spec.tsx`
  - 例: `LoginForm.spec.ts`
- 型定義: `xxx.ts` または `xxx.types.ts`
  - 例: `user.types.ts`

### 2.2 バックエンド

- モジュールファイル: `kebab-case.ts` または `camelCase.ts`
  - 例: `user.controller.ts`, `auth.service.ts`
- ルーティング: `user.routes.ts`, `auth.routes.ts`
- DTO/型定義: `xxx.dto.ts`, `xxx.types.ts`
  - 例: `create-user.dto.ts`, `api.types.ts`
- ミドルウェア: `xxx.middleware.ts`
  - 例: `auth.middleware.ts`
- テスト: `xxx.spec.ts`
  - 例: `user.service.spec.ts`

### 2.3 共有ファイル

- 共有型: `xxx.types.ts`
- Enum 定義: `xxx.enums.ts`
- ユーティリティ: `xxx.ts`

---

## 3. 命名規則

### 3.1 TypeScript コード全般

- 命名と構造はプロジェクト全体で一貫性を保つ
- 型定義は適切に整理し、必要に応じて `types/` や `dtos/` に分離する
- コードは可読性と保守性を優先する

### 3.2 Vue 固有ルール

- コンポーネントと機能ごとにファイルを整理する
- `defineProps` / `defineEmits` は型付きで使用する
- UI 要素のテスト属性は安定した命名を使う
- ロジックは可能な限り composable に切り出す

### 3.3 API / バックエンド

- HTTP レイヤー、ビジネスロジック、データアクセスは責務ごとに分離する
- API パスや環境変数の命名は一貫したプロジェクトスタイルを採用する
- 共有型や DTO は専用の `types/` / `dtos/` に整理する

---

## 4. Vue 3 + TypeScript の実装スタイル

### 4.1 コンポーネント構造

- 常に `<script setup lang="ts">` を使用する
- `defineProps` / `defineEmits` を型付きで使う
- コンポーネントは単一の責務に集中させる
- プレゼンテーショナルコンポーネントとロジックは分離する
- `setup()` 内のロジックはできるだけ composable に切り出す

### 4.2 型の扱い

- 可能な限り厳密な型を定義する
- API レスポンス型は DTO / types で整理する
- `unknown` を使う場合は型ガードで安全に処理する

### 4.3 テンプレート

- ロジックをテンプレート内に書きすぎない
- 単純な式ならテンプレートで書くが、複雑なロジックは `computed` / メソッドに移す
- `v-if` と `v-for` は同階層で混在しすぎないようにする

### 4.4 スタイル

- `<style scoped lang="scss">` を推奨
- グローバルスタイルは必要最小限にする
- BEM やユーティリティクラスを使う場合は一貫性を保つ

---

## 5. TypeScript バックエンドの実装スタイル

### 5.1 アーキテクチャ

- `controllers/` は HTTP レイヤーの受け口
- `services/` はビジネスロジック
- `repositories/` はデータ永続化や DB アクセス
- `routes/` でエンドポイントを定義し、コントローラーを接続
- `middlewares/` で共通処理を分離する
- `dtos/` でリクエスト/レスポンス型を定義する

### 5.2 関数・クラス

- シンプルな関数はサービスやユーティリティとして抽出する
- コントローラーは HTTP リクエスト/レスポンス変換に専念する
- ビジネスロジックはサービス層に置く

### 5.3 エラーハンドリング

- 例外は適切にキャッチし、HTTP レスポンスにマッピングする
- `try/catch` でエラーを握りつぶさない
- カスタムエラー型を使い、エラー判定を明確にする

### 5.4 設定と環境

- 設定値は `process.env` から安全に取得する
- 必要な環境変数は起動前に検証する
- `config/` や `env.ts` で構成情報をまとめる

---

## 6. テスト規約

### 6.1 ファイル配置

- フロントエンドユニットテスト: `src/frontend/tests/`
- バックエンドユニットテスト: `src/backend/tests/`
- テストファイル名: `xxx.spec.ts`

### 6.2 テストスタイル

- `describe()` / `it()` を使う
- テストは小さな単位で書く
- `setup` と `cleanup` を明示的に行う
- モックは必要最小限にとどめ、振る舞いを明確にする

---

## 7. 共通ルール

### 7.1 コード品質

- コードは一貫したフォーマットとスタイルで記述する
- 静的解析や型チェックを活用して品質を保つ
- CI で品質チェックを行うことを推奨する

### 7.2 ドキュメント

- 新しい機能追加時は `README.md` か `structure.md` に構造変更を追記する
- API は必要に応じて `docs/` にサマリを残す

### 7.3 一貫性

- 一度決めた命名規則やファイル構造はプロジェクト全体で維持する
- フロントとバックで共有する型は `src/shared/types/` にまとめる
- 既存スタイルに合わせる場合は、明確な差分理由をドキュメント化する

---

## 8. 追加の命名例

### UI 要素の `data-testid`

- `login-form-submit-button`
- `user-list-search-input`
- `profile-card-edit-button`

### API クラス / 関数

- `UserController`
- `AuthService`
- `UserRepository`
- `createUserDto`

### イベント / プロパティ

- `isLoading`
- `userProfile`
- `onSubmit`
- `fetchUserData`

---

## 9. 生成ルールとの整合性

AI-DLC ルールファイルでは、UI 用の自動テスト属性について以下を推奨しています:

- `data-testid` は `component-element-role` 形式
- ID は動的に変わるものを避ける

この `structure.md` は、Vue 3 + TypeScript フロントエンドと TypeScript バックエンドの実装構造および命名規則を具体化するための補完資料です。
