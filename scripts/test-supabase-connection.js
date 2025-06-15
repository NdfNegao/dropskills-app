require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Checking Supabase configuration...');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
  console.error('\n❌ SUPABASE_SERVICE_ROLE_KEY is still set to placeholder value!');
  console.log('\n📋 To fix this:');
  console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project: qlpaxyrebidvxizpxdym');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the "service_role" key (NOT the anon key)');
  console.log('5. Replace "your_supabase_service_role_key" in your .env file');
  console.log('\n⚠️  The service_role key should start with "eyJ" and be much longer');
  process.exit(1);
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
  console.error('\n❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is still set to placeholder value!');
  console.log('\n📋 To fix this:');
  console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project: qlpaxyrebidvxizpxdym');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the "anon" key');
  console.log('5. Replace "your_supabase_anon_key" in your .env file');
  process.exit(1);
}

console.log('\n✅ API keys appear to be configured (not placeholder values)');
console.log('\n🔗 Testing connection...');

// Test with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    // Test simple query
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database error:', error);
      
      if (error.message.includes('relation "knowledge_documents" does not exist')) {
        console.log('\n💡 The knowledge_documents table does not exist.');
        console.log('   You need to run the SQL setup first.');
        console.log('   Copy and paste the SQL from sql/rag_setup.sql into your Supabase SQL Editor.');
      } else if (error.message.includes('Invalid API key')) {
        console.log('\n💡 The API key format is correct but the key itself is invalid.');
        console.log('   Please double-check that you copied the correct service_role key from Supabase.');
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ knowledge_documents table exists');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();