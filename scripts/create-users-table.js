const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlpaxyrebidvxizpxdym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscGF4eXJlYmlkdnhpenB4ZHltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI2ODAzNiwiZXhwIjoyMDYzODQ0MDM2fQ._f1RHB_AvaGZE_F-h-LeAMaynSP8wGK5gHhSw7icfZQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsersTable() {
  try {
    console.log('🔄 Création de la table users...');

    // SQL pour créer la table users
    const createTableSQL = `
      -- Créer la table users si elle n'existe pas
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        password_hash TEXT,
        role VARCHAR(50) DEFAULT 'USER',
        
        -- Champs pour le système premium
        is_premium BOOLEAN DEFAULT FALSE,
        subscription_plan VARCHAR(50),
        
        -- Champs Stripe
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        
        -- Métadonnées
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Index pour améliorer les performances
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
      CREATE INDEX IF NOT EXISTS idx_users_premium ON users(is_premium);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

      -- Fonction pour mettre à jour automatiquement updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Trigger pour mettre à jour updated_at automatiquement
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      -- Politique RLS (Row Level Security)
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      -- Politique pour permettre aux utilisateurs de voir leurs propres données
      DROP POLICY IF EXISTS "Users can view own data" ON users;
      CREATE POLICY "Users can view own data" ON users
        FOR SELECT USING (auth.email() = email);

      -- Politique pour permettre aux utilisateurs de mettre à jour leurs propres données
      DROP POLICY IF EXISTS "Users can update own data" ON users;
      CREATE POLICY "Users can update own data" ON users
        FOR UPDATE USING (auth.email() = email);

      -- Politique pour permettre l'insertion (pour les webhooks Stripe)
      DROP POLICY IF EXISTS "Allow insert for authenticated users" ON users;
      CREATE POLICY "Allow insert for authenticated users" ON users
        FOR INSERT WITH CHECK (true);

      -- Politique pour les services (webhooks Stripe avec service role)
      DROP POLICY IF EXISTS "Service role can manage all users" ON users;
      CREATE POLICY "Service role can manage all users" ON users
        FOR ALL USING (auth.role() = 'service_role');
    `;

    // Exécuter le SQL via une requête REST directe
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseKey
      },
      body: JSON.stringify({ sql: createTableSQL })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur HTTP:', response.status, errorText);
      
      // Alternative : Essayer via SQL brut
      console.log('🔄 Tentative alternative...');
      
      const { error } = await supabase.rpc('exec', { sql: createTableSQL });
      
      if (error) {
        console.error('❌ Erreur SQL:', error.message);
        return;
      }
    }

    console.log('✅ Table users créée avec succès !');

    // Vérifier que la table a été créée
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur test table:', testError.message);
    } else {
      console.log('✅ Table users opérationnelle !');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

createUsersTable(); 