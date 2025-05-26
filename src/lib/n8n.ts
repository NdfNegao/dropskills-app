// Configuration n8n
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://cyriliriebi.app.n8n.cloud';
const N8N_API_KEY = process.env.N8N_API_KEY;

export interface N8nToolRequest {
  toolType: 'pack-createur' | 'rebranding-pdf' | 'descriptions-ia' | 'idees-produits' | 'generateur-titres' | 'calculateur-revenus';
  input: Record<string, any>;
  userId?: string;
}

export interface N8nToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
}

// Mapping des outils vers leurs webhooks n8n
const TOOL_WEBHOOKS = {
  'pack-createur': '/webhook/pack-createur-ia',
  'rebranding-pdf': '/webhook/rebranding-pdf',
  'descriptions-ia': '/webhook/descriptions-ia',
  'idees-produits': '/webhook/idees-produits',
  'generateur-titres': '/webhook/generateur-titres',
  'calculateur-revenus': '/webhook/calculateur-revenus'
};

/**
 * Appelle un outil IA via n8n
 */
export async function callN8nTool(request: N8nToolRequest): Promise<N8nToolResponse> {
  try {
    const webhookUrl = TOOL_WEBHOOKS[request.toolType];
    if (!webhookUrl) {
      throw new Error(`Outil non supporté: ${request.toolType}`);
    }

    const response = await fetch(`${N8N_BASE_URL}${webhookUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY && { 'Authorization': `Bearer ${N8N_API_KEY}` })
      },
      body: JSON.stringify({
        ...request.input,
        userId: request.userId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur n8n: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data,
      executionId: data.executionId
    };

  } catch (error) {
    console.error('Erreur appel n8n:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Vérifie le statut d'une exécution n8n
 */
export async function checkN8nExecution(executionId: string): Promise<N8nToolResponse> {
  try {
    const response = await fetch(`${N8N_BASE_URL}/api/v1/executions/${executionId}`, {
      headers: {
        ...(N8N_API_KEY && { 'Authorization': `Bearer ${N8N_API_KEY}` })
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur statut n8n: ${response.status}`);
    }

    const execution = await response.json();
    
    return {
      success: execution.finished && !execution.stoppedAt,
      data: execution.data,
      executionId
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur vérification'
    };
  }
}

// Types pour chaque outil
export interface PackCreateurInput {
  niche: string;
  audience: string;
  format: 'ebook' | 'video' | 'audio' | 'template';
  niveau: 'debutant' | 'intermediaire' | 'avance';
}

export interface RebrandingPdfInput {
  pdfUrl: string;
  nouveauNom: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  logo?: string;
}

export interface DescriptionsIaInput {
  produit: string;
  caracteristiques: string[];
  audience: string;
  tonalite: 'professionnel' | 'decontracte' | 'persuasif';
}

export interface IdeesProduitsInput {
  niche: string;
  budget: number;
  competences: string[];
  objectif: string;
}

export interface GenerateurTitresInput {
  sujet: string;
  type: 'article' | 'video' | 'ebook' | 'formation';
  emotion: 'curiosite' | 'urgence' | 'benefice' | 'probleme';
  nombreTitres: number;
}

export interface CalculateurRevenusInput {
  produits: Array<{
    nom: string;
    prix: number;
    ventesEstimees: number;
  }>;
  couts: Array<{
    nom: string;
    montant: number;
    type: 'fixe' | 'variable';
  }>;
  periode: 'mensuel' | 'annuel';
} 