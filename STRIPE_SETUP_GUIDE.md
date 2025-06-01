# 🚀 Guide de Configuration Stripe - Approche 80/20

## ✅ Ce qui a été implémenté

### 1. Code Backend
- ✅ Installation de la dépendance Stripe
- ✅ Configuration Stripe (`/src/lib/stripe.ts`)
- ✅ API route pour créer les sessions checkout (`/src/app/api/stripe/create-checkout/route.ts`)
- ✅ Webhook pour gérer les paiements (`/src/app/api/stripe/webhook/route.ts`)
- ✅ Migration base de données (`/supabase/migrations/20241220_create_users_table.sql`)

### 2. Code Frontend
- ✅ Page de checkout simplifiée (`/src/app/checkout/page.tsx`)
- ✅ Hook `useAuth` mis à jour pour vérifier le statut premium
- ✅ Redirection automatique vers Stripe Checkout

### 3. Sécurité
- ✅ Aucune donnée de carte stockée sur vos serveurs
- ✅ Paiement 100% géré par Stripe
- ✅ Webhooks sécurisés avec signature

## 🔧 Configuration requise (15 minutes)

### Étape 1: Configuration Stripe Dashboard

1. **Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)**

2. **Créez vos produits et prix:**
   ```
   Produit: DropSkills Premium
   
   Prix 1 (Mensuel):
   - Montant: 47€
   - Récurrence: Mensuelle
   - Copiez le price_id (ex: price_1ABC123...)
   
   Prix 2 (Annuel):
   - Montant: 397€
   - Récurrence: Annuelle
   - Copiez le price_id (ex: price_1DEF456...)
   ```

3. **Configurez le webhook:**
   - Allez dans "Développeurs" > "Webhooks"
   - Cliquez "Ajouter un endpoint"
   - URL: `https://votre-domaine.com/api/stripe/webhook`
   - Événements à écouter:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
   - Copiez le secret du webhook (whsec_...)

### Étape 2: Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local`:

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_... en production
STRIPE_SECRET_KEY=sk_test_...      # ou sk_live_... en production
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_1ABC123... # ID du prix mensuel
STRIPE_PRICE_YEARLY=price_1DEF456...  # ID du prix annuel
```

### Étape 3: Base de données

Exécutez la migration SQL dans votre dashboard Supabase:

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Copiez-collez le contenu de `/supabase/migrations/20241220_create_users_table.sql`
4. Exécutez la migration

### Étape 4: Test

1. **Démarrez votre application:**
   ```bash
   npm run dev
   ```

2. **Testez le flow:**
   - Allez sur `/checkout?plan=premium-monthly`
   - Cliquez sur "Payer avec Stripe"
   - Utilisez une carte de test Stripe: `4242 4242 4242 4242`
   - Vérifiez que l'utilisateur devient premium après paiement

## 🎯 Résultat Final

### Ce que vos utilisateurs verront:
1. **Page de checkout** avec résumé du plan
2. **Redirection vers Stripe** (page sécurisée)
3. **Paiement sur Stripe** (cartes, Apple Pay, Google Pay)
4. **Retour sur votre site** avec accès premium activé

### Ce que vous gérez:
- ✅ **Minimum de code** (approche 80/20)
- ✅ **Sécurité maximale** (Stripe gère tout)
- ✅ **Conformité PCI** automatique
- ✅ **Gestion des fraudes** par Stripe
- ✅ **Factures automatiques**

## 🚨 Points d'attention

### En développement:
- Utilisez les clés `test` de Stripe
- Les webhooks peuvent être testés avec ngrok

### En production:
- Remplacez par les clés `live` de Stripe
- Configurez le webhook avec votre vraie URL
- Testez le flow complet avant le lancement

## 🔄 Prochaines étapes (optionnelles)

1. **Page de gestion d'abonnement** (lien vers le portail client Stripe)
2. **Emails de confirmation** (via Stripe ou votre système)
3. **Analytics des conversions**
4. **Codes promo** (déjà supporté par Stripe Checkout)

## 💡 Avantages de cette approche

- **Rapide**: 2-3 jours vs 2-3 semaines
- **Sécurisé**: Stripe gère la sécurité
- **Fiable**: Infrastructure éprouvée
- **Évolutif**: Facile d'ajouter des fonctionnalités
- **Maintenance**: Minimum de code à maintenir

---

**🎉 Félicitations ! Votre système de paiement Stripe est prêt !**

Pour toute question, consultez la [documentation Stripe](https://stripe.com/docs) ou contactez le support.