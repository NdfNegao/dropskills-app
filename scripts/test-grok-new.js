require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Nouvelle clé Grok fournie par l'utilisateur
const NEW_GROK_KEY = 'xai-Gigyi8Pwk9JV4O8DHsxcAbeb1EV4IkAgHxZFCBsqcj8Zjxi85NZJRNxTNuBIBndULzxw6P1EVZZuuJvh';

async function testGrokAPI() {
  console.log('🔧 TEST DE LA NOUVELLE CLÉ GROK\n');
  console.log('=' .repeat(50));
  
  console.log(`🔑 Nouvelle clé: ${NEW_GROK_KEY.substring(0, 15)}...${NEW_GROK_KEY.slice(-10)}`);
  console.log(`🔑 Ancienne clé: ${process.env.GROK_API_KEY ? process.env.GROK_API_KEY.substring(0, 15) + '...' + process.env.GROK_API_KEY.slice(-10) : 'Non définie'}\n`);
  
  // Test avec la nouvelle clé
  console.log('🚀 Test avec la nouvelle clé...');
  
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NEW_GROK_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [{ role: 'user', content: 'Bonjour, test de connexion' }],
        max_tokens: 10
      })
    });
    
    console.log(`📡 Status HTTP: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCÈS: API Grok accessible!');
      console.log(`💬 Réponse: ${data.choices?.[0]?.message?.content || 'Réponse reçue'}`);
      console.log(`🏷️  Modèle utilisé: ${data.model || 'grok-2-1212'}`);
      console.log(`🔢 Tokens utilisés: ${data.usage?.total_tokens || 'N/A'}`);
    } else {
      const errorData = await response.json().catch(() => null);
      console.log('❌ ERREUR:');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      if (errorData) {
        console.log(`   Message: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
    }
    
  } catch (error) {
    console.log('❌ ERREUR DE CONNEXION:');
    console.log(`   ${error.message}`);
  }
  
  // Test des différents endpoints possibles
  console.log('\n🔍 Test des endpoints alternatifs...');
  
  const endpoints = [
    'https://api.x.ai/v1/models',
    'https://api.x.ai/v1/chat/completions',
    'https://api.x.ai/chat/completions'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📍 Test: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: endpoint.includes('/models') ? 'GET' : 'POST',
        headers: {
          'Authorization': `Bearer ${NEW_GROK_KEY}`,
          'Content-Type': 'application/json'
        },
        body: endpoint.includes('/models') ? undefined : JSON.stringify({
          model: 'grok-2-1212',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log('   ✅ Endpoint fonctionnel');
      } else {
        console.log(`   ❌ Erreur: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 RECOMMANDATIONS:');
  console.log('• Si le test est réussi, mettez à jour votre .env.local avec la nouvelle clé');
  console.log('• Relancez ensuite l\'audit complet des APIs');
  console.log('• Testez un mentor IA pour confirmer le fonctionnement');
}

testGrokAPI().catch(console.error);