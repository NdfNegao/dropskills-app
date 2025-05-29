#!/usr/bin/env node

/**
 * Script de configuration des variables d'environnement Vercel
 * Configure automatiquement les variables pour la production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration des variables d\'environnement Vercel');
console.log('====================================================\n');

// Lire les variables depuis .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local non trouvé');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parser le fichier .env.local
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    envVars[key.trim()] = value.trim();
  }
});

// Variables à configurer sur Vercel
const vercelEnvVars = {
  'NEXTAUTH_URL': 'https://dropskills-h1c28tdyf-cyrils-projects-5dd3a4d6.vercel.app',
  'NEXTAUTH_SECRET': envVars.NEXTAUTH_SECRET || 'DqzSxhNEFUvr6zZMRyOi+DBXAumud8OowWk3yTlgEAk=',
  'GOOGLE_CLIENT_ID': envVars.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': envVars.GOOGLE_CLIENT_SECRET,
  'OPENAI_API_KEY': envVars.OPENAI_API_KEY,
  'NODE_ENV': 'production'
};

console.log('🔍 Variables à configurer:');
Object.keys(vercelEnvVars).forEach(key => {
  const value = vercelEnvVars[key];
  if (value) {
    const displayValue = key.includes('SECRET') || key.includes('KEY') 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`   ✅ ${key}: ${displayValue}`);
  } else {
    console.log(`   ❌ ${key}: MANQUANT`);
  }
});

console.log('\n🚀 Configuration des variables sur Vercel...\n');

// Configurer chaque variable
let successCount = 0;
let errorCount = 0;

Object.entries(vercelEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`⚠️  Ignoré ${key} (valeur manquante)`);
    return;
  }

  try {
    console.log(`🔧 Configuration de ${key}...`);
    
    // Échapper les caractères spéciaux pour le shell
    const escapedValue = value.replace(/"/g, '\\"').replace(/'/g, "\\'");
    
    const command = `vercel env add ${key} production --value="${escapedValue}" --force`;
    execSync(command, { stdio: 'pipe' });
    
    console.log(`   ✅ ${key} configuré`);
    successCount++;
  } catch (error) {
    console.log(`   ❌ Erreur pour ${key}: ${error.message}`);
    errorCount++;
  }
});

console.log('\n📊 Résumé de la configuration:');
console.log(`   ✅ Variables configurées: ${successCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n🎉 Toutes les variables ont été configurées avec succès !');
  console.log('\n🔄 Redéploiement automatique en cours...');
  
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('\n✅ Redéploiement terminé !');
    console.log('\n🌐 Votre application est maintenant disponible à:');
    console.log('   https://dropskills-h1c28tdyf-cyrils-projects-5dd3a4d6.vercel.app');
  } catch (error) {
    console.log('\n❌ Erreur lors du redéploiement:', error.message);
  }
} else {
  console.log('\n⚠️  Certaines variables n\'ont pas pu être configurées.');
  console.log('   Veuillez les configurer manuellement sur https://vercel.com');
}

console.log('\n💡 Prochaines étapes:');
console.log('   1. Tester l\'application en production');
console.log('   2. Configurer un domaine personnalisé');
console.log('   3. Mettre à jour Google OAuth avec la nouvelle URL');
console.log('   4. Surveiller les performances et erreurs'); 