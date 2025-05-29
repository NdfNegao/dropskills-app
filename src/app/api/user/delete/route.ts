import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Vérifier que l'utilisateur n'est pas un admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', userEmail)
      .single();

    if (userData?.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Les comptes administrateur ne peuvent pas être supprimés via cette interface' },
        { status: 403 }
      );
    }

    // Commencer une transaction de suppression
    // 1. Supprimer les préférences utilisateur
    await supabase
      .from('user_preferences')
      .delete()
      .eq('user_email', userEmail);

    // 2. Supprimer l'historique d'utilisation des outils
    await supabase
      .from('tool_usage')
      .delete()
      .eq('user_email', userEmail);

    // 3. Supprimer les données sauvegardées
    await supabase
      .from('user_saved_data')
      .delete()
      .eq('user_email', userEmail);

    // 4. Supprimer les sessions actives
    await supabase
      .from('sessions')
      .delete()
      .eq('user_email', userEmail);

    // 5. Supprimer les comptes liés (OAuth)
    await supabase
      .from('accounts')
      .delete()
      .eq('user_email', userEmail);

    // 6. Finalement, supprimer l'utilisateur principal
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('email', userEmail);

    if (deleteUserError) {
      console.error('Erreur suppression utilisateur:', deleteUserError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du compte' },
        { status: 500 }
      );
    }

    // Log de l'action pour audit
    console.log(`Compte utilisateur supprimé: ${userEmail} à ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur API delete:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
} 