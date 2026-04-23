import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .envファイルを読み込む
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function deleteAllArticles() {
  try {
    console.log('🗑️  全ての記事を削除中...');
    console.log('');

    // 記事に関連する画像を削除
    const { error: imagesError } = await supabase
      .from('article_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 全て削除

    if (imagesError) {
      console.error('❌ 画像削除エラー:', imagesError);
    }

    // 記事タグの関連を削除
    const { error: tagsError } = await supabase
      .from('article_tags')
      .delete()
      .neq('article_id', '00000000-0000-0000-0000-000000000000'); // 全て削除

    if (tagsError) {
      console.error('❌ タグ削除エラー:', tagsError);
    }

    // 記事を削除
    const { error: articlesError } = await supabase
      .from('articles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 全て削除

    if (articlesError) {
      console.error('❌ 記事削除エラー:', articlesError);
      throw articlesError;
    }

    console.log('✅ 全ての記事を削除しました');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

deleteAllArticles();
