import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { ValidationError } from '../../domain/errors/validation.error';

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  isPublished?: boolean; // 公開するかどうか（デフォルト: false）
}

export class CreateArticleUsecase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(input: CreateArticleInput): Promise<Article> {
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
    const tags = await Promise.all(
      input.tags.map(async (tagName) => {
        return await this.tagRepository.findOrCreate(tagName);
      }),
    );

    // 記事エンティティ作成
    const article = Article.create(input.title.trim(), input.content, input.authorId, tags);

    // 公開フラグが指定されている場合は公開
    if (input.isPublished) {
      article.publish();
    }

    // 保存
    return this.articleRepository.save(article);
  }
}
