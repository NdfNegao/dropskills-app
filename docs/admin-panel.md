# Admin Panel DropSkills

## Vue d'ensemble

L'admin panel DropSkills est une interface d'administration complète construite avec Next.js, NextAuth et Prisma. Il permet de gérer tous les aspects de votre plateforme SaaS.

## Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec NextAuth
- Support multi-providers (Email, Google, GitHub)
- Gestion des rôles (SUPER_ADMIN, ADMIN, SUPPORT)
- Sessions persistantes

### 📊 Dashboard Principal
- Statistiques en temps réel
- Métriques utilisateurs et revenus
- Activité récente des webhooks
- Actions rapides

### 👥 Gestion des Utilisateurs
- Liste complète des utilisateurs
- Filtres par rôle et statut
- Statistiques détaillées par utilisateur
- Actions de modération

### 📦 Gestion des Packs
- Création et modification de packs
- Gestion des fichiers et ressources
- Statistiques de vente
- Configuration des accès

### 🤖 Outils IA
- Configuration des outils IA
- Monitoring de l'usage
- Gestion des quotas
- Logs détaillés

### 🎫 Support Client
- Tickets de support
- Système de réponses
- Escalade automatique
- Historique complet

### 🔗 Webhooks
- Logs des webhooks Systeme.io
- Monitoring des intégrations
- Gestion des erreurs
- Retry automatique

### 📈 Analytics
- Rapports détaillés
- Métriques de performance
- Analyses de tendances
- Export de données

## Installation et Configuration

### 1. Prérequis
```bash
# Installer les dépendances
npm install next-auth bcryptjs @types/bcryptjs date-fns

# Générer le client Prisma
npm run db:generate
```

### 2. Configuration des variables d'environnement
Copiez `.env.example` vers `.env` et configurez :

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Admin par défaut
ADMIN_EMAIL="admin@dropskills.com"
ADMIN_PASSWORD="admin123"
```

### 3. Créer un utilisateur admin
```bash
npm run create-admin
```

### 4. Démarrer l'application
```bash
npm run dev
```

L'admin panel sera accessible sur : `http://localhost:3000/admin`

## Structure des Fichiers

```
src/
├── app/
│   ├── admin/
│   │   ├── (protected)/          # Pages protégées
│   │   │   ├── layout.tsx        # Layout admin avec auth
│   │   │   ├── page.tsx          # Dashboard principal
│   │   │   ├── utilisateurs/     # Gestion utilisateurs
│   │   │   ├── packs/           # Gestion packs
│   │   │   ├── outils-ia/       # Gestion IA
│   │   │   ├── support/         # Support client
│   │   │   ├── webhooks/        # Logs webhooks
│   │   │   └── analytics/       # Rapports
│   │   └── login/
│   │       └── page.tsx         # Page de connexion
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts     # Configuration NextAuth
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx     # Navigation latérale
│       ├── AdminHeader.tsx      # En-tête avec profil
│       ├── AdminStatsCard.tsx   # Cartes statistiques
│       ├── AdminQuickActions.tsx # Actions rapides
│       └── AdminRecentActivity.tsx # Activité récente
├── lib/
│   ├── auth.ts                  # Configuration NextAuth
│   ├── prisma.ts               # Client Prisma
│   └── supabase.ts             # Client Supabase
└── types/
    └── next-auth.d.ts          # Types NextAuth
```

## Sécurité

### Authentification
- Mots de passe hashés avec bcrypt (12 rounds)
- Sessions JWT sécurisées
- Vérification des rôles sur chaque page
- Protection CSRF intégrée

### Autorisations
- Middleware de vérification des rôles
- Accès granulaire par fonctionnalité
- Logs d'audit automatiques
- Rate limiting sur les API

### Bonnes Pratiques
- Variables d'environnement pour les secrets
- Validation des entrées utilisateur
- Sanitisation des données
- Headers de sécurité configurés

## Personnalisation

### Thème et Design
Le design utilise un thème sombre avec la couleur principale `#ff0033` (rouge DropSkills).

Variables CSS principales :
```css
--primary: #ff0033
--background: #000000
--card: #111111
--border: #232323
--text: #ffffff
--muted: #gray-400
```

### Ajout de Nouvelles Pages
1. Créer le fichier dans `src/app/admin/(protected)/`
2. Ajouter la route dans `AdminSidebar.tsx`
3. Implémenter la logique métier
4. Ajouter les permissions nécessaires

### Composants Réutilisables
- `AdminStatsCard` : Cartes de statistiques
- `AdminTable` : Tables avec pagination
- `AdminModal` : Modales standardisées
- `AdminForm` : Formulaires avec validation

## API Endpoints

### Authentification
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signout` - Déconnexion
- `GET /api/auth/session` - Session actuelle

### Utilisateurs
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/users` - Créer un utilisateur
- `PUT /api/admin/users/[id]` - Modifier un utilisateur
- `DELETE /api/admin/users/[id]` - Supprimer un utilisateur

### Packs
- `GET /api/admin/packs` - Liste des packs
- `POST /api/admin/packs` - Créer un pack
- `PUT /api/admin/packs/[id]` - Modifier un pack
- `DELETE /api/admin/packs/[id]` - Supprimer un pack

## Monitoring et Logs

### Logs d'Administration
Tous les actions admin sont loggées dans la table `AdminLog` :
- Action effectuée
- Utilisateur responsable
- Timestamp
- Métadonnées contextuelles

### Métriques
Les métriques sont calculées automatiquement :
- Utilisateurs actifs
- Revenus générés
- Usage des outils IA
- Performance des packs

### Alertes
Configuration d'alertes pour :
- Erreurs critiques
- Pics d'utilisation
- Tentatives de connexion suspectes
- Échecs de webhook

## Déploiement

### Production
1. Configurer les variables d'environnement
2. Déployer la base de données Supabase
3. Configurer les domaines et SSL
4. Déployer sur Vercel/Netlify
5. Créer l'utilisateur admin initial

### Maintenance
- Sauvegardes automatiques de la DB
- Monitoring des performances
- Mise à jour des dépendances
- Rotation des secrets

## Support

Pour toute question ou problème :
1. Vérifiez les logs dans l'admin panel
2. Consultez la documentation Prisma/NextAuth
3. Vérifiez la configuration Supabase
4. Contactez l'équipe de développement

## Roadmap

### Fonctionnalités à venir
- [ ] Dashboard temps réel avec WebSockets
- [ ] Export avancé des données
- [ ] Système de notifications push
- [ ] Interface mobile responsive
- [ ] Intégration avec plus de providers OAuth
- [ ] Système de backup automatique
- [ ] API GraphQL pour les intégrations
- [ ] Tableau de bord personnalisable 