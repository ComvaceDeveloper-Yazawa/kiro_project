# ドメインエンティティ定義 - Unit 3: backend

## エンティティ設計の原則

- エンティティは不変条件（invariant）を自身で保証する
- 不正な状態のエンティティは生成できない（`static create()` ファクトリメソッドで制御）
- エンティティは Prisma の型に依存しない（Infrastructure 層で変換する）

---

## AppError 階層（確定）

```typescript
// src/domain/errors/app.error.ts

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "リソースが見つかりません") {
    super("NOT_FOUND", message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "入力値が正しくありません") {
    super("VALIDATION_ERROR", message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "認証が必要です") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "アクセス権限がありません") {
    super("FORBIDDEN", message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "リソースが既に存在します") {
    super("CONFLICT", message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "サーバーエラーが発生しました") {
    super("INTERNAL_SERVER_ERROR", message, 500);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "サービスが一時的に利用できません") {
    super("SERVICE_UNAVAILABLE", message, 503);
  }
}
```

---

## リソースエンティティのテンプレート

新しいリソースを追加するときのテンプレートです。

```typescript
// src/domain/{resource}/entities/{resource}.entity.ts

export interface {Resource}Props {
  id: string;
  // リソース固有のフィールド
  createdAt: Date;
  updatedAt: Date;
}

export class {Resource}Entity {
  private constructor(private readonly props: {Resource}Props) {}

  // ファクトリメソッド（不変条件チェック）
  static create(props: {Resource}Props): {Resource}Entity {
    // 不変条件の検証
    if (!props.id) {
      throw new ValidationError('ID は必須です');
    }
    // リソース固有のバリデーション
    return new {Resource}Entity(props);
  }

  // ゲッター
  get id(): string { return this.props.id; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  // プレーンオブジェクトへの変換（レスポンス用）
  toPlainObject(): {Resource}Props {
    return { ...this.props };
  }
}
```

---

## リポジトリインターフェースのテンプレート

```typescript
// src/domain/{resource}/repositories/{resource}.repository.ts

export interface {Resource}Repository {
  findById(id: string): Promise<{Resource}Entity | null>;
  findAll(filter?: {Resource}Filter): Promise<{Resource}Entity[]>;
  save(entity: {Resource}Entity): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface {Resource}Filter {
  // フィルタリング条件（リソース固有）
  limit?: number;
  offset?: number;
}
```

---

## Prisma リポジトリ実装のテンプレート

```typescript
// src/infrastructure/prisma/{resource}/{resource}.repository.impl.ts

import type { FastifyInstance } from 'fastify';
import type { {Resource}Repository, {Resource}Filter } from '../../../domain/{resource}/repositories/{resource}.repository';
import { {Resource}Entity } from '../../../domain/{resource}/entities/{resource}.entity';
import { ServiceUnavailableError } from '../../../domain/errors/app.error';

export class Prisma{Resource}Repository implements {Resource}Repository {
  constructor(private readonly fastify: FastifyInstance) {}

  async findById(id: string): Promise<{Resource}Entity | null> {
    try {
      const record = await this.fastify.prisma.{resource}.findUnique({
        where: { id },
      });
      if (!record) return null;
      return {Resource}Entity.create(record);
    } catch (error) {
      throw new ServiceUnavailableError('データベースへの接続に失敗しました');
    }
  }

  async findAll(filter?: {Resource}Filter): Promise<{Resource}Entity[]> {
    try {
      const records = await this.fastify.prisma.{resource}.findMany({
        take: filter?.limit,
        skip: filter?.offset,
      });
      return records.map((r) => {Resource}Entity.create(r));
    } catch (error) {
      throw new ServiceUnavailableError('データベースへの接続に失敗しました');
    }
  }

  async save(entity: {Resource}Entity): Promise<void> {
    try {
      const data = entity.toPlainObject();
      await this.fastify.prisma.{resource}.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    } catch (error) {
      throw new ServiceUnavailableError('データベースへの接続に失敗しました');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.fastify.prisma.{resource}.delete({ where: { id } });
    } catch (error) {
      throw new ServiceUnavailableError('データベースへの接続に失敗しました');
    }
  }
}
```

---

## ユースケースのテンプレート

```typescript
// src/usecases/{resource}/create-{resource}.usecase.ts

import type { Create{Resource}Input, {Resource}Type } from '@monorepo/shared';
import type { {Resource}Repository } from '../../domain/{resource}/repositories/{resource}.repository';
import { {Resource}Entity } from '../../domain/{resource}/entities/{resource}.entity';
import { randomUUID } from 'crypto';

export class Create{Resource}Usecase {
  constructor(
    private readonly {resource}Repository: {Resource}Repository,
  ) {}

  async execute(input: Create{Resource}Input): Promise<{Resource}Type> {
    const entity = {Resource}Entity.create({
      id: randomUUID(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.{resource}Repository.save(entity);

    return entity.toPlainObject();
  }
}
```

---

## auth.plugin.ts の型拡張

```typescript
// src/plugins/auth.plugin.ts

import type { FastifyPluginAsync } from "fastify";
import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError } from "../domain/errors/app.error";

// Fastify の型拡張
declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    };
  }
}

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    const token = authHeader.slice(7);
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedError();
    }

    request.user = {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  });
};
```

---

## db.plugin.ts の型拡張

```typescript
// src/plugins/db.plugin.ts

import type { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

// Fastify の型拡張
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};
```

---

## 新しいリソースを追加する手順

1. `src/domain/{resource}/entities/{resource}.entity.ts` — エンティティ定義
2. `src/domain/{resource}/repositories/{resource}.repository.ts` — リポジトリ I/F 定義
3. `src/infrastructure/prisma/{resource}/{resource}.repository.impl.ts` — Prisma 実装
4. `src/usecases/{resource}/` — ユースケース群（create/get/list/update/delete）
5. `src/routes/{resource}/{resource}.route.ts` — ルート定義
6. `src/plugins/routes.plugin.ts` に新ルートを登録
7. `packages/shared/src/schemas/domain/{resource}/` に Zod スキーマを追加
