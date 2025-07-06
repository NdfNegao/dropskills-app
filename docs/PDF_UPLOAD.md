# Upload de Documents PDF dans le Système RAG

## Vue d'ensemble

Le système RAG de DropSkills supporte maintenant l'upload et le traitement automatique de documents PDF. Cette fonctionnalité permet d'ajouter facilement du contenu à la base de connaissances du Master Mentor.

## Fonctionnalités

### 🔄 Traitement Automatique
- **Extraction de texte** : Conversion automatique du PDF en texte
- **Chunking intelligent** : Division du contenu en segments optimisés
- **Génération d'embeddings** : Vectorisation pour la recherche sémantique
- **Indexation** : Ajout automatique à la base de connaissances

### 🌍 Support Multilingue
- **Détection automatique** de la langue (français/anglais)
- **Traduction automatique** des documents anglais vers le français
- **Préservation du contenu original** avec métadonnées de traduction
- **Tags automatiques** pour identifier les documents traduits

### 📁 Interface Utilisateur
- **Drag & Drop** : Glissez-déposez vos PDF directement
- **Sélection de fichiers** : Interface classique de sélection
- **Métadonnées personnalisables** : Titre, type, tags, URL source
- **Barre de progression** : Suivi en temps réel de l'upload
- **Validation** : Vérification automatique des fichiers

## Utilisation

### 1. Accès à l'Interface

1. Connectez-vous en tant qu'administrateur
2. Allez dans **Admin** → **RAG**
3. Cliquez sur l'onglet **"Upload PDF"**

### 2. Upload d'un Document

1. **Sélection du fichier** :
   - Glissez-déposez votre PDF dans la zone prévue
   - Ou cliquez sur "Sélectionner un PDF"

2. **Métadonnées** :
   - **Titre** (requis) : Nom du document
   - **Type de source** : Document, Article, Guide, FAQ
   - **URL source** (optionnel) : Lien vers la source originale
   - **Tags** (optionnel) : Mots-clés séparés par des virgules

3. **Options de traduction** :
   - Activez/désactivez la traduction automatique
   - Recommandé : **Activé** pour les documents anglais

4. **Upload** :
   - Cliquez sur "Uploader"
   - Suivez la progression
   - Confirmation de succès

### 3. Traitement Automatique

Le système effectue automatiquement :

1. **Validation** du fichier (type, taille)
2. **Extraction** du texte du PDF
3. **Détection** de la langue
4. **Traduction** (si activée et document en anglais)
5. **Chunking** du contenu
6. **Génération** des embeddings
7. **Indexation** dans la base de connaissances

## Configuration

### Variables d'Environnement

```env
# Google Translate (optionnel - pour traduction automatique)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

### Limites Techniques

- **Taille maximum** : 10 MB par fichier
- **Types supportés** : PDF uniquement
- **Contenu minimum** : 100 caractères de texte extractible
- **Langues supportées** : Français, Anglais (détection automatique)

## Métadonnées Automatiques

Le système ajoute automatiquement :

- **Tags** :
  - `pdf` : Identifie les documents uploadés
  - `anglais` : Pour les documents en anglais
  - `traduit` : Pour les documents traduits

- **Métadonnées** :
  - Nom du fichier original
  - Taille du fichier
  - Langue détectée
  - Statut de traduction
  - Longueur du texte (original et final)
  - Date d'extraction

## Gestion des Erreurs

### Erreurs Communes

1. **"Type de fichier non supporté"**
   - Solution : Utilisez uniquement des fichiers PDF

2. **"Fichier trop volumineux"**
   - Solution : Réduisez la taille (max 10MB)

3. **"PDF ne contient pas assez de texte"**
   - Solution : Vérifiez que le PDF contient du texte extractible
   - Note : Les PDF scannés sans OCR ne fonctionneront pas

4. **"Erreur lors de l'extraction"**
   - Solution : Vérifiez que le PDF n'est pas corrompu
   - Essayez de le réenregistrer depuis votre éditeur PDF

### Traduction

- **Sans Google Translate** : Détection basique français/anglais
- **Avec Google Translate** : Détection précise et traduction de qualité
- **Fallback** : En cas d'erreur, le texte original est conservé

## Bonnes Pratiques

### 📝 Préparation des Documents

1. **Qualité du PDF** :
   - Utilisez des PDF avec du texte sélectionnable
   - Évitez les PDF scannés sans OCR
   - Vérifiez que le contenu est bien structuré

2. **Métadonnées** :
   - Choisissez des titres descriptifs
   - Utilisez des tags pertinents
   - Ajoutez l'URL source si disponible

3. **Organisation** :
   - Groupez les documents par thématique avec des tags
   - Utilisez des conventions de nommage cohérentes
   - Documentez la source des informations

### 🌍 Gestion Multilingue

1. **Documents Anglais** :
   - Activez la traduction automatique
   - Vérifiez la qualité de la traduction après upload
   - Ajoutez des tags spécifiques (`english-source`, `technical-doc`)

2. **Documents Français** :
   - La traduction n'est pas nécessaire
   - Le système détecte automatiquement la langue

## API Endpoint

### POST `/api/rag/upload`

```typescript
// FormData avec :
interface UploadRequest {
  file: File;              // Fichier PDF
  title: string;           // Titre du document
  sourceType?: string;     // Type de source
  sourceUrl?: string;      // URL source
  tags?: string;           // Tags séparés par virgules
  autoTranslate?: boolean; // Traduction automatique
}

// Réponse :
interface UploadResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    detectedLanguage: string;
    wasTranslated: boolean;
    textLength: number;
    tags: string[];
  };
  message?: string;
  error?: string;
}
```

## Intégration avec le Master Mentor

Les documents uploadés sont automatiquement :

1. **Indexés** dans la base de connaissances
2. **Disponibles** pour les requêtes du Master Mentor
3. **Recherchables** via l'interface de test
4. **Cités** comme sources dans les réponses

## Monitoring et Maintenance

### Surveillance

- Vérifiez régulièrement les logs d'upload
- Surveillez la qualité des traductions
- Contrôlez la taille de la base de connaissances

### Maintenance

- Nettoyez périodiquement les documents obsolètes
- Mettez à jour les tags et métadonnées
- Vérifiez la pertinence des traductions

## Support et Dépannage

En cas de problème :

1. Vérifiez les logs de l'application
2. Contrôlez la configuration des variables d'environnement
3. Testez avec un PDF simple
4. Vérifiez la connectivité aux services externes (Google Translate)

---

*Cette fonctionnalité améliore significativement l'efficacité d'ajout de contenu au système RAG, particulièrement pour les documents techniques et éducatifs en anglais qui constituent une part importante des ressources de formation.*