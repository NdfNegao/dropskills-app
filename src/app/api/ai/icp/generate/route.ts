import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Vérification des permissions premium
async function checkPremiumAccess(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { authorized: false, error: 'Authentication required' };
  }

  const userRole = (session.user as any).role;
  const canAccessPremium = userRole === 'PREMIUM' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  if (!canAccessPremium) {
    return { authorized: false, error: 'Premium subscription required' };
  }

  return { authorized: true, user: session.user };
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier les permissions
    const authCheck = await checkPremiumAccess(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const formData = await request.json();
    
    // Validation des données
    const requiredFields = ['secteur', 'produitService', 'promesseUnique', 'budgetCible', 'zoneGeographique', 'tonalite'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Génération de l'ICP avec IA (simulation pour le développement)
    const icpAnalysis = await generateICPAnalysis(formData);

    // Log de l'usage pour analytics
    await logAIUsage(authCheck.user.id, 'ICP_GENERATION', formData);

    return NextResponse.json({
      success: true,
      analysis: icpAnalysis,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur génération ICP:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction de génération d'ICP (simulation IA)
async function generateICPAnalysis(formData: any) {
  // Simulation d'un délai d'IA
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    profilSociodemographique: {
      age: generateAgeRange(formData.secteur),
      sexe: "Mixte avec légère prédominance féminine (55%)",
      localisation: formData.zoneGeographique,
      situationPro: generateProfessionalSituation(formData.secteur),
      niveauRevenus: formData.budgetCible
    },
    psychologieMotivations: {
      besoins: generateNeeds(formData.secteur, formData.produitService),
      desirs: generateDesires(formData.promesseUnique),
      peurs: generateFears(formData.secteur),
      objections: generateObjections(formData.budgetCible)
    },
    problemePrincipaux: generateMainProblems(formData.secteur, formData.produitService),
    ouLeTrouver: {
      canaux: formData.canaux || [],
      plateformes: generatePlatforms(formData.canaux),
      groupes: generateGroups(formData.secteur),
      evenements: generateEvents(formData.secteur)
    },
    messagingImpactant: {
      expressions: generateExpressions(formData.tonalite),
      accroches: generateHooks(formData.promesseUnique),
      styleDiscours: formData.tonalite
    },
    budgetPouvoirAchat: {
      budgetTypique: formData.budgetCible,
      frequenceAchat: generatePurchaseFrequency(formData.secteur),
      facteursPrix: generatePriceFactors(formData.secteur)
    },
    segments: {
      principal: {
        nom: "Segment Principal",
        description: `Profil principal pour ${formData.secteur}`,
        pourcentage: "70%"
      },
      variantes: [
        {
          nom: "Segment Secondaire",
          description: "Variante du profil principal",
          pourcentage: "20%"
        },
        {
          nom: "Segment Niche",
          description: "Segment de niche spécialisé",
          pourcentage: "10%"
        }
      ]
    },
    ficheActionable: {
      resumeExecutif: `Votre client idéal dans le secteur ${formData.secteur} recherche ${formData.promesseUnique}.`,
      prioritesMarketing: [
        "Créer du contenu éducatif",
        "Développer la confiance",
        "Démontrer la valeur",
        "Faciliter la prise de décision"
      ],
      prochainEtapes: [
        "Créer des personas détaillés",
        "Adapter le messaging",
        "Tester les canaux identifiés",
        "Mesurer l'engagement"
      ],
      metriquesACles: [
        "Taux de conversion",
        "Coût d'acquisition client",
        "Lifetime value",
        "Net Promoter Score"
      ]
    }
  };
}

// Fonctions utilitaires de génération
function generateAgeRange(secteur: string): string {
  const ageRanges: Record<string, string> = {
    'technologie': '25-45 ans',
    'sante': '30-55 ans',
    'education': '25-50 ans',
    'finance': '30-60 ans',
    'default': '25-50 ans'
  };
  return ageRanges[secteur.toLowerCase()] || ageRanges.default;
}

function generateProfessionalSituation(secteur: string): string {
  const situations: Record<string, string> = {
    'technologie': 'Cadres, entrepreneurs, freelances tech',
    'sante': 'Professionnels de santé, patients actifs',
    'education': 'Enseignants, formateurs, apprenants',
    'finance': 'Cadres financiers, entrepreneurs, investisseurs',
    'default': 'Professionnels actifs, entrepreneurs'
  };
  return situations[secteur.toLowerCase()] || situations.default;
}

function generateNeeds(secteur: string, produit: string): string[] {
  return [
    `Solution efficace pour ${produit.toLowerCase()}`,
    'Gain de temps et d\'efficacité',
    'Résultats mesurables',
    'Support et accompagnement'
  ];
}

function generateDesires(promesse: string): string[] {
  return [
    `Atteindre ${promesse.toLowerCase()}`,
    'Se démarquer de la concurrence',
    'Reconnaissance professionnelle',
    'Croissance et développement'
  ];
}

function generateFears(secteur: string): string[] {
  return [
    'Faire le mauvais choix',
    'Perdre du temps et de l\'argent',
    'Ne pas obtenir les résultats promis',
    'Complexité de mise en œuvre'
  ];
}

function generateObjections(budget: string): string[] {
  return [
    `Budget limité (${budget})`,
    'Manque de temps pour la mise en œuvre',
    'Doutes sur l\'efficacité',
    'Besoin de preuves sociales'
  ];
}

function generateMainProblems(secteur: string, produit: string): string[] {
  return [
    `Difficulté à ${produit.toLowerCase()}`,
    'Manque de stratégie claire',
    'Outils inadaptés ou obsolètes',
    'Manque d\'expertise interne'
  ];
}

function generatePlatforms(canaux: string[]): string[] {
  const platformMap: Record<string, string[]> = {
    'linkedin': ['LinkedIn', 'LinkedIn Groups', 'LinkedIn Sales Navigator'],
    'facebook': ['Facebook', 'Facebook Groups', 'Facebook Marketplace'],
    'instagram': ['Instagram', 'Instagram Stories', 'Instagram Reels'],
    'youtube': ['YouTube', 'YouTube Shorts', 'YouTube Community'],
    'email': ['Email Marketing', 'Newsletters', 'Email Sequences']
  };
  
  const platforms = new Set<string>();
  canaux.forEach(canal => {
    const canalPlatforms = platformMap[canal.toLowerCase()] || [canal];
    canalPlatforms.forEach(platform => platforms.add(platform));
  });
  
  return Array.from(platforms);
}

function generateGroups(secteur: string): string[] {
  return [
    `Groupes professionnels ${secteur}`,
    'Communautés d\'entrepreneurs',
    'Forums spécialisés',
    'Associations professionnelles'
  ];
}

function generateEvents(secteur: string): string[] {
  return [
    `Salons professionnels ${secteur}`,
    'Conférences et webinaires',
    'Networking events',
    'Formations et workshops'
  ];
}

function generateExpressions(tonalite: string): string[] {
  const expressions: Record<string, string[]> = {
    'professionnel': ['Optimiser', 'Maximiser', 'Stratégique', 'Performance'],
    'amical': ['Ensemble', 'Simplement', 'Facilement', 'Naturellement'],
    'expert': ['Expertise', 'Maîtrise', 'Excellence', 'Innovation'],
    'default': ['Efficace', 'Pratique', 'Résultats', 'Solution']
  };
  return expressions[tonalite.toLowerCase()] || expressions.default;
}

function generateHooks(promesse: string): string[] {
  return [
    `"Découvrez comment ${promesse.toLowerCase()}"`,
    `"La méthode pour ${promesse.toLowerCase()}"`,
    `"Enfin une solution pour ${promesse.toLowerCase()}"`,
    `"Transformez votre approche de ${promesse.toLowerCase()}"`
  ];
}

function generatePurchaseFrequency(secteur: string): string {
  const frequencies: Record<string, string> = {
    'technologie': 'Trimestrielle à annuelle',
    'sante': 'Mensuelle à trimestrielle',
    'education': 'Annuelle',
    'finance': 'Trimestrielle',
    'default': 'Trimestrielle à annuelle'
  };
  return frequencies[secteur.toLowerCase()] || frequencies.default;
}

function generatePriceFactors(secteur: string): string[] {
  return [
    'Rapport qualité-prix',
    'ROI démontrable',
    'Support inclus',
    'Garantie de résultats'
  ];
}

// Log de l'usage IA pour analytics
async function logAIUsage(userId: string, action: string, data: any) {
  try {
    // Ici vous pourriez logger dans votre base de données
    console.log(`AI Usage - User: ${userId}, Action: ${action}, Data:`, data);
  } catch (error) {
    console.error('Erreur lors du logging:', error);
  }
} 