#!/usr/bin/env node

/**
 * Script de vérification de la configuration Google OAuth
 * Usage: node scripts/check-google-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration Google OAuth...\n');

// Vérifier les variables d'environnement
function checkEnvVars() {
  console.log('📋 Variables d\'environnement:');
  
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  const optionalVars = [
    'TEST_ADMIN_EMAIL',
    'TEST_ADMIN_PASSWORD',
    'TEST_PREMIUM_EMAIL',
    'TEST_PREMIUM_PASSWORD',
    'TEST_USER_EMAIL',
    'TEST_USER_PASSWORD'
  ];

  let allGood = true;

  // Vérifier les variables requises
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`);
    } else {
      console.log(`  ❌ ${varName}: MANQUANT`);
      allGood = false;
    }
  });

  // Vérifier les variables optionnelles
  console.log('\n📋 Variables optionnelles (développement):');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`);
    } else {
      console.log(`  ⚠️  ${varName}: Non défini`);
    }
  });

  return allGood;
}

// Vérifier le fichier .env.local
function checkEnvFile() {
  console.log('\n📄 Fichier .env.local:');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('  ✅ .env.local existe');
    
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log(`  📊 ${lines.length} variables définies`);
    
    // Vérifier la structure
    const hasNextAuth = content.includes('NEXTAUTH_');
    const hasGoogle = content.includes('GOOGLE_');
    
    if (hasNextAuth) {
      console.log('  ✅ Configuration NextAuth détectée');
    } else {
      console.log('  ❌ Configuration NextAuth manquante');
    }
    
    if (hasGoogle) {
      console.log('  ✅ Configuration Google détectée');
    } else {
      console.log('  ❌ Configuration Google manquante');
    }
    
  } else {
    console.log('  ❌ .env.local n\'existe pas');
    console.log('  💡 Créez ce fichier avec vos variables d\'environnement');
  }
}

// Vérifier la configuration NextAuth
function checkNextAuthConfig() {
  console.log('\n⚙️  Configuration NextAuth:');
  
  const authConfigPath = path.join(process.cwd(), 'src/lib/auth.ts');
  
  if (fs.existsSync(authConfigPath)) {
    console.log('  ✅ Fichier auth.ts existe');
    
    const content = fs.readFileSync(authConfigPath, 'utf8');
    
    // Vérifier les providers
    if (content.includes('GoogleProvider')) {
      console.log('  ✅ Google Provider configuré');
    } else {
      console.log('  ❌ Google Provider manquant');
    }
    
    if (content.includes('CredentialsProvider')) {
      console.log('  ✅ Credentials Provider configuré');
    } else {
      console.log('  ❌ Credentials Provider manquant');
    }
    
    // Vérifier les callbacks
    if (content.includes('callbacks')) {
      console.log('  ✅ Callbacks configurés');
    } else {
      console.log('  ⚠️  Callbacks non configurés');
    }
    
  } else {
    console.log('  ❌ Fichier auth.ts manquant');
  }
}

// Vérifier les pages d'authentification
function checkAuthPages() {
  console.log('\n📱 Pages d\'authentification:');
  
  const authPages = [
    'src/app/auth/signin/page.tsx',
    'src/app/auth/signup/page.tsx',
    'src/app/auth/error/page.tsx'
  ];
  
  authPages.forEach(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${pagePath.split('/').pop()}`);
    } else {
      console.log(`  ❌ ${pagePath.split('/').pop()} manquant`);
    }
  });
}

// Valider le format des variables
function validateFormats() {
  console.log('\n🔍 Validation des formats:');
  
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  
  // Valider Google Client ID
  if (googleClientId) {
    if (googleClientId.endsWith('.apps.googleusercontent.com')) {
      console.log('  ✅ GOOGLE_CLIENT_ID format valide');
    } else {
      console.log('  ❌ GOOGLE_CLIENT_ID format invalide (doit finir par .apps.googleusercontent.com)');
    }
  }
  
  // Valider Google Client Secret
  if (googleClientSecret) {
    if (googleClientSecret.startsWith('GOCSPX-')) {
      console.log('  ✅ GOOGLE_CLIENT_SECRET format valide');
    } else {
      console.log('  ❌ GOOGLE_CLIENT_SECRET format invalide (doit commencer par GOCSPX-)');
    }
  }
  
  // Valider NextAuth Secret
  if (nextAuthSecret) {
    if (nextAuthSecret.length >= 32) {
      console.log('  ✅ NEXTAUTH_SECRET longueur suffisante');
    } else {
      console.log('  ❌ NEXTAUTH_SECRET trop court (minimum 32 caractères)');
    }
  }
  
  // Valider NextAuth URL
  if (nextAuthUrl) {
    if (nextAuthUrl.startsWith('http://') || nextAuthUrl.startsWith('https://')) {
      console.log('  ✅ NEXTAUTH_URL format valide');
    } else {
      console.log('  ❌ NEXTAUTH_URL format invalide (doit commencer par http:// ou https://)');
    }
  }
}

// Générer des suggestions
function generateSuggestions() {
  console.log('\n💡 Suggestions:');
  
  if (!process.env.NEXTAUTH_SECRET) {
    console.log('  🔑 Générez un NEXTAUTH_SECRET:');
    console.log('     openssl rand -base64 32');
    console.log('     ou');
    console.log('     node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
  }
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('  🔗 Configurez Google OAuth:');
    console.log('     1. Allez sur https://console.cloud.google.com/');
    console.log('     2. Créez un projet ou sélectionnez-en un');
    console.log('     3. Activez l\'API Google+');
    console.log('     4. Configurez l\'écran de consentement OAuth');
    console.log('     5. Créez des identifiants OAuth 2.0');
  }
  
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('  📄 Créez un fichier .env.local avec:');
    console.log('     NEXTAUTH_URL=http://localhost:3000');
    console.log('     NEXTAUTH_SECRET=your-secret-here');
    console.log('     GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
    console.log('     GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret');
  }
}

// Fonction principale
function main() {
  console.log('🚀 DropSkills - Vérification Configuration Google OAuth\n');
  
  const envVarsOk = checkEnvVars();
  checkEnvFile();
  checkNextAuthConfig();
  checkAuthPages();
  validateFormats();
  generateSuggestions();
  
  console.log('\n' + '='.repeat(60));
  
  if (envVarsOk) {
    console.log('🎉 Configuration semble correcte !');
    console.log('🧪 Testez maintenant avec: npm run dev');
  } else {
    console.log('⚠️  Configuration incomplète');
    console.log('📖 Consultez GOOGLE_SETUP.md pour plus d\'aide');
  }
  
  console.log('='.repeat(60));
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { checkEnvVars, checkEnvFile, checkNextAuthConfig }; 