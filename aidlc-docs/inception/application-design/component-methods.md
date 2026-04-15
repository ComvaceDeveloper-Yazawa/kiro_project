# コンポーネントメソッド定義

※ 詳細なビジネスルールは Construction フェーズの Functional Design で定義します。
ここではメソッドシグネチャと高レベルの目的を定義します。

---

## backend / Interface 層

### `hooks/error.handler.ts`

```typescript
// Fastify グローバルエラーハンドラー
// AppError のサブクラスを判定し、適切な HTTP ステータスと ApiResponse 形式に変換
setErrorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void
```

### `routes/{resource}.route.ts`

```typescript
// リソースルートの登録（Fastify プラグイン形式）
// 入力: Zod スキーマで検証済みリクエスト
// 出力: ApiResponse<T> 形式
async function {resource}Routes(fastify: FastifyInstance): Promise<void>
```

---

## backend / Application 層

### `usecases/{resource}/{action}.usecase.ts`

```typescript
// 単一ユースケースの実行
// 入力型は shared の Zod 推論型を使用
// トランザクション境界はここで管理
async execute(input: {ActionInput}): Promise<{ActionOutput}>
```

---

## backend / Domain 層

### `domain/{resource}/entities/{resource}.entity.ts`

```typescript
// エンティティ生成（不変条件チェック込み）
// 不正な状態では DomainError を throw
static create(props: {ResourceProps}): {Resource}Entity

// エンティティの値オブジェクト取得
get id(): string
get createdAt(): Date
// ... リソース固有のゲッター
```

### `domain/{resource}/repositories/{resource}.repository.ts`

```typescript
// リポジトリインターフェース（抽象）
// Infrastructure 層で実装
interface {Resource}Repository {
  findById(id: string): Promise<{Resource}Entity | null>
  findAll(filter?: {ResourceFilter}): Promise<{Resource}Entity[]>
  save(entity: {Resource}Entity): Promise<void>
  delete(id: string): Promise<void>
}
```

### `domain/errors/app.error.ts`

```typescript
// カスタムエラー階層
class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number
  )
}
class NotFoundError extends AppError      // 404
class ValidationError extends AppError   // 400
class UnauthorizedError extends AppError // 401
class ForbiddenError extends AppError    // 403
class ConflictError extends AppError     // 409
```

---

## backend / Infrastructure 層

### `infrastructure/prisma/{resource}.repository.impl.ts`

```typescript
// {Resource}Repository インターフェースの Prisma 実装
class Prisma{Resource}Repository implements {Resource}Repository {
  findById(id: string): Promise<{Resource}Entity | null>
  findAll(filter?: {ResourceFilter}): Promise<{Resource}Entity[]>
  save(entity: {Resource}Entity): Promise<void>
  delete(id: string): Promise<void>
}
```

### `infrastructure/supabase/auth.service.ts`

```typescript
// Supabase Auth JWT 検証
verifyToken(token: string): Promise<SupabaseUser>
// ユーザー情報取得
getUser(userId: string): Promise<SupabaseUser | null>
```

---

## frontend / API 通信層

### `composables/api/useApiClient.ts`

```typescript
// 共通 fetch ラッパー
// 認証ヘッダー自動付与・ApiResponse<T> 型変換・エラーハンドリング
function useApiClient(): {
  get<T>(path: string): Promise<ApiResponse<T>>;
  post<T>(path: string, body: unknown): Promise<ApiResponse<T>>;
  put<T>(path: string, body: unknown): Promise<ApiResponse<T>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
};
```

### `composables/api/use{Resource}Api.ts`

```typescript
// リソースごとの API 操作
// 入力型・出力型は shared の Zod 推論型を使用
function use{Resource}Api(): {
  fetch{Resource}(id: string): Promise<{Resource}Type>
  fetch{Resource}List(filter?: {ResourceFilter}): Promise<{Resource}Type[]>
  create{Resource}(input: Create{Resource}Input): Promise<{Resource}Type>
  update{Resource}(id: string, input: Update{Resource}Input): Promise<{Resource}Type>
  delete{Resource}(id: string): Promise<void>
}
```

### `composables/useAuth.ts`

```typescript
// Supabase Auth セッション管理
function useAuth(): {
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  onAuthStateChange(callback: (session: Session | null) => void): void;
};
```

---

## frontend / 状態管理層（Pinia Setup 記法）

### `stores/use{Resource}Store.ts`

```typescript
// Setup 記法（defineStore with setup function）
export const use{Resource}Store = defineStore('{resource}', () => {
  // state
  const items = ref<{Resource}Type[]>([])
  const currentItem = ref<{Resource}Type | null>(null)
  const isLoading = ref(false)

  // actions
  async function loadItems(): Promise<void>
  async function loadItem(id: string): Promise<void>
  function reset(): void

  return { items, currentItem, isLoading, loadItems, loadItem, reset }
})
```

### `stores/useAuthStore.ts`

```typescript
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  async function initialize(): Promise<void>; // アプリ起動時のセッション復元
  async function signIn(email: string, password: string): Promise<void>;
  async function signOut(): Promise<void>;

  return { user, isAuthenticated, initialize, signIn, signOut };
});
```

---

## frontend / ルーティング

### `router/index.ts`

```typescript
// ナビゲーションガード（認証チェック）
// meta.requiresAuth: true のルートは未認証時にログインページへリダイレクト
router.beforeEach(async (to, from): Promise<RouteLocationRaw | boolean>)
```
