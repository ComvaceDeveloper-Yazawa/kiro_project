import { Article } from '../entities/article.entity';

export class MarkdownPrinterService {
  /**
   * 記事エンティティをMarkdown形式で出力する
   */
  print(article: Article): string {
    const lines: string[] = [];

    // タイトル
    lines.push(`# ${article.title}`);
    lines.push('');

    // メタデータ
    lines.push('---');
    lines.push(`作成者ID: ${article.authorId}`);
    lines.push(`作成日: ${article.createdAt.toISOString()}`);
    lines.push(`更新日: ${article.updatedAt.toISOString()}`);
    lines.push(`公開状態: ${article.isPublished ? '公開' : '下書き'}`);
    if (article.publishedAt) {
      lines.push(`公開日: ${article.publishedAt.toISOString()}`);
    }
    if (article.tags.length > 0) {
      lines.push(`タグ: ${article.tags.join(', ')}`);
    }
    lines.push('---');
    lines.push('');

    // コンテンツ
    lines.push(article.content);

    return lines.join('\n');
  }
}
