import { Article } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { ValidationError } from '../../domain/errors/validation.error';

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
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
    const tagNames = await Promise.all(
      input.tags.map(async (tagName) => {
        const tag = await this.tagRepository.findOrCreate(tagName);
        return tag.name;
      }),
    );

    // 記事エンティティ作成
    const article = new Article(
      crypto.randomUUID(),
      input.title.trim(),
      input.content,
      input.authorId,
      false, // 初期状態は下書き
      null,
      new Date(),
      new Date(),
      tagNames,
    );

    // 保存
    return this.articleRepository.save(article);
  }
}
