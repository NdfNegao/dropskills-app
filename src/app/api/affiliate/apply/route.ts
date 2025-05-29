import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { email, promotionMethod } = await request.json();

    if (!email || !promotionMethod) {
      return NextResponse.json(
        { error: 'Email et méthode de promotion requis' },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;

    // Vérifier si l'utilisateur a déjà postulé
    const { data: existingApplication } = await supabase
      .from('affiliates')
      .select('id')
      .eq('user_email', userEmail)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Vous avez déjà postulé au programme d\'affiliation' },
        { status: 400 }
      );
    }

    // Générer un code d'affiliation unique
    const affiliateCode = `DS${Date.now().toString(36).toUpperCase()}`;

    // Créer la candidature d'affiliation
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_email: userEmail,
        contact_email: email,
        promotion_method: promotionMethod,
        affiliate_code: affiliateCode,
        status: 'pending',
        total_commissions: 0,
        pending_commissions: 0,
        total_referrals: 0,
        conversion_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la candidature' },
        { status: 500 }
      );
    }

    // TODO: Envoyer un email de notification à l'équipe admin
    // TODO: Envoyer un email de confirmation à l'utilisateur

    return NextResponse.json({
      success: true,
      message: 'Candidature envoyée avec succès',
      affiliateCode: affiliateCode
    });

  } catch (error) {
    console.error('Erreur API affiliate apply:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 