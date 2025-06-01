import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Calcul estimé du coût basé sur le modèle et les tokens
const calculateCost = (model: string, tokens: number): number => {
  const costs: Record<string, number> = {
    'gpt-4o': 0.015, // $15 per 1M tokens
    'gpt-4o-mini': 0.00015, // $0.15 per 1M tokens
    'gpt-3.5-turbo': 0.0005, // $0.50 per 1M tokens
  };
  
  const costPerToken = costs[model] || 0.001;
  return (tokens / 1000000) * costPerToken;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tool_id,
      user_id,
      user_email,
      input,
      output,
      tokens_used,
      duration_ms,
      status,
      error_message,
      model_used
    } = body;

    // Calculer le coût estimé
    const cost_estimate = tokens_used ? calculateCost(model_used, tokens_used) : 0;

    const { data, error } = await supabaseAdmin
      .from('ai_tool_logs')
      .insert({
        tool_id,
        user_id,
        user_email,
        input,
        output,
        tokens_used,
        duration_ms,
        status,
        error_message,
        model_used,
        cost_estimate
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors du logging:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors du logging:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 