import { NextRequest, NextResponse } from 'next/server';
import { AIProviderManager } from '@/lib/ai-providers';

export async function POST(req: NextRequest) {
  try {
    const { 
      sujet = "Formation en ligne pour entrepreneurs", 
      type = "formation",
      emotion = "curiosite",
      nombreTitres = 5 
    } = await req.json();

    // Utiliser le provider optimal pour "titles" (maintenant Grok 3)
    const provider = await AIProviderManager.getOptimalProvider('titles');
    
    console.log(`🎨 Test Générateur Titres avec ${provider.name}`);

    // Prompt optimisé pour la créativité
    const prompt = `Tu es un expert en copywriting créatif et accrocheur. 

MISSION : Génère ${nombreTitres} titres ${type === 'formation' ? 'de formation' : type === 'article' ? "d'article" : type === 'video' ? 'de vidéo' : "d'ebook"} ultra-créatifs et engageants.

SUJET : ${sujet}

ÉMOTION CIBLE : ${emotion === 'curiosite' ? 'Curiosité - éveiller la soif de savoir' : 
                   emotion === 'urgence' ? 'Urgence - créer un sentiment de nécessité immédiate' :
                   emotion === 'benefice' ? 'Bénéfice - mettre en avant les gains concrets' :
                   'Problème - souligner la douleur à résoudre'}

EXIGENCES :
- Titres percutants et mémorables
- Utilise des techniques de copywriting avancées
- Intègre des power words et des émotions fortes
- Évite les clichés, sois original et audacieux
- Chaque titre doit donner envie de cliquer immédiatement

FORMAT : Retourne uniquement la liste numérotée des titres, sans explication.

EXEMPLES de styles recherchés :
- "Le Secret que 97% des Entrepreneurs Ignorent"
- "Pourquoi Tout Ce Qu'on Vous Dit Sur [X] Est Faux"
- "La Méthode Interdite qui Change Tout"

Génère maintenant ${nombreTitres} titres créatifs pour "${sujet}" :`;

    // Générer avec le provider optimal
    const startTime = Date.now();
    const response = await provider.generateText(prompt, {
      temperature: 0.9, // Maximum de créativité
      maxTokens: 1000
    });
    const endTime = Date.now();

    // Extraire les titres de la réponse
    const titres = response
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(titre => titre.length > 0);

    return NextResponse.json({
      success: true,
      provider: {
        name: provider.name,
        model: provider.model,
        capabilities: provider.capabilities
      },
      input: { sujet, type, emotion, nombreTitres },
      titres,
      performance: {
        responseTime: endTime - startTime,
        temperature: 0.9,
        creativity_mode: 'maximum',
        provider_specialization: 'creativity & copywriting'
      },
      cost_estimate: provider.getCost(prompt.length / 4, response.length / 4).toFixed(6),
      raw_response: response
    });

  } catch (error) {
    console.error('Erreur test créatif:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du test créatif',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 