import { AIProviderManager } from './ai-providers';

// Types pour les outils IA
export interface AiToolRequest {
  toolType: string;
  input: Record<string, any>;
  userId?: string;
}

export interface AiToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    provider: string;
    model: string;
    cost: string;
    responseTime: number;
  };
}

// Templates de prompts pour chaque outil
const TOOL_PROMPTS = {
  titleGenerator: (input: any) => `
MISSION : Génère ${input.nombreTitres} titres ${input.type === 'formation' ? 'de formation' : input.type === 'article' ? "d'article" : input.type === 'video' ? 'de vidéo' : "d'ebook"} ultra-créatifs et engageants.

SUJET : ${input.sujet}

ÉMOTION CIBLE : ${input.emotion === 'curiosite' ? 'Curiosité - éveiller la soif de savoir' : 
                 input.emotion === 'urgence' ? 'Urgence - créer un sentiment de nécessité immédiate' :
                 input.emotion === 'benefice' ? 'Bénéfice - mettre en avant les gains concrets' :
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

Génère maintenant ${input.nombreTitres} titres créatifs pour "${input.sujet}" :`,

  'pack-createur': (input: any) => `Tu es un expert en création de produits numériques et en stratégie marketing.

MISSION : Crée un plan complet de pack numérique pour la niche "${input.niche}" destiné à une audience "${input.audience}".

FORMAT SOUHAITÉ : ${input.format}
NIVEAU : ${input.niveau}

STRUCTURE À RETOURNER :
1. TITRE DU PACK (accrocheur et vendeur)
2. DESCRIPTION MARKETING (2-3 phrases persuasives)
3. CONTENU DÉTAILLÉ :
   - Module 1 : [Titre + 3-4 points clés]
   - Module 2 : [Titre + 3-4 points clés]
   - Module 3 : [Titre + 3-4 points clés]
   - Bonus : [2-3 bonus exclusifs]
4. PROPOSITION DE VALEUR UNIQUE
5. PRIX RECOMMANDÉ
6. STRATÉGIE DE LANCEMENT (3 étapes)

Sois créatif, pratique et orienté résultats pour maximiser l'impact commercial.`,

  productDescription: (input: any) => `
MISSION : Crée une description ${input.tonalite} pour le produit "${input.produit}".

AUDIENCE CIBLE : ${input.audience}

CARACTÉRISTIQUES PRINCIPALES :
${input.caracteristiques.map((c: string, i: number) => `- ${c}`).join('\n')}

STRUCTURE À RESPECTER :
1. ACCROCHE (1 phrase qui capte l'attention)
2. PROBLÈME (2-3 phrases sur la douleur du client)
3. SOLUTION (3-4 phrases sur les bénéfices)
4. PREUVES SOCIALES (1-2 phrases crédibilisant)
5. APPEL À L'ACTION (1 phrase incitative)

TONALITÉ : ${input.tonalite === 'professionnel' ? 'Formelle et experte' : 
             input.tonalite === 'decontracte' ? 'Amicale et accessible' : 
             'Persuasive et urgente'}

Maximum 250 mots, optimisé pour la conversion.`
};

/**
 * Traite une demande d'outil IA
 */
export async function processAiTool(request: AiToolRequest): Promise<AiToolResponse> {
  try {
    const startTime = Date.now();
    
    // Obtenir le prompt template
    const promptTemplate = TOOL_PROMPTS[request.toolType as keyof typeof TOOL_PROMPTS];
    if (!promptTemplate) {
      throw new Error(`Outil non supporté: ${request.toolType}`);
    }

    // Générer le prompt avec les inputs
    const prompt = promptTemplate(request.input);

    // Mapper le toolType vers le provider optimal
    const toolMapping: Record<string, string> = {
  
      'pack-createur': 'content',
  
    };

    const providerType = toolMapping[request.toolType] || 'content';
    
    // Obtenir le provider optimal
    const provider = await AIProviderManager.getOptimalProvider(providerType);
    
    console.log(`🤖 Processing ${request.toolType} with ${provider.name}`);

    // Générer la réponse
    const response = await provider.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 2000
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Parser la réponse selon le type d'outil
    let parsedData;

    if (request.toolType === 'titleGenerator') {
      // Extraire les titres numérotés
      const titres = response
        .split('\n')
        .filter(line => line.trim() && /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(titre => titre.length > 0);
      
      parsedData = { titres };
    } else {
      // Pour les autres outils, retourner le texte brut structuré
      parsedData = { content: response };
    }

    return {
      success: true,
      data: parsedData,
      metadata: {
        provider: provider.name,
        model: provider.model,
        cost: provider.getCost(prompt.length / 4, response.length / 4).toFixed(6),
        responseTime
      }
    };

  } catch (error) {
    console.error('Erreur traitement outil IA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Types d'entrée pour chaque outil (copiés de n8n.ts)
export interface GenerateurTitresInput {
  sujet: string;
  type: 'article' | 'video' | 'ebook' | 'formation';
  emotion: 'curiosite' | 'urgence' | 'benefice' | 'probleme';
  nombreTitres: number;
}

export interface PackCreateurInput {
  niche: string;
  audience: string;
  format: 'ebook' | 'video' | 'audio' | 'template';
  niveau: 'debutant' | 'intermediaire' | 'avance';
}


  produit: string;
  caracteristiques: string[];
  audience: string;
  tonalite: 'professionnel' | 'decontracte' | 'persuasif';
}