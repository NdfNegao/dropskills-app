import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour soumettre une idée' },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Le titre et la description sont requis' },
        { status: 400 }
      );
    }

    // Insérer l'idée dans la base de données
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: title.trim(),
        description: description.trim(),
        user_email: session.user.email,
        status: 'submitted',
        votes_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'insertion de l\'idée:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la soumission de l\'idée' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Idée soumise avec succès !',
        idea: data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur API ideas:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        user:user_email (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des idées:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des idées' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: data || [] });

  } catch (error) {
    console.error('Erreur API ideas GET:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}