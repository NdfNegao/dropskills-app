import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Configuration des tables Product Requests...');

    const supabase = getSupabase();

    // Insérer des données de test directement
    const testData = [
      {
        title: 'Ultimate Survival Prepper',
        description: 'Pack complet avec contenus détaillés, checklists et guides sur la survie, la préparation aux urgences, le stockage alimentaire, l\'auto-défense, et plus encore.',
        status: 'pending',
        votes_count: 19,
        user_id: 'test-user-1',
        user_email: 'user1@example.com',
        priority: 'high'
      },
      {
        title: 'Clés pour humaniser vos textes marketing IA',
        description: 'Des astuces pour rendre vos textes IA plus humains, plus rapides à produire, tout en gardant votre identité de marque !',
        status: 'pending',
        votes_count: 39,
        user_id: 'test-user-2',
        user_email: 'user2@example.com',
        priority: 'high'
      },
      {
        title: 'Bonnes pratiques de sécurité pour le business en ligne',
        description: 'Gardez votre activité et vos données en sécurité sur internet. Options gratuites et payantes pour la cybersécurité – soyez prudent, soyez protégé.',
        status: 'in_progress',
        votes_count: 31,
        user_id: 'test-user-3',
        user_email: 'user3@example.com',
        priority: 'medium'
      },
      {
        title: 'Travailler avec des assistants virtuels (VA)',
        description: 'Comment collaborer efficacement avec un VA à distance. SOPs, KPIs, suivi des tâches et reporting.',
        status: 'pending',
        votes_count: 28,
        user_id: 'test-user-4',
        user_email: 'user4@example.com',
        priority: 'medium'
      },
      {
        title: 'Restez motivé pour garder la forme et la santé',
        description: 'Un workbook motivationnel pour celles et ceux qui peinent à garder de bonnes habitudes pour rester en forme et en bonne santé.',
        status: 'completed',
        votes_count: 29,
        user_id: 'test-user-5',
        user_email: 'user5@example.com',
        priority: 'low'
      },
      {
        title: 'Leadership sécurité : construire une culture de responsabilité',
        description: 'Guide pratique pour les leaders afin d\'instaurer une culture sécurité forte par l\'exemple, la communication et l\'engagement quotidien.',
        status: 'rejected',
        votes_count: 24,
        user_id: 'test-user-6',
        user_email: 'user6@example.com',
        priority: 'low'
      }
    ];

    // Vérifier si les données existent déjà
    const { data: existingRequests } = await supabase
      .from('product_requests')
      .select('id')
      .limit(1);

    if (!existingRequests || existingRequests.length === 0) {
      const { error: insertError } = await supabase
        .from('product_requests')
        .insert(testData);

      if (insertError) {
        console.error('Erreur lors de l\'insertion des données de test:', insertError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'insertion des données de test', details: insertError.message },
          { status: 500 }
        );
      }
    }

    console.log('✅ Données de test Product Requests ajoutées avec succès');

    return NextResponse.json({
      success: true,
      message: 'Données de test Product Requests ajoutées avec succès',
      note: 'Les tables doivent être créées manuellement dans Supabase Dashboard'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la configuration', details: error },
      { status: 500 }
    );
  }
} 