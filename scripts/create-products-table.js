require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Vérification des variables d\'environnement...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Défini' : '❌ Manquant');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Défini' : '❌ Manquant');

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'your_supabase_url') {
  console.error('❌ Variables Supabase manquantes ou invalides');
  console.error('Assurez-vous que .env.local contient les bonnes valeurs Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createTableSQL = `
-- Migration pour créer la table products
-- Version: 002_products_table.sql

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  format TEXT NOT NULL,
  image TEXT,
  description TEXT,
  short_description TEXT,
  long_description TEXT,
  likes INTEGER DEFAULT 0,
  file_url TEXT,
  tags TEXT[] DEFAULT '{}',
  pages INTEGER,
  words INTEGER,
  size TEXT,
  file_type TEXT,
  images TEXT[] DEFAULT '{}',
  details TEXT[] DEFAULT '{}',
  rights TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  category TEXT,
  instructor TEXT,
  duration TEXT,
  features JSONB DEFAULT '[]',
  permissions TEXT[] DEFAULT '{}',
  preview_images TEXT[] DEFAULT '{}',
  download_url TEXT,
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_is_premium ON public.products(is_premium);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_format ON public.products(format);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Permissions RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tous peuvent lire
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Politique d'écriture : seuls les admins peuvent modifier
CREATE POLICY "Only admins can modify products" 
ON public.products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.email = auth.jwt() ->> 'email' 
    AND users.role = 'ADMIN'
  )
);
`;

async function createProductsTable() {
  console.log('🚀 Création de la table products...');

  try {
    // Test simple de connexion d'abord
    console.log('🔌 Test de connexion à Supabase...');
    const { data: testConnection, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Erreur de connexion:', connectionError.message);
      return;
    }

    console.log('✅ Connexion Supabase réussie');

    // Vérifier si la table products existe déjà
    console.log('🔍 Vérification de l\'existence de la table products...');
    const { data: existingTable, error: checkError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (!checkError) {
      console.log('ℹ️ La table products existe déjà');
      console.log('🎯 Prête pour la migration des données !');
      return;
    }

    if (checkError && !checkError.message.includes('does not exist')) {
      console.error('❌ Erreur lors de la vérification:', checkError.message);
      return;
    }

    console.log('📋 Table products non trouvée, création nécessaire...');
    console.log('⚠️ Vous devez créer la table manuellement dans Supabase Dashboard');
    console.log('');
    console.log('🚀 Instructions:');
    console.log('1. Allez sur https://supabase.com/dashboard');
    console.log('2. Sélectionnez votre projet DropSkills');
    console.log('3. Allez dans "SQL Editor"');
    console.log('4. Exécutez le SQL suivant:');
    console.log('');
    console.log('--- SQL À EXÉCUTER ---');
    console.log(`
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  format TEXT NOT NULL,
  image TEXT,
  description TEXT,
  short_description TEXT,
  long_description TEXT,
  likes INTEGER DEFAULT 0,
  file_url TEXT,
  tags TEXT[] DEFAULT '{}',
  pages INTEGER,
  words INTEGER,
  size TEXT,
  file_type TEXT,
  images TEXT[] DEFAULT '{}',
  details TEXT[] DEFAULT '{}',
  rights TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  category TEXT,
  instructor TEXT,
  duration TEXT,
  features JSONB DEFAULT '[]',
  permissions TEXT[] DEFAULT '{}',
  preview_images TEXT[] DEFAULT '{}',
  download_url TEXT,
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_is_premium ON public.products(is_premium);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_format ON public.products(format);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Permissions RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tous peuvent lire
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);
    `);
    console.log('--- FIN DU SQL ---');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécution
createProductsTable(); 