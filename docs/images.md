# Guide des Images - Dropskills

## 📐 Spécifications Techniques

### Format et Dimensions
- **Format** : PNG avec transparence
- **Dimensions** : 1200x675 pixels (ratio 16:9)
- **Poids maximum** : 300KB par image
- **Dossier** : `/public/formations/`

### Images Requises
1. `meta-ads-2025.png`
2. `social-media-workbook.png`
3. `psychology-selling.png`
4. `productivity-masterclass.png`
5. `business-plan-template.png`
6. `default.png` (image de fallback)

## 🛠️ Outils Recommandés

### Redimensionnement
1. **Script Automatique**
   ```bash
   chmod +x scripts/resize-images.sh
   ./scripts/resize-images.sh
   ```

2. **Manuellement**
   - [TinyPNG](https://tinypng.com/) : Compression
   - [Squoosh](https://squoosh.app/) : Optimisation avancée
   - [ImageMagick](https://imagemagick.org/) : Redimensionnement en ligne de commande

### Bonnes Pratiques
1. **Optimisation**
   - Compresser toutes les images
   - Utiliser la transparence quand nécessaire
   - Éviter les images trop lourdes

2. **Nommage**
   - Utiliser des noms en minuscules
   - Remplacer les espaces par des tirets
   - Exemple : `meta-ads-2025.png`

3. **Contenu**
   - Images de haute qualité
   - Texte lisible
   - Contraste suffisant
   - Cohérence visuelle

## 🔍 Vérification

### Checklist
- [ ] Dimensions correctes (1200x675)
- [ ] Format PNG
- [ ] Poids < 300KB
- [ ] Nom de fichier conforme
- [ ] Image de fallback présente

### Tests
1. Vérifier l'affichage sur :
   - Mobile (320px)
   - Tablette (768px)
   - Desktop (1200px+)
2. Tester le fallback
3. Vérifier la performance (Lighthouse)

## ⚠️ Dépannage

### Problèmes Courants
1. **Image floue**
   - Vérifier la résolution source
   - Utiliser une image plus grande

2. **Image trop lourde**
   - Compresser avec TinyPNG
   - Réduire la qualité si nécessaire

3. **404 sur l'image**
   - Vérifier le nom du fichier
   - Vérifier le chemin
   - Vérifier les permissions

## 📝 Notes
- Toujours garder une copie des images originales
- Documenter les modifications importantes
- Maintenir la cohérence visuelle 