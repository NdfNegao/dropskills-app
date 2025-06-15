# Implémentation RAG (Retrieval-Augmented Generation)

## Vue d'ensemble

Ce document décrit l'implémentation complète du système RAG pour Dropskills, permettant au Master Mentor d'accéder à une base de connaissances structurée pour fournir des réponses plus précises et contextuelles.

## Architecture

### Composants principaux

1. **Base de données (Supabase + pgvector)**
   - `knowledge_documents` : Stockage des documents sources
   - `knowledge_chunks` : Fragments de texte avec embeddings vectoriels
   - Extension `pgvector` pour la recherche de similarité

2. **Service RAG (`src/lib/rag.ts`)**
   - Génération d'embeddings avec OpenAI
   - Chunking intelligent du texte
   - Recherche de similarité vectorielle
   - Génération de réponses contextuelles

3. **APIs REST**
   - `/api/rag/documents` : Gestion des documents
   - `/api/rag/search` : Recherche et génération RAG

4. **Interface d'administration**
   - `/admin/rag` : Interface de gestion de la base de connaissances

## Structure de la base de données

### Table `knowledge_documents`
```sql
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `knowledge_chunks`
```sql
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Installation et configuration

### 1. Prérequis

```bash
# Installer les dépendances
npm install openai @langchain/openai @langchain/community langchain
```

### 2. Configuration de la base de données

```bash
# Exécuter le script SQL de setup
psql -h your-supabase-host -U postgres -d postgres -f sql/rag_setup.sql
```

### 3. Variables d'environnement

```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Initialisation de la base de connaissances

```bash
# Exécuter le script d'initialisation
npx ts-node scripts/init-rag.ts
```

## Utilisation

### API de gestion des documents

#### Lister les documents
```http
GET /api/rag/documents
```

#### Ajouter un document
```http
POST /api/rag/documents
Content-Type: application/json

{
  "title": "Titre du document",
  "content": "Contenu du document...",
  "sourceUrl": "https://example.com",
  "sourceType": "article",
  "tags": ["tag1", "tag2"]
}
```

#### Supprimer un document
```http
DELETE /api/rag/documents
Content-Type: application/json

{
  "documentId": "uuid-du-document"
}
```

### API de recherche RAG

#### Recherche simple
```http
POST /api/rag/search
Content-Type: application/json

{
  "query": "Comment optimiser mes tunnels de vente ?",
  "mode": "search",
  "limit": 5
}
```

#### Génération RAG complète
```http
POST /api/rag/search
Content-Type: application/json

{
  "query": "Comment optimiser mes tunnels de vente ?",
  "mode": "full"
}
```

### Intégration avec le Master Mentor

Le Master Mentor utilise automatiquement le système RAG :

1. **Détection automatique** : Quand `mentorId === 'master-mentor'`
2. **Recherche contextuelle** : Recherche dans la base de connaissances
3. **Seuil de confiance** : Utilise RAG si `confidence > 0.6`
4. **Fallback intelligent** : Retombe sur l'IA classique si nécessaire

## Interface d'administration

Accédez à `/admin/rag` pour :

- **Visualiser** tous les documents de la base de connaissances
- **Rechercher** dans la base avec aperçu des résultats
- **Ajouter** de nouveaux documents
- **Supprimer** des documents existants

## Fonctionnalités avancées

### Chunking intelligent

- **Respect des paragraphes** : Préserve la structure du contenu
- **Limite de tokens** : Chunks de ~500 tokens pour optimiser les embeddings
- **Overlap minimal** : Évite la duplication tout en gardant le contexte

### Recherche de similarité

- **Embeddings OpenAI** : Modèle `text-embedding-3-small`
- **Recherche vectorielle** : Utilise la similarité cosinus
- **Filtrage par pertinence** : Seuil de similarité configurable

### Génération de réponses

- **Contexte enrichi** : Combine les chunks les plus pertinents
- **Prompt engineering** : Template optimisé pour la cohérence
- **Sources citées** : Références automatiques aux documents sources
- **Score de confiance** : Évaluation de la qualité de la réponse

## Métriques et monitoring

### Métriques clés

- **Temps de réponse** : Latence des requêtes RAG
- **Taux d'utilisation** : Fréquence d'activation du RAG vs fallback
- **Score de confiance moyen** : Qualité des réponses générées
- **Couverture des requêtes** : % de requêtes trouvant du contenu pertinent

### Logs et debugging

```typescript
// Exemple de log RAG
console.log('RAG Search:', {
  query: userQuery,
  foundChunks: searchResults.length,
  confidence: response.confidence,
  sources: response.sources.map(s => s.title)
});
```

## Optimisations et bonnes pratiques

### Performance

1. **Index vectoriel** : Créé automatiquement sur la colonne `embedding`
2. **Pagination** : Limitez les résultats de recherche
3. **Cache** : Considérez un cache Redis pour les requêtes fréquentes
4. **Batch processing** : Traitez les documents par lots

### Qualité du contenu

1. **Contenu structuré** : Utilisez des titres et sous-titres clairs
2. **Longueur optimale** : Documents de 1000-5000 mots
3. **Tags pertinents** : Facilitent la recherche et l'organisation
4. **Mise à jour régulière** : Gardez le contenu à jour

### Sécurité

1. **Validation des entrées** : Sanitisez tout contenu utilisateur
2. **Authentification** : Protégez les endpoints d'administration
3. **Rate limiting** : Limitez les requêtes par utilisateur
4. **Logs d'audit** : Tracez les modifications de contenu

## Dépannage

### Problèmes courants

#### Pas de résultats RAG
- Vérifiez que la base de connaissances contient du contenu
- Ajustez le seuil de similarité
- Reformulez la requête

#### Réponses de mauvaise qualité
- Améliorez la qualité du contenu source
- Ajustez le prompt template
- Augmentez le nombre de chunks récupérés

#### Performance lente
- Vérifiez les index de base de données
- Optimisez la taille des chunks
- Considérez un cache

### Commandes utiles

```bash
# Réinitialiser la base de connaissances
npx ts-node scripts/init-rag.ts

# Vérifier la configuration
node -e "console.log(process.env.OPENAI_API_KEY ? 'OpenAI OK' : 'OpenAI manquant')"

# Tester la connexion Supabase
node -e "const { supabaseAdmin } = require('./src/lib/supabase'); supabaseAdmin.from('knowledge_documents').select('count').then(console.log)"
```

## Évolutions futures

### Fonctionnalités prévues

1. **Import automatique** : Synchronisation avec des sources externes
2. **Embeddings multilingues** : Support de plusieurs langues
3. **Recherche hybride** : Combinaison recherche vectorielle + textuelle
4. **Analytics avancées** : Dashboard de performance RAG
5. **Fine-tuning** : Modèles personnalisés pour le domaine

### Intégrations possibles

- **Notion/Confluence** : Import automatique de documentation
- **YouTube** : Transcription et indexation de vidéos
- **PDF/Documents** : Extraction et traitement automatique
- **Web scraping** : Veille automatique de contenu

## Support

Pour toute question ou problème :

1. Consultez les logs d'application
2. Vérifiez la configuration des variables d'environnement
3. Testez les endpoints API individuellement
4. Contactez l'équipe technique avec les détails de l'erreur

---

*Documentation mise à jour le : [Date actuelle]*
*Version : 1.0*