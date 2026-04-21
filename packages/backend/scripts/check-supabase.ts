import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .envファイルを読み込む
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase 接続チェック');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// 環境変数チェック
console.log('📋 環境変数:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`   SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ 設定済み' : '❌ 未設定'}`);
console.log('');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ 環境変数が不足しています');
  console.error('');
  console.error('📝 .env ファイルに以下を設定してください:');
  console.error('   SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_ANON_KEY=your-anon-key');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkSupabase() {
  try {
    // 接続テスト
    console.log('🔌 Supabase 接続テスト...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);

    if (healthError && !healthError.message.includes('does not exist')) {
      console.error('❌ 接続エラー:', healthError.message);
      process.exit(1);
    }

    console.log('✅ Supabase に接続できました');
    console.log('');

    // ユーザー一覧を取得
    console.log('👥 ユーザー一覧:');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ ユーザー一覧の取得に失敗:', usersError.message);
      process.exit(1);
    }

    if (!users || users.users.length === 0) {
      console.log('   ⚠️  ユーザーが存在しません');
      console.log('');
      console.log('💡 テストユーザーを作成してください:');
      console.log('   pnpm create-test-user');
    } else {
      console.log(`   合計: ${users.users.length} 人`);
      console.log('');
      users.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Email Confirmed: ${user.email_confirmed_at ? '✅ Yes' : '❌ No'}`);
        console.log(`      Created: ${new Date(user.created_at).toLocaleString('ja-JP')}`);
        console.log(
          `      Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ja-JP') : 'なし'}`,
        );
        console.log('');
      });

      // test@example.com の確認
      const testUser = users.users.find((u) => u.email === 'test@example.com');
      if (testUser) {
        console.log('✅ テストユーザー (test@example.com) が存在します');
        if (!testUser.email_confirmed_at) {
          console.log('⚠️  メール確認が完了していません');
          console.log('');
          console.log('📝 対処方法:');
          console.log('   1. Supabase Dashboard → Authentication → Users');
          console.log('   2. test@example.com をクリック');
          console.log('   3. "Confirm email" ボタンをクリック');
        }
      } else {
        console.log('⚠️  テストユーザー (test@example.com) が存在しません');
        console.log('');
        console.log('💡 テストユーザーを作成してください:');
        console.log('   pnpm create-test-user');
      }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ チェック完了');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('');
    console.error('❌ エラーが発生しました');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error);
    process.exit(1);
  }
}

checkSupabase();
