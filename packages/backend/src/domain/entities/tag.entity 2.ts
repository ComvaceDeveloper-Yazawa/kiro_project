export class Tag {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}

  static create(name: string): Tag {
    return new Tag(crypto.randomUUID(), name.trim().toLowerCase(), new Date());
  }

  equals(other: Tag): boolean {
    return this.name === other.name;
  }
}
