# Configuration n8n pour DropSkills

## 🎯 Vue d'ensemble

Cette documentation explique comment configurer n8n pour intégrer les outils IA de DropSkills.

## 📋 Prérequis

1. Compte n8n Cloud : `https://cyriliriebi.app.n8n.cloud`
2. Clé API n8n (optionnelle pour les webhooks publics)
3. Accès aux modèles IA (OpenAI, Claude, etc.)

## 🔧 Configuration des variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# n8n Configuration
N8N_BASE_URL=https://cyriliriebi.app.n8n.cloud
N8N_API_KEY=your_n8n_api_key_here
```

## 🛠️ Workflows n8n à créer

### 1. Générateur de Titres (`/webhook/generateur-titres`)

**Nœuds requis :**
1. **Webhook Trigger** : `/webhook/generateur-titres`
2. **Function Node** : Validation des données
3. **OpenAI Node** : Génération des titres
4. **Function Node** : Formatage de la réponse

**Prompt suggéré :**
```
Tu es un expert en copywriting. Génère {{$json.nombreTitres}} titres accrocheurs pour un {{$json.type}} sur le sujet "{{$json.sujet}}".

Critères :
- Émotion cible : {{$json.emotion}}
- Audience : grand public francophone
- Longueur : 50-80 caractères
- Style : engageant et professionnel

Pour chaque titre, fournis :
1. Le titre
2. Un score de 1 à 10 (impact marketing)
3. Une explication courte (pourquoi ce titre fonctionne)

Format de réponse JSON :
{
  "titres": [
    {
      "titre": "Votre titre ici",
      "score": 8,
      "explication": "Explication courte"
    }
  ]
}
```

### 2. Pack Créateur IA (`/webhook/pack-createur-ia`)

**Nœuds requis :**
1. **Webhook Trigger** : `/webhook/pack-createur-ia`
2. **Function Node** : Validation
3. **OpenAI Node** : Génération du pack
4. **Function Node** : Structuration

**Prompt suggéré :**
```
Crée un pack de produits digitaux complet pour la niche "{{$json.niche}}" destiné à "{{$json.audience}}".

Format souhaité : {{$json.format}}
Niveau : {{$json.niveau}}

Génère :
1. Titre du pack
2. Description marketing (150 mots)
3. Table des matières détaillée
4. 5 bonus complémentaires
5. Prix suggéré
6. Stratégie de lancement

Format JSON attendu...
```

### 3. Descriptions IA (`/webhook/descriptions-ia`)
### 4. Idées de Produits (`/webhook/idees-produits`)
### 5. Rebranding PDF (`/webhook/rebranding-pdf`)
### 6. Calculateur de Revenus (`/webhook/calculateur-revenus`)

## 🔗 Structure des webhooks

Chaque webhook doit :
1. Accepter les données POST en JSON
2. Valider les paramètres d'entrée
3. Appeler le modèle IA approprié
4. Retourner une réponse structurée

**Format de réponse standard :**
```json
{
  "success": true,
  "data": {
    // Résultats spécifiques à l'outil
  },
  "executionId": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🚀 Déploiement

1. Créez les workflows dans n8n
2. Activez les webhooks
3. Testez chaque endpoint
4. Configurez les variables d'environnement
5. Déployez l'application DropSkills

## 📊 Monitoring

- Surveillez les logs d'exécution dans n8n
- Configurez des alertes pour les échecs
- Optimisez les prompts selon les retours utilisateurs

## 🔒 Sécurité

- Utilisez HTTPS pour tous les webhooks
- Validez toutes les entrées utilisateur
- Limitez le taux de requêtes
- Loggez les accès pour audit

## 💡 Avantages de cette architecture

✅ **Scalabilité** : Gestion centralisée des workflows IA
✅ **Flexibilité** : Changement facile de modèles IA
✅ **Monitoring** : Suivi détaillé des performances
✅ **Maintenance** : Mise à jour des prompts sans redéploiement
✅ **Coûts** : Optimisation des appels API
✅ **Fiabilité** : Gestion d'erreurs et retry automatique 