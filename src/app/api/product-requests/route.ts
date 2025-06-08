import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase.from('product_requests').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data: requests, error } = await query;
    if (error) {
      throw error;
    }
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Erreur API product-requests GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Titre et description requis' },
        { status: 400 }
      );
    }

    if (title.length < 10 || title.length > 255) {
      return NextResponse.json(
        { error: 'Le titre doit contenir entre 10 et 255 caractères' },
        { status: 400 }
      );
    }

    if (description.length < 20 || description.length > 2000) {
      return NextResponse.json(
        { error: 'La description doit contenir entre 20 et 2000 caractères' },
        { status: 400 }
      );
    }

    const user = session.user as any;
    const { data: newRequest, error } = await supabase.from('product_requests').insert({
      title: title.trim(),
      description: description.trim(),
      user_id: user.id || user.email,
      user_email: user.email
    }).select().single();
    if (error) {
      throw error;
    }
    return NextResponse.json({
      success: true,
      message: 'Demande créée avec succès',
      request: newRequest
    });
  } catch (error) {
    console.error('Erreur API product-requests POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
} 