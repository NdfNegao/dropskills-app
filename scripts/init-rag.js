/**
 * Script d'initialisation de la base de connaissances RAG
 * Ajoute du contenu de base pour le Master Mentor
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fonction pour générer un embedding
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Erreur génération embedding:', error);
    throw error;
  }
}

// Fonction pour découper le texte en chunks
function chunkText(text, maxTokens = 500) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + sentence + '. ';
    
    if (potentialChunk.length > maxTokens * 4 && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '. ';
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

// Fonction pour ajouter un document
async function addDocument(title, content, sourceUrl, sourceType = 'document', tags = [], metadata = {}) {
  try {
    // 1. Insérer le document
    const { data: document, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title,
        content,
        source_url: sourceUrl,
        source_type: sourceType,
        tags,
        metadata
      })
      .select('id')
      .single();
    
    if (docError) throw docError;
    
    // 2. Découper le contenu en chunks
    const chunks = chunkText(content);
    
    // 3. Générer les embeddings et insérer les chunks
    const chunkInserts = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      chunkInserts.push({
        document_id: document.id,
        chunk_text: chunk,
        chunk_index: i,
        embedding: JSON.stringify(embedding),
        token_count: Math.ceil(chunk.length / 4)
      });
    }
    
    const { error: chunksError } = await supabase
      .from('knowledge_chunks')
      .insert(chunkInserts);
    
    if (chunksError) throw chunksError;
    
    console.log(`Document ajouté: ${title} (${chunks.length} chunks)`);
    return document.id;
    
  } catch (error) {
    console.error('Erreur ajout document:', error);
    throw error;
  }
}

const INITIAL_DOCUMENTS = [
  {
    title: "Guide Dropskills - Introduction à la plateforme",
    content: `Dropskills est une plateforme d'apprentissage révolutionnaire spécialisée dans le marketing digital, le copywriting et l'intelligence artificielle. Notre mission est d'aider les entrepreneurs, marketeurs et créateurs de contenu à développer leurs compétences et leur business grâce à des formations pratiques et des outils IA innovants.

La plateforme propose :
- Des formations complètes en marketing digital
- Des outils IA pour automatiser vos tâches
- Des mentors IA spécialisés par domaine
- Une communauté active d'entrepreneurs
- Des ressources pratiques et templates

Dropskills se distingue par son approche pratique et orientée résultats. Chaque formation est conçue pour être immédiatement applicable dans votre business. Les outils IA intégrés vous permettent de gagner du temps sur les tâches répétitives tout en maintenant une qualité professionnelle.

Notre philosophie : apprendre en faisant, avec des résultats mesurables dès les premiers jours.`,
    sourceType: "guide",
    tags: ["dropskills", "introduction", "plateforme", "marketing", "ia"]
  },
  {
    title: "Copywriting - Les fondamentaux de la persuasion",
    content: `Le copywriting efficace repose sur la compréhension profonde de votre audience cible. Voici les principes fondamentaux :

**1. Connaître son audience**
- Identifiez leurs douleurs principales
- Comprenez leurs désirs profonds
- Anticipez leurs objections
- Adaptez votre langage à leur niveau

**2. Structure AIDA**
- Attention : Captez l'attention dès les premiers mots
- Intérêt : Maintenez l'engagement avec des bénéfices clairs
- Désir : Créez l'envie avec des preuves sociales
- Action : Guidez vers l'action avec un CTA clair

**3. Techniques de persuasion**
- Urgence et rareté
- Preuves sociales et témoignages
- Autorité et expertise
- Réciprocité et engagement

**4. Optimisation continue**
- Testez différentes versions
- Analysez les métriques de conversion
- Ajustez selon les retours
- Mesurez l'impact sur les ventes`,
    sourceType: "guide",
    tags: ["copywriting", "persuasion", "vente", "marketing", "conversion"]
  },
  {
    title: "Intelligence Artificielle - Applications Business",
    content: `L'intelligence artificielle transforme le business moderne. Voici les applications les plus impactantes :

**1. Automatisation du service client**
- Chatbots intelligents 24/7
- Réponses personnalisées
- Escalade automatique vers humains
- Analyse de sentiment en temps réel

**2. Marketing et ventes**
- Personnalisation des recommandations
- Segmentation automatique des audiences
- Optimisation des campagnes publicitaires
- Prédiction du comportement d'achat

**3. Création de contenu**
- Génération de textes marketing
- Création d'images et vidéos
- Optimisation SEO automatique
- Traduction multilingue

**4. Analyse et insights**
- Analyse prédictive des ventes
- Détection de tendances
- Optimisation des prix
- Prévision de la demande

**5. Productivité**
- Automatisation des tâches répétitives
- Planification intelligente
- Gestion de projet assistée
- Synthèse de documents`,
    sourceType: "article",
    tags: ["ia", "business", "automatisation", "marketing", "productivité"]
  }
];

async function initializeRAG() {
  console.log('🚀 Initialisation de la base de connaissances RAG...');
  
  try {
    for (let i = 0; i < INITIAL_DOCUMENTS.length; i++) {
      const doc = INITIAL_DOCUMENTS[i];
      console.log(`📄 Ajout du document ${i + 1}/${INITIAL_DOCUMENTS.length}: ${doc.title}`);
      
      await addDocument(
        doc.title,
        doc.content,
        undefined, // sourceUrl
        doc.sourceType,
        doc.tags
      );
      
      console.log(`✅ Document "${doc.title}" ajouté avec succès`);
    }
    
    console.log('\n🎉 Initialisation terminée avec succès!');
    console.log(`📊 ${INITIAL_DOCUMENTS.length} documents ajoutés à la base de connaissances`);
    console.log('\n💡 Vous pouvez maintenant tester le Master Mentor avec ces connaissances.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécution du script
initializeRAG();