import { randomUUID } from 'crypto';
import type { Tag } from './tag.entity';

export class Article {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public readonly authorId: string,
    public isPublished: boolean,
    public publishedAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public tags: Tag[],
    public nextArticleId: string | null = null,
    public nextArticle?: { id: string; title: string } | null,
  ) {}

  static create(
    title: string,
    content: string,
    authorId: string,
    tags: Tag[] = [],
    nextArticleId: string | null = null,
  ): Article {
    const now = new Date();
    return new Article(
      randomUUID(),
      title,
      content,
      authorId,
      false, // 初期状態は下書き
      null,
      now,
      now,
      tags,
      nextArticleId,
    );
  }

  publish(): void {
    if (this.isPublished) {
      throw new Error('記事は既に公開されています');
    }
    this.isPublished = true;
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  unpublish(): void {
    if (!this.isPublished) {
      throw new Error('記事は既に非公開です');
    }
    this.isPublished = false;
    this.publishedAt = null;
    this.updatedAt = new Date();
  }

  update(title: string, content: string, tags: Tag[], nextArticleId: string | null = null): void {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.nextArticleId = nextArticleId;
    this.updatedAt = new Date();
  }

  canBeModifiedBy(userId: string): boolean {
    return this.authorId === userId;
  }

  isAccessibleBy(userId: string | null): boolean {
    // 公開記事は誰でもアクセス可能
    if (this.isPublished) {
      return true;
    }
    // 下書きは作成者のみアクセス可能
    return userId !== null && this.authorId === userId;
  }
}
