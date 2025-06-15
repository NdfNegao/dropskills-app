require('dotenv').config();

console.log('Environment Variables Check:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('Supabase URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...');
}