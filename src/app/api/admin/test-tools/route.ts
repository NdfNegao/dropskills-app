import { NextRequest, NextResponse } from 'next/server';
import { processAiTool } from '@/lib/ai-tools';

export async function POST(req: NextRequest) {
  try {
    const { 
      toolType = "generateur-offre",
      input = {
        sujet: "Intelligence Artificielle pour PME",
        type: "formation", 
        emotion: "curiosite",
        nombreTitres: 5
      }
    } = await req.json();

    console.log(`🧪 Test outil : ${toolType}`);

    // Tester notre nouveau système sans n8n
    const result = await processAiTool({
      toolType,
      input,
      userId: 'test-user'
    });

    return NextResponse.json({
      success: result.success,
      toolType,
      input,
      data: result.data,
      metadata: result.metadata,
      error: result.error,
      status: result.success ? '✅ NOUVEAU SYSTÈME FONCTIONNE' : '❌ ERREUR DÉTECTÉE'
    });

  } catch (error) {
    console.error('Erreur test outils:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du test',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        status: '❌ SYSTÈME EN ERREUR'
      },
      { status: 500 }
    );
  }
}