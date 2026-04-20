import { Tag } from '../entities/tag.entity';

export interface TagRepository {
  save(tag: Tag): Promise<Tag>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  findOrCreate(name: string): Promise<Tag>;
}
