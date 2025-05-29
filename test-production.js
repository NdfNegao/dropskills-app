#!/usr/bin/env node

/**
 * Test de l'application DropSkills en production
 * Vérifie que tout fonctionne sur Vercel
 */

const https = require('https');

const PRODUCTION_URL = 'https://dropskills-g6atcqyei-cyrils-projects-5dd3a4d6.vercel.app';

// Routes à tester en production
const PRODUCTION_ROUTES = [
  '/',
  '/auth/signin',
  '/catalogue',
  '/outils',
  '/outils/icp-maker',
  '/outils/generateur-offre',
  '/api/auth/providers',
  '/api/auth/session'
];

console.log('🌐 Test de DropSkills en Production');
console.log('===================================\n');
console.log(`🔗 URL: ${PRODUCTION_URL}\n`);

async function testProductionRoute(route) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      hostname: 'dropskills-g6atcqyei-cyrils-projects-5dd3a4d6.vercel.app',
      path: route,
      method: 'GET',
      headers: {
        'User-Agent': 'DropSkills-Production-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const success = status >= 200 && status < 400;
        const size = Buffer.byteLength(data, 'utf8');
        
        resolve({
          route,
          status,
          success,
          responseTime,
          size
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        route,
        status: 0,
        success: false,
        responseTime: -1,
        size: 0,
        error: err.message
      });
    });

    req.end();
  });
}

async function runProductionTests() {
  console.log(`🚀 Test de ${PRODUCTION_ROUTES.length} routes en production...\n`);
  
  const results = [];
  
  for (const route of PRODUCTION_ROUTES) {
    console.log(`🔍 Test: ${route}`);
    const result = await testProductionRoute(route);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    const time = result.responseTime > 0 ? `${result.responseTime}ms` : 'Erreur';
    const size = result.size > 0 ? `${(result.size / 1024).toFixed(1)}KB` : '-';
    
    console.log(`   ${status} ${time} | ${size} | Status: ${result.status}`);
    
    if (result.error) {
      console.log(`   ❌ Erreur: ${result.error}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Analyse des résultats
  console.log('\n📊 Résultats de production:');
  console.log('===========================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Routes fonctionnelles: ${successful}/${results.length}`);
  console.log(`❌ Routes en échec: ${failed}/${results.length}`);
  
  if (successful > 0) {
    const successfulTests = results.filter(r => r.success);
    const avgResponseTime = successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length;
    const maxResponseTime = Math.max(...successfulTests.map(r => r.responseTime));
    const minResponseTime = Math.min(...successfulTests.map(r => r.responseTime));
    
    console.log(`⏱️  Temps de réponse moyen: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`🚀 Temps de réponse min: ${minResponseTime}ms`);
    console.log(`🐌 Temps de réponse max: ${maxResponseTime}ms`);
  }
  
  if (failed > 0) {
    console.log('\n🔍 Routes en échec:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.route} (${r.status})`);
    });
  }
  
  console.log('\n🎉 Test de production terminé !');
  
  if (successful === results.length) {
    console.log('🚀 DropSkills fonctionne parfaitement en production !');
    console.log('\n🌐 Votre application est maintenant live à:');
    console.log(`   ${PRODUCTION_URL}`);
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. ✅ Tester les fonctionnalités manuellement');
    console.log('   2. 🔧 Configurer un domaine personnalisé');
    console.log('   3. 🔐 Mettre à jour Google OAuth');
    console.log('   4. 📊 Configurer les analytics');
  } else {
    console.log('⚠️  Certaines routes nécessitent une attention en production.');
  }
}

runProductionTests(); 