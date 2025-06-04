import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà dans Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Déterminer le rôle (ADMIN si c'est l'email de Cyril)
    const role = email.toLowerCase() === 'cyril.iriebi@gmail.com' ? 'ADMIN' : 'USER';
    const isPremium = role === 'ADMIN'; // L'admin est premium par défaut

    // Sauvegarder l'utilisateur en base de données
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        role: role,
        is_premium: isPremium,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de la création de l\'utilisateur:', insertError);
      return NextResponse.json(
        { message: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    console.log('Nouvel utilisateur créé:', {
      id: newUser.id,
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: role
    });

    // TODO: Envoyer un email de bienvenue
    // await sendWelcomeEmail(email, firstName);

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: {
          id: newUser.id,
          firstName,
          lastName,
          email: email.toLowerCase(),
          role: role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 