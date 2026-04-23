import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function listArticles() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, next_article_id, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Found ' + (articles?.length || 0) + ' articles:');
  articles?.forEach((article, index) => {
    console.log(index + 1 + '. ' + article.title);
    console.log('   ID: ' + article.id);
    console.log('   Next: ' + (article.next_article_id || 'none'));
  });
}

listArticles();
