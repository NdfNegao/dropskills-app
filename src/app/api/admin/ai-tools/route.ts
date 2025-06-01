import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET : Liste tous les outils IA
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('ai_tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST : Crée un nouvel outil IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('ai_tools')
      .insert(body)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
} 