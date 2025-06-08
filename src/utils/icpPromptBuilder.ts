import { ICPFormData } from '@/types/icp';

export function buildPrompt(formData: ICPFormData): string {
  const {
    secteur,
    produitService,
    promesseUnique,
    budgetCible,
    canaux,
    tonalite,
    objectifs,
    defis,
    valeurs
  } = formData;

  return `
Agis comme un expert copywriter, marketer digital et en création d'ICP (Ideal Customer Profile). 
Crée un profil client idéal détaillé et actionnable basé sur les informations suivantes :

Voici les informations business à analyser :
- Secteur d'activité : ${secteur}
- Produit/Service : ${produitService}
- Promesse unique : ${promesseUnique}
- Budget cible : ${budgetCible}
- Canaux marketing : ${canaux.join(', ')}
- Tonalité : ${tonalite}
- Objectifs principaux : ${objectifs || 'Non spécifié'}
- Défis majeurs : ${defis || 'Non spécifié'}
- Valeurs importantes : ${valeurs || 'Non spécifié'}

Génère un avatar client idéal (ICP) selon la structure suivante :
1. Situation actuelle (profil sociodémographique, pro, digital, valeurs…)
2. Situation désirée
3. Douleurs/problèmes principaux
4. Solutions déjà essayées
5. Solution idéale recherchée
6. Où le trouver (canaux, plateformes, groupes, événements)
7. Messaging impactant (expressions, accroches, style de discours)
8. Budget & pouvoir d'achat (budget typique, fréquence achat, facteurs de prix)
9. Segments (principal + variantes)
10. Fiche actionnable (résumé exécutif, priorités marketing, prochaines étapes, métriques clés)

11. Journal intime "douleur" :
Rédige un texte de 150 mots à la première personne ("je") du point de vue de l'avatar, qui décrit avec émotion ses difficultés, frustrations, peurs ou blocages au quotidien. Utilise une métaphore ou une image forte, et intègre une scène du quotidien pour rendre la douleur vivante et authentique.

12. Journal intime "victoire" :
Rédige un texte de 150 mots à la première personne ("je") du point de vue du même avatar, mais cette fois qui a atteint ses objectifs et se trouve dans la situation désirée. Fais ressentir l'émotion positive (joie, soulagement, fierté…), et décris une scène concrète où cette victoire se manifeste (vue, son, sensation…).

13. Résumé express :
Résume le profil de l'avatar client en 5 lignes maximum, à utiliser sur une fiche produit ou une accroche marketing.

14. Accroches marketing :
- Donne 3 accroches centrées sur la douleur du persona (utilise son langage, ses émotions).
- Donne 3 accroches centrées sur la situation rêvée ou désirée du persona.

Formate la réponse pour chaque section clairement (utilise des titres de section explicites).
`;
}