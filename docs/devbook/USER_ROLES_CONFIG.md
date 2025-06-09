# Configuration des Rôles Utilisateur - DropSkills

## Vue d'ensemble

La plateforme DropSkills utilise un système de rôles simplifié avec trois statuts utilisateur :

## 🔐 Rôles Utilisateur

### 1. **ADMIN** (Administrateur unique)
- **Utilisateur** : `cyril.iriebi@gmail.com` uniquement
- **Accès** : Accès complet à tous les produits (FREE + PREMIUM)
- **Privilèges** : 
  - Accès à tous les outils IA
  - Accès au panel d'administration
  - Bypass de toutes les restrictions premium
  - Gestion complète de la plateforme

### 2. **PREMIUM** (Utilisateurs payants)
- **Utilisateurs** : Clients avec abonnement actif
- **Accès** : Produits FREE + PREMIUM
- **Privilèges** :
  - Accès à tous les outils IA premium
  - Accès aux formations premium
  - Support prioritaire
  - Contenu exclusif

### 3. **FREE** (Utilisateurs gratuits)
- **Utilisateurs** : Tous les autres utilisateurs
- **Accès** : Produits FREE uniquement
- **Limitations** :
  - Pas d'accès aux outils IA premium
  - Pas d'accès aux formations premium
  - Support standard

## 🏗️ Architecture Technique

### Attribution des Rôles

**Automatique dans `src/lib/auth.ts` :**
```typescript
if (session.user.email === 'cyril.iriebi@gmail.com') {
  (session.user as any).role = 'ADMIN';
} else {
  (session.user as any).role = 'FREE'; // Par défaut
}
```

**Upgrade vers PREMIUM :**
- Via Stripe webhook après paiement réussi
- Mise à jour du champ `is_premium` dans Supabase
- Le hook `useAuth` vérifie ce statut

### Vérification des Permissions

**Frontend (`useAuth` hook) :**
```typescript
const canAccessPremium = premiumStatus || isAdmin;
```

**Backend (API routes) :**
```typescript
if (!['PREMIUM', 'ADMIN'].includes(userRole)) {
  return { error: 'Accès premium requis', status: 403 };
}
```

**Middleware :**
```typescript
if (token.email === 'cyril.iriebi@gmail.com') {
  return NextResponse.next(); // Admin bypass
}
```

## 📊 Gestion des Produits

### Classification des Produits

**Produits FREE :**
- `isPremium: false` ou `isPremium` non défini
- Accessibles à tous les utilisateurs
- Échantillons, formations de base

**Produits PREMIUM :**
- `isPremium: true`
- Accessibles aux utilisateurs PREMIUM et ADMIN
- Formations avancées, outils IA, contenu exclusif

### Affichage Conditionnel

**Composants avec protection :**
- `PremiumGuard` : Bloque l'accès aux non-premium
- `ProductCard` : Affiche le badge "Premium"
- `ProductFilters` : Filtre par statut premium

## 🔄 Flux d'Upgrade

1. **Utilisateur FREE** → Visite `/premium`
2. **Sélection plan** → Redirection `/checkout`
3. **Paiement Stripe** → Webhook déclenché
4. **Mise à jour BDD** → `is_premium = true`
5. **Statut PREMIUM** → Accès immédiat

## 🛡️ Sécurité

### Points de Contrôle

1. **Middleware** : Première ligne de défense
2. **API Routes** : Vérification côté serveur
3. **Components** : Protection côté client
4. **Database** : Statut persistant

### Admin Unique

- Un seul admin : `cyril.iriebi@gmail.com`
- Hardcodé dans le système d'authentification
- Accès automatique sans vérification BDD
- Bypass de toutes les restrictions

## 📝 Configuration Actuelle

### Fichiers Clés

- `src/lib/auth.ts` : Attribution des rôles
- `src/hooks/useAuth.ts` : Logique d'authentification
- `src/middleware.ts` : Protection des routes
- `src/components/auth/PremiumGuard.tsx` : Protection des composants
- `supabase/migrations/` : Structure BDD

### Variables d'Environnement

- `NEXTAUTH_SECRET` : Secret pour JWT
- `NEXT_PUBLIC_SUPABASE_URL` : URL Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique Supabase
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET` : Secret webhook Stripe

## 🎯 Avantages de cette Configuration

✅ **Simplicité** : Seulement 3 rôles clairs
✅ **Sécurité** : Admin unique et identifié
✅ **Flexibilité** : Upgrade/downgrade facile
✅ **Performance** : Vérifications optimisées
✅ **Maintenance** : Code facile à maintenir

Cette configuration légère répond parfaitement aux besoins de la plateforme tout en maintenant une architecture claire et sécurisée.