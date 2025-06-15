/**
 * Script d'initialisation de la base de connaissances RAG
 * Ajoute du contenu de base pour le Master Mentor
 */

import { addDocument } from '../src/lib/rag';

const INITIAL_DOCUMENTS = [
  {
    title: "Guide Dropskills - Introduction à la plateforme",
    content: `Dropskills est une plateforme d'apprentissage révolutionnaire spécialisée dans le marketing digital, le copywriting et l'intelligence artificielle. Notre mission est d'aider les entrepreneurs, marketeurs et créateurs de contenu à développer leurs compétences et leur business grâce à des formations pratiques et des outils IA innovants.

La plateforme propose :
- Des formations complètes en marketing digital
- Des outils IA pour automatiser vos tâches
- Des mentors IA spécialisés par domaine
- Une communauté active d'entrepreneurs
- Des ressources pratiques et templates

Dropskills se distingue par son approche pratique et orientée résultats. Chaque formation est conçue pour être immédiatement applicable dans votre business. Les outils IA intégrés vous permettent de gagner du temps sur les tâches répétitives tout en maintenant une qualité professionnelle.

Notre philosophie : apprendre en faisant, avec des résultats mesurables dès les premiers jours.`,
    sourceType: "guide",
    tags: ["dropskills", "introduction", "plateforme", "marketing", "ia"]
  },
  {
    title: "Copywriting - Les fondamentaux de la persuasion",
    content: `Le copywriting efficace repose sur la compréhension profonde de votre audience cible. Voici les principes fondamentaux :

**1. Connaître son audience**
- Identifiez leurs douleurs principales
- Comprenez leurs désirs profonds
- Anticipez leurs objections
- Adaptez votre langage à leur niveau

**2. Structure AIDA**
- Attention : Captez l'attention dès les premiers mots
- Intérêt : Maintenez l'engagement avec des bénéfices clairs
- Désir : Créez l'envie avec des preuves sociales
- Action : Guidez vers l'action avec un CTA clair

**3. Techniques de persuasion**
- Urgence et rareté
- Preuves sociales et témoignages
- Autorité et expertise
- Réciprocité et engagement

**4. Optimisation continue**
- Testez différentes versions
- Analysez les métriques de conversion
- Itérez basé sur les données
- Personnalisez selon les segments

Un bon copy transforme les visiteurs en clients en créant une connexion émotionnelle forte et en répondant précisément aux besoins exprimés.`,
    sourceType: "guide",
    tags: ["copywriting", "persuasion", "conversion", "aida", "marketing"]
  },
  {
    title: "Intelligence Artificielle - Applications business pratiques",
    content: `L'intelligence artificielle transforme radicalement le business moderne. Voici les applications les plus impactantes :

**1. Automatisation du service client**
- Chatbots intelligents 24/7
- Réponses personnalisées automatiques
- Escalade intelligente vers les humains
- Analyse de sentiment en temps réel

**2. Marketing et ventes**
- Personnalisation des recommandations produits
- Segmentation automatique des audiences
- Optimisation des campagnes publicitaires
- Prédiction du comportement d'achat

**3. Création de contenu**
- Génération de textes marketing
- Création d'images et visuels
- Optimisation SEO automatique
- Adaptation multicanal du contenu

**4. Analyse et insights**
- Analyse prédictive des ventes
- Détection de tendances marché
- Optimisation des prix dynamique
- Reporting automatisé

**5. Productivité**
- Automatisation des tâches répétitives
- Planification intelligente
- Synthèse de documents
- Traduction multilingue

L'IA n'est plus un luxe mais une nécessité pour rester compétitif. L'important est de commencer petit et d'évoluer progressivement.`,
    sourceType: "article",
    tags: ["ia", "intelligence-artificielle", "business", "automatisation", "productivité"]
  },
  {
    title: "Tunnels de vente - Optimisation des conversions",
    content: `Un tunnel de vente efficace guide méthodiquement vos prospects vers l'achat. Voici comment l'optimiser :

**1. Analyse du parcours actuel**
- Mappez chaque étape du tunnel
- Identifiez les points de friction
- Mesurez les taux de conversion par étape
- Analysez les abandons

**2. Optimisation de la landing page**
- Headline percutant et clair
- Proposition de valeur unique
- Preuves sociales visibles
- CTA contrasté et actionnable

**3. Processus de checkout**
- Minimisez le nombre d'étapes
- Offrez plusieurs moyens de paiement
- Rassurez sur la sécurité
- Proposez des garanties

**4. Techniques d'optimisation**
- Tests A/B systématiques
- Personnalisation selon la source
- Retargeting des abandons
- Upsells et cross-sells stratégiques

**5. Métriques clés à suivre**
- Taux de conversion global
- Coût d'acquisition client (CAC)
- Valeur vie client (LTV)
- Retour sur investissement publicitaire (ROAS)

**6. Outils recommandés**
- ClickFunnels ou Leadpages pour la création
- Google Analytics pour le tracking
- Hotjar pour l'analyse comportementale
- Stripe ou PayPal pour les paiements

Un tunnel optimisé peut doubler voire tripler vos conversions avec le même trafic.`,
    sourceType: "guide",
    tags: ["tunnel-de-vente", "conversion", "optimisation", "landing-page", "checkout"]
  },
  {
    title: "Stratégie de contenu - Réseaux sociaux et engagement",
    content: `Une stratégie de contenu efficace sur les réseaux sociaux nécessite une approche structurée :

**1. Définition de la stratégie**
- Objectifs SMART clairement définis
- Personas détaillés de votre audience
- Choix des plateformes pertinentes
- Calendrier éditorial structuré

**2. Types de contenu performants**
- Contenu éducatif (80% de vos posts)
- Behind-the-scenes authentique
- User-generated content
- Stories et contenu éphémère
- Lives et vidéos interactives

**3. Optimisation par plateforme**

**LinkedIn :**
- Articles longs et expertise
- Posts professionnels
- Networking actif
- Partage d'insights business

**Instagram :**
- Visuels de qualité
- Stories engageantes
- Reels tendances
- IGTV pour le contenu long

**TikTok :**
- Contenu viral et tendances
- Vidéos courtes et dynamiques
- Challenges et hashtags
- Authenticité avant tout

**4. Engagement et communauté**
- Répondez rapidement aux commentaires
- Posez des questions engageantes
- Créez des sondages interactifs
- Collaborez avec d'autres créateurs

**5. Métriques importantes**
- Taux d'engagement (likes, commentaires, partages)
- Portée et impressions
- Croissance des followers qualifiés
- Trafic généré vers votre site
- Conversions attribuées aux réseaux sociaux

La régularité et l'authenticité sont les clés du succès sur les réseaux sociaux.`,
    sourceType: "guide",
    tags: ["réseaux-sociaux", "contenu", "engagement", "instagram", "linkedin", "tiktok"]
  },
  {
    title: "Email Marketing - Stratégies de conversion avancées",
    content: `L'email marketing reste l'un des canaux les plus rentables. Voici comment maximiser vos résultats :

**1. Construction de liste qualifiée**
- Lead magnets irrésistibles
- Formulaires optimisés
- Pop-ups intelligents
- Contenu gated de qualité

**2. Segmentation avancée**
- Comportement d'achat
- Engagement avec les emails
- Données démographiques
- Cycle de vie client

**3. Séquences automatisées**

**Séquence de bienvenue :**
- Email 1 : Bienvenue + livraison du lead magnet
- Email 2 : Présentation de votre histoire
- Email 3 : Contenu de valeur exclusif
- Email 4 : Témoignages et preuves sociales
- Email 5 : Offre spéciale de bienvenue

**Séquence d'abandon de panier :**
- Email 1 : Rappel immédiat (1h après)
- Email 2 : Urgence + bénéfices (24h après)
- Email 3 : Offre spéciale + garantie (72h après)

**4. Optimisation des emails**
- Objets accrocheurs (45-50 caractères max)
- Préheader complémentaire
- Design responsive
- CTA clairs et contrastés
- Personnalisation poussée

**5. Tests et optimisation**
- A/B test sur les objets
- Test des heures d'envoi
- Fréquence optimale
- Longueur du contenu

**6. Métriques clés**
- Taux d'ouverture (>25% = bon)
- Taux de clic (>3% = bon)
- Taux de conversion
- Taux de désabonnement (<0.5%)
- Revenue per email (RPE)

**7. Outils recommandés**
- Mailchimp ou ConvertKit pour débuter
- ActiveCampaign pour l'automation avancée
- Klaviyo pour l'e-commerce
- Sendinblue pour les budgets serrés

Un euro investi en email marketing peut rapporter jusqu'à 42 euros selon les études.`,
    sourceType: "guide",
    tags: ["email-marketing", "automation", "segmentation", "conversion", "newsletter"]
  },
  {
    title: "SEO et référencement naturel - Guide pratique 2024",
    content: `Le SEO évolue constamment. Voici les stratégies qui fonctionnent en 2024 :

**1. Recherche de mots-clés moderne**
- Intention de recherche avant volume
- Mots-clés longue traîne
- Questions fréquentes (People Also Ask)
- Recherche vocale et conversationnelle

**2. Contenu optimisé pour l'utilisateur**
- E-A-T (Expertise, Autorité, Fiabilité)
- Contenu en profondeur (2000+ mots)
- Structure claire avec H1-H6
- Réponses directes aux questions

**3. SEO technique**
- Core Web Vitals optimisés
- Mobile-first indexing
- HTTPS obligatoire
- Structured data (Schema.org)
- Sitemap XML à jour

**4. Stratégie de liens**
- Backlinks de qualité vs quantité
- Guest posting sur sites autoritaires
- Linkbuilding naturel
- Maillage interne stratégique

**5. SEO local (si applicable)**
- Google My Business optimisé
- Citations locales cohérentes
- Avis clients positifs
- Contenu géolocalisé

**6. Outils indispensables**
- Google Search Console (gratuit)
- Google Analytics 4
- SEMrush ou Ahrefs (payant)
- Screaming Frog (technique)
- PageSpeed Insights (performance)

**7. Métriques à suivre**
- Positions moyennes
- Trafic organique
- Taux de clic (CTR)
- Temps de session
- Pages par session

**8. Erreurs à éviter**
- Keyword stuffing
- Contenu dupliqué
- Liens de mauvaise qualité
- Négligence du mobile
- Vitesse de chargement lente

Le SEO est un marathon, pas un sprint. Les résultats arrivent généralement après 3-6 mois d'efforts constants.`,
    sourceType: "guide",
    tags: ["seo", "référencement", "google", "mots-clés", "contenu", "technique"]
  },
  {
    title: "FAQ Dropskills - Questions fréquentes",
    content: `**Q: Qu'est-ce qui différencie Dropskills des autres plateformes de formation ?**
R: Dropskills combine formations pratiques, outils IA intégrés et mentors spécialisés. Notre approche est 100% orientée résultats avec des templates et outils directement utilisables.

**Q: Les outils IA sont-ils inclus dans l'abonnement ?**
R: Oui, tous les outils IA (Copy Mentor, Content Creator, Funnel Builder, etc.) sont inclus dans l'abonnement premium sans limitation d'usage.

**Q: Puis-je utiliser Dropskills si je débute complètement ?**
R: Absolument ! Nos formations partent des bases et progressent étape par étape. Les mentors IA s'adaptent à votre niveau et vous guident personnellement.

**Q: Y a-t-il une garantie de remboursement ?**
R: Oui, nous offrons une garantie satisfait ou remboursé de 30 jours sans condition.

**Q: Les formations sont-elles mises à jour ?**
R: Oui, le contenu est mis à jour régulièrement pour rester à la pointe des dernières tendances marketing et IA.

**Q: Puis-je télécharger les formations ?**
R: Les vidéos sont accessibles en streaming. Vous pouvez télécharger tous les templates, guides PDF et ressources complémentaires.

**Q: Y a-t-il un support client ?**
R: Oui, notre équipe support répond sous 24h maximum. Les membres premium ont accès au support prioritaire.

**Q: Les outils IA fonctionnent-ils en français ?**
R: Oui, tous nos outils IA sont optimisés pour le français et comprennent les spécificités du marché francophone.

**Q: Puis-je utiliser les contenus générés commercialement ?**
R: Oui, tous les contenus créés avec nos outils vous appartiennent et peuvent être utilisés librement pour vos projets commerciaux.

**Q: Y a-t-il des limites d'utilisation ?**
R: Aucune limite sur les outils IA pour les membres premium. Utilisation fair-use pour éviter les abus.

**Q: Proposez-vous des formations en groupe ou du coaching ?**
R: Nous proposons des masterclass mensuelles en live et des sessions de coaching de groupe pour les membres premium.

**Q: Comment accéder aux nouveautés ?**
R: Toutes les nouvelles formations et outils sont automatiquement ajoutés à votre espace membre sans coût supplémentaire.`,
    sourceType: "faq",
    tags: ["faq", "dropskills", "support", "abonnement", "outils-ia", "formations"]
  }
];

async function initializeRAG() {
  console.log('🚀 Initialisation de la base de connaissances RAG...');
  
  try {
    for (const doc of INITIAL_DOCUMENTS) {
      console.log(`📄 Ajout du document: ${doc.title}`);
      
      const documentId = await addDocument(
        doc.title,
        doc.content,
        undefined, // pas d'URL source
        doc.sourceType,
        doc.tags
      );
      
      console.log(`✅ Document ajouté avec l'ID: ${documentId}`);
    }
    
    console.log('🎉 Initialisation terminée avec succès!');
    console.log(`📊 ${INITIAL_DOCUMENTS.length} documents ajoutés à la base de connaissances`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initializeRAG();
}

export { initializeRAG, INITIAL_DOCUMENTS };