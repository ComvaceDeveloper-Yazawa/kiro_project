import { PrismaClient } from '@prisma/client';
import { Tag } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

export class TagRepositoryImpl implements TagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(tag: Tag): Promise<Tag> {
    const saved = await this.prisma.tags.upsert({
      where: { id: tag.id },
      create: {
        id: tag.id,
        name: tag.name,
        created_at: tag.createdAt,
      },
      update: {
        name: tag.name,
      },
    });

    return new Tag(saved.id, saved.name, saved.created_at);
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await this.prisma.tags.findUnique({
      where: { name: name.toLowerCase() },
    });

    if (!tag) return null;

    return new Tag(tag.id, tag.name, tag.created_at);
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tags.findMany({
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) => new Tag(tag.id, tag.name, tag.created_at));
  }

  async findOrCreate(name: string): Promise<Tag> {
    const normalizedName = name.trim().toLowerCase();

    const existing = await this.findByName(normalizedName);
    if (existing) {
      return existing;
    }

    const newTag = Tag.create(normalizedName);
    return this.save(newTag);
  }
}
