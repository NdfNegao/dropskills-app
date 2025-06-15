#!/usr/bin/env node

/**
 * Script pour configurer la base de données RAG
 * Utilise les variables d'environnement Supabase
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { 
  NEXT_PUBLIC_SUPABASE_URL, 
  SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY 
} = process.env;

function main() {
  console.log('🚀 Configuration du setup RAG pour Dropskills\n');
  
  // Vérification des variables d'environnement
  const missing = [];
  if (!NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  
  if (missing.length > 0) {
    console.log('❌ Variables d\'environnement manquantes:');
    missing.forEach(var_name => console.log(`   - ${var_name}`));
    console.log('\nVeuillez configurer votre fichier .env\n');
    process.exit(1);
  }
  
  console.log('✅ Variables d\'environnement configurées');
  
  // Extraction des informations Supabase
  const url = new URL(NEXT_PUBLIC_SUPABASE_URL);
  const host = url.hostname;
  const dbName = url.pathname.split('/')[1] || 'postgres';
  
  console.log(`\n📊 Configuration Supabase:`);
  console.log(`   Host: ${host}`);
  console.log(`   Database: ${dbName}`);
  
  // Vérification du fichier SQL
  const sqlFile = path.join(__dirname, '..', 'sql', 'rag_setup.sql');
  if (!fs.existsSync(sqlFile)) {
    console.log('❌ Fichier sql/rag_setup.sql introuvable');
    process.exit(1);
  }
  
  console.log('✅ Fichier SQL trouvé');
  
  // Instructions d'exécution
  console.log('\n🔧 Options pour exécuter le setup:');
  console.log('\n1. Via psql (si installé):');
  console.log(`   psql -h ${host} -U postgres -d ${dbName} -f sql/rag_setup.sql`);
  
  console.log('\n2. Via l\'interface Supabase (recommandé):');
  console.log('   a. Allez sur https://supabase.com/dashboard');
  console.log('   b. Sélectionnez votre projet');
  console.log('   c. Allez dans "SQL Editor"');
  console.log('   d. Créez une nouvelle requête');
  console.log('   e. Copiez-collez le contenu du fichier sql/rag_setup.sql');
  console.log('   f. Exécutez la requête');
  
  console.log('\n3. Contenu du fichier SQL:');
  console.log('   Fichier: sql/rag_setup.sql');
  console.log('   Taille:', fs.statSync(sqlFile).size, 'bytes');
  
  // Affichage du contenu SQL pour copier-coller
  console.log('\n📄 Contenu SQL à exécuter:');
  console.log('=' .repeat(60));
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  console.log(sqlContent);
  console.log('=' .repeat(60));
  
  console.log('\n✨ Après l\'exécution du SQL, lancez:');
  console.log('   npm run init-rag');
  console.log('   ou');
  console.log('   npx ts-node scripts/init-rag.ts');
}

if (require.main === module) {
  main();
}

module.exports = { main };