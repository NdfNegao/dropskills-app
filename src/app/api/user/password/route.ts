import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// Créer un mot de passe pour les comptes Google
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà un mot de passe
    const { data: existingUser } = await supabase
      .from('users')
      .select('password')
      .eq('email', session.user.email)
      .single();

    if (existingUser?.password) {
      return NextResponse.json(
        { error: 'Un mot de passe existe déjà. Utilisez la fonction de modification.' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour l'utilisateur avec le nouveau mot de passe
    const { error } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email);

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du mot de passe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe créé avec succès'
    });

  } catch (error) {
    console.error('Erreur API password POST:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Modifier un mot de passe existant
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mot de passe actuel et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec son mot de passe actuel
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password')
      .eq('email', session.user.email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'Aucun mot de passe défini. Utilisez la fonction de création.' },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour avec le nouveau mot de passe
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email);

    if (updateError) {
      console.error('Erreur Supabase:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du mot de passe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur API password PUT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 