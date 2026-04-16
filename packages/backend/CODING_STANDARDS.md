# Backend コーディング規約

## アーキテクチャ: DDD 寄り 4 層

```
Interface 層   src/routes/ + src/plugins/ + src/hooks/
Application 層 src/usecases/
Domain 層      src/domain/
Infrastructure 層 src/infrastructure/
```

依存方向: Interface → Application → Domain ← Infrastructure
Domain 層は他の層に依存しない。

---

## 1. ファイル命名規則

| 種別             | 規則                             | 例                        |
| ---------------- | -------------------------------- | ------------------------- |
| ルート           | `{resource}.route.ts`            | `user.route.ts`           |
| ユースケース     | `{action}-{resource}.usecase.ts` | `create-user.usecase.ts`  |
| エンティティ     | `{resource}.entity.ts`           | `user.entity.ts`          |
| リポジトリ I/F   | `{resource}.repository.ts`       | `user.repository.ts`      |
| リポジトリ実装   | `{resource}.repository.impl.ts`  | `user.repository.impl.ts` |
| プラグイン       | `{name}.plugin.ts`               | `auth.plugin.ts`          |
| ドメインサービス | `{resource}.domain-service.ts`   | `user.domain-service.ts`  |

---

## 2. 命名規則

| 対象             | 規則                                       | 例                                 |
| ---------------- | ------------------------------------------ | ---------------------------------- |
| クラス           | PascalCase                                 | `CreateUserUsecase`                |
| インターフェース | PascalCase（I プレフィックスなし）         | `UserRepository`                   |
| 関数・変数       | camelCase                                  | `findById`, `userId`               |
| 定数             | UPPER_SNAKE_CASE                           | `MAX_RETRY_COUNT`                  |
| boolean 変数     | `is` / `has` / `can` プレフィックス        | `isAuthenticated`, `hasPermission` |
| 非同期関数       | `async` を明示、`Async` サフィックスは不要 | `async findById()`                 |

---

## 3. エラーハンドリング

| 推奨                                         | 非推奨                                   |
| -------------------------------------------- | ---------------------------------------- |
| AppError サブクラスを throw                  | `reply.status(404).send(...)` を直接呼ぶ |
| ドメイン層・ユースケース層でエラーを throw   | Interface 層でエラーを握りつぶす         |
| 外部サービス障害は `ServiceUnavailableError` | 全エラーを `InternalServerError` にする  |
| エラーメッセージは日本語・ユーザー向け       | スタックトレースをメッセージに含める     |

---

## 4. 非同期処理

| 推奨                             | 非推奨                               |
| -------------------------------- | ------------------------------------ |
| `async/await` を使用             | `.then().catch()` チェーン           |
| `try/catch` で外部呼び出しを囲む | 未処理の Promise rejection を放置    |
| `Promise.all` で並列処理         | 直列で書けるものを無理に並列化しない |

---

## 5. テスト方針（Vitest）

- カバレッジ目標: **100%**（`vitest --coverage`）
- 除外対象: `src/index.ts`（エントリポイント）、型定義のみのファイル
- テストファイル配置: `src/**/__tests__/{filename}.test.ts`
- ユニットテスト: ユースケース・ドメインエンティティ・エラークラスを優先
- インテグレーションテスト: ルートハンドラーは `fastify.inject()` で実施
- モック: Prisma は `vitest.mock` でモック、Supabase Auth は `SupabaseAuthService` をモック

```typescript
// ユースケーステストの例
import { describe, it, expect, vi } from "vitest";
import { CreateUserUsecase } from "../create-user.usecase";
import type { UserRepository } from "../../domain/user/repositories/user.repository";

describe("CreateUserUsecase", () => {
  it("正常系: ユーザーを作成して返す", async () => {
    const mockRepo: UserRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
    };
    const usecase = new CreateUserUsecase(mockRepo);
    // ...
  });
});
```

---

## 6. 新しいリソースを追加する手順

1. `packages/shared/src/schemas/domain/{resource}/` に Zod スキーマを追加
2. `src/domain/{resource}/entities/{resource}.entity.ts` — エンティティ定義
3. `src/domain/{resource}/repositories/{resource}.repository.ts` — リポジトリ I/F
4. `src/infrastructure/prisma/{resource}/{resource}.repository.impl.ts` — Prisma 実装
5. `src/usecases/{resource}/` — ユースケース群（create/get/list/update/delete）
6. `src/routes/{resource}/{resource}.route.ts` — ルート定義
7. `src/plugins/routes.plugin.ts` に新ルートを登録
8. `packages/supabase/migrations/` に RLS ポリシーを追加
9. `packages/backend/prisma/schema.prisma` にモデルを追加して `prisma migrate dev` を実行

---

## 7. セキュリティチェックリスト（新ルート追加時）

- [ ] 認証が必要なルートに `preHandler` で auth.plugin が適用されているか
- [ ] リソース所有者チェック（IDOR 防止）が実装されているか
- [ ] 全入力パラメータに Zod バリデーションが適用されているか
- [ ] エラーレスポンスにスタックトレース・内部情報が含まれていないか
- [ ] レート制限が適切に設定されているか
