import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single();

    if (!userData || (userData.role !== 'SUPER_ADMIN' && userData.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { id, status } = await request.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'ID et statut valide requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la demande
    const { data, error } = await supabase
      .from('affiliates')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut' },
        { status: 500 }
      );
    }

    // Si approuvé, on pourrait ici déclencher l'intégration avec Systeme.io
    if (status === 'approved') {
      // TODO: Intégrer avec l'API Systeme.io pour créer l'affilié
      // TODO: Envoyer un email de bienvenue avec les instructions
      console.log(`Affilié approuvé: ${data.contact_email} - Code: ${data.affiliate_code}`);
    }

    // TODO: Envoyer un email de notification à l'utilisateur
    
    return NextResponse.json({
      success: true,
      message: `Demande ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`,
      data
    });

  } catch (error) {
    console.error('Erreur API admin affiliates update:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 