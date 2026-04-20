export interface StorageService {
  uploadImage(file: Buffer, fileName: string, articleId: string): Promise<string>;
  deleteImage(storagePath: string): Promise<void>;
  getPublicUrl(storagePath: string): string;
}
