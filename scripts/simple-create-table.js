const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlpaxyrebidvxizpxdym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscGF4eXJlYmlkdnhpenB4ZHltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI2ODAzNiwiZXhwIjoyMDYzODQ0MDM2fQ._f1RHB_AvaGZE_F-h-LeAMaynSP8wGK5gHhSw7icfZQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  console.log('🔄 Création table users...');
  
  // Version ultra simple - juste créer la table
  const { error } = await supabase.rpc('sql', {
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        password_hash TEXT,
        role VARCHAR(50) DEFAULT 'USER',
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (error) {
    console.error('❌ Erreur SQL:', error);
    
    // Si ça échoue, essayons de créer un utilisateur directement
    console.log('🔄 Tentative création utilisateur direct...');
    
    const { data, error: insertError } = await supabase
      .from('users')
      .insert({
        email: 'test@dropskills.fr',
        name: 'Test User',
        first_name: 'Test',
        last_name: 'User',
        role: 'USER',
        is_premium: false
      })
      .select();

    if (insertError) {
      console.error('❌ Table users n\'existe vraiment pas:', insertError.message);
      console.log('\n📝 SOLUTION MANUELLE:');
      console.log('1. Va sur https://supabase.com/dashboard');
      console.log('2. Ouvre ton projet DropSkills');
      console.log('3. Va dans "SQL Editor"');
      console.log('4. Exécute cette requête:');
      console.log(`
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password_hash TEXT,
  role VARCHAR(50) DEFAULT 'USER',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Table créée et utilisateur test ajouté !');
    }
  } else {
    console.log('✅ Table users créée !');
  }
}

createTable(); 