import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

// Templates de titres par plateforme et ton
const TITLE_TEMPLATES = {
  blog: {
    engaging: [
      "Comment {topic} peut transformer votre {audience}",
      "Le secret que {audience} ne veulent pas que vous sachiez sur {topic}",
      "7 façons surprenantes d'utiliser {topic} pour {goal}",
      "Pourquoi {audience} échouent avec {topic} (et comment réussir)",
      "La méthode ultime pour maîtriser {topic} en 30 jours"
    ],
    professional: [
      "Guide complet : {topic} pour {audience}",
      "Analyse approfondie de {topic} : stratégies et résultats",
      "Optimiser {topic} : meilleures pratiques pour {audience}",
      "Étude de cas : comment {topic} améliore {goal}",
      "Tendances 2024 : l'évolution de {topic} pour {audience}"
    ],
    urgent: [
      "URGENT : Ce que {audience} doivent savoir sur {topic}",
      "Dernière chance : {topic} avant qu'il ne soit trop tard",
      "Alerte {audience} : {topic} change tout maintenant",
      "Action immédiate requise : {topic} pour {goal}",
      "Ne ratez pas : {topic} révolutionne {audience}"
    ]
  },
  youtube: {
    engaging: [
      "JE TESTE {topic} pendant 30 jours (résultats CHOQUANTS)",
      "PERSONNE ne vous dit ça sur {topic} (RÉVÉLATIONS)",
      "Comment j'ai transformé ma vie avec {topic}",
      "RÉACTION : {audience} découvrent {topic} pour la première fois",
      "Le DÉFI {topic} qui change tout pour {audience}"
    ],
    funny: [
      "Quand {audience} découvrent {topic} 😂",
      "J'ai essayé {topic} et voici ce qui s'est passé...",
      "POV : Tu es {audience} et tu découvres {topic}",
      "Les FAILS les plus drôles avec {topic}",
      "Mes parents réagissent à {topic} (HILARANT)"
    ]
  },
  linkedin: {
    professional: [
      "3 leçons apprises en implémentant {topic} chez {audience}",
      "Pourquoi {topic} est l'avenir de {goal}",
      "Mon retour d'expérience sur {topic} après 5 ans",
      "Comment {topic} a révolutionné notre approche de {goal}",
      "Les erreurs à éviter avec {topic} (basé sur 100+ projets)"
    ],
    educational: [
      "Thread : Tout comprendre sur {topic} en 5 minutes",
      "Masterclass gratuite : {topic} pour {audience}",
      "Les fondamentaux de {topic} que tout {audience} devrait connaître",
      "Formation express : {topic} de A à Z",
      "Certification {topic} : ce que vous devez savoir"
    ]
  }
};

// Générateur de titres basé sur les paramètres
function generateTitles(data: any): string[] {
  const { topic, platform, tone, audience, goal } = data;
  
  // Templates génériques si pas de correspondance
  const genericTemplates = [
    "Le guide ultime de {topic} pour {audience}",
    "10 astuces {topic} que {audience} adorent",
    "Maîtriser {topic} : stratégies pour {goal}",
    "Les erreurs {topic} que font 90% des {audience}",
    "Comment {topic} peut changer votre {goal}",
    "De débutant à expert : votre parcours {topic}",
    "Les secrets {topic} des {audience} qui réussissent",
    "Révolution {topic} : nouvelles méthodes pour {goal}",
    "Pourquoi {topic} est essentiel pour {audience}",
    "Transformer {goal} grâce à {topic}"
  ];
  
  // Sélection des templates appropriés
  let selectedTemplates: string[] = [];
  
  if (TITLE_TEMPLATES[platform as keyof typeof TITLE_TEMPLATES]) {
    const platformTemplates = TITLE_TEMPLATES[platform as keyof typeof TITLE_TEMPLATES];
    
    // Essayer de trouver le ton spécifique
    if (tone in platformTemplates) {
      selectedTemplates = (platformTemplates as any)[tone];
    } else {
      // Prendre le premier ton disponible pour cette plateforme
      const firstTone = Object.keys(platformTemplates)[0];
      selectedTemplates = (platformTemplates as any)[firstTone];
    }
  }
  
  // Combinaison des templates
  const allTemplates = [...selectedTemplates, ...genericTemplates];
  
  // Génération de 10 titres uniques
  const titles: string[] = [];
  const usedTemplates = new Set();
  
  while (titles.length < 10 && usedTemplates.size < allTemplates.length) {
    const template = allTemplates[Math.floor(Math.random() * allTemplates.length)];
    
    if (!usedTemplates.has(template)) {
      usedTemplates.add(template);
      
      // Remplacement des variables
      let title = template
        .replace(/{topic}/g, topic)
        .replace(/{audience}/g, audience)
        .replace(/{goal}/g, goal);
      
      // Ajustements selon la plateforme
      if (platform === 'youtube') {
        title = title.toUpperCase();
      } else if (platform === 'linkedin') {
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }
      
      titles.push(title);
    }
  }
  
  // Si on n'a pas assez de titres, on en génère d'autres avec variations
  while (titles.length < 10) {
    const baseTemplate = allTemplates[titles.length % allTemplates.length];
    let title = baseTemplate
      .replace(/{topic}/g, topic)
      .replace(/{audience}/g, audience)
      .replace(/{goal}/g, goal);
    
    // Ajout de variations
    const variations = [
      `${title} (Guide 2024)`,
      `${title} - Méthode Prouvée`,
      `${title} : Résultats Garantis`,
      `${title} [GRATUIT]`,
      `${title} + Bonus Exclusif`
    ];
    
    const variation = variations[titles.length % variations.length];
    titles.push(variation);
  }
  
  return titles.slice(0, 10);
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
    
    const requiredFields = ['topic', 'platform', 'audience'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Génération des titres
    const titles = generateTitles(data);

    // Log de l'usage (pour analytics)
    console.log(`Titres générés pour l'utilisateur ${accessCheck.user?.email} - Sujet: ${data.topic}, Plateforme: ${data.platform}`);

    return NextResponse.json({
      success: true,
      titles,
      metadata: {
        topic: data.topic,
        platform: data.platform,
        tone: data.tone,
        audience: data.audience,
        goal: data.goal,
        generatedAt: new Date().toISOString(),
        count: titles.length
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération des titres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 