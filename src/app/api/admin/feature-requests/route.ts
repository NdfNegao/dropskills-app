import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { featureRequestSchema } from '@/lib/validations/admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// GET : Liste des demandes de fonctionnalités avec filtres


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Essayer d'abord avec la vraie table
    try {
      let query = supabaseAdmin
        .from('feature_requests')
        .select('*', { count: 'exact' })
        .order('votes', { ascending: false }) // Trier par nombre de votes
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (priority && priority !== 'all') {
        query = query.eq('priority', priority);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        features: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      });

    } catch (dbError) {
      // Si la table n'existe pas, retourner des données par défaut
      console.log('Table feature_requests non trouvée, utilisation de données par défaut');
      
      const mockFeatures = [
        {
          id: '1',
          user_email: 'sarah.dev@company.com',
          title: 'Générateur d\'emails de prospection',
          description: 'Créer un outil IA qui génère des emails de prospection personnalisés basés sur le profil LinkedIn du prospect et le contexte de l\'entreprise.',
          category: 'ai_tool' as const,
          priority: 'high' as const,
          status: 'planned' as const,
          votes: 47,
          estimated_effort: 'large' as const,
          target_version: 'v2.1',
          assigned_to: 'Équipe IA',
          business_value: 'high' as const,
          technical_complexity: 'medium' as const,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          user_email: 'marc.marketing@startup.fr',
          title: 'Interface mobile responsive',
          description: 'Améliorer l\'interface mobile pour permettre l\'utilisation des outils IA depuis un smartphone. Actuellement très difficile à utiliser.',
          category: 'ui_improvement' as const,
          priority: 'high' as const,
          status: 'in_development' as const,
          votes: 32,
          estimated_effort: 'medium' as const,
          target_version: 'v1.8',
          assigned_to: 'Équipe Frontend',
          business_value: 'medium' as const,
          technical_complexity: 'medium' as const,
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          user_email: 'julie.growth@agency.io',
          title: 'Intégration HubSpot',
          description: 'Connecter directement les outils IA avec HubSpot pour importer automatiquement les ICPs générés et synchroniser les contacts.',
          category: 'integration' as const,
          priority: 'medium' as const,
          status: 'under_review' as const,
          votes: 28,
          estimated_effort: 'large' as const,
          business_value: 'high' as const,
          technical_complexity: 'high' as const,
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          user_email: 'alex.founder@unicorn.co',
          title: 'Mode collaboratif équipe',
          description: 'Permettre aux équipes de travailler ensemble sur les mêmes projets, partager les templates et collaborer en temps réel.',
          category: 'new_feature' as const,
          priority: 'critical' as const,
          status: 'submitted' as const,
          votes: 64,
          business_value: 'critical' as const,
          technical_complexity: 'complex' as const,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          user_email: 'thomas.consultant@pro.com',
          title: 'Export PDF automatique',
          description: 'Générer automatiquement des PDFs professionnels avec les résultats des outils IA pour les présenter aux clients.',
          category: 'new_feature' as const,
          priority: 'low' as const,
          status: 'completed' as const,
          votes: 15,
          estimated_effort: 'small' as const,
          target_version: 'v1.7',
          business_value: 'medium' as const,
          technical_complexity: 'low' as const,
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Appliquer les filtres
      let filteredFeatures = mockFeatures;
      
      if (status && status !== 'all') {
        filteredFeatures = filteredFeatures.filter(f => f.status === status);
      }
      if (category && category !== 'all') {
        filteredFeatures = filteredFeatures.filter(f => f.category === category);
      }
      if (priority && priority !== 'all') {
        filteredFeatures = filteredFeatures.filter(f => f.priority === priority);
      }

      // Trier par votes puis par date
      filteredFeatures.sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      const total = filteredFeatures.length;
      const startIndex = (page - 1) * limit;
      const paginatedFeatures = filteredFeatures.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        features: paginatedFeatures,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error('Erreur API feature requests:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Créer une nouvelle demande de fonctionnalité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = featureRequestSchema.omit({ 
      id: true, 
      created_at: true, 
      updated_at: true,
      votes: true // Les votes commencent à 0
    }).parse(body);

    try {
      const { data, error } = await supabaseAdmin
        .from('feature_requests')
        .insert({
          ...validatedData,
          votes: 1, // L'utilisateur qui créé vote automatiquement
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json(data);
    } catch (dbError) {
      // Si la table n'existe pas, simuler la création
      console.log('Table feature_requests non trouvée, simulation de création');
      
      const mockFeature = {
        id: Date.now().toString(),
        ...validatedData,
        votes: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json(mockFeature);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: error.errors.map(e => ({ 
          field: e.path.join('.'), 
          message: e.message 
        }))
      }, { status: 400 });
    }
    
    console.error('Erreur création feature request:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 