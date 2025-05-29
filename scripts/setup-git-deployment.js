#!/usr/bin/env node

/**
 * Script de configuration du déploiement Git pour Vercel
 * Configure le déploiement automatique depuis GitHub
 */

console.log('🔗 Configuration du déploiement Git pour DropSkills');
console.log('==================================================\n');

console.log('📋 Étapes pour configurer le déploiement automatique:\n');

console.log('1. 🌐 Connecter GitHub à Vercel:');
console.log('   • Allez sur https://vercel.com/dashboard');
console.log('   • Cliquez sur "Import Project"');
console.log('   • Sélectionnez "Import Git Repository"');
console.log('   • Choisissez votre repository: NdfNegao/dropskills-app');
console.log('   • Configurez les paramètres de déploiement\n');

console.log('2. ⚙️  Configuration automatique:');
console.log('   • Framework Preset: Next.js');
console.log('   • Build Command: npm run build');
console.log('   • Output Directory: .next');
console.log('   • Install Command: npm install\n');

console.log('3. 🔐 Variables d\'environnement:');
console.log('   • Les variables sont déjà configurées sur Vercel');
console.log('   • Elles seront automatiquement utilisées\n');

console.log('4. 🚀 Déploiement automatique:');
console.log('   • Chaque push sur main → déploiement en production');
console.log('   • Chaque push sur autres branches → déploiement preview');
console.log('   • Pull requests → déploiements de test\n');

console.log('5. 📊 Monitoring:');
console.log('   • Logs en temps réel sur Vercel dashboard');
console.log('   • Métriques de performance');
console.log('   • Alertes en cas d\'erreur\n');

console.log('✅ Avantages du déploiement Git:');
console.log('   • 🔄 Déploiements automatiques');
console.log('   • 📝 Historique des déploiements');
console.log('   • 🔙 Rollback facile');
console.log('   • 🧪 Preview des branches');
console.log('   • 👥 Collaboration d\'équipe');
console.log('   • 🛡️  Sécurité renforcée\n');

console.log('🎯 Prochaines étapes:');
console.log('   1. Connecter le repository sur Vercel.com');
console.log('   2. Tester un déploiement avec un nouveau commit');
console.log('   3. Configurer les notifications de déploiement');
console.log('   4. Mettre en place les environnements (dev/staging/prod)\n');

console.log('💡 Commandes utiles:');
console.log('   • git push origin main → Déploiement production');
console.log('   • git push origin feature-branch → Preview deployment');
console.log('   • vercel --prod → Déploiement manuel (backup)');
console.log('   • vercel logs → Voir les logs de production\n');

console.log('🌐 URLs importantes:');
console.log('   • Dashboard Vercel: https://vercel.com/dashboard');
console.log('   • Repository GitHub: https://github.com/NdfNegao/dropskills-app');
console.log('   • Production actuelle: https://dropskills-g6atcqyei-cyrils-projects-5dd3a4d6.vercel.app\n');

console.log('🎉 Une fois connecté, votre workflow sera:');
console.log('   1. Développer localement');
console.log('   2. Committer les changements');
console.log('   3. Pousser vers GitHub');
console.log('   4. Vercel déploie automatiquement ! 🚀'); 