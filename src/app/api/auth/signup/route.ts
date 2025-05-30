import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

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

    // Vérifier si l'utilisateur existe déjà
    // TODO: Remplacer par une vraie vérification en base de données
    const existingUsers = [
      'admin@dropskills.com',
      'premium@dropskills.com',
      'user@dropskills.com'
    ];

    if (existingUsers.includes(email.toLowerCase())) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // TODO: Sauvegarder l'utilisateur en base de données
    // const newUser = await createUser({
    //   firstName,
    //   lastName,
    //   email: email.toLowerCase(),
    //   password: hashedPassword,
    //   role: 'USER',
    //   createdAt: new Date(),
    //   isActive: true
    // });

    // Simulation de création d'utilisateur
    console.log('Nouvel utilisateur créé:', {
      firstName,
      lastName,
      email: email.toLowerCase(),
      hashedPassword: hashedPassword.substring(0, 20) + '...',
      role: 'USER'
    });

    // TODO: Envoyer un email de bienvenue
    // await sendWelcomeEmail(email, firstName);

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          role: 'USER'
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