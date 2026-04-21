import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .envファイルを読み込む
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 環境変数チェック:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ 設定済み' : '❌ 未設定'}`);
console.log('');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ エラー: 環境変数が設定されていません');
  console.error('');
  console.error('📝 セットアップ手順:');
  console.error('1. packages/backend/.env ファイルを作成');
  console.error('2. 以下の環境変数を設定:');
  console.error('   SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('');
  console.error('💡 Supabase Dashboard で取得:');
  console.error('   Settings → API → Project URL (SUPABASE_URL)');
  console.error('   Settings → API → service_role key (SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUser() {
  const testEmail = 'test@example.com';
  const testPassword = 'test1234';

  console.log('🔧 テストユーザーを作成中...');
  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔑 Password: ${testPassword}`);
  console.log('');

  try {
    // 既存のユーザーを削除（存在する場合）
    console.log('🔍 既存ユーザーをチェック中...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ ユーザー一覧の取得に失敗:', listError.message);
      throw listError;
    }

    const existingUser = existingUsers?.users.find((u) => u.email === testEmail);

    if (existingUser) {
      console.log(`🗑️  既存のテストユーザーを削除中... (ID: ${existingUser.id})`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);

      if (deleteError) {
        console.error('❌ ユーザー削除に失敗:', deleteError.message);
        throw deleteError;
      }
      console.log('✅ 既存ユーザーを削除しました');
    } else {
      console.log('ℹ️  既存ユーザーは見つかりませんでした');
    }

    // 新しいユーザーを作成
    console.log('');
    console.log('👤 新しいユーザーを作成中...');
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // メール確認をスキップ
    });

    if (error) {
      console.error('❌ ユーザー作成に失敗:', error.message);
      throw error;
    }

    console.log('');
    console.log('✅ テストユーザーを作成しました！');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 ログイン情報');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 User ID: ${data.user.id}`);
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 次のステップ:');
    console.log('   1. フロントエンドを起動: cd packages/frontend && pnpm dev');
    console.log('   2. http://localhost:5173 を開く');
    console.log('   3. 「テストユーザーで入力」ボタンをクリック');
    console.log('   4. ログイン');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ エラーが発生しました');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (error instanceof Error) {
      console.error(`エラーメッセージ: ${error.message}`);
      if ('status' in error) {
        console.error(`ステータスコード: ${(error as any).status}`);
      }
    } else {
      console.error(error);
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    console.error('💡 トラブルシューティング:');
    console.error('   1. SUPABASE_SERVICE_ROLE_KEY が正しいか確認');
    console.error('   2. Supabase プロジェクトが有効か確認');
    console.error('   3. ネットワーク接続を確認');
    console.error('');
    process.exit(1);
  }
}

createTestUser();
