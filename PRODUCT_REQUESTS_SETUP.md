# 🚀 Configuration du Système de Demandes de Produits

## 📋 Vue d'ensemble

Le système de demandes de produits permet aux utilisateurs de :
- ✅ Suggérer de nouveaux produits
- ✅ Voter pour les demandes existantes
- ✅ Voir le statut des demandes (En attente, En cours, Terminé, Rejeté)
- ✅ Recevoir des notifications sur l'avancement

Les administrateurs peuvent :
- ✅ Gérer toutes les demandes
- ✅ Modifier les statuts et priorités
- ✅ Ajouter des notes internes
- ✅ Définir des dates de livraison estimées
- ✅ Supprimer des demandes

## 🗄️ Configuration de la Base de Données

### Étape 1 : Créer les Tables dans Supabase

1. **Connectez-vous à votre Dashboard Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Sélectionnez votre projet DropSkills

2. **Ouvrez l'Éditeur SQL**
   - Dans le menu latéral, cliquez sur "SQL Editor"
   - Cliquez sur "New Query"

3. **Exécutez le Script SQL**
   - Copiez tout le contenu du fichier `product_requests_schema.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" pour exécuter le script

### Étape 2 : Vérifier la Création des Tables

Après l'exécution du script, vous devriez voir :

**Tables créées :**
- `product_requests` - Stocke les demandes de produits
- `product_request_votes` - Stocke les votes des utilisateurs

**Fonctions créées :**
- `increment_request_votes()` - Incrémente le compteur de votes
- `decrement_request_votes()` - Décrémente le compteur de votes
- `update_updated_at_column()` - Met à jour automatiquement la date de modification

**Données de test :**
- 6 demandes de produits avec différents statuts
- Données réalistes pour tester le système

## 🔧 Configuration de l'Application

### Étape 3 : Vérifier les APIs

Les APIs suivantes ont été créées :

**APIs Utilisateur :**
- `GET /api/product-requests` - Récupère toutes les demandes
- `POST /api/product-requests` - Crée une nouvelle demande
- `POST /api/product-requests/[id]/vote` - Vote/dé-vote pour une demande
- `GET /api/product-requests/[id]/vote` - Vérifie si l'utilisateur a voté

**APIs Admin :**
- `GET /api/admin/product-requests` - Récupère toutes les demandes (admin)
- `PUT /api/admin/product-requests` - Met à jour une demande (admin)
- `DELETE /api/admin/product-requests` - Supprime une demande (admin)

### Étape 4 : Vérifier les Pages

**Page Utilisateur :**
- `/demandes` - Interface utilisateur pour voir et créer des demandes

**Page Admin :**
- `/admin/product-requests` - Interface admin pour gérer les demandes

## 🎯 Fonctionnalités Implémentées

### ✅ Interface Utilisateur

**Page Demandes (`/demandes`) :**
- Statistiques en temps réel (Total, En cours, Terminées, Votes)
- Onglets par statut (Idées, En cours, Terminé, Rejeté)
- Système de vote interactif
- Formulaire de création de demandes avec validation
- Affichage des notes admin et dates estimées
- Design responsive et moderne

**Fonctionnalités de Vote :**
- Vote/dé-vote en un clic
- Compteur de votes en temps réel
- Prévention des votes multiples
- Redirection vers login si non connecté

**Formulaire de Création :**
- Validation côté client et serveur
- Limites de caractères (titre: 10-255, description: 20-2000)
- Messages d'erreur informatifs
- État de chargement pendant la soumission

### ✅ Interface Admin

**Page Admin (`/admin/product-requests`) :**
- Vue d'ensemble avec statistiques complètes
- Filtres par statut, priorité et recherche textuelle
- Édition en ligne des demandes
- Gestion des statuts (En attente, En cours, Terminé, Rejeté)
- Gestion des priorités (Basse, Moyenne, Haute)
- Notes admin internes
- Dates de livraison estimées
- Suppression avec confirmation

**Fonctionnalités Admin :**
- Permissions vérifiées (SUPER_ADMIN/ADMIN uniquement)
- Logs d'actions automatiques
- Interface intuitive avec feedback visuel
- Sauvegarde en temps réel

### ✅ Sécurité et Permissions

**Row Level Security (RLS) :**
- Lecture publique des demandes
- Création autorisée pour tous les utilisateurs connectés
- Modification/suppression réservée aux admins

**Validation des Données :**
- Validation côté serveur sur toutes les APIs
- Vérification des permissions admin
- Prévention des injections SQL
- Gestion d'erreurs complète

## 🚀 Test du Système

### Étape 5 : Tester les Fonctionnalités

1. **Test Utilisateur :**
   ```bash
   # Démarrer l'application
   npm run dev
   
   # Aller sur http://localhost:3001/demandes
   # Tester la création d'une demande
   # Tester le système de vote
   ```

2. **Test Admin :**
   ```bash
   # Se connecter avec un compte admin
   # Aller sur http://localhost:3001/admin/product-requests
   # Tester l'édition des demandes
   # Tester les filtres et la recherche
   ```

### Étape 6 : Vérifier les Données

Dans Supabase Dashboard :
1. Allez dans "Table Editor"
2. Vérifiez la table `product_requests`
3. Vérifiez la table `product_request_votes`
4. Testez les fonctions dans l'éditeur SQL

## 📊 Structure des Données

### Table `product_requests`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `title` | VARCHAR(255) | Titre de la demande |
| `description` | TEXT | Description détaillée |
| `status` | VARCHAR(20) | Statut (pending, in_progress, completed, rejected) |
| `votes_count` | INTEGER | Nombre de votes |
| `user_id` | VARCHAR(255) | ID de l'utilisateur créateur |
| `user_email` | VARCHAR(255) | Email de l'utilisateur |
| `admin_notes` | TEXT | Notes internes admin |
| `priority` | VARCHAR(10) | Priorité (low, medium, high) |
| `estimated_completion` | DATE | Date de livraison estimée |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

### Table `product_request_votes`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `request_id` | UUID | Référence vers product_requests |
| `user_id` | VARCHAR(255) | ID de l'utilisateur votant |
| `user_email` | VARCHAR(255) | Email de l'utilisateur |
| `created_at` | TIMESTAMP | Date du vote |

## 🎨 Personnalisation

### Modifier les Statuts

Pour ajouter/modifier les statuts disponibles :

1. **Modifier la contrainte en base :**
   ```sql
   ALTER TABLE product_requests 
   DROP CONSTRAINT IF EXISTS product_requests_status_check;
   
   ALTER TABLE product_requests 
   ADD CONSTRAINT product_requests_status_check 
   CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected', 'nouveau_statut'));
   ```

2. **Mettre à jour les interfaces TypeScript :**
   ```typescript
   // Dans src/lib/supabase.ts
   status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'nouveau_statut'
   ```

3. **Mettre à jour les composants :**
   - `src/app/demandes/page.tsx` (TABS)
   - `src/app/admin/product-requests/page.tsx` (options select)

### Modifier les Priorités

Même processus pour les priorités dans la contrainte `priority`.

## 🔧 Maintenance

### Nettoyage des Données

```sql
-- Supprimer les votes orphelins
DELETE FROM product_request_votes 
WHERE request_id NOT IN (SELECT id FROM product_requests);

-- Recalculer les compteurs de votes
UPDATE product_requests 
SET votes_count = (
  SELECT COUNT(*) 
  FROM product_request_votes 
  WHERE request_id = product_requests.id
);
```

### Sauvegarde

```sql
-- Exporter les demandes
COPY product_requests TO '/path/to/backup/product_requests.csv' DELIMITER ',' CSV HEADER;

-- Exporter les votes
COPY product_request_votes TO '/path/to/backup/product_request_votes.csv' DELIMITER ',' CSV HEADER;
```

## 🎉 Félicitations !

Votre système de demandes de produits est maintenant opérationnel ! 

**Fonctionnalités disponibles :**
- ✅ Interface utilisateur complète
- ✅ Interface admin avancée
- ✅ Système de votes en temps réel
- ✅ Gestion des statuts et priorités
- ✅ Sécurité et permissions
- ✅ Données de test incluses

**Prochaines étapes suggérées :**
- 📧 Ajouter des notifications email
- 🔔 Système de notifications push
- 📊 Analytics avancées
- 🏷️ Système de tags/catégories
- 💬 Commentaires sur les demandes 