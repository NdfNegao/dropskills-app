# 🎨 Dropskills Theme Guide

> **Guide de conception et matrice de design pour l'écosystème Dropskills**  
> Version 1.0 - Décembre 2024

---

## 📋 Table des Matières

1. [Philosophie de Design](#philosophie-de-design)
2. [Système de Couleurs](#système-de-couleurs)
3. [Typographie](#typographie)
4. [Composants UI](#composants-ui)
5. [Layout & Grilles](#layout--grilles)
6. [Animations & Transitions](#animations--transitions)
7. [Iconographie](#iconographie)
8. [Patterns de Design](#patterns-de-design)
9. [Responsive Design](#responsive-design)
10. [Checklist de Conformité](#checklist-de-conformité)

---

## 🎯 Philosophie de Design

### Vision
**"Tech Premium avec une Approche Humaine"**

- **Moderne & Sophistiqué** : Interface sombre avec des accents vibrants
- **Accessible & Intuitif** : Navigation claire et interactions fluides
- **Performance-First** : Optimisé pour la vitesse et l'efficacité
- **Évolutif** : Système modulaire et extensible

### Principes Fondamentaux

1. **Clarté** : Chaque élément a un but précis
2. **Cohérence** : Uniformité dans tous les composants
3. **Contraste** : Hiérarchie visuelle claire
4. **Fluidité** : Transitions naturelles et micro-interactions

---

## 🎨 Système de Couleurs

### Palette Principale (Thème Sombre)

```css
/* Couleurs de Base - Dark Theme */
--background: #0a0a0a;        /* Noir profond - Background principal */
--background-secondary: #111111; /* Noir secondaire - Cartes */
--background-tertiary: #18181b;  /* Noir tertiaire - Gradients */

/* Couleur Signature */
--primary: #ff0033;           /* Rouge Dropskills - CTA principal */
--primary-hover: #cc0029;     /* Rouge hover */
--primary-light: #ff0033/20;  /* Rouge transparent */

/* Texte */
--foreground: #ffffff;        /* Blanc - Texte principal */
--foreground-secondary: #a3a3a3; /* Gris clair - Texte secondaire */
--foreground-muted: #666666;  /* Gris - Texte désactivé */

/* Bordures & Séparateurs */
--border: #232323;            /* Bordures subtiles */
--border-light: #2a2a2a;      /* Bordures légères */

/* États */
--success: #22c55e;           /* Vert - Succès */
--warning: #f59e0b;           /* Orange - Attention */
--error: #ef4444;             /* Rouge - Erreur */
--info: #3b82f6;              /* Bleu - Information */
```

### Palette Secondaire (Thème Clair)

```css
/* Couleurs de Base - Light Theme */
[data-theme="light"] {
  --background: #ffffff;        /* Blanc pur - Background principal */
  --background-secondary: #f8f9fa; /* Gris très clair - Cartes */
  --background-tertiary: #f1f3f4;  /* Gris clair - Gradients */

  /* Couleur Signature */
  --primary: #ff0033;           /* Rouge Dropskills - CTA principal */
  --primary-hover: #cc0029;     /* Rouge hover */
  --primary-light: #ff0033/10;  /* Rouge transparent plus léger */

  /* Texte */
  --foreground: #0f172a;        /* Gris très foncé - Texte principal */
  --foreground-secondary: #475569; /* Gris moyen - Texte secondaire */
  --foreground-muted: #94a3b8;  /* Gris clair - Texte désactivé */

  /* Bordures & Séparateurs */
  --border: #e2e8f0;            /* Bordures douces */
  --border-light: #f1f5f9;      /* Bordures très légères */

  /* États */
  --success: #059669;           /* Vert plus foncé - Succès */
  --warning: #d97706;           /* Orange plus foncé - Attention */
  --error: #dc2626;             /* Rouge plus foncé - Erreur */
  --info: #2563eb;              /* Bleu plus foncé - Information */
}
```

### 🌟 Règles d'Or pour le Thème Clair

#### 📖 Lisibilité
- **Contraste optimal** : Texte foncé (#0f172a, #334155, #475569) sur fond très clair (#ffffff, #f8f9fa, #f1f3f4)
- **Jamais de noir pur sur blanc pur** : Trop dur à lire, préférer gris foncé (#0f172a) sur blanc cassé (#fafafa)
- **Vérification du contraste** : Utiliser [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) ou [Color.review](https://www.color.review/)
- **Texte coloré** : Ne jamais mettre du texte coloré (bleu clair, orange clair) sur blanc sans vérifier la lisibilité

#### 🎯 Hiérarchie Visuelle
- **Titres** : Doivent ressortir (taille, graisse, espacement)
- **Liens** : Clairement visibles, idéalement soulignés ou d'une couleur différenciante
- **Bordures et séparateurs** : Fins et doux (#e2e8f0, #f1f5f9)

#### 🎨 Couleurs d'Accent
- **Couleurs vives** : Tester sur fond clair, souvent désaturer ou foncer par rapport à la version dark
- **États interactifs** : Maintenir des états hover/focus visibles

#### ♿ Accessibilité
- **Normes WCAG AA** : Minimum requis pour l'accessibilité
- **Contraste minimum** : 4.5:1 pour le texte normal, 3:1 pour les gros titres
- **États de focus** : Toujours visibles et contrastés

### Couleurs Fonctionnelles

```css
/* Backgrounds Spécialisés */
--card-bg: #111111;           /* Cartes et conteneurs */
--sidebar-bg: #0f0f0f;        /* Sidebar */
--modal-bg: #0a0a0a/95;       /* Modales avec overlay */

/* Couleurs d'Accent */
--accent-blue: #3b82f6;       /* Bleu - Liens et infos */
--accent-green: #22c55e;      /* Vert - Succès */
--accent-purple: #8b5cf6;     /* Violet - Premium */
--accent-orange: #f59e0b;     /* Orange - Attention */
```

### Usage des Couleurs

| Couleur | Usage Principal | Exemples |
|---------|----------------|----------|
| `#ff0033` | Actions principales | Boutons CTA, liens importants |
| `#ffffff` | Texte principal | Titres, contenu principal |
| `#a3a3a3` | Texte secondaire | Descriptions, métadonnées |
| `#232323` | Bordures | Séparateurs, contours de cartes |
| `#111111` | Conteneurs | Cartes, panels, modales |

---

## ✍️ Typographie

### Police Principale

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Hiérarchie Typographique

```css
/* Titres */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* H1 - Titres principaux */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* H2 - Titres de section */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* H3 - Sous-titres */
.text-xl  { font-size: 1.25rem; line-height: 1.75rem; }  /* H4 - Titres de carte */
.text-lg  { font-size: 1.125rem; line-height: 1.75rem; } /* H5 - Sous-titres */

/* Corps de texte */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* Texte principal */
.text-sm   { font-size: 0.875rem; line-height: 1.25rem; } /* Texte secondaire */
.text-xs   { font-size: 0.75rem; line-height: 1rem; }    /* Métadonnées */
```

### Poids de Police

```css
.font-light     { font-weight: 300; }  /* Texte léger */
.font-normal    { font-weight: 400; }  /* Texte normal */
.font-medium    { font-weight: 500; }  /* Texte moyen */
.font-semibold  { font-weight: 600; }  /* Texte semi-gras */
.font-bold      { font-weight: 700; }  /* Titres importants */
.font-extrabold { font-weight: 800; }  /* Titres principaux */
```

---

## 🧩 Composants UI

### Boutons

#### Variants Principaux

```tsx
// Bouton Principal (CTA)
<Button variant="default" size="lg">
  className="bg-[#ff0033] hover:bg-[#cc0029] text-white"
</Button>

// Bouton Secondaire
<Button variant="outline" size="default">
  className="border-gray-700 bg-transparent hover:bg-gray-800"
</Button>

// Bouton Ghost
<Button variant="ghost" size="sm">
  className="hover:bg-gray-800 hover:text-white"
</Button>
```

#### Tailles

```css
.btn-sm  { height: 2rem; padding: 0 0.75rem; font-size: 0.75rem; }
.btn-md  { height: 2.25rem; padding: 0 1rem; font-size: 0.875rem; }
.btn-lg  { height: 2.5rem; padding: 0 2rem; font-size: 1rem; }
.btn-xl  { height: 3rem; padding: 0 2.5rem; font-size: 1.125rem; }
```

### Cartes

#### Structure de Base

```tsx
<div className="
  bg-[#111111] 
  border border-[#232323] 
  rounded-lg 
  p-6 
  hover:border-[#2a2a2a] 
  transition-all duration-200
">
  {/* Contenu de la carte */}
</div>
```

#### Variants de Cartes

```css
/* Carte Standard */
.card-standard {
  background: #111111;
  border: 1px solid #232323;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

/* Carte Premium */
.card-premium {
  background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
  border: 1px solid #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
}

/* Carte Interactive */
.card-interactive {
  transition: all 0.2s ease;
  cursor: pointer;
}
.card-interactive:hover {
  border-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
```

### Inputs & Forms

```tsx
// Input Standard
<Input className="
  bg-[#111111] 
  border-[#232323] 
  text-white 
  placeholder:text-[#666666]
  focus:border-[#ff0033] 
  focus:ring-1 
  focus:ring-[#ff0033]
" />

// Select
<Select>
  <SelectTrigger className="bg-[#111111] border-[#232323]">
    <SelectValue placeholder="Sélectionner..." />
  </SelectTrigger>
</Select>
```

### Badges & Tags

```tsx
// Badge Standard
<Badge className="bg-[#232323] text-[#a3a3a3] hover:bg-[#2a2a2a]">
  Standard
</Badge>

// Badge Premium
<Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
  Premium
</Badge>

// Badge Success
<Badge className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
  Actif
</Badge>
```

---

## 📐 Layout & Grilles

### Système de Grille

```css
/* Grilles Responsives */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Espacements

```css
/* Système d'espacement (basé sur 0.25rem = 4px) */
.space-xs  { gap: 0.5rem; }   /* 8px */
.space-sm  { gap: 0.75rem; }  /* 12px */
.space-md  { gap: 1rem; }     /* 16px */
.space-lg  { gap: 1.5rem; }   /* 24px */
.space-xl  { gap: 2rem; }     /* 32px */
.space-2xl { gap: 3rem; }     /* 48px */
```

### Conteneurs

```css
/* Conteneur Principal */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Conteneur de Section */
.section-container {
  padding: 2rem 0;
}

/* Conteneur de Carte */
.card-container {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
```

---

## ✨ Animations & Transitions

### Transitions de Base

```css
/* Transition Standard */
.transition-standard {
  transition: all 0.2s ease;
}

/* Transition Lente */
.transition-slow {
  transition: all 0.3s ease;
}

/* Transition Rapide */
.transition-fast {
  transition: all 0.15s ease;
}
```

### Animations Personnalisées

```css
/* Slide In */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### Effets Hover

```css
/* Hover Standard */
.hover-standard:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Hover Glow */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(255, 0, 51, 0.3);
}

/* Hover Scale */
.hover-scale:hover {
  transform: scale(1.02);
}
```

---

## 🎯 Iconographie

### Bibliothèque : Lucide React

#### Icônes Principales

```tsx
// Navigation
import { Home, Settings, User, LogOut } from 'lucide-react';

// Actions
import { Plus, Edit, Trash2, Save, Download } from 'lucide-react';

// États
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// Business
import { Target, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

// Tech
import { Bot, Zap, Rocket, Brain } from 'lucide-react';
```

#### Tailles d'Icônes

```css
.icon-xs  { width: 0.75rem; height: 0.75rem; } /* 12px */
.icon-sm  { width: 1rem; height: 1rem; }       /* 16px */
.icon-md  { width: 1.25rem; height: 1.25rem; } /* 20px */
.icon-lg  { width: 1.5rem; height: 1.5rem; }   /* 24px */
.icon-xl  { width: 2rem; height: 2rem; }       /* 32px */
```

#### Usage Contextuel

| Contexte | Taille | Couleur | Exemples |
|----------|--------|---------|----------|
| Navigation | `w-5 h-5` | `text-gray-400` | Menu sidebar |
| Boutons | `w-4 h-4` | `text-white` | Icônes dans boutons |
| États | `w-5 h-5` | Couleur d'état | Success, warning, error |
| Cartes | `w-6 h-6` | `text-[#ff0033]` | Icônes de fonctionnalités |

---

## 🎨 Patterns de Design

### Glassmorphism

```css
.glass-effect {
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradients

```css
/* Gradient Principal */
.gradient-primary {
  background: linear-gradient(135deg, #0a0a0a 0%, #18181b 100%);
}

/* Gradient Accent */
.gradient-accent {
  background: linear-gradient(135deg, #ff0033 0%, #cc0029 100%);
}

/* Gradient Subtle */
.gradient-subtle {
  background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
}
```

### Shadows

```css
/* Ombres */
.shadow-sm  { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
.shadow-md  { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); }
.shadow-lg  { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
.shadow-xl  { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }

/* Ombres Colorées */
.shadow-primary { box-shadow: 0 8px 25px rgba(255, 0, 51, 0.2); }
.shadow-purple  { box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2); }
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Patterns Responsifs

```tsx
// Navigation Mobile
<div className="block md:hidden"> {/* Mobile only */}
<div className="hidden md:block"> {/* Desktop only */}

// Grilles Adaptatives
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Espacements Responsifs
<div className="p-4 md:p-6 lg:p-8">

// Texte Responsif
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## ✅ Checklist de Conformité

### Avant de Créer/Modifier une Page

#### 🎨 Design
- [ ] Utilise la palette de couleurs Dropskills
- [ ] Respecte la hiérarchie typographique
- [ ] Applique les espacements standardisés
- [ ] Utilise les composants UI existants

#### 🧩 Composants
- [ ] Suit les patterns de cartes établis
- [ ] Utilise les variants de boutons appropriés
- [ ] Applique les états hover/focus
- [ ] Respecte les tailles d'icônes

#### 📱 Responsive
- [ ] Testé sur mobile (320px+)
- [ ] Testé sur tablette (768px+)
- [ ] Testé sur desktop (1024px+)
- [ ] Navigation mobile fonctionnelle

#### ⚡ Performance
- [ ] Animations fluides (60fps)
- [ ] Transitions appropriées
- [ ] Pas de layout shift
- [ ] Images optimisées

#### ♿ Accessibilité
- [ ] Contraste suffisant (WCAG AA)
- [ ] Navigation au clavier
- [ ] Labels appropriés
- [ ] États focus visibles

---

## 🔧 Outils & Ressources

### Stack Technique
- **Framework** : Next.js 14
- **Styling** : Tailwind CSS
- **Composants** : Radix UI
- **Icônes** : Lucide React
- **Animations** : Framer Motion
- **Variants** : Class Variance Authority

### 🎨 Outils de Contraste et Accessibilité

#### Vérification de Contraste
- **[Color.review](https://www.color.review/)** 🌟 : Vérification en temps réel du contraste et de l'accessibilité
- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)** : Vérification WCAG AA/AAA
- **Chrome Extension "axe"** : Audit d'accessibilité automatisé
- **Lighthouse** : Audit de performance et accessibilité intégré

#### Standards et Guidelines
- **[Google Material Design](https://material.io/design)** : Principes de design moderne
- **[Material Theme Builder](https://m3.material.io/theme-builder)** : Générateur de palettes claire/sombre
- **[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)** : Standards iOS/macOS
- **[Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)** : Bonnes pratiques couleurs

### 📋 Check-list Thème Clair

#### ✅ Contrôles Obligatoires
- [ ] Contraste texte/fond conforme WCAG AA (4.5:1 minimum)
- [ ] Liens et boutons facilement repérables
- [ ] Pas de zone "aveuglante" (blanc pur massif)
- [ ] États actifs/hover/focus visibles
- [ ] Test mobile réussi (le clair révèle les défauts !)
- [ ] Variables CSS utilisées pour toutes les couleurs
- [ ] Test avec simulateur d'accessibilité
- [ ] Validation par 2-3 collègues (éviter le "syndrome de l'œil fatigué")

#### 🚫 Erreurs à Éviter
- Texte pur noir (#000) sur blanc pur (#fff)
- Texte coloré sans vérification de contraste
- Faire confiance à l'IA pour les couleurs sans contrôle humain
- Oublier les états de focus/hover
- Ne pas tester sur mobile

### 💡 Workflow de Développement

#### Processus Recommandé
1. **Définir les variables CSS** pour toutes les couleurs
2. **Tester chaque modification** avec un outil de contraste
3. **Valider sur mobile** (révèle souvent des problèmes)
4. **Audit d'accessibilité** avec axe ou Lighthouse
5. **Review humaine** par l'équipe

#### Outils Magiques ✨
- **[Color.review](https://www.color.review/)** : Mets ta couleur de texte et ton fond, il te donne en live la lisibilité et l'accessibilité
- **Material Theme Builder** : Génère automatiquement les palettes claire/sombre cohérentes
- **Chrome DevTools** : Simulateur de déficiences visuelles intégré

### Ressources Utiles
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Components](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

### Outils de Développement
- **Design Tokens** : Variables CSS personnalisées
- **Linting** : ESLint + Prettier
- **Testing** : Jest + Testing Library
- **Performance** : Vercel Analytics

---

## 📝 Notes de Version

### Version 1.1 (Décembre 2024) - Thème Clair
- ✨ **Nouveau** : Palette complète pour thème clair
- ✨ **Nouveau** : Règles d'or pour la lisibilité en mode clair
- ✨ **Nouveau** : Outils de vérification de contraste et accessibilité
- ✨ **Nouveau** : Standards et guidelines (Material Design, Apple HIG)
- ✨ **Nouveau** : Check-list spécifique au thème clair
- ✨ **Nouveau** : Workflow de développement pour l'accessibilité
- 🔧 **Amélioré** : Variables CSS pour les deux thèmes
- 🔧 **Amélioré** : Documentation des outils magiques

### Version 1.0 (Décembre 2024)
- ✅ Documentation complète du système de design
- ✅ Palette de couleurs standardisée
- ✅ Composants UI documentés
- ✅ Patterns responsifs établis
- ✅ Checklist de conformité

---

**© 2024 Dropskills - Theme Guide**  
*Maintenu par l'équipe de développement Dropskills*