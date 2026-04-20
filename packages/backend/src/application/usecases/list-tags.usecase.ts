import { Tag } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

export class ListTagsUsecase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }
}
