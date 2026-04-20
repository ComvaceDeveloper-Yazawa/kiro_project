import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';
import { ValidationError } from '../../domain/errors/validation.error';

export interface UpdateArticleInput {
  articleId: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
}

export class UpdateArticleUsecase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(input: UpdateArticleInput): Promise<Article> {
    // 記事の取得
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) {
      throw new NotFoundError('記事', input.articleId);
    }

    // 認可チェック
    if (!article.canBeModifiedBy(input.userId)) {
      throw new AuthorizationError('この記事を編集する権限がありません');
    }

    // バリデーション
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError('タイトルは必須です');
    }

    if (input.title.length > 200) {
      throw new ValidationError('タイトルは200文字以内で入力してください');
    }

    if (!input.content || input.content.trim().length === 0) {
      throw new ValidationError('本文は必須です');
    }

    if (input.tags.length > 10) {
      throw new ValidationError('タグは10個まで設定できます');
    }

    // タグの存在確認と作成
    const tagNames = await Promise.all(
      input.tags.map(async (tagName) => {
        const tag = await this.tagRepository.findOrCreate(tagName);
        return tag.name;
      }),
    );

    // 記事更新
    article.update(input.title.trim(), input.content, tagNames);

    // 保存
    return this.articleRepository.save(article);
  }
}
