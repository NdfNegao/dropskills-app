# 🚀 INTÉGRATION SYSTEME.IO - GUIDE COMPLET

## 📋 Vue d'ensemble

L'intégration Systeme.io permet de :
- ✅ Synchroniser les produits entre Systeme.io et DropSkills
- ✅ Traiter automatiquement les commandes via webhooks
- ✅ Gérer les abonnements et remboursements
- ✅ Créer automatiquement les utilisateurs et leur donner accès aux packs

## 🔧 Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Webhook Systeme.io
SYSTEME_IO_WEBHOOK_SECRET="votre-secret-webhook-systeme-io"

# API Systeme.io (optionnel pour la synchronisation)
SYSTEME_IO_API_KEY="votre-cle-api-systeme-io"
```

### 2. Installation des tables

#### Option A : Via l'API (recommandé)
```bash
curl -X POST http://localhost:3001/api/systeme-io/setup
```

#### Option B : Manuellement dans Supabase
1. Allez dans l'éditeur SQL de Supabase
2. Exécutez le contenu du fichier `systeme_io_tables.sql`

### 3. Configuration du webhook dans Systeme.io

1. Connectez-vous à votre compte Systeme.io
2. Allez dans **Paramètres > Webhooks**
3. Créez un nouveau webhook avec :
   - **URL** : `https://votre-domaine.com/api/webhooks/systeme-io`
   - **Secret** : Le même que `SYSTEME_IO_WEBHOOK_SECRET`
   - **Événements** : 
     - ✅ order.completed
     - ✅ subscription.created
     - ✅ refund.completed
     - ✅ subscription.cancelled

## 📊 Structure des tables

### systeme_io_products
Mapping entre les produits Systeme.io et les packs DropSkills
```sql
- systeme_io_product_id : ID du produit dans Systeme.io
- pack_id : ID du pack DropSkills correspondant
- product_name : Nom du produit
- product_price : Prix du produit
- currency : Devise (EUR par défaut)
- status : active/inactive
```

### systeme_io_orders
Historique des commandes Systeme.io
```sql
- systeme_io_order_id : ID de la commande
- systeme_io_product_id : ID du produit commandé
- customer_email : Email du client
- total_amount : Montant total
- status : Statut de la commande
- user_id : ID de l'utilisateur créé
- pack_id : ID du pack accordé
```

### systeme_io_webhooks
Logs de tous les webhooks reçus
```sql
- event_type : Type d'événement
- payload : Données complètes du webhook
- processed : Webhook traité ou non
- error_message : Message d'erreur si échec
```

## 🛠️ APIs disponibles

### 1. Gestion des produits
```bash
# Lister tous les mappings
GET /api/systeme-io/products

# Créer un mapping
POST /api/systeme-io/products
{
  "systeme_io_product_id": "prod_123",
  "pack_id": "uuid-du-pack",
  "product_name": "Nom du produit",
  "product_price": 97.00
}

# Mettre à jour un mapping
PUT /api/systeme-io/products
{
  "systeme_io_product_id": "prod_123",
  "pack_id": "nouveau-uuid"
}

# Supprimer un mapping
DELETE /api/systeme-io/products?product_id=prod_123
```

### 2. Synchronisation
```bash
# Synchroniser les produits depuis Systeme.io
POST /api/systeme-io/sync
{
  "action": "sync_products"
}

# Synchroniser les commandes
POST /api/systeme-io/sync
{
  "action": "sync_orders",
  "data": {
    "since": "2024-01-01"  // Optionnel
  }
}
```

### 3. Tests et diagnostics
```bash
# Vérifier l'état de l'intégration
GET /api/systeme-io/test

# Créer des données de test
POST /api/systeme-io/test
{
  "action": "create_test_data"
}

# Simuler un webhook
POST /api/systeme-io/test
{
  "action": "simulate_webhook"
}

# Nettoyer les données de test
POST /api/systeme-io/test
{
  "action": "cleanup_test_data"
}
```

## 🔄 Flux de traitement des commandes

1. **Réception du webhook** : Systeme.io envoie un webhook lors d'une commande
2. **Vérification** : La signature est vérifiée pour s'assurer de l'authenticité
3. **Enregistrement** : Le webhook est enregistré dans `systeme_io_webhooks`
4. **Traitement** :
   - La commande est enregistrée dans `systeme_io_orders`
   - Le produit est recherché dans `systeme_io_products`
   - Un utilisateur est créé dans `profiles`
   - L'accès au pack est accordé dans `user_packs`
   - Les statistiques sont mises à jour dans `pack_stats`
5. **Confirmation** : Le webhook est marqué comme traité

## 🧪 Tests

### 1. Tester la configuration
```bash
# Vérifier que tout est configuré
curl http://localhost:3001/api/systeme-io/test
```

### 2. Créer un mapping de test
```bash
curl -X POST http://localhost:3001/api/systeme-io/test \
  -H "Content-Type: application/json" \
  -d '{"action": "create_test_data"}'
```

### 3. Simuler une commande
```bash
curl -X POST http://localhost:3001/api/systeme-io/test \
  -H "Content-Type: application/json" \
  -d '{"action": "simulate_webhook"}'
```

## 📈 Monitoring

### Statistiques disponibles
- Nombre de produits mappés
- Nombre de commandes traitées
- Taux de succès des webhooks
- Dernière synchronisation

### Logs
Tous les événements sont enregistrés avec :
- 📥 Webhooks reçus
- ✅ Commandes traitées
- ❌ Erreurs rencontrées
- 🔄 Synchronisations effectuées

## 🚨 Dépannage

### Erreur "Invalid signature"
- Vérifiez que `SYSTEME_IO_WEBHOOK_SECRET` correspond au secret configuré dans Systeme.io

### Produit non mappé
- Créez un mapping entre le produit Systeme.io et un pack DropSkills

### Tables non trouvées
- Exécutez le script de setup : `POST /api/systeme-io/setup`
- Ou exécutez manuellement `systeme_io_tables.sql` dans Supabase

## 🔐 Sécurité

- ✅ Vérification de signature sur tous les webhooks
- ✅ Politiques RLS activées sur toutes les tables
- ✅ Logs détaillés de toutes les opérations
- ✅ Validation des données entrantes

## 📝 Prochaines étapes

1. **Configurer les produits** : Créez les mappings pour vos produits
2. **Tester l'intégration** : Utilisez les APIs de test
3. **Activer en production** : Configurez le webhook dans Systeme.io
4. **Monitorer** : Surveillez les logs et statistiques

---

*Documentation créée le 28 mai 2025 - DropSkills x Systeme.io Integration* 