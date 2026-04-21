import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateArticleUsecase } from '../create-article.usecase';
import type { ArticleRepository } from '../../../domain/repositories/article.repository';
import type { TagRepository } from '../../../domain/repositories/tag.repository';
import { Article } from '../../../domain/entities/article.entity';
import { Tag } from '../../../domain/entities/tag.entity';

describe('CreateArticleUsecase', () => {
  let usecase: CreateArticleUsecase;
  let mockArticleRepo: ArticleRepository;
  let mockTagRepo: TagRepository;

  beforeEach(() => {
    // モックリポジトリを作成
    mockArticleRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByAuthorId: vi.fn(),
      findByTags: vi.fn(),
      delete: vi.fn(),
    };

    mockTagRepo = {
      save: vi.fn(),
      findByName: vi.fn(),
      findAll: vi.fn(),
      findOrCreate: vi.fn(),
    };

    usecase = new CreateArticleUsecase(mockArticleRepo, mockTagRepo);
  });

  describe('正常系', () => {
    it('タグなしで記事を作成できる', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: [],
      };

      const savedArticle = Article.create(input.title, input.content, input.authorId, []);

      vi.mocked(mockArticleRepo.save).mockResolvedValue(savedArticle);

      // Act
      const result = await usecase.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe(input.title);
      expect(result.content).toBe(input.content);
      expect(result.authorId).toBe(input.authorId);
      expect(result.isPublished).toBe(false);
      expect(mockArticleRepo.save).toHaveBeenCalledTimes(1);
      expect(mockTagRepo.findOrCreate).not.toHaveBeenCalled();
    });

    it('タグ付きで記事を作成できる', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: ['TypeScript', 'Vue'],
      };

      const tag1 = Tag.create('TypeScript');
      const tag2 = Tag.create('Vue');

      vi.mocked(mockTagRepo.findOrCreate).mockResolvedValueOnce(tag1).mockResolvedValueOnce(tag2);

      const savedArticle = Article.create(input.title, input.content, input.authorId, [tag1, tag2]);

      vi.mocked(mockArticleRepo.save).mockResolvedValue(savedArticle);

      // Act
      const result = await usecase.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].name).toBe('typescript'); // タグは小文字に正規化される
      expect(result.tags[1].name).toBe('vue');
      expect(mockTagRepo.findOrCreate).toHaveBeenCalledTimes(2);
      expect(mockArticleRepo.save).toHaveBeenCalledTimes(1);
    });

    it('作成された記事は下書き状態である', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: [],
      };

      const savedArticle = Article.create(input.title, input.content, input.authorId, []);

      vi.mocked(mockArticleRepo.save).mockResolvedValue(savedArticle);

      // Act
      const result = await usecase.execute(input);

      // Assert
      expect(result.isPublished).toBe(false);
      expect(result.publishedAt).toBeNull();
    });
  });

  describe('異常系', () => {
    it('タイトルが空の場合はエラー', async () => {
      // Arrange
      const input = {
        title: '',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: [],
      };

      // Act & Assert
      await expect(usecase.execute(input)).rejects.toThrow();
    });

    it('タイトルが200文字を超える場合はエラー', async () => {
      // Arrange
      const input = {
        title: 'a'.repeat(201),
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: [],
      };

      // Act & Assert
      await expect(usecase.execute(input)).rejects.toThrow();
    });

    it('本文が空の場合はエラー', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '',
        authorId: 'user-123',
        tags: [],
      };

      // Act & Assert
      await expect(usecase.execute(input)).rejects.toThrow();
    });

    it('タグが10個を超える場合はエラー', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
      };

      // Act & Assert
      await expect(usecase.execute(input)).rejects.toThrow();
    });

    it('タグ名が30文字を超える場合はエラー', async () => {
      // Arrange
      const input = {
        title: 'テスト記事',
        content: '# テスト記事の内容',
        authorId: 'user-123',
        tags: ['a'.repeat(31)],
      };

      // Act & Assert
      await expect(usecase.execute(input)).rejects.toThrow();
    });
  });
});
