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
    public tags: string[],
  ) {}

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

  update(title: string, content: string, tags: string[]): void {
    this.title = title;
    this.content = content;
    this.tags = tags;
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
