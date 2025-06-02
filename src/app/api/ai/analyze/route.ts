import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Interface pour les données à analyser
interface OpportunityData {
  title: string;
  description?: string;
  url?: string;
  source: string;
  rawData?: any;
  sector?: string;
  keywords?: string[];
}

// Interface pour les résultats d'analyse
interface AnalysisResult {
  relevanceScore: number;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  insights: {
    marketOpportunity: string;
    competitiveAdvantage: string;
    actionItems: string[];
    risks: string[];
    estimatedValue: string;
  };
  creativeContent: {
    headline: string;
    pitch: string;
    socialPosts: string[];
    emailTemplate: string;
  };
  tags: string[];
  sector: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { opportunityData, analysisType = 'full' }: { 
      opportunityData: OpportunityData; 
      analysisType?: 'quick' | 'full' | 'creative' 
    } = await request.json();

    // Validation des données
    if (!opportunityData || !opportunityData.title) {
      return NextResponse.json({ 
        error: 'Données d\'opportunité manquantes' 
      }, { status: 400 });
    }

    // Vérifier les limites utilisateur
    const { data: usageCheck } = await supabase.rpc('check_user_usage_limit', {
      p_user_id: user.id,
      p_usage_type: 'ai_analysis',
      p_quantity: 1
    });

    if (!usageCheck) {
      return NextResponse.json({ 
        error: 'Limite d\'analyses IA atteinte pour ce mois' 
      }, { status: 429 });
    }

    let analysisResult: AnalysisResult;

    // Choisir la stratégie d'analyse selon le type
    switch (analysisType) {
      case 'quick':
        analysisResult = await performQuickAnalysis(opportunityData);
        break;
      case 'creative':
        analysisResult = await performCreativeAnalysis(opportunityData);
        break;
      default:
        analysisResult = await performFullAnalysis(opportunityData);
    }

    // Enregistrer l'usage
    await supabase.from('usage_tracking').insert({
      user_id: user.id,
      usage_type: 'ai_analysis',
      action: `analysis_${analysisType}`,
      quantity: 1,
      cost_credits: getAnalysisCost(analysisType),
      metadata: {
        analysis_type: analysisType,
        source: opportunityData.source,
        relevance_score: analysisResult.relevanceScore
      }
    });

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      metadata: {
        analysisType,
        timestamp: new Date().toISOString(),
        cost: getAnalysisCost(analysisType)
      }
    });

  } catch (error) {
    console.error('Erreur analyse IA:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'analyse IA' 
    }, { status: 500 });
  }
}

// Analyse rapide avec DeepSeek (économique)
async function performQuickAnalysis(data: OpportunityData): Promise<AnalysisResult> {
  const prompt = `
Analyse rapide cette opportunité business :

Titre: ${data.title}
Description: ${data.description || 'Non fournie'}
Source: ${data.source}
Secteur: ${data.sector || 'Non défini'}

Fournis une analyse JSON avec :
1. Score de pertinence (0-100)
2. Niveau de priorité (low/medium/high/critical)  
3. 3 insights clés
4. 2 actions immédiates
5. Secteur principal
6. 3 tags pertinents

Format JSON strict:
{
  "relevanceScore": number,
  "priorityLevel": "low|medium|high|critical",
  "insights": {
    "marketOpportunity": "string",
    "competitiveAdvantage": "string", 
    "actionItems": ["action1", "action2"],
    "risks": ["risk1"],
    "estimatedValue": "string"
  },
  "tags": ["tag1", "tag2", "tag3"],
  "sector": "string"
}`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    const result = await response.json();
    const analysisData = JSON.parse(result.choices[0].message.content);

    return {
      ...analysisData,
      creativeContent: {
        headline: `Opportunité ${analysisData.priorityLevel}: ${data.title}`,
        pitch: `Analyse en cours de ${data.title}`,
        socialPosts: [`🔍 Nouvelle opportunité détectée: ${data.title}`],
        emailTemplate: `Opportunité business identifiée: ${data.title}`
      }
    };

  } catch (error) {
    console.error('Erreur DeepSeek:', error);
    return getDefaultAnalysis(data);
  }
}

// Analyse créative avec Grok (premium)
async function performCreativeAnalysis(data: OpportunityData): Promise<AnalysisResult> {
  const prompt = `
Tu es un expert en copywriting et création de contenu. Analyse cette opportunité business et crée du contenu percutant :

Opportunité: ${data.title}
Description: ${data.description || ''}
Source: ${data.source}

Créé du contenu créatif et engageant :
1. Headline accrocheur
2. Pitch de vente percutant  
3. 3 posts sociaux viraux
4. Email template personnalisé
5. Score de pertinence et priorité

Format JSON:
{
  "relevanceScore": number,
  "priorityLevel": "low|medium|high|critical",
  "insights": {
    "marketOpportunity": "analyse créative du marché",
    "competitiveAdvantage": "avantages uniques identifiés",
    "actionItems": ["action créative 1", "action créative 2"],
    "risks": ["risque principal"],
    "estimatedValue": "estimation créative"
  },
  "creativeContent": {
    "headline": "titre ultra-accrocheur",
    "pitch": "pitch de vente irrésistible",
    "socialPosts": ["post viral 1", "post viral 2", "post viral 3"],
    "emailTemplate": "email personnalisé et engageant"
  },
  "tags": ["tag1", "tag2", "tag3"],
  "sector": "secteur identifié"
}`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);

  } catch (error) {
    console.error('Erreur Grok:', error);
    return getDefaultAnalysis(data);
  }
}

// Analyse complète avec DeepSeek + Grok
async function performFullAnalysis(data: OpportunityData): Promise<AnalysisResult> {
  // D'abord analyse stratégique avec DeepSeek
  const strategicAnalysis = await performQuickAnalysis(data);
  
  // Puis contenu créatif avec Grok
  const creativeAnalysis = await performCreativeAnalysis(data);
  
  // Combiner les résultats
  return {
    relevanceScore: Math.max(strategicAnalysis.relevanceScore, creativeAnalysis.relevanceScore),
    priorityLevel: strategicAnalysis.priorityLevel,
    insights: strategicAnalysis.insights,
    creativeContent: creativeAnalysis.creativeContent,
    tags: [...strategicAnalysis.tags, ...creativeAnalysis.tags].slice(0, 5),
    sector: strategicAnalysis.sector || creativeAnalysis.sector
  };
}

// Coût selon le type d'analyse
function getAnalysisCost(type: string): number {
  switch (type) {
    case 'quick': return 0.01; // DeepSeek seulement
    case 'creative': return 0.05; // Grok seulement  
    case 'full': return 0.06; // DeepSeek + Grok
    default: return 0.01;
  }
}

// Analyse par défaut en cas d'erreur
function getDefaultAnalysis(data: OpportunityData): AnalysisResult {
  return {
    relevanceScore: 50,
    priorityLevel: 'medium',
    insights: {
      marketOpportunity: `Opportunité détectée dans ${data.source}`,
      competitiveAdvantage: 'Analyse en cours',
      actionItems: ['Examiner en détail', 'Évaluer la faisabilité'],
      risks: ['Informations limitées'],
      estimatedValue: 'À évaluer'
    },
    creativeContent: {
      headline: `Nouvelle opportunité: ${data.title}`,
      pitch: `Opportunité identifiée via ${data.source}`,
      socialPosts: [`🔍 Opportunité détectée: ${data.title}`],
      emailTemplate: `Une nouvelle opportunité a été identifiée: ${data.title}`
    },
    tags: ['opportunité', 'nouveau', data.source],
    sector: data.sector || 'Non défini'
  };
} 