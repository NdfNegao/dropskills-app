import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserByEmail } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe dans Supabase Auth
    const user = await getAuthUserByEmail(email);

    if (!user) {
      // Pour des raisons de sécurité, on retourne toujours success
      // même si l'utilisateur n'existe pas
      return NextResponse.json({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
      });
    }

    // TODO: Implémenter l'envoi d'email de réinitialisation
    // Utiliser Supabase Auth pour générer le lien de reset
    // ou un service d'email comme Resend/SendGrid

    return NextResponse.json({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
    });

  } catch (error) {
    console.error('Erreur forgot password:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 