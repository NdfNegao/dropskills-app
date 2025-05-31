# 📐 Documentation de référence : Gabarit "Bento" Dropskills

## 1. Structure générale

```jsx
<div className="max-w-7xl mx-auto">
  {/* ... */}
</div>
```
- Largeur maximale : `max-w-7xl`
- Centrage horizontal : `mx-auto`
- Pas de padding latéral ici (géré par le layout global ou les sous-blocs)

---

## 2. Header

```jsx
<div className="mb-8">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
      {/* Icône Lucide */}
    </div>
    <div>
      <h1 className="text-3xl font-bold text-white">Titre de la page</h1>
      <p className="text-gray-400">Sous-titre descriptif</p>
    </div>
  </div>
</div>
```
- Icône : carré 48x48px, fond dégradé, icône blanche centrée
- Titre : `text-3xl font-bold text-white`
- Sous-titre : `text-gray-400`
- Espacement : `gap-3` entre icône et texte, `mb-4` sous le header, `mb-8` sous le bloc header

---

## 3. Section statistiques (optionnelle)

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {/* 4 boîtes de stats */}
</div>
```
- Grille responsive : 2 colonnes sur mobile, 4 sur desktop
- Espacement : `gap-4` entre les boîtes, `mb-8` sous la grille
- Chaque boîte :
  ```jsx
  <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
    <div className="flex items-center gap-2 text-blue-400 mb-1">
      {/* Icône */}
      <span className="text-sm font-medium">Label</span>
    </div>
    <div className="text-2xl font-bold text-white">Valeur</div>
    <div className="text-xs text-gray-400">Description</div>
  </div>
  ```

---

## 4. Filtres, contrôles, contenu métier

```jsx
<div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
  {/* Filtres, recherche, etc. */}
</div>
```
- Fond sombre, bordure, arrondi, padding généreux, marge basse

- Contenu principal :
  - Toujours dans le même conteneur `max-w-7xl`
  - Sections espacées par des `mb-8` ou `mb-12`
  - Grilles de contenu avec `gap-6` ou `gap-4`

---

## 5. Alignement & Responsive

- Tout est aligné à gauche (header, stats, contenu)
- Jamais de centrage du header ou des stats
- Sidebar : le contenu commence bien à gauche, aligné avec le header/stats
- Responsive : le padding latéral est géré par le layout global ou le composant parent

---

## 6. Checklist de conformité

- [ ] Le conteneur principal est en `max-w-7xl mx-auto`
- [ ] Le header suit la structure (icône, titre, sous-titre, classes, espacements)
- [ ] Les stats (si présentes) sont dans une grille `grid-cols-2 md:grid-cols-4 gap-4 mb-8`
- [ ] Les sections sont espacées par des `mb-8` ou `mb-12`
- [ ] Aucun centrage du header ou des stats
- [ ] Le contenu commence bien à gauche, aligné avec la sidebar
- [ ] Responsive testé sur mobile et desktop

---

## 7. Exemples de code

**Header + stats**
```jsx
<div className="max-w-7xl mx-auto">
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
        <Package className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">Centre de formation</h1>
        <p className="text-gray-400">Formez-vous sur les sujets qui comptent vraiment pour votre business</p>
      </div>
    </div>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {/* ... */}
  </div>
  {/* ... */}
</div>
```

---

## 8. Règle d'or

> **Ne jamais modifier la structure du gabarit.**
> On adapte uniquement le contenu métier (icône, titre, sous-titre, stats, contenu), jamais la structure, les classes ou l'alignement.

---

À utiliser pour chaque nouvelle page ou refonte d'une page de la sidebar. 