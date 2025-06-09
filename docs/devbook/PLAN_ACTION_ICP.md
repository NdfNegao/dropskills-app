# Plan d'Action - Amélioration ICP Maker

## Analyse de l'existant

### Structure actuelle :
- **ICPWizardV2** : Wizard en 4 étapes (Business Context, Product/Service, Marketing Channels, Tonality)
- **ICPResult** : Affichage des résultats avec sections expandables
- **API route** : `/api/icp/generate-v2` avec prompt statique
- **Types** : ICPFormData et ICPAnalysis définis

### Nouvelles fonctionnalités à implémenter :
1. **Wizard enrichi** : Questions conditionnelles et collecte d'informations plus détaillées
2. **Prompt dynamique** : Construction basée sur les réponses collectées
3. **Nouvelles sections de résultats** :
   - Journaux intimes (douleur + victoire)
   - Résumé express (5 lignes)
   - Accroches ciblées (3 douleur + 3 situation rêvée)

## Plan d'implémentation

### Phase 1 : Mise à jour des types et interfaces
- [ ] Étendre ICPFormData avec les nouveaux champs
- [ ] Mettre à jour ICPAnalysis avec les nouvelles sections
- [ ] Créer les types pour les journaux intimes et accroches

### Phase 2 : Amélioration du wizard
- [ ] Ajouter de nouvelles étapes au wizard
- [ ] Implémenter les questions conditionnelles
- [ ] Mettre à jour les composants d'étapes existants

### Phase 3 : Prompt dynamique
- [ ] Créer la fonction buildPrompt()
- [ ] Intégrer la construction dynamique dans l'API
- [ ] Tester la génération avec les nouveaux prompts

### Phase 4 : Affichage des nouveaux résultats
- [ ] Étendre ICPResult avec les nouvelles sections
- [ ] Créer les composants pour journaux intimes
- [ ] Ajouter l'affichage des accroches ciblées

### Phase 5 : Tests et optimisations
- [ ] Tester le flow complet
- [ ] Optimiser l'UX
- [ ] Vérifier la compatibilité avec l'existant

## Réutilisation des composants existants

- **ToolLayout** : Conservé tel quel
- **PremiumGuard** : Conservé tel quel
- **StepWizard** : Étendu avec nouvelles étapes
- **Section components** dans ICPResult : Réutilisés et étendus
- **Animations Framer Motion** : Conservées

## Priorités

1. **Haute** : Types et structure de données
2. **Haute** : Prompt dynamique et API
3. **Moyenne** : Nouvelles étapes du wizard
4. **Moyenne** : Affichage des nouveaux résultats
5. **Basse** : Optimisations UX