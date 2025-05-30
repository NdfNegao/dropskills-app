import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Récupérer les préférences de notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les préférences depuis Supabase
    const { data, error } = await supabase
      .from('user_preferences')
      .select('notifications')
      .eq('user_email', session.user.email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des préférences' },
        { status: 500 }
      );
    }

    // Valeurs par défaut si aucune préférence n'existe
    const defaultNotifications = {
      emailMarketing: true,
      newFeatures: true,
      securityAlerts: true, // Toujours activé
      weeklyDigest: false
    };

    const notifications = data?.notifications || defaultNotifications;

    return NextResponse.json(notifications);

  } catch (error) {
    console.error('Erreur API notifications GET:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Mettre à jour les préférences de notifications
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const notifications = await request.json();

    // Validation des données
    const validKeys = ['emailMarketing', 'newFeatures', 'securityAlerts', 'weeklyDigest'];
    const isValid = Object.keys(notifications).every(key => validKeys.includes(key)) &&
                   Object.values(notifications).every(value => typeof value === 'boolean');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    // Forcer les alertes de sécurité à true
    notifications.securityAlerts = true;

    // Vérifier si des préférences existent déjà
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_email', session.user.email)
      .single();

    let result;
    
    if (existing) {
      // Mettre à jour les préférences existantes
      result = await supabase
        .from('user_preferences')
        .update({
          notifications,
          updated_at: new Date().toISOString()
        })
        .eq('user_email', session.user.email);
    } else {
      // Créer de nouvelles préférences
      result = await supabase
        .from('user_preferences')
        .insert({
          user_email: session.user.email,
          notifications,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    if (result.error) {
      console.error('Erreur Supabase:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des préférences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications
    });

  } catch (error) {
    console.error('Erreur API notifications PUT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 