import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';

interface AnalyzeIdeaRequest {
  title: string;
  description: string;
  potentialRevenue?: string;
}

interface IdeaAnalysis {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    differentiator: string;
    alerts: string[];
  };
  actionPlan: {
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
      aiTools: string[];
    };
    step3: {
      title: string;
      description: string;
    };
  };
  keyMetrics: {
    revenueEstimate: {
      min: string;
      max: string;
    };
    weeklyHours: string;
    majorAlert: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body: AnalyzeIdeaRequest = await request.json();
    
    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: 'Le titre et la description sont requis' },
        { status: 400 }
      );
    }

    // Prompt optimisé pour l'analyse d'idées
    const systemPrompt = `Tu es expert en business en ligne, IA, copywriting, et growth.

Quand un utilisateur soumet une idée business, analyse-la en profondeur. Évalue rapidement :
- Le marché cible
- La faisabilité dans les 6 prochains mois
- L'utilisation de l'IA pour accélérer la réussite
- Le potentiel de gains réaliste en 6 mois (donne un ordre de grandeur concret en euros)

Contraintes :
- Sois direct, humain, motivant ("voix Dropskills")
- No bullshit : si le projet n'a pas de potentiel, explique-le franchement
- Utilise des exemples d'outils IA concrets (ChatGPT, Notion AI, Zapier, etc.)

Réponds UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "analysis": {
    "strengths": ["Force 1", "Force 2", "Force 3"],
    "weaknesses": ["Faiblesse 1", "Faiblesse 2"],
    "differentiator": "Point différenciant principal",
    "alerts": ["Alerte 1", "Alerte 2"]
  },
  "actionPlan": {
    "step1": {
      "title": "Validation & Premiers clients",
      "description": "Actions concrètes pour la première semaine"
    },
    "step2": {
      "title": "Automatisation IA",
      "description": "Comment utiliser l'IA pour scaler",
      "aiTools": ["ChatGPT", "Notion AI", "Zapier"]
    },
    "step3": {
      "title": "Scale & Revenus",
      "description": "Débloquer les revenus et passer à l'étape supérieure"
    }
  },
  "keyMetrics": {
    "revenueEstimate": {
      "min": "1000€",
      "max": "5000€"
    },
    "weeklyHours": "10-15h",
    "majorAlert": "Point de vigilance majeur"
  },
  "cta": "Message motivant pour passer à l'action"
}`;

    const userPrompt = `Analyse cette idée business :

**TITRE :** ${body.title}
**DESCRIPTION :** ${body.description}
${body.potentialRevenue ? `**POTENTIEL FINANCIER VISÉ :** ${body.potentialRevenue}` : ''}

Fournis une analyse complète selon le format demandé.`;

    try {
      const completion = await openai().chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Aucune réponse reçue de OpenAI');
      }

      const analysis = JSON.parse(response);

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de l\'analyse:', error);
      throw new Error(`Erreur lors de l'analyse avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de l\'analyse d\'idée:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'analyse de l\'idée',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 