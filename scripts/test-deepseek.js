/**
 * Script de test pour l'intégration DeepSeek V3
 * Usage: node scripts/test-deepseek.js
 */

// Configuration simple pour test
process.env.NODE_ENV = 'development';

// Test basique de l'API DeepSeek
const https = require('https');
const fs = require('fs');
const path = require('path');

// Lecture du fichier .env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  });
}

// Test simple de l'API DeepSeek
async function testDeepSeekAPI() {
  console.log('🧪 Test d\'intégration DeepSeek V3\n');
  
  // Test 1: Vérification de la configuration
  console.log('1️⃣ Vérification de la configuration...');
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('❌ DEEPSEEK_API_KEY non configurée');
    console.log('💡 Ajoutez DEEPSEEK_API_KEY=your_key dans votre fichier .env');
    console.log('📋 Étapes suivantes:');
    console.log('   1. Visitez https://platform.deepseek.com');
    console.log('   2. Créez un compte et générez une clé API');
    console.log('   3. Ajoutez DEEPSEEK_API_KEY=sk-xxx dans .env');
    console.log('   4. Relancez ce test');
    return;
  }
  console.log('✅ Configuration OK\n');
  
  // Test 2: Test API simple
  console.log('2️⃣ Test de l\'API DeepSeek...');
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: 'Dis bonjour en français'
        }],
        max_tokens: 50
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API DeepSeek fonctionnelle');
      console.log(`📝 Réponse: ${data.choices[0].message.content}`);
      console.log(`📊 Tokens utilisés: ${data.usage.total_tokens}`);
      
      // Calcul du coût
      const inputCost = (data.usage.prompt_tokens * 0.14) / 1000000;
      const outputCost = (data.usage.completion_tokens * 0.28) / 1000000;
      const totalCost = inputCost + outputCost;
      console.log(`💰 Coût: $${totalCost.toFixed(6)}`);
      
      // Comparaison avec OpenAI
      const openaiCost = (data.usage.prompt_tokens * 2.50 / 1000000) + (data.usage.completion_tokens * 10.00 / 1000000);
      const savings = openaiCost - totalCost;
      const savingsPercent = (savings / openaiCost) * 100;
      console.log(`💸 Coût équivalent OpenAI: $${openaiCost.toFixed(6)}`);
      console.log(`💰 Économies: $${savings.toFixed(6)} (${savingsPercent.toFixed(1)}%)\n`);
    } else {
      const error = await response.json();
      console.error('❌ Erreur API:', error);
      return;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return;
  }
  
  console.log('🎉 Test réussi!');
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Démarrer le serveur: npm run dev');
  console.log('2. Tester l\'endpoint: /api/ai/titles/generate');
  console.log('3. Vérifier les économies dans les logs');
  console.log('4. Déployer en production');
}

// Polyfill fetch pour Node.js si nécessaire
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Exécution du test
if (require.main === module) {
  testDeepSeekAPI().catch(console.error);
}

module.exports = { testDeepSeekAPI };