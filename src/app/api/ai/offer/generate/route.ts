import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Fonction utilitaire pour vérifier l'accès premium
async function checkPremiumAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { error: 'Non authentifié', status: 401 };
  }

  // Vérification du rôle premium
  const userRole = session.user.role;
  if (!['PREMIUM', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
    return { error: 'Accès premium requis', status: 403 };
  }

  return { user: session.user };
}

// Templates d'offres par secteur
const OFFER_TEMPLATES = {
  ecommerce: {
    hook: "Transformez vos visiteurs en clients fidèles",
    structure: "problème → solution → bénéfices → urgence → garantie → CTA"
  },
  saas: {
    hook: "Automatisez votre business et gagnez du temps",
    structure: "douleur → démonstration → ROI → essai gratuit → CTA"
  },
  consulting: {
    hook: "Obtenez les résultats que vous méritez",
    structure: "expertise → cas clients → méthode → résultats → CTA"
  },
  agency: {
    hook: "Déléguez et concentrez-vous sur l'essentiel",
    structure: "problème → processus → portfolio → garantie → CTA"
  },
  restaurant: {
    hook: "Une expérience culinaire inoubliable",
    structure: "ambiance → spécialités → fraîcheur → réservation → CTA"
  },
  fitness: {
    hook: "Atteignez vos objectifs forme et bien-être",
    structure: "transformation → méthode → accompagnement → résultats → CTA"
  },
  'real-estate': {
    hook: "Trouvez le bien immobilier de vos rêves",
    structure: "besoins → expertise → portfolio → accompagnement → CTA"
  },
  other: {
    hook: "La solution que vous attendiez",
    structure: "problème → solution → avantages → preuve → CTA"
  }
};

// Générateur d'offres basé sur les paramètres
function generateOffer(data: any) {
  const template = OFFER_TEMPLATES[data.businessType as keyof typeof OFFER_TEMPLATES] || OFFER_TEMPLATES.other;
  
  // Adaptation du ton
  const toneAdjustments = {
    professional: { style: "formel", vocabulary: "technique" },
    friendly: { style: "chaleureux", vocabulary: "accessible" },
    urgent: { style: "pressant", vocabulary: "action" },
    luxury: { style: "exclusif", vocabulary: "premium" },
    casual: { style: "décontracté", vocabulary: "simple" }
  };

  const tone = toneAdjustments[data.tone as keyof typeof toneAdjustments] || toneAdjustments.professional;

  // Génération de l'offre
  let offer = `🎯 ${template.hook}\n\n`;

  // Accroche personnalisée
  offer += `Cher(e) ${data.targetAudience},\n\n`;

  // Problème/Besoin
  offer += `Vous cherchez ${data.productService.toLowerCase()} mais vous vous heurtez aux mêmes obstacles que la plupart des ${data.targetAudience.toLowerCase()} :\n`;
  offer += `• Manque de temps pour tout gérer\n`;
  offer += `• Difficultés à obtenir des résultats concrets\n`;
  offer += `• Budget serré et ROI incertain\n\n`;

  // Solution
  offer += `🚀 VOICI LA SOLUTION QUI CHANGE TOUT :\n\n`;
  offer += `${data.productService} avec ${data.uniqueValue}.\n\n`;

  // Bénéfices
  offer += `✅ CE QUE VOUS OBTENEZ :\n`;
  offer += `• Résultats mesurables dès les premiers jours\n`;
  offer += `• Accompagnement personnalisé par nos experts\n`;
  offer += `• Méthode éprouvée par +1000 clients satisfaits\n`;
  offer += `• Support prioritaire 7j/7\n\n`;

  // Prix et urgence
  const urgencyTexts = {
    low: "Offre valable ce mois-ci",
    medium: "Places limitées - Réservez maintenant",
    high: "⚡ DERNIÈRES HEURES - Stock limité !"
  };

  offer += `💰 INVESTISSEMENT : À partir de ${data.priceRange.split('-')[0]}€\n`;
  offer += `🎁 BONUS EXCLUSIF : Formation offerte (valeur 297€)\n\n`;

  offer += `⏰ ${urgencyTexts[data.urgency as keyof typeof urgencyTexts]}\n\n`;

  // Garantie
  offer += `🛡️ GARANTIE SATISFAIT OU REMBOURSÉ 30 JOURS\n`;
  offer += `Nous sommes tellement confiants que vous allez adorer notre ${data.productService.toLowerCase()} que nous vous offrons une garantie complète.\n\n`;

  // Call to Action
  offer += `🎯 PASSEZ À L'ACTION MAINTENANT :\n`;
  offer += `👉 Cliquez sur le bouton ci-dessous\n`;
  offer += `👉 Réservez votre créneau de consultation gratuite\n`;
  offer += `👉 Commencez votre transformation dès aujourd'hui\n\n`;

  offer += `[BOUTON] 🚀 JE VEUX COMMENCER MAINTENANT\n\n`;

  // Signature
  offer += `À très bientôt,\n`;
  offer += `L'équipe Dropskills\n\n`;

  offer += `P.S. : N'attendez pas demain pour ce que vous pouvez commencer aujourd'hui. Vos concurrents, eux, n'attendent pas ! 💪`;

  return offer;
}

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'accès premium
    const accessCheck = await checkPremiumAccess();
    if (accessCheck.error) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    // Validation des données d'entrée
    const data = await request.json();
    
    const requiredFields = ['businessType', 'targetAudience', 'productService', 'uniqueValue', 'priceRange'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Génération de l'offre
    const offer = generateOffer(data);

    // Log de l'usage (pour analytics)
    console.log(`Offre générée pour l'utilisateur ${accessCheck.user?.email} - Secteur: ${data.businessType}`);

    return NextResponse.json({
      success: true,
      offer,
      metadata: {
        businessType: data.businessType,
        targetAudience: data.targetAudience,
        tone: data.tone,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération de l\'offre:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 