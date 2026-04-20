import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class MarkdownParserService {
  /**
   * Markdownを安全なHTMLにパースする
   */
  parse(markdown: string): string {
    const rawHtml = marked.parse(markdown) as string;
    return this.sanitize(rawHtml);
  }

  /**
   * Markdownの構文を検証する
   */
  validate(markdown: string): ValidationResult {
    const errors: string[] = [];

    if (!markdown || markdown.trim().length === 0) {
      errors.push('Markdownコンテンツが空です');
    }

    // 基本的な構文チェック
    try {
      marked.parse(markdown);
    } catch (error) {
      errors.push(`Markdown構文エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * HTMLをサニタイズしてXSS攻撃を防ぐ
   */
  sanitize(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'br',
        'hr',
        'strong',
        'em',
        'u',
        's',
        'code',
        'pre',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'blockquote',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'iframe', // サンドボックス埋め込み用
      ],
      ALLOWED_ATTR: [
        'href',
        'title',
        'alt',
        'src',
        'class',
        'id',
        'width',
        'height',
        'frameborder',
        'allowfullscreen', // iframe用
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });
  }
}
