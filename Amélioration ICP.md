Résumé des adaptations à faire
Découpage du Wizard

Garde le wizard en accordéon si tu veux, mais tu peux passer en full step-by-step linéaire si tu veux un vrai “assistant IA”.

Pour chaque input saisi, stocke-le dans un state global (ce que tu fais déjà).

Après chaque input, propose des micro-suggestions/adaptations pour l’étape suivante (optionnel).

Prompt dynamique

À la génération, compose le prompt enrichi premium avec toutes les infos collectées.

Si tu veux des questions “conditionnelles” (par ex, plus d’infos si la promesse unique est “coaching business”), tu ajoutes des sous-étapes ou de la logique conditionnelle dans le wizard (ex: ajoute une question “Quels sont tes clients idéaux ?” si secteur = coaching).

Back-end

Tu as déjà le bon endpoint /api/icp/generate-v2. Il doit maintenant prendre en compte toutes les infos du wizard (pas juste les champs de base), et construire le prompt enrichi comme discuté.

Important : C’est ce prompt qui va te donner les hooks, journaux, résumés, variantes, etc.

Si tu veux, tu peux générer plusieurs blocs à la suite dans la même réponse AI.

Affichage résultats

Ton composant ICPResult est déjà prêt à recevoir un objet structuré — il suffit de le mapper sur les nouvelles sections.

Pour afficher aussi les journaux intimes, accroches, résumé express, etc., ajoute des sections supplémentaires à l’UI.

Mise à jour du Prompt dans le Front
Remplace ton handleGenerate (ou l’équivalent dans le back) par ceci :

ts
Copier
Modifier
const buildPrompt = (formData: ICPFormData) => `
Agis comme un expert copywriter et marketer digital.
Voici les informations business à analyser :
- Secteur d'activité : ${formData.secteur}
- Produit/Service : ${formData.produitService}
- Promesse unique : ${formData.promesseUnique}
- Budget cible : ${formData.budgetCible}
- Canaux marketing : ${formData.canaux.join(', ')}
- Tonalité : ${formData.tonalite}
- Objectifs principaux : ${formData.objectifs}
- Défis majeurs : ${formData.defis}
- Valeurs importantes : ${formData.valeurs}

Génère un avatar client idéal (ICP) selon la structure suivante :
1. Situation actuelle (profil sociodémographique, pro, digital, valeurs…)
2. Situation désirée
3. Douleurs/problèmes principaux
4. Solutions déjà essayées
5. Solution idéale recherchée
6. Où le trouver (canaux, plateformes, groupes, événements)
7. Messaging impactant (expressions, accroches, style de discours)
8. Budget & pouvoir d’achat (budget typique, fréquence achat, facteurs de prix)
9. Segments (principal + variantes)
10. Fiche actionnable (résumé exécutif, priorités marketing, prochaines étapes, métriques clés)

11. Journal intime “douleur” :
Rédige un texte de 150 mots à la première personne (“je”) du point de vue de l’avatar, qui décrit avec émotion ses difficultés, frustrations, peurs ou blocages au quotidien. Utilise une métaphore ou une image forte, et intègre une scène du quotidien pour rendre la douleur vivante et authentique.

12. Journal intime “victoire” :
Rédige un texte de 150 mots à la première personne (“je”) du point de vue du même avatar, mais cette fois qui a atteint ses objectifs et se trouve dans la situation désirée. Fais ressentir l’émotion positive (joie, soulagement, fierté…), et décris une scène concrète où cette victoire se manifeste (vue, son, sensation…).

13. Résumé express :
Résume le profil de l’avatar client en 5 lignes maximum, à utiliser sur une fiche produit ou une accroche marketing.

14. Accroches marketing :
- Donne 3 accroches centrées sur la douleur du persona (utilise son langage, ses émotions).
- Donne 3 accroches centrées sur la situation rêvée ou désirée du persona.

Formate la réponse pour chaque section clairement (utilise des titres de section explicites).
`;

Puis dans ton handleGenerate, tu fais :

js
Copier
Modifier
const payload = {
  ...formData,
  prompt: buildPrompt(formData)
}
const response = await fetch('/api/icp/generate-v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
Note :

Backend/API & Front
Backend : S’assure que le résultat du LLM est bien splitté par sections (grâce aux titres).
Exemple de parsing simple côté backend :

ts
Copier
Modifier
// (exemple de regex)
const matchJournalDouleur = output.match(/Journal intime “douleur”[\s\S]+?\n(.+?)\n(\w|$)/);
Front : Affiche chaque section dans un bloc dédié (comme décrit plus haut).


Exemple de section additionnelle :

tsx
Copier
Modifier
{icpResult?.journauxIntimes && (
  <div className="bg-[#1a1a1a] rounded-lg p-4">
    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-yellow-300" />
      Journaux Intimes
    </h3>
    <div className="space-y-2 text-sm text-gray-200">
      <div>
        <p className="font-medium text-red-400 mb-1">Douleur</p>
        <p>{icpResult.journauxIntimes.douleur}</p>
      </div>
      <div>
        <p className="font-medium text-green-400 mb-1">Victoire</p>
        <p>{icpResult.journauxIntimes.victoire}</p>
      </div>
    </div>
  </div>
)}
{icpResult?.resumeExpress && (
  <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
    <h3 className="text-white font-semibold mb-3">Résumé express</h3>
    <p className="text-gray-200 text-sm">{icpResult.resumeExpress}</p>
  </div>
)}
{icpResult?.accroches && (
  <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
    <h3 className="text-white font-semibold mb-3">Accroches marketing</h3>
    <div className="space-y-1 text-sm">
      <p className="font-medium text-red-400 mb-1">Douleur :</p>
      {icpResult.accroches.douleur.map((a, i) => <p key={i}>• {a}</p>)}
      <p className="font-medium text-green-400 mt-2 mb-1">Rêve :</p>
      {icpResult.accroches.reve.map((a, i) => <p key={i}>• {a}</p>)}
    </div>
  </div>
)}
Et adapte l’objet retourné dans le back pour contenir ces champs.

Conclusion
Ton flow actuel est déjà prêt à accueillir ce mode “step by step enrichi”.

Tout se joue dans :

La construction du prompt dans le front,

L’API qui doit forward ce prompt tel quel,

L’affichage dynamique des nouveaux blocs de résultats.

