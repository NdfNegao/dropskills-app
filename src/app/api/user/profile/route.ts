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

    const { firstName, lastName } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Prénom et nom requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le profil dans Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du profil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        firstName: data.first_name,
        lastName: data.last_name,
        name: data.name,
        email: data.email
      }
    });

  } catch (error) {
    console.error('Erreur API profile:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 