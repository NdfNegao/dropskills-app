import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Récupérer les données utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (userError) {
      console.error('Erreur récupération utilisateur:', userError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données utilisateur' },
        { status: 500 }
      );
    }

    // Récupérer les préférences
    const { data: preferencesData } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_email', userEmail)
      .single();

    // Récupérer l'historique d'utilisation des outils (si la table existe)
    const { data: usageData } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(100); // Limiter à 100 dernières utilisations

    // Récupérer les données sauvegardées (projets, ICP, etc.)
    const { data: savedData } = await supabase
      .from('user_saved_data')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    // Construire l'objet d'export complet
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        platform: 'DropSkills'
      },
      profile: {
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        name: userData.name,
        role: userData.role,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
        lastLoginAt: userData.last_login_at
      },
      preferences: {
        notifications: preferencesData?.notifications || {
          emailMarketing: true,
          newFeatures: true,
          securityAlerts: true,
          weeklyDigest: false
        },
        createdAt: preferencesData?.created_at,
        updatedAt: preferencesData?.updated_at
      },
      toolUsage: {
        totalUsages: usageData?.length || 0,
        recentUsages: usageData?.map(usage => ({
          toolName: usage.tool_name,
          usedAt: usage.created_at,
          metadata: usage.metadata
        })) || []
      },
      savedData: {
        totalSaved: savedData?.length || 0,
        projects: savedData?.map(item => ({
          type: item.data_type,
          title: item.title,
          content: item.content,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) || []
      },
      statistics: {
        accountAge: userData.created_at ? 
          Math.floor((new Date().getTime() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)) + ' jours' : 
          'Non disponible',
        isPremium: userData.role === 'PREMIUM' || userData.role === 'ADMIN',
        isAdmin: userData.email === 'cyril.iriebi@gmail.com'
      }
    };

    return NextResponse.json(exportData);

  } catch (error) {
    console.error('Erreur API export:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'export' },
      { status: 500 }
    );
  }
}