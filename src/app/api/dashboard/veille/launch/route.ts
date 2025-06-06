import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { keywords } = body;

    if (!keywords || typeof keywords !== 'string') {
      return NextResponse.json({ error: 'Mots-clés requis' }, { status: 400 });
    }

    const supabase = createServerComponentClient({ cookies });
    const userEmail = session.user.email;
    const canAccessPremium = (session.user as any).role === 'PREMIUM' || (session.user as any).role === 'ADMIN';

    // 1. Analyser les mots-clés
    const keywordsList = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);

    if (keywordsList.length === 0) {
      return NextResponse.json({ error: 'Au moins un mot-clé valide requis' }, { status: 400 });
    }

    // 2. Créer une session de veille
    const veilleSession = {
      user_email: userEmail,
      keywords: keywordsList,
      status: 'processing',
      created_at: new Date().toISOString(),
      is_premium: canAccessPremium
    };

    const { data: sessionData, error: sessionError } = await supabase
      .from('veille_sessions')
      .insert(veilleSession)
      .select()
      .single();

    if (sessionError) {
      console.error('Erreur création session veille:', sessionError);
      return NextResponse.json({ error: 'Erreur création session' }, { status: 500 });
    }

    // 3. Simuler la recherche d'opportunités (à remplacer par vraie logique)
    const simulatedOpportunities = generateOpportunities(keywordsList, canAccessPremium);

    // 4. Sauvegarder les opportunités trouvées
    const opportunitiesData = simulatedOpportunities.map(opp => ({
      ...opp,
      user_email: userEmail,
      veille_session_id: sessionData.id,
      created_at: new Date().toISOString()
    }));

    const { data: savedOpportunities, error: oppError } = await supabase
      .from('opportunities')
      .insert(opportunitiesData)
      .select();

    if (oppError) {
      console.error('Erreur sauvegarde opportunités:', oppError);
      // Continue même si la sauvegarde échoue
    }

    // 5. Mettre à jour le statut de la session
    await supabase
      .from('veille_sessions')
      .update({ 
        status: 'completed',
        opportunities_count: simulatedOpportunities.length 
      })
      .eq('id', sessionData.id);

    // 6. Retourner les résultats
    return NextResponse.json({
      success: true,
      session_id: sessionData.id,
      opportunities_found: simulatedOpportunities.length,
      opportunities: simulatedOpportunities,
      message: `✅ Veille lancée ! ${simulatedOpportunities.length} opportunités détectées pour: ${keywordsList.join(', ')}`
    });

  } catch (error) {
    console.error('Erreur API veille:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      success: false 
    }, { status: 500 });
  }
}

function generateOpportunities(keywords: string[], isPremium: boolean) {
  const opportunityTemplates = [
    {
      title: "Startup {keyword} lève des fonds",
      description: "Nouvelle levée de fonds dans le secteur {keyword}, opportunité de partenariat ou d'investissement",
      source: "LinkedIn",
      relevance_score: 85 + Math.floor(Math.random() * 15),
      priority_level: "high",
      status: "new",
      sector: "Finance"
    },
    {
      title: "Marché {keyword} en expansion",
      description: "Croissance forte du marché {keyword}, demande croissante pour des solutions innovantes",
      source: "TechCrunch",
      relevance_score: 70 + Math.floor(Math.random() * 20),
      priority_level: "medium",
      status: "analyzed",
      sector: "Tech"
    },
    {
      title: "Tendance {keyword} émergente",
      description: "Nouvelle tendance {keyword} identifiée, fort potentiel de développement commercial",
      source: "Veille IA",
      relevance_score: 75 + Math.floor(Math.random() * 20),
      priority_level: "medium",
      status: "new",
      sector: "Innovation"
    }
  ];

  if (isPremium) {
    opportunityTemplates.push(
      {
        title: "Analyse concurrentielle {keyword}",
        description: "Analyse premium des concurrents dans le secteur {keyword}, points faibles identifiés",
        source: "Crunchbase Pro",
        relevance_score: 90 + Math.floor(Math.random() * 10),
        priority_level: "high",
        status: "premium_analysis",
        sector: "Stratégie"
      },
      {
        title: "Opportunité Blue Ocean {keyword}",
        description: "Marché {keyword} peu exploité, opportunité de premier entrant identifiée",
        source: "Research Premium",
        relevance_score: 95 + Math.floor(Math.random() * 5),
        priority_level: "high",
        status: "premium_analysis",
        sector: "Blue Ocean"
      }
    );
  }

  const opportunities = [];
  const maxOpportunities = isPremium ? 8 : 3;

  for (let i = 0; i < Math.min(keywords.length * 2, maxOpportunities); i++) {
    const template = opportunityTemplates[i % opportunityTemplates.length];
    const keyword = keywords[i % keywords.length];
    
    opportunities.push({
      id: `opp_${Date.now()}_${i}`,
      title: template.title.replace(/\{keyword\}/g, keyword),
      description: template.description.replace(/\{keyword\}/g, keyword),
      source: template.source,
      relevance_score: template.relevance_score,
      priority_level: template.priority_level,
      status: template.status,
      tags: [keyword, template.sector.toLowerCase()],
      sector: template.sector
    });
  }

  return opportunities;
} 