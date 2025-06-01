# 📚 DevBook Complet - DropSkills 2024

## 🎯 Vue d'ensemble du projet

DropSkills est une plateforme moderne de dropshipping de produits digitaux développée avec Next.js 14, offrant des outils IA, formations, et un système d'administration complet.

### 🏗️ Architecture technique
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Authentification** : NextAuth.js
- **Base de données** : Supabase
- **IA** : OpenAI API
- **Déploiement** : Vercel
- **Analytics** : Vercel Analytics + PostHog

---

## 📁 Structure du projet

### Frontend (src/app/)
```
src/app/
├── page.tsx                    # Page d'accueil
├── layout.tsx                  # Layout principal
├── globals.css                 # Styles globaux
│
├── admin/                      # Section administration (15 pages)
│   ├── page.tsx               # Dashboard admin
│   ├── analytics/             # Analytics et métriques
│   ├── utilisateurs/          # Gestion utilisateurs
│   ├── produits/              # Gestion produits
│   ├── outils-ia/             # Gestion outils IA
│   ├── prompts/               # Gestion prompts IA
│   ├── affiliates/            # Gestion affiliés
│   ├── packs/                 # Gestion packs
│   ├── support/               # Support client
│   ├── product-requests/      # Demandes produits
│   ├── database/              # Gestion BDD
│   ├── security/              # Sécurité
│   ├── settings/              # Configuration
│   ├── docs/                  # Documentation
│   └── outils/                # Gestion outils
│
├── outils/                     # Outils IA (15+ outils)
│   ├── icp-maker/             # Générateur ICP
│   ├── tunnel-maker/          # Générateur tunnels
│   ├── usp-maker/             # Générateur USP
│   ├── descriptions/          # Générateur descriptions
│   ├── generateur-titres/     # Générateur titres
│   ├── pdf-rebrander/         # Rebranding PDF
│   ├── calculateur/           # Simulateur revenus
│   ├── agent-veille/          # Agent de veille
│   ├── content-system/        # Système de contenu
│   ├── copy-money-mail/       # Email marketing
│   ├── generateur-offre/      # Générateur d'offres
│   ├── lead-magnet/           # Lead magnets
│   └── tunnel-vente/          # Tunnels de vente
│
├── auth/                       # Authentification
│   ├── signin/                # Connexion
│   ├── signup/                # Inscription
│   ├── error/                 # Erreurs auth
│   ├── forgot-password/       # Mot de passe oublié
│   └── reset-password/        # Reset mot de passe
│
├── api/                        # API Routes
│   ├── admin/                 # APIs admin
│   ├── ai/                    # APIs IA
│   ├── ai-tools/              # APIs outils IA
│   ├── auth/                  # APIs auth
│   ├── user/                  # APIs utilisateur
│   └── [autres]/              # Autres APIs
│
└── [autres pages]/             # Pages utilisateur
    ├── dashboard/             # Tableau de bord utilisateur
    ├── universite/            # Formations
    ├── premium/               # Page premium
    ├── favoris/               # Favoris
    ├── sauvegardes/           # Sauvegardes
    ├── echantillons/          # Échantillons
    ├── demandes/              # Demandes
    ├── support/               # Support
    └── compte/                # Compte utilisateur
```

### Composants (src/components/)
```
src/components/
├── admin/                      # Composants admin
│   ├── AdminLayoutWithSidebar.tsx  # Layout admin principal
│   ├── AdminSidebar.tsx            # Sidebar admin
│   └── [autres]/                   # Autres composants admin
│
├── auth/                       # Composants auth
│   ├── PremiumGuard.tsx           # Protection premium
│   ├── AdminGuard.tsx             # Protection admin
│   └── [autres]/                  # Autres composants auth
│
├── ui/                         # Composants UI
│   ├── Button.tsx                 # Boutons
│   ├── Input.tsx                  # Inputs
│   ├── Modal.tsx                  # Modales
│   └── [autres]/                  # Autres composants UI
│
└── [composants métier]/        # Composants spécifiques
    ├── AiToolCard.tsx             # Carte outil IA
    ├── ProductCard.tsx            # Carte produit
    ├── LayoutWithSidebar.tsx      # Layout avec sidebar
    └── [autres]/                  # Autres composants
```

### Configuration et utilitaires
```
src/
├── lib/                        # Bibliothèques
│   ├── auth.ts                    # Configuration auth
│   ├── supabase.ts                # Client Supabase
│   ├── openai.ts                  # Client OpenAI
│   ├── prompts.ts                 # Gestion prompts
│   └── utils.ts                   # Utilitaires
│
├── data/                       # Données statiques
│   ├── ai-tools.ts                # Configuration outils IA
│   └── products.ts                # Données produits
│
├── hooks/                      # Hooks personnalisés
│   ├── useAuth.ts                 # Hook authentification
│   ├── useAiTool.ts               # Hook outils IA
│   └── [autres]/                  # Autres hooks
│
├── types/                      # Types TypeScript
│   ├── admin.ts                   # Types admin
│   └── next-auth.d.ts             # Types NextAuth
│
└── context/                    # Contextes React
    ├── ThemeContext.tsx           # Thème
    ├── LikedProductsContext.tsx   # Produits aimés
    └── SavedProductsContext.tsx   # Produits sauvegardés
```

---

## 🔐 Système d'authentification et de rôles

### Rôles utilisateur
- **USER** : Utilisateur standard (accès limité)
- **PREMIUM** : Utilisateur premium (accès outils IA)
- **ADMIN** : Administrateur (accès admin partiel)
- **SUPER_ADMIN** : Super administrateur (accès complet)

### Protection des routes
- **Middleware** : Protection côté serveur (`src/middleware.ts`)
- **Guards** : Protection côté client (`PremiumGuard`, `AdminGuard`)
- **Hook useAuth** : Gestion centralisée de l'authentification

### Comptes de test
```
Utilisateur standard:
- Email: user@dropskills.com
- Mot de passe: user123

Utilisateur premium:
- Email: premium@dropskills.com
- Mot de passe: premium123

Super administrateur:
- Email: admin@dropskills.com
- Mot de passe: admin123
```

---

## 🤖 Système d'outils IA

### Architecture des prompts
- **Prompts codés en dur** : Actuellement dans `src/data/ai-tools.ts`
- **Système centralisé** : `src/lib/prompts.ts` avec classe `PromptBuilder`
- **API admin prompts** : Interface d'administration (mode mock)
- **Migration recommandée** : Vers base de données pour gestion dynamique

### Outils IA disponibles (15+ outils)
1. **ICP Maker** : Générateur de persona client idéal
2. **Tunnel Maker** : Générateur de tunnels de vente
3. **USP Maker** : Générateur de propositions de valeur
4. **Générateur de descriptions** : Descriptions produits IA
5. **Générateur de titres** : Titres accrocheurs
6. **PDF Rebrander** : Personnalisation de PDFs
7. **Calculateur de revenus** : Simulateur de gains
8. **Agent de veille** : Surveillance concurrentielle
9. **Content System** : Système de contenu
10. **Copy Money Mail** : Email marketing
11. **Générateur d'offres** : Création d'offres
12. **Lead Magnet** : Aimants à prospects
13. **Tunnel de vente** : Entonnoirs de conversion
14. **Et plus...**

### Configuration des outils
```typescript
interface AiTool {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  isPremium: boolean;
}
```

---

## 🎨 Design System

### Thème et couleurs
- **Couleur principale** : Bleu (`blue-600`)
- **Couleurs secondaires** : Gris (`gray-50` à `gray-900`)
- **Succès** : Vert (`green-600`)
- **Erreur** : Rouge (`red-600`)
- **Warning** : Orange (`orange-600`)

### Composants UI standardisés
- **Boutons** : Variants primary, secondary, outline
- **Inputs** : Styles cohérents avec validation
- **Cards** : Cartes produits, outils, statistiques
- **Modales** : Système de modales réutilisables
- **Layouts** : Layouts avec sidebar pour admin et utilisateur

### Responsive design
- **Mobile first** : Design adaptatif
- **Breakpoints** : sm, md, lg, xl, 2xl
- **Sidebar responsive** : Drawer mobile, sidebar desktop

---

## 📊 Section Administration

### Pages d'administration (15 pages)
Toutes les pages utilisent `AdminLayoutWithSidebar` pour la cohérence :

1. **Dashboard** : Vue d'ensemble, statistiques principales
2. **Analytics** : Métriques détaillées, graphiques
3. **Utilisateurs** : Gestion des comptes utilisateur
4. **Produits** : Gestion du catalogue
5. **Outils IA** : Configuration des outils
6. **Prompts** : Gestion des prompts IA
7. **Affiliés** : Programme d'affiliation
8. **Packs** : Gestion des packs produits
9. **Support** : Support client
10. **Demandes produits** : Suggestions utilisateurs
11. **Base de données** : Gestion BDD
12. **Sécurité** : Paramètres sécurité
13. **Configuration** : Paramètres généraux
14. **Documentation** : Docs internes
15. **Outils** : Gestion outils généraux

### Composant AdminLayoutWithSidebar
```typescript
interface AdminLayoutWithSidebarProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  stats: StatData[];
  children: React.ReactNode;
}
```

### Navigation admin
- **Sidebar dédiée** : Navigation spécialisée admin
- **Permissions** : Accès selon le rôle
- **Statistiques** : Métriques en temps réel
- **Actions rapides** : Boutons d'action contextuels

---

## 🚀 Déploiement et DevOps

### Environnements
- **Développement** : `npm run dev` (localhost:3000)
- **Staging** : Branch `develop` → Vercel preview
- **Production** : Branch `main` → dropskills.vercel.app

### Workflow Git
```bash
# Développement
git checkout -b feature/nouvelle-fonctionnalite
# ... développement ...
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite

# Merge vers develop pour staging
git checkout develop
git merge feature/nouvelle-fonctionnalite
git push origin develop

# Merge vers main pour production
git checkout main
git merge develop
git push origin main
```

### Variables d'environnement
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Scripts utiles
```bash
npm run dev              # Développement
npm run build            # Build production
npm run test:all         # Tests complets
npm run deploy           # Déploiement manuel
npm run create-admin     # Créer admin
npm run check-google     # Vérifier config Google
```

---

## 📈 Analytics et monitoring

### Outils d'analytics
- **Vercel Analytics** : Métriques de performance
- **PostHog** : Analytics comportementales
- **Performance tracking** : Hook personnalisé

### Métriques suivies
- **Utilisateurs** : Inscriptions, connexions, activité
- **Outils IA** : Utilisation, succès, erreurs
- **Produits** : Vues, téléchargements, favoris
- **Performance** : Temps de chargement, erreurs

---

## 🔧 Standards de développement

### Conventions de code
- **TypeScript strict** : Types obligatoires
- **ESLint + Prettier** : Formatage automatique
- **Naming conventions** :
  - Composants : PascalCase
  - Fichiers : kebab-case
  - Variables : camelCase
  - Constants : UPPER_SNAKE_CASE

### Structure des composants
```typescript
// 1. Imports
import React from 'react';
import { ComponentProps } from './types';

// 2. Interface
interface Props {
  // props definition
}

// 3. Composant
export default function Component({ prop1, prop2 }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {
    // logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Gestion des erreurs
- **Try-catch** : Gestion des erreurs async
- **Error boundaries** : Composants d'erreur
- **Toast notifications** : Feedback utilisateur
- **Logging** : Console.error en développement

---

## 🎯 Bonnes pratiques

### Performance
- **Lazy loading** : Chargement différé des composants
- **Image optimization** : Next.js Image component
- **Bundle splitting** : Séparation du code
- **Caching** : Mise en cache des données

### Sécurité
- **Validation côté serveur** : Toujours valider
- **Sanitization** : Nettoyage des inputs
- **HTTPS only** : Connexions sécurisées
- **Secrets management** : Variables d'environnement

### UX/UI
- **Loading states** : États de chargement
- **Error states** : Gestion des erreurs
- **Responsive design** : Adaptation mobile
- **Accessibility** : Standards WCAG

### Tests
- **Unit tests** : Tests unitaires (à implémenter)
- **Integration tests** : Tests d'intégration (à implémenter)
- **E2E tests** : Tests end-to-end (à implémenter)
- **Manual testing** : Tests manuels réguliers

---

## 📚 Documentation

### Documentation existante
- **README.md** : Vue d'ensemble du projet
- **DEVBOOK.md** : Guide de développement admin
- **ADMIN_DEVBOOK.md** : Plan de modernisation admin
- **ADMIN_MIGRATION_PLAN.md** : Plan de migration
- **ADMIN_PAGES_AUDIT.md** : Audit des pages admin
- **DEPLOYMENT_GUIDE.md** : Guide de déploiement
- **PREMIUM_SYSTEM_README.md** : Système premium

### Documentation à maintenir
- **API documentation** : Documentation des APIs
- **Component library** : Guide des composants
- **User guides** : Guides utilisateur
- **Admin guides** : Guides administrateur

---

## 🔮 Roadmap et évolutions

### Améliorations techniques
- **Migration prompts vers BDD** : Gestion dynamique
- **Tests automatisés** : Suite de tests complète
- **Monitoring avancé** : Alertes et métriques
- **Performance optimization** : Optimisations continues

### Nouvelles fonctionnalités
- **API publique** : API pour développeurs
- **Webhooks** : Intégrations externes
- **Multi-langue** : Support i18n
- **Thème sombre** : Mode sombre

### Évolutions business
- **Marketplace** : Place de marché
- **Affiliés avancés** : Programme étendu
- **Analytics avancées** : Tableaux de bord
- **Intégrations** : Outils tiers

---

*Ce devbook est un document vivant qui doit être mis à jour régulièrement pour refléter l'évolution du projet DropSkills.*