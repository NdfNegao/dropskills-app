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

// Templates de contenu par plateforme
const CONTENT_TEMPLATES = {
  Instagram: {
    types: ['Post photo', 'Story', 'Reel', 'Carrousel'],
    hashtags: ['#entrepreneur', '#business', '#motivation', '#success', '#tips']
  },
  LinkedIn: {
    types: ['Article', 'Post', 'Carrousel', 'Vidéo'],
    hashtags: ['#leadership', '#business', '#networking', '#professional', '#growth']
  },
  Facebook: {
    types: ['Post', 'Vidéo', 'Live', 'Event'],
    hashtags: ['#business', '#community', '#tips', '#success', '#motivation']
  },
  TikTok: {
    types: ['Vidéo courte', 'Trend', 'Tutorial', 'Behind the scenes'],
    hashtags: ['#fyp', '#business', '#entrepreneur', '#tips', '#viral']
  },
  YouTube: {
    types: ['Vidéo longue', 'Short', 'Live', 'Podcast'],
    hashtags: ['#youtube', '#business', '#tutorial', '#entrepreneur', '#tips']
  },
  Twitter: {
    types: ['Tweet', 'Thread', 'Retweet', 'Space'],
    hashtags: ['#business', '#entrepreneur', '#tips', '#startup', '#growth']
  },
  Blog: {
    types: ['Article', 'Guide', 'Case study', 'Interview'],
    hashtags: ['#blog', '#content', '#business', '#tips', '#guide']
  },
  Email: {
    types: ['Newsletter', 'Promotion', 'Welcome', 'Tips'],
    hashtags: ['#email', '#newsletter', '#tips', '#business', '#value']
  }
};

// Générateur de contenu
function generateContentPlan(data: any) {
  const { business, audience, goals, platforms, frequency, tone } = data;
  
  const contentPlan = [];
  const postsPerWeek = frequency === 'daily' ? 7 : frequency === '3times' ? 3 : frequency === 'weekly' ? 1 : 2;
  
  for (let week = 1; week <= 4; week++) {
    const weekContent = [];
    
    for (let post = 0; post < postsPerWeek; post++) {
      const platform = platforms[post % platforms.length];
      const template = CONTENT_TEMPLATES[platform as keyof typeof CONTENT_TEMPLATES];
      const contentType = template.types[Math.floor(Math.random() * template.types.length)];
      
      // Génération du titre selon le type de contenu
      const titles = [
        `Comment ${business.toLowerCase()} peut transformer votre ${goals[0]?.toLowerCase()}`,
        `5 secrets que ${audience} ne connaissent pas sur ${business.toLowerCase()}`,
        `Pourquoi ${audience} échouent avec ${business.toLowerCase()} (et comment réussir)`,
        `Le guide ultime pour ${audience} : ${business.toLowerCase()}`,
        `Transformation ${business.toLowerCase()} : avant/après inspirant`,
        `Les erreurs à éviter quand on débute avec ${business.toLowerCase()}`,
        `Mon retour d'expérience : ${business.toLowerCase()} après 1 an`,
        `3 astuces ${business.toLowerCase()} que j'aurais aimé connaître plus tôt`,
        `Défi 30 jours : ${business.toLowerCase()} pour ${audience}`,
        `Behind the scenes : comment je gère mon ${business.toLowerCase()}`
      ];
      
      const descriptions = [
        `Découvrez comment optimiser votre approche ${business.toLowerCase()} pour obtenir des résultats concrets.`,
        `Partagez votre expérience et vos conseils pratiques avec ${audience}.`,
        `Analysez les tendances actuelles et leur impact sur ${business.toLowerCase()}.`,
        `Présentez une étude de cas réelle avec des résultats mesurables.`,
        `Offrez de la valeur gratuite à votre communauté ${audience}.`,
        `Répondez aux questions fréquentes de ${audience} sur ${business.toLowerCase()}.`,
        `Montrez les coulisses de votre ${business.toLowerCase()} pour créer de l'authenticité.`,
        `Proposez un défi interactif pour engager ${audience}.`,
        `Partagez une transformation inspirante liée à ${business.toLowerCase()}.`,
        `Donnez des conseils pratiques et actionnables pour ${audience}.`
      ];
      
      weekContent.push({
        platform,
        type: contentType,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        hashtags: [
          ...template.hashtags.slice(0, 3),
          `#${business.toLowerCase().replace(/\s+/g, '')}`,
          `#${audience.toLowerCase().replace(/\s+/g, '')}`
        ]
      });
    }
    
    contentPlan.push({
      week,
      content: weekContent
    });
  }
  
  return contentPlan;
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
    
    const requiredFields = ['business', 'audience', 'goals', 'platforms'];
    for (const field of requiredFields) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Génération du plan de contenu
    const contentPlan = generateContentPlan(data);

    // Log de l'usage (pour analytics)
    console.log(`Système de contenu généré pour l'utilisateur ${accessCheck.user?.email} - Business: ${data.business}`);

    return NextResponse.json({
      success: true,
      contentPlan,
      metadata: {
        business: data.business,
        audience: data.audience,
        platforms: data.platforms,
        frequency: data.frequency,
        generatedAt: new Date().toISOString(),
        weeksGenerated: 4
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération du système de contenu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 