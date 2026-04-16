# コンポーネント依存関係

## パッケージ間依存関係

```
shared
  ^         ^
  |         |
backend   frontend
  ^
  |
supabase（マイグレーション・スキーマ定義）
```

### ルール

- `shared` は他パッケージに依存しない（依存の起点）
- `backend` は `shared` にのみ依存
- `frontend` は `shared` にのみ依存
- `backend` と `frontend` は互いに依存しない
- `supabase` パッケージはアプリコードに依存しない（CLI 管理のみ）

---

## backend 内レイヤー依存関係

```
routes（Interface 層）
  └── usecases（Application 層）
        └── domain（Domain 層）
              └── infrastructure（Infrastructure 層）
```

### 依存方向のルール（依存性逆転の原則）

| 依存元         | 依存先                      | 方法                           |
| -------------- | --------------------------- | ------------------------------ |
| routes         | usecases                    | 直接インポート                 |
| usecases       | domain entities             | 直接インポート                 |
| usecases       | domain repository interface | インターフェースに依存         |
| infrastructure | domain repository interface | インターフェースを実装         |
| routes         | domain errors               | 直接インポート（エラー型判定） |

**禁止事項:**

- domain 層が infrastructure 層をインポートすること
- domain 層が routes 層をインポートすること
- usecases 層が Prisma を直接インポートすること

---

## frontend 内依存関係

```
views/
  └── components/（UI コンポーネント）
  └── composables/api/（API 通信）
        └── useApiClient（共通 fetch ラッパー）
  └── composables/（ビジネスロジック・バリデーション）
  └── stores/（永続状態）
        └── composables/api/（store が API composable を呼び出す場合）
router/
  └── stores/useAuthStore（ナビゲーションガード）
```

### 依存方向のルール

| 依存元          | 依存先          | 説明                                 |
| --------------- | --------------- | ------------------------------------ |
| views           | components      | UI 組み立て                          |
| components      | composables     | ビジネスロジック・バリデーション委譲 |
| views           | composables     | ビジネスロジック利用                 |
| views           | stores          | 状態参照                             |
| composables/api | useApiClient    | fetch ラッパー経由で通信             |
| stores          | composables/api | 必要に応じて API 呼び出し            |
| router          | useAuthStore    | 認証状態チェック                     |

**禁止事項:**

- components が stores を直接参照すること（composables 経由）
- composables/api が stores を参照すること（循環依存防止）
- components にビジネスロジックを直接書くこと（composables に委譲）

---

## shared との依存関係

```
shared/schemas/
  ├── api/          → backend の routes 層・frontend の composables/api で使用
  └── domain/       → backend の domain 層・usecases 層で使用
```

### 型の流れ

```
shared（Zod スキーマ定義）
  ↓ z.infer<typeof Schema>
backend routes（リクエスト検証）
  ↓ 検証済み型
usecases（ユースケース入力型）
  ↓ エンティティ変換
domain entities

shared（Zod スキーマ定義）
  ↓ z.infer<typeof Schema>
frontend composables/api（API 呼び出し型）
  ↓ レスポンス型
stores / views
```

---

## データフロー（リクエスト〜レスポンス）

### バックエンド

```
HTTP Request
  → routes（Zod バリデーション）
  → usecase.execute(validatedInput)
  → domain entity 生成・ビジネスルール適用
  → repository.save(entity)
  → Prisma（DB 書き込み）
  → entity → response 型変換
  → ApiResponse<T> として返却
```

### フロントエンド

```
User Action（View/Component）
  → composable（UI ロジック）
  → composables/api（fetch 呼び出し）
  → useApiClient（認証ヘッダー付与・エラーハンドリング）
  → HTTP Request → backend
  → ApiResponse<T> 受信
  → store に保存 or View に直接返却
  → UI 更新
```

---

## 循環依存防止ルール

1. `shared` は何にも依存しない
2. `backend` ↔ `frontend` の相互依存禁止
3. backend 内: domain 層は上位層（routes/usecases）を知らない
4. frontend 内: `composables/api` は `stores` を参照しない
5. frontend 内: `components` は `stores` を直接参照しない（親 View 経由）
