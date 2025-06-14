require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Nouvelle clé Grok fournie par l'utilisateur
const NEW_GROK_KEY = 'xai-Gigyi8Pwk9JV4O8DHsxcAbeb1EV4IkAgHxZFCBsqcj8Zjxi85NZJRNxTNuBIBndULzxw6P1EVZZuuJvh';

async function checkGrokModels() {
  console.log('🔍 VÉRIFICATION DES MODÈLES GROK DISPONIBLES\n');
  console.log('=' .repeat(60));
  
  try {
    console.log('📡 Récupération de la liste des modèles...');
    
    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NEW_GROK_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}\n`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ MODÈLES DISPONIBLES:');
      console.log('=' .repeat(40));
      
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((model, index) => {
          console.log(`${index + 1}. ${model.id}`);
          if (model.object) console.log(`   Type: ${model.object}`);
          if (model.created) console.log(`   Créé: ${new Date(model.created * 1000).toLocaleDateString()}`);
          if (model.owned_by) console.log(`   Propriétaire: ${model.owned_by}`);
          console.log('');
        });
        
        // Test avec le premier modèle disponible
        if (data.data.length > 0) {
          const firstModel = data.data[0].id;
          console.log(`🧪 TEST AVEC LE MODÈLE: ${firstModel}`);
          console.log('=' .repeat(40));
          
          try {
            const testResponse = await fetch('https://api.x.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${NEW_GROK_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: firstModel,
                messages: [{ role: 'user', content: 'Bonjour, test de connexion' }],
                max_tokens: 10
              })
            });
            
            console.log(`📡 Status: ${testResponse.status}`);
            
            if (testResponse.ok) {
              const testData = await testResponse.json();
              console.log('✅ SUCCÈS: Chat completions fonctionne!');
              console.log(`💬 Réponse: ${testData.choices?.[0]?.message?.content || 'Réponse reçue'}`);
              console.log(`🏷️  Modèle confirmé: ${testData.model || firstModel}`);
            } else {
              const errorData = await testResponse.json().catch(() => null);
              console.log('❌ ERREUR lors du test:');
              console.log(`   Status: ${testResponse.status}`);
              if (errorData) {
                console.log(`   Message: ${errorData.error?.message || JSON.stringify(errorData)}`);
              }
            }
            
          } catch (testError) {
            console.log('❌ ERREUR lors du test:');
            console.log(`   ${testError.message}`);
          }
        }
        
      } else {
        console.log('⚠️  Format de réponse inattendu');
        console.log(JSON.stringify(data, null, 2));
      }
      
    } else {
      const errorData = await response.json().catch(() => null);
      console.log('❌ ERREUR lors de la récupération des modèles:');
      console.log(`   Status: ${response.status}`);
      if (errorData) {
        console.log(`   Message: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
    }
    
  } catch (error) {
    console.log('❌ ERREUR DE CONNEXION:');
    console.log(`   ${error.message}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 PROCHAINES ÉTAPES:');
  console.log('1. Notez le nom exact du modèle disponible');
  console.log('2. Mettez à jour votre configuration avec le bon nom de modèle');
  console.log('3. Mettez à jour la clé API dans .env.local');
  console.log('4. Relancez l\'audit des APIs');
}

checkGrokModels().catch(console.error);