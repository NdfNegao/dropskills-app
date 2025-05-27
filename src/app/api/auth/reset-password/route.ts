import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier si le token est valide et non expiré
    const user = await prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoverySentAt: {
          gt: new Date(Date.now() - 3600000) // Token valide pendant 1 heure
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe et effacer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        recoveryToken: null,
        recoverySentAt: null
      }
    });

    // Mettre à jour le mot de passe dans Supabase
    const { error: supabaseError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (supabaseError) {
      console.error('Erreur lors de la mise à jour du mot de passe dans Supabase:', supabaseError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du mot de passe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 