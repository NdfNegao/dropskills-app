import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';



export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const supabase = createServerComponentClient({ cookies });
    const userEmail = session.user.email;
    // TEMPORAIRE: Accès premium ouvert à tous pour le lancement
    const canAccessPremium = true; // (session.user as any).role === 'PREMIUM' || (session.user as any).role === 'ADMIN';

    // 1. Récupérer les vraies opportunités depuis la table 'opportunities'
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erreur récupération opportunités:', error);
      // Fallback avec données simulées
      return NextResponse.json(getMockOpportunities(canAccessPremium));
    }

    // 2. Si aucune opportunité réelle, retourner des données simulées
    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json(getMockOpportunities(canAccessPremium));
    }

    // 3. Formater les opportunités réelles
    const formattedOpportunities = opportunities.map(opp => ({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      source: opp.source || 'Veille IA',
      relevance_score: opp.relevance_score || 85,
      priority_level: opp.priority_level || 'medium',
      status: opp.status || 'new',
      tags: opp.tags || [],
      sector: opp.sector || 'Non défini',
      created_at: opp.created_at
    }));

    return NextResponse.json(formattedOpportunities);

  } catch (error) {
    console.error('Erreur dashboard opportunities:', error);
    
    // Fallback en cas d'erreur
    return NextResponse.json(getMockOpportunities(false));
  }
}

function getMockOpportunities(canAccessPremium: boolean) {
  const baseOpportunities = [
    {
      id: '1',
      title: 'Startup FinTech lève 2M€',
      description: 'Nouvelle opportunité dans le secteur bancaire digital français',
      source: 'LinkedIn',
      relevance_score: 92,
      priority_level: 'high',
      status: 'new',
      tags: ['fintech', 'levée de fonds', 'france'],
      sector: 'Finance',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Marché SaaS B2B en croissance',
      description: 'Opportunité dans l\'automatisation des processus RH',
      source: 'TechCrunch',
      relevance_score: 78,
      priority_level: 'medium',
      status: 'analyzed',
      tags: ['saas', 'b2b', 'rh'],
      sector: 'Tech',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'E-commerce alimentaire bio',
      description: 'Tendance forte vers l\'alimentation bio et locale',
      source: 'Veille IA',
      relevance_score: 85,
      priority_level: 'high',
      status: 'new',
      tags: ['ecommerce', 'bio', 'alimentaire'],
      sector: 'Commerce',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  if (canAccessPremium) {
    return [
      ...baseOpportunities,
      {
        id: '4',
        title: 'IA générative pour l\'éducation',
        description: 'Secteur éducatif recherche solutions IA personnalisées',
        source: 'ProductHunt',
        relevance_score: 90,
        priority_level: 'high',
        status: 'premium_analysis',
        tags: ['ia', 'éducation', 'personnalisation'],
        sector: 'EdTech',
        created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: '5',
        title: 'Solutions de télétravail hybride',
        description: 'Entreprises cherchent outils collaboration avancés',
        source: 'Crunchbase',
        relevance_score: 88,
        priority_level: 'medium',
        status: 'premium_analysis',
        tags: ['télétravail', 'collaboration', 'productivité'],
        sector: 'Workplace',
        created_at: new Date(Date.now() - 345600000).toISOString()
      }
    ];
  }

  return baseOpportunities;
}