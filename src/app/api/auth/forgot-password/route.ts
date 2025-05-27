import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un succès
      return NextResponse.json({ success: true });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Expire dans 1 heure

    // Mettre à jour l'utilisateur avec le token
    await prisma.user.updateMany({
      where: { email },
      data: {
        recoveryToken: resetToken,
        recoverySentAt: new Date()
      }
    });

    // Envoyer l'email via Supabase
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    });

    if (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
} 