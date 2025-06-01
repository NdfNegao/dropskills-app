# DevBook - DropSkills Admin

## Table des matières

1. [Architecture des pages d'administration](#architecture-des-pages-dadministration)
2. [Composant AdminLayoutWithSidebar](#composant-adminlayoutwithsidebar)
3. [Standards de développement](#standards-de-développement)
4. [Guide de migration](#guide-de-migration)
5. [Exemples d'implémentation](#exemples-dimplémentation)
6. [Bonnes pratiques](#bonnes-pratiques)

## Architecture des pages d'administration

### Vue d'ensemble

Toutes les pages d'administration de DropSkills utilisent le composant `AdminLayoutWithSidebar` pour garantir une expérience utilisateur cohérente et une maintenabilité optimale.

### Structure des fichiers

```
src/app/admin/
├── page.tsx                    # Dashboard principal
├── analytics/page.tsx          # Analytics et métriques
├── database/page.tsx           # Gestion base de données
├── outils/page.tsx             # Gestion des outils
├── security/page.tsx           # Paramètres de sécurité
├── support/page.tsx            # Support client
├── product-requests/page.tsx   # Demandes de produits
├── affiliates/page.tsx         # Gestion des affiliés
├── packs/page.tsx              # Gestion des packs
├── docs/page.tsx               # Documentation
├── outils-ia/page.tsx          # Outils IA
├── prompts/page.tsx            # Gestion des prompts
├── produits/page.tsx           # Gestion des produits
├── settings/page.tsx           # Paramètres
└── utilisateurs/page.tsx       # Gestion des utilisateurs
```

## Composant AdminLayoutWithSidebar

### Description

`AdminLayoutWithSidebar` est le composant de layout principal pour toutes les pages d'administration. Il fournit :

- **Sidebar de navigation** : Navigation cohérente entre les pages admin
- **Header avec statistiques** : Affichage des métriques clés
- **Zone de contenu principale** : Container pour le contenu spécifique de chaque page
- **Responsive design** : Adaptation automatique aux différentes tailles d'écran

### Props du composant

```typescript
interface AdminLayoutWithSidebarProps {
  icon: React.ReactNode;          // Icône de la page
  title: string;                  // Titre de la page
  subtitle: string;               // Sous-titre descriptif
  stats: StatData[];              // Tableau des statistiques
  children: React.ReactNode;      // Contenu de la page
}

interface StatData {
  title: string;                  // Titre de la statistique
  value: string;                  // Valeur à afficher
  icon: React.ReactNode;          // Icône de la statistique
}
```

### Utilisation de base

```tsx
import { Users } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminPage() {
  const statsData = [
    {
      title: "Total utilisateurs",
      value: "1,234",
      icon: <Users size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des utilisateurs"
      subtitle="Gérez les comptes utilisateurs de la plateforme"
      stats={statsData}
    >
      {/* Contenu spécifique de la page */}
      <div className="bg-white rounded-xl p-6">
        <h2>Contenu de la page</h2>
      </div>
    </AdminLayoutWithSidebar>
  );
}
```

## Standards de développement

### 1. Structure des statistiques

Toutes les pages doivent définir leurs statistiques dans un tableau `statsData` :

```tsx
const statsData = [
  {
    title: "Nom de la métrique",
    value: "Valeur",
    icon: <IconComponent size={24} />
  }
];
```

### 2. Icônes

- Utiliser les icônes de **Lucide React**
- Taille standard : `size={24}` pour les icônes principales
- Cohérence thématique avec le contenu de la page

### 3. Nommage des composants

- Préfixe `Admin` pour les pages d'administration
- Noms descriptifs et explicites
- PascalCase pour les noms de composants

### 4. Imports

```tsx
"use client";
import { IconName } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
```

## Guide de migration

### Migration depuis PageBentoLayout

Si une page utilise encore `PageBentoLayout`, suivez ces étapes :

#### 1. Supprimer l'ancien import

```tsx
// ❌ À supprimer
import PageBentoLayout from '@/components/PageBentoLayout';
```

#### 2. Adapter la structure des statistiques

```tsx
// ❌ Ancien format (PageBentoLayout)
const stats = [
  {
    icon: <Users className="w-5 h-5" />,
    label: "Total utilisateurs",
    value: "1,234",
    color: "text-blue-400"
  }
];

// ✅ Nouveau format (AdminLayoutWithSidebar)
const statsData = [
  {
    title: "Total utilisateurs",
    value: "1,234",
    icon: <Users size={24} />
  }
];
```

#### 3. Modifier la structure du composant

```tsx
// ❌ Ancienne structure
<AdminLayoutWithSidebar>
  <PageBentoLayout
    icon={<Users className="w-6 h-6 text-white" />}
    title="Gestion des utilisateurs"
    subtitle="Gérez les comptes utilisateurs"
    stats={stats}
  >
    {/* Contenu */}
  </PageBentoLayout>
</AdminLayoutWithSidebar>

// ✅ Nouvelle structure
<AdminLayoutWithSidebar
  icon={<Users size={24} />}
  title="Gestion des utilisateurs"
  subtitle="Gérez les comptes utilisateurs de la plateforme"
  stats={statsData}
>
  {/* Contenu */}
</AdminLayoutWithSidebar>
```

## Exemples d'implémentation

### Page de gestion des utilisateurs

```tsx
"use client";
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function UsersPage() {
  const statsData = [
    {
      title: "Total utilisateurs",
      value: "1,234",
      icon: <Users size={24} />
    },
    {
      title: "Nouveaux ce mois",
      value: "45",
      icon: <UserPlus size={24} />
    },
    {
      title: "Actifs",
      value: "1,189",
      icon: <UserCheck size={24} />
    },
    {
      title: "Suspendus",
      value: "45",
      icon: <UserX size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des utilisateurs"
      subtitle="Gérez les comptes utilisateurs de la plateforme"
      stats={statsData}
    >
      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-black mb-6">
          Liste des utilisateurs
        </h2>
        {/* Contenu du tableau */}
      </div>
    </AdminLayoutWithSidebar>
  );
}
```

### Page de support

```tsx
"use client";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminSupport() {
  const statsData = [
    {
      title: "Total tickets",
      value: "156",
      icon: <MessageSquare size={24} />
    },
    {
      title: "En attente",
      value: "23",
      icon: <Clock size={24} />
    },
    {
      title: "Résolus",
      value: "128",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Fermés",
      value: "5",
      icon: <AlertCircle size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<MessageSquare size={24} />}
      title="Support client"
      subtitle="Gérez les tickets de support et l'assistance client"
      stats={statsData}
    >
      {/* Contenu de la page support */}
    </AdminLayoutWithSidebar>
  );
}
```

## Bonnes pratiques

### 1. Cohérence des données

- Utilisez des données réalistes dans les statistiques
- Maintenez la cohérence des formats de valeurs (nombres, pourcentages, etc.)
- Utilisez des icônes appropriées au contexte

### 2. Performance

- Évitez les re-rendus inutiles en mémorisant les données statiques
- Utilisez `useMemo` pour les calculs coûteux de statistiques

```tsx
const statsData = useMemo(() => [
  {
    title: "Total",
    value: calculateTotal().toString(),
    icon: <Users size={24} />
  }
], [dependencies]);
```

### 3. Accessibilité

- Utilisez des titres et sous-titres descriptifs
- Assurez-vous que les icônes ont un sens contextuel
- Maintenez un contraste suffisant pour la lisibilité

### 4. Responsive Design

- Le composant `AdminLayoutWithSidebar` gère automatiquement la responsivité
- Testez sur différentes tailles d'écran
- Utilisez des classes Tailwind appropriées pour le contenu

### 5. Maintenance

- Documentez les changements dans ce devbook
- Suivez les conventions de nommage établies
- Testez les modifications sur toutes les pages admin

## Conclusion

L'utilisation standardisée d'`AdminLayoutWithSidebar` garantit :

- **Cohérence** : Interface unifiée sur toutes les pages admin
- **Maintenabilité** : Un seul composant à maintenir et faire évoluer
- **Performance** : Code optimisé et réutilisable
- **Expérience utilisateur** : Navigation intuitive et présentation cohérente

Pour toute question ou suggestion d'amélioration, consultez l'équipe de développement.