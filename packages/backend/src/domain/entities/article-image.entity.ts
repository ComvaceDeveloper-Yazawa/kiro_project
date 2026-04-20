export class ArticleImage {
  constructor(
    public readonly id: string,
    public readonly articleId: string,
    public readonly storagePath: string,
    public readonly url: string,
    public readonly createdAt: Date,
  ) {}

  static create(articleId: string, storagePath: string, url: string): ArticleImage {
    return new ArticleImage(crypto.randomUUID(), articleId, storagePath, url, new Date());
  }

  belongsToArticle(articleId: string): boolean {
    return this.articleId === articleId;
  }
}
