# 📄 Fonctionnalité d'Upload PDF pour le Système RAG

## 🎯 Objectif

Cette fonctionnalité permet d'ajouter facilement des documents PDF à la base de connaissances du système RAG de DropSkills, avec support automatique de la traduction français/anglais pour répondre aux besoins de la communauté majoritairement francophone.

## ✨ Fonctionnalités Implémentées

### 🔄 Traitement Automatique
- **Extraction de texte PDF** avec `pdf-parse`
- **Détection automatique de langue** (français/anglais)
- **Traduction automatique** des documents anglais vers le français
- **Chunking intelligent** et génération d'embeddings
- **Indexation automatique** dans Supabase avec pgvector

### 🌍 Support Multilingue
- **Détection basique** : Analyse des mots courants français/anglais
- **Google Translate** (optionnel) : Détection précise et traduction de qualité
- **Métadonnées de traduction** : Suivi des documents traduits
- **Tags automatiques** : `anglais`, `traduit`, `pdf`

### 🎨 Interface Utilisateur
- **Drag & Drop** : Glissez-déposez vos PDF
- **Validation en temps réel** : Type, taille, contenu
- **Barre de progression** : Suivi de l'upload
- **Métadonnées personnalisables** : Titre, type, tags, URL source

## 🚀 Installation et Configuration

### 1. Dépendances Installées

```bash
npm install pdf-parse multer @types/multer @google-cloud/translate
```

### 2. Variables d'Environnement

Ajoutez dans votre `.env.local` :

```env
# Google Translate (optionnel - pour traduction automatique)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

**Note** : Sans Google Translate, le système utilise une détection basique mais fonctionnelle.

### 3. Fichiers Créés

```
src/
├── app/api/rag/upload/
│   └── route.ts                 # API d'upload et traitement PDF
├── components/rag/
│   └── PDFUpload.tsx           # Composant d'upload avec drag & drop
└── app/admin/rag/page.tsx      # Interface admin mise à jour

docs/
└── PDF_UPLOAD.md               # Documentation complète

scripts/
└── test-pdf-upload.js          # Script de test automatisé
```

## 📖 Utilisation

### Interface Web

1. **Accès** : `/admin/rag` → Onglet "Upload PDF"
2. **Upload** : Glissez-déposez ou sélectionnez un PDF
3. **Métadonnées** : Titre, type, tags, URL source
4. **Options** : Traduction automatique (recommandée)
5. **Validation** : Upload et traitement automatique

### API REST

```typescript
// POST /api/rag/upload
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('title', 'Mon Document');
formData.append('sourceType', 'document');
formData.append('tags', 'formation, marketing');
formData.append('autoTranslate', 'true');

const response = await fetch('/api/rag/upload', {
  method: 'POST',
  body: formData
});
```

## 🧪 Tests

### Test Automatisé

```bash
# Démarrer le serveur
npm run dev

# Dans un autre terminal
node scripts/test-pdf-upload.js
```

### Test Manuel

1. Allez sur `http://localhost:3000/admin/rag`
2. Cliquez sur l'onglet "Upload PDF"
3. Testez avec un PDF de votre choix
4. Vérifiez dans l'onglet "Documents" que le document apparaît
5. Testez la recherche dans l'onglet "Recherche"

## 🔧 Spécifications Techniques

### Limites
- **Taille maximum** : 10 MB
- **Types supportés** : PDF uniquement
- **Contenu minimum** : 100 caractères extractibles
- **Langues** : Français, Anglais

### Traitement
1. **Validation** : Type, taille, contenu
2. **Extraction** : Texte du PDF avec `pdf-parse`
3. **Nettoyage** : Normalisation des espaces et caractères
4. **Détection langue** : Analyse ou Google Translate
5. **Traduction** : Si anglais et option activée
6. **Chunking** : Division en segments optimisés
7. **Embeddings** : Génération avec OpenAI
8. **Indexation** : Stockage dans Supabase

### Métadonnées Automatiques

```json
{
  "originalFileName": "document.pdf",
  "fileSize": 1024000,
  "detectedLanguage": "en",
  "wasTranslated": true,
  "extractedAt": "2024-01-15T10:30:00Z",
  "originalTextLength": 5000,
  "finalTextLength": 5200
}
```

## 🌍 Gestion Multilingue

### Détection de Langue

**Sans Google Translate** :
- Analyse des 100 premiers mots
- Comparaison avec dictionnaires français/anglais
- Fiable pour la plupart des documents

**Avec Google Translate** :
- Détection précise via API Google
- Support de nombreuses langues
- Traduction de haute qualité

### Stratégie de Traduction

1. **Documents français** : Aucune traduction nécessaire
2. **Documents anglais** : Traduction automatique si activée
3. **Chunking intelligent** : Division en segments de 4000 caractères
4. **Rate limiting** : Pause de 100ms entre chunks
5. **Fallback** : Conservation du texte original en cas d'erreur

## 🔍 Intégration avec le Master Mentor

Les documents uploadés sont automatiquement :

1. **Indexés** dans la base de connaissances
2. **Disponibles** pour les requêtes du Master Mentor
3. **Cités** comme sources dans les réponses
4. **Recherchables** via l'interface de test

### Exemple d'Utilisation

```
Utilisateur: "Comment faire du marketing digital ?"

Master Mentor: "Basé sur les documents de formation disponibles..."
[Cite automatiquement les PDFs uploadés pertinents]
```

## 🛠️ Dépannage

### Erreurs Communes

1. **"Type de fichier non supporté"**
   - Vérifiez que le fichier est bien un PDF
   - Certains PDF corrompus peuvent causer cette erreur

2. **"PDF ne contient pas assez de texte"**
   - PDF scanné sans OCR
   - PDF avec uniquement des images
   - Solution : Utilisez un outil OCR avant upload

3. **"Erreur lors de l'extraction"**
   - PDF protégé par mot de passe
   - PDF corrompu
   - Solution : Réenregistrez le PDF depuis votre éditeur

4. **Traduction non disponible**
   - Variable `GOOGLE_TRANSLATE_API_KEY` non configurée
   - Le système utilise la détection basique (fonctionnelle)

### Logs de Debug

Vérifiez les logs du serveur pour :
- Erreurs d'extraction PDF
- Problèmes de traduction
- Erreurs d'indexation Supabase

## 📊 Monitoring

### Métriques à Surveiller

- **Taux de succès** des uploads
- **Qualité des traductions** (vérification manuelle)
- **Performance** de l'extraction (temps de traitement)
- **Taille** de la base de connaissances

### Maintenance

- **Nettoyage périodique** des documents obsolètes
- **Mise à jour** des traductions si nécessaire
- **Optimisation** des chunks pour de meilleures performances

## 🎯 Avantages pour DropSkills

### Pour les Utilisateurs Francophones
- **Accès facilité** aux ressources anglaises
- **Traduction automatique** de qualité
- **Base de connaissances enrichie** rapidement

### Pour les Administrateurs
- **Gain de temps** : Plus besoin de copier-coller manuellement
- **Qualité** : Traitement automatisé et cohérent
- **Scalabilité** : Ajout rapide de nombreux documents

### Pour le Master Mentor
- **Réponses plus riches** grâce à plus de contenu
- **Sources diversifiées** (français et anglais traduit)
- **Mise à jour facile** de la base de connaissances

## 🚀 Évolutions Futures

### Améliorations Possibles
- **Support OCR** pour les PDF scannés
- **Traitement batch** pour plusieurs fichiers
- **Détection automatique** de la qualité de traduction
- **Interface de révision** des traductions
- **Support d'autres formats** (DOCX, TXT)

### Optimisations
- **Cache des traductions** pour éviter les re-traductions
- **Compression intelligente** des chunks
- **Parallélisation** du traitement

---

**Cette implémentation répond parfaitement au besoin exprimé d'ajouter des documents PDF au système RAG, avec une attention particulière au support multilingue pour la communauté francophone de DropSkills.**