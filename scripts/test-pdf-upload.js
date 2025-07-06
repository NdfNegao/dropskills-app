/**
 * Script de test pour l'API d'upload PDF
 * Usage: node scripts/test-pdf-upload.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_PDF_PATH = path.join(__dirname, 'test-document.pdf');

// Créer un PDF de test simple si il n'existe pas
function createTestPDF() {
  const PDFDocument = require('pdfkit');
  
  if (fs.existsSync(TEST_PDF_PATH)) {
    console.log('📄 PDF de test existant trouvé');
    return;
  }
  
  console.log('📄 Création d\'un PDF de test...');
  
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(TEST_PDF_PATH));
  
  // Contenu du PDF de test
  doc.fontSize(20).text('Document de Test RAG', 100, 100);
  doc.fontSize(14).text('\nCeci est un document de test pour valider le système d\'upload PDF du RAG.', 100, 150);
  doc.text('\nContenu en français :', 100, 200);
  doc.text('- Formation en marketing digital', 100, 230);
  doc.text('- Stratégies de copywriting', 100, 250);
  doc.text('- Intelligence artificielle appliquée', 100, 270);
  doc.text('\nCe document contient suffisamment de texte pour être traité par le système RAG.', 100, 320);
  doc.text('Il sera automatiquement découpé en chunks et indexé dans la base de connaissances.', 100, 350);
  
  doc.end();
  
  console.log('✅ PDF de test créé:', TEST_PDF_PATH);
}

// Test de l'API d'upload
async function testPDFUpload() {
  try {
    console.log('🚀 Test de l\'API d\'upload PDF...');
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(TEST_PDF_PATH)) {
      throw new Error('Fichier PDF de test non trouvé');
    }
    
    // Préparer les données
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_PDF_PATH));
    formData.append('title', 'Document de Test RAG');
    formData.append('sourceType', 'document');
    formData.append('tags', 'test, formation, marketing');
    formData.append('autoTranslate', 'false');
    
    // Envoyer la requête
    console.log('📤 Envoi du fichier...');
    const response = await fetch(`${API_BASE_URL}/api/rag/upload`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Upload réussi!');
      console.log('📊 Résultat:', {
        id: result.data.id,
        title: result.data.title,
        langue: result.data.detectedLanguage,
        traduit: result.data.wasTranslated,
        longueur: result.data.textLength,
        tags: result.data.tags
      });
    } else {
      console.error('❌ Erreur upload:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur test:', error.message);
  }
}

// Test de recherche
async function testRAGSearch() {
  try {
    console.log('\n🔍 Test de recherche RAG...');
    
    const response = await fetch(`${API_BASE_URL}/api/rag/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'formation marketing digital',
        mode: 'search',
        limit: 3
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Recherche réussie!');
      console.log(`📊 ${result.data.results.length} résultats trouvés`);
      
      result.data.results.forEach((res, index) => {
        console.log(`\n${index + 1}. ${res.document_title}`);
        console.log(`   Similarité: ${(res.similarity * 100).toFixed(1)}%`);
        console.log(`   Extrait: ${res.chunk_text.substring(0, 100)}...`);
      });
    } else {
      console.error('❌ Erreur recherche:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur test recherche:', error.message);
  }
}

// Test complet
async function runTests() {
  console.log('🧪 Tests du système d\'upload PDF RAG\n');
  
  try {
    // Vérifier que le serveur est démarré
    console.log('🔍 Vérification du serveur...');
    const healthCheck = await fetch(`${API_BASE_URL}/api/health`).catch(() => null);
    
    if (!healthCheck) {
      console.log('⚠️  Serveur non accessible. Assurez-vous que le serveur Next.js est démarré.');
      console.log('   Commande: npm run dev');
      return;
    }
    
    // Créer le PDF de test
    createTestPDF();
    
    // Attendre un peu pour la création du fichier
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test d'upload
    await testPDFUpload();
    
    // Attendre un peu pour l'indexation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test de recherche
    await testRAGSearch();
    
    console.log('\n🎉 Tests terminés!');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Nettoyage
function cleanup() {
  if (fs.existsSync(TEST_PDF_PATH)) {
    fs.unlinkSync(TEST_PDF_PATH);
    console.log('🧹 Fichier de test supprimé');
  }
}

// Gestion des signaux pour le nettoyage
process.on('SIGINT', () => {
  console.log('\n🛑 Interruption détectée');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

// Exécution
if (require.main === module) {
  runTests().finally(() => {
    // Garder le fichier de test pour inspection manuelle
    console.log('\n📝 Le fichier de test est conservé pour inspection:', TEST_PDF_PATH);
  });
}

module.exports = {
  testPDFUpload,
  testRAGSearch,
  createTestPDF
};