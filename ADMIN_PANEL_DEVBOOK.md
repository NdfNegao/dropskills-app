# 📋 DEVBOOK - Admin Panel DropSkills

## 🎯 Vue d'ensemble

Ce devbook détaille la composition, la conception et les standards pour créer des pages dans l'admin panel de DropSkills. Il inclut une checklist complète pour s'assurer que tous les éléments sont en place et respectés.

---

## 🏗️ Architecture des composants

### Structure hiérarchique

```
AdminLayoutWithSidebar
├── AdminSidebar (Desktop)
├── Mobile Navigation Drawer
└── AdminPageLayout
    ├── Header Section
    ├── Stats Cards (optionnel)
    └── Main Content Area
```

### Composants principaux

#### 1. `AdminLayoutWithSidebar`
**Localisation :** `/src/components/admin/AdminLayoutWithSidebar.tsx`

**Props obligatoires :**
```typescript
interface AdminLayoutWithSidebarProps {
  icon: React.ReactNode;           // Icône de la page (Lucide React)
  title: string;                   // Titre principal
  subtitle?: string;               // Sous-titre optionnel
  stats?: StatCardData[];          // Cartes de statistiques
  actions?: ActionData[] | React.ReactNode; // Actions du header
  children: React.ReactNode;       // Contenu principal
  sidebarClassName?: string;       // Classes CSS personnalisées
}
```

#### 2. `AdminSidebar`
**Localisation :** `/src/components/admin/AdminSidebar.tsx`

**Fonctionnalités :**
- Navigation principale admin
- Gestion de l'état collapsed/expanded
- Vérification des permissions (email admin)
- Navigation responsive mobile

#### 3. `AdminPageLayout`
**Localisation :** `/src/components/admin/AdminPageLayout.tsx`

**Structure :**
- Header avec icône, titre, sous-titre et actions
- Section stats cards (grid responsive)
- Zone de contenu principal

---

## 🎨 Design System

### Palette de couleurs

#### Thème clair (Admin Panel)
```css
/* Backgrounds */
bg-white           /* Fond principal */
bg-gray-50         /* Fond de l'application */
bg-gray-100        /* Fond des icônes */
bg-gray-900        /* Sidebar */

/* Textes */
text-black         /* Titres principaux */
text-gray-600      /* Sous-titres */
text-gray-700      /* Texte normal */
text-white         /* Texte sur fond sombre */

/* Bordures */
border-gray-200    /* Bordures principales */
border-gray-300    /* Bordures inputs */

/* États */
text-blue-500      /* Liens et éléments interactifs */
text-green-500     /* Succès/positif */
text-red-500       /* Erreur/négatif */
text-yellow-500    /* Attention */
```

### Typographie

```css
/* Titres */
text-3xl font-bold text-black     /* H1 - Titre principal */
text-xl font-semibold text-black  /* H2 - Sous-sections */
text-lg font-medium text-gray-700 /* H3 - Éléments importants */

/* Corps de texte */
text-base text-gray-700           /* Texte normal */
text-sm text-gray-600             /* Texte secondaire */
text-xs text-gray-500             /* Métadonnées */
```

### Espacements

```css
/* Padding */
px-6 py-6         /* Padding standard des sections */
p-4               /* Padding des cartes */
p-3               /* Padding des boutons */

/* Margins */
gap-6             /* Espacement entre éléments principaux */
gap-4             /* Espacement entre éléments secondaires */
gap-2             /* Espacement entre éléments proches */
```

---

## 📱 Responsive Design

### Breakpoints Tailwind

```css
/* Mobile First */
default           /* < 640px */
sm:               /* ≥ 640px */
md:               /* ≥ 768px */
lg:               /* ≥ 1024px */
xl:               /* ≥ 1280px */
```

### Grilles responsives

```css
/* Stats Cards */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

/* Contenu principal */
grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6

/* Tables */
overflow-x-auto   /* Scroll horizontal sur mobile */
```

### Navigation mobile

- Sidebar cachée sur mobile (`hidden lg:flex`)
- Menu hamburger avec overlay
- Drawer animé avec `transform transition-transform`

---

## 🧩 Patterns de composants

### 1. Stats Cards

```typescript
interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}
```

**Style standard :**
```css
bg-white rounded-lg border border-gray-200 p-6 shadow-sm
```

### 2. Boutons d'action

```typescript
interface ActionData {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  icon?: React.ReactNode;
  loading?: boolean;
}
```

**Variants :**
- `default`: `bg-blue-500 text-white hover:bg-blue-600`
- `destructive`: `bg-red-500 text-white hover:bg-red-600`
- `outline`: `border border-gray-300 text-gray-700 hover:bg-gray-50`

### 3. Tables

```css
/* Container */
bg-white rounded-lg border border-gray-200 overflow-hidden

/* Header */
bg-gray-50 px-6 py-3 border-b border-gray-200

/* Rows */
px-6 py-4 border-b border-gray-200 hover:bg-gray-50
```

### 4. Modals

```css
/* Overlay */
fixed inset-0 bg-black bg-opacity-50 z-50

/* Content */
bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto
```

### 5. Forms

```css
/* Labels */
block text-sm font-medium text-gray-700 mb-2

/* Inputs */
w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500

/* Textareas */
w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none
```

---

## 🔧 Hooks et utilitaires

### Hooks essentiels

```typescript
// Authentication
const { user, isLoading } = useAuth();
const { data: session, status } = useSession();

// Navigation
const router = useRouter();

// État local
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Vérification des permissions

```typescript
useEffect(() => {
  if (status === 'loading') return;
  
  if (!session?.user?.email) {
    router.push('/');
    return;
  }
  
  if (session.user.email !== 'cyril.iriebi@gmail.com') {
    router.push('/dashboard');
    return;
  }

  // Charger les données
}, [session, status, router]);
```

### Gestion des erreurs

```typescript
const handleApiCall = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/admin/endpoint');
    
    if (!response.ok) {
      throw new Error('Erreur lors de la requête');
    }
    
    const data = await response.json();
    // Traiter les données
    
  } catch (error) {
    console.error('Erreur:', error);
    setError('Message d\'erreur utilisateur');
  } finally {
    setLoading(false);
  }
};
```

---

## 📋 Template de page admin

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { IconName } from 'lucide-react';

interface DataType {
  // Définir le type de données
}

export default function AdminPageName() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification des permissions
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email) {
      router.push('/');
      return;
    }
    
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/endpoint');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }
      
      const result = await response.json();
      setData(result.data || []);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  // Stats pour le header
  const stats = [
    {
      title: "Titre Stat 1",
      value: data.length,
      icon: <IconName className="w-5 h-5" />
    },
    // Autres stats...
  ];

  // Actions du header
  const actions = [
    {
      label: "Action",
      onClick: () => {},
      icon: <IconName className="w-4 h-4" />
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<IconName className="w-5 h-5" />}
        title="Titre de la page"
        subtitle="Chargement..."
        stats={[]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  if (error) {
    return (
      <AdminLayoutWithSidebar
        icon={<IconName className="w-5 h-5" />}
        title="Titre de la page"
        subtitle="Erreur"
        stats={[]}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<IconName className="w-5 h-5" />}
      title="Titre de la page"
      subtitle="Description de la page"
      stats={stats}
      actions={actions}
    >
      {/* Contenu principal */}
      <div className="space-y-6">
        {/* Sections de contenu */}
      </div>
    </AdminLayoutWithSidebar>
  );
}
```

---

## ✅ CHECKLIST COMPLÈTE

### 🔐 Sécurité et Permissions

- [ ] **Vérification d'authentification** avec `useSession`
- [ ] **Contrôle d'accès admin** (email = 'cyril.iriebi@gmail.com')
- [ ] **Redirection appropriée** si non autorisé
- [ ] **Gestion du loading state** pendant la vérification

### 🏗️ Structure des composants

- [ ] **Import d'AdminLayoutWithSidebar** depuis le bon chemin
- [ ] **Props obligatoires** fournies (icon, title, children)
- [ ] **Icône Lucide React** appropriée pour la page
- [ ] **Titre descriptif** et **sous-titre** si nécessaire

### 📊 Données et État

- [ ] **Types TypeScript** définis pour les données
- [ ] **État loading** géré avec useState
- [ ] **État error** géré avec useState
- [ ] **Fonction fetchData** avec gestion d'erreurs
- [ ] **useEffect** pour charger les données au mount

### 🎨 Interface utilisateur

#### Header et Stats
- [ ] **Stats cards** configurées si applicable
- [ ] **Actions du header** définies si nécessaire
- [ ] **Icônes cohérentes** avec le design system

#### États de chargement
- [ ] **Loading state** avec spinner et message
- [ ] **Error state** avec message et bouton retry
- [ ] **Empty state** si aucune donnée

#### Contenu principal
- [ ] **Layout responsive** avec classes Tailwind appropriées
- [ ] **Espacement cohérent** (gap-6, p-6, etc.)
- [ ] **Couleurs du thème** respectées (bg-white, text-gray-700, etc.)

### 📱 Responsive Design

- [ ] **Grilles responsives** (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- [ ] **Tables scrollables** sur mobile (overflow-x-auto)
- [ ] **Boutons adaptés** aux écrans tactiles
- [ ] **Texte lisible** sur toutes les tailles d'écran

### 🔧 Fonctionnalités

#### Recherche et filtres
- [ ] **Barre de recherche** si applicable
- [ ] **Filtres** avec état géré
- [ ] **Debounce** pour les recherches en temps réel

#### Actions CRUD
- [ ] **Boutons d'action** avec icônes appropriées
- [ ] **Modals** pour création/édition
- [ ] **Confirmations** pour les suppressions
- [ ] **Feedback utilisateur** (success/error messages)

#### Tables et listes
- [ ] **Headers de colonnes** clairs
- [ ] **Données formatées** (dates, nombres, devises)
- [ ] **Actions par ligne** (edit, delete, view)
- [ ] **Pagination** si nécessaire

### 🎯 Performance

- [ ] **Lazy loading** pour les images
- [ ] **Debounce** pour les recherches
- [ ] **Optimistic updates** quand possible
- [ ] **Cache** des données si approprié

### ♿ Accessibilité

- [ ] **Labels** pour tous les inputs
- [ ] **Alt text** pour les images
- [ ] **Focus states** visibles
- [ ] **Contraste** suffisant pour les textes
- [ ] **Navigation clavier** fonctionnelle

### 🧪 Tests et Validation

- [ ] **Validation côté client** pour les formulaires
- [ ] **Gestion des erreurs API** appropriée
- [ ] **Messages d'erreur** informatifs
- [ ] **Tests manuels** sur différentes tailles d'écran

### 📝 Code Quality

- [ ] **Types TypeScript** complets
- [ ] **Noms de variables** descriptifs
- [ ] **Commentaires** pour la logique complexe
- [ ] **Imports** organisés et optimisés
- [ ] **Console.log** supprimés en production

### 🔄 Intégration

- [ ] **API endpoints** fonctionnels
- [ ] **Navigation** vers/depuis autres pages admin
- [ ] **Sidebar** mise à jour si nouvelle page
- [ ] **Permissions** testées avec différents utilisateurs

---

## 🚀 Déploiement

### Avant le déploiement

- [ ] **Tests complets** sur environnement de dev
- [ ] **Vérification responsive** sur appareils réels
- [ ] **Performance** vérifiée (Lighthouse)
- [ ] **Sécurité** validée (pas de données sensibles exposées)

### Après le déploiement

- [ ] **Tests de fumée** sur production
- [ ] **Monitoring** des erreurs activé
- [ ] **Feedback utilisateur** collecté
- [ ] **Documentation** mise à jour si nécessaire

---

## 📚 Ressources

### Documentation
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js](https://next-auth.js.org/)

### Composants UI
- `/src/components/admin/` - Composants admin
- `/src/components/ui/` - Composants UI génériques

### Exemples de référence
- `/src/app/admin/page.tsx` - Dashboard principal
- `/src/app/admin/produits/page.tsx` - Gestion des produits
- `/src/app/admin/utilisateurs/page.tsx` - Gestion des utilisateurs

---

*Ce devbook est un document vivant qui doit être mis à jour au fur et à mesure de l'évolution de l'admin panel.*