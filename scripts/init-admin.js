const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function initAdmin() {
  try {
    const email = 'cyril.iriebi@gmail.com';
    const password = 'jjbMMA200587@'; // Mot de passe admin
    const firstName = 'Cyril';
    const lastName = 'Iriebi';
    
    // Vérifier si l'admin existe déjà
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      console.log('✅ Compte admin déjà existant');
      return;
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer le compte admin
    const { data: newAdmin, error } = await supabase
      .from('users')
      .insert({
        email: email,
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        password_hash: hashedPassword,
        role: 'ADMIN',
        is_premium: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error);
      return;
    }

    console.log('✅ Compte admin créé avec succès:', {
      id: newAdmin.id,
      email: newAdmin.email,
      role: newAdmin.role,
      isPremium: newAdmin.is_premium
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
  }
}

// Exécuter le script
initAdmin(); 