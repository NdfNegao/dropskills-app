import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation de l'email
    if (!email) {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // TODO: Vérifier si l'utilisateur existe en base de données
    // const user = await getUserByEmail(email);
    // if (!user) {
    //   // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
    //   return NextResponse.json(
    //     { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' },
    //     { status: 200 }
    //   );
    // }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // TODO: Sauvegarder le token en base de données
    // await savePasswordResetToken({
    //   email,
    //   token: resetToken,
    //   expiresAt: resetTokenExpiry
    // });

    // TODO: Envoyer l'email de réinitialisation
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(email, resetUrl);

    // Simulation pour le développement
    console.log('Token de réinitialisation généré:', {
      email,
      token: resetToken,
      expiresAt: resetTokenExpiry,
      resetUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
    });

    // Réponse générique pour des raisons de sécurité
    return NextResponse.json(
      { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 