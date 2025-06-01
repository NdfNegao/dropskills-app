import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// PUT : Met à jour un outil IA
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await request.json();
  const { data, error } = await supabaseAdmin
    .from('ai_tools')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// DELETE : Supprime un outil IA
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { error } = await supabaseAdmin
    .from('ai_tools')
    .delete()
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
} 