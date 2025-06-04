const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://qlpaxyrebidvxizpxdym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscGF4eXJlYmlkdnhpenB4ZHltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI2ODAzNiwiZXhwIjoyMDYzODQ0MDM2fQ._f1RHB_AvaGZE_F-h-LeAMaynSP8wGK5gHhSw7icfZQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    console.log('🔄 Test de connexion Supabase...');
    
    // Test direct de la table users
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('email, role, is_premium')
      .limit(5);

    if (usersError) {
      console.error('❌ Erreur table users:', usersError.message);
      console.log('⚠️ La table users n\'existe probablement pas');
      
      // Essayer de créer la table via SQL direct
      console.log('🔄 Tentative de création de la table users...');
      
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email: 'test@test.com',
          name: 'Test User',
          first_name: 'Test',
          last_name: 'User',
          role: 'USER',
          is_premium: false
        });

      if (createError) {
        console.error('❌ Erreur test insertion:', createError.message);
      }
      
      return;
    }

    console.log('✅ Connexion réussie !');
    console.log('👥 Utilisateurs existants:', existingUsers);

    // Chercher l'admin Cyril
    const { data: adminUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'cyril.iriebi@gmail.com')
      .single();

    if (adminUser) {
      console.log('✅ Compte admin Cyril trouvé:', {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        isPremium: adminUser.is_premium
      });
    } else {
      console.log('⚠️ Compte admin Cyril non trouvé, création nécessaire');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSupabase(); 