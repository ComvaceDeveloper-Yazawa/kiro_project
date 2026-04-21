import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .envファイルを読み込む
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function checkArticles() {
  try {
    console.log('📚 記事一覧を確認中...');
    console.log('');

    const articles = await prisma.articles.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (articles.length === 0) {
      console.log('⚠️  記事が存在しません');
      return;
    }

    console.log(`合計: ${articles.length} 件の記事`);
    console.log('');

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   作成者: ${article.users?.email || 'Unknown'}`);
      console.log(`   公開状態: ${article.is_published ? '✅ 公開' : '📝 下書き'}`);
      console.log(
        `   公開日時: ${article.published_at ? new Date(article.published_at).toLocaleString('ja-JP') : 'なし'}`,
      );
      console.log(`   作成日時: ${new Date(article.created_at).toLocaleString('ja-JP')}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ チェック完了');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticles();
