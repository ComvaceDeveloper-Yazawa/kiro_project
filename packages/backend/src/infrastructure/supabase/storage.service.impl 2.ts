import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from '../../domain/services/storage.service';

export class SupabaseStorageService implements StorageService {
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'images';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase環境変数が設定されていません');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadImage(file: Buffer, fileName: string, articleId: string): Promise<string> {
    // ファイル名をサニタイズ
    const sanitizedFileName = this.sanitizeFileName(fileName);
    const storagePath = `articles/${articleId}/${Date.now()}-${sanitizedFileName}`;

    const { error } = await this.supabase.storage.from(this.bucketName).upload(storagePath, file, {
      contentType: this.getContentType(fileName),
      upsert: false,
    });

    if (error) {
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }

    return storagePath;
  }

  async deleteImage(storagePath: string): Promise<void> {
    const { error } = await this.supabase.storage.from(this.bucketName).remove([storagePath]);

    if (error) {
      throw new Error(`画像の削除に失敗しました: ${error.message}`);
    }
  }

  getPublicUrl(storagePath: string): string {
    const { data } = this.supabase.storage.from(this.bucketName).getPublicUrl(storagePath);

    return data.publicUrl;
  }

  private sanitizeFileName(fileName: string): string {
    // 危険な文字を削除
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    };

    return contentTypes[ext || ''] || 'application/octet-stream';
  }
}
