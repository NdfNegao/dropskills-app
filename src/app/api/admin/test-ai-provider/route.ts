import { NextRequest, NextResponse } from 'next/server';
import { AI_PROVIDERS } from '@/lib/ai-providers';

export async function POST(req: NextRequest) {
  try {
    const { provider, prompt } = await req.json();
    
    if (!AI_PROVIDERS[provider]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider inconnu' 
      }, { status: 400 });
    }
    
    const aiProvider = AI_PROVIDERS[provider];
    
    if (!aiProvider.isAvailable()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider non configuré (clé API manquante)' 
      }, { status: 400 });
    }
    
    const startTime = Date.now();
    const text = await aiProvider.generateText(prompt);
    const endTime = Date.now();
    
    return NextResponse.json({
      success: true,
      text,
      responseTime: `${endTime - startTime}ms`,
      provider: aiProvider.name,
      model: aiProvider.model
    });
    
  } catch (error) {
    console.error('Provider test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur de test inconnue' 
    }, { status: 500 });
  }
} 