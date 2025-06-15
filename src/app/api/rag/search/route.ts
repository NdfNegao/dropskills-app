import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge, generateRAGResponse } from '@/lib/rag';

// POST - Recherche dans la base de connaissances
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, mode = 'full', limit = 5, threshold = 0.6 } = body;
    
    // Validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query requis' },
        { status: 400 }
      );
    }
    
    if (query.length < 3) {
      return NextResponse.json(
        { success: false, error: 'La requête doit faire au moins 3 caractères' },
        { status: 400 }
      );
    }
    
    // Mode 'search' : retourne seulement les chunks pertinents
    if (mode === 'search') {
      const results = await searchKnowledge(query, limit, threshold);
      
      return NextResponse.json({
        success: true,
        data: {
          results,
          count: results.length,
          query
        }
      });
    }
    
    // Mode 'full' : génère une réponse RAG complète
    const ragResponse = await generateRAGResponse(query);
    
    return NextResponse.json({
      success: true,
      data: {
        answer: ragResponse.answer,
        sources: ragResponse.sources,
        confidence: ragResponse.confidence,
        query,
        hasKnowledge: ragResponse.sources.length > 0
      }
    });
    
  } catch (error) {
    console.error('Erreur RAG search:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}