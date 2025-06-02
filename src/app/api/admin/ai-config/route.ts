import { NextRequest, NextResponse } from 'next/server';
import { AI_PROVIDERS, TOOL_PROVIDER_MAPPING } from '@/lib/ai-providers';
import fs from 'fs';
import path from 'path';

// GET: Récupérer la configuration actuelle
export async function GET() {
  try {
    return NextResponse.json({
      providers: Object.entries(AI_PROVIDERS).map(([key, provider]) => ({
        key,
        name: provider.name,
        available: provider.isAvailable(),
        model: provider.model,
        pricing: provider.pricing,
        capabilities: provider.capabilities
      })),
      mapping: TOOL_PROVIDER_MAPPING,
      envStatus: {
        DEEPSEEK_API_KEY: !!process.env.DEEPSEEK_API_KEY,
        XAI_API_KEY: !!process.env.XAI_API_KEY,
        ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
        GOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY,
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY
      }
    });
  } catch (error) {
    console.error('Erreur récupération config IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}

// POST: Mettre à jour le mapping des outils
export async function POST(req: NextRequest) {
  try {
    const { toolId, providerId } = await req.json();
    
    // Validation
    if (!toolId || !providerId) {
      return NextResponse.json(
        { error: 'toolId et providerId sont requis' },
        { status: 400 }
      );
    }
    
    if (!AI_PROVIDERS[providerId]) {
      return NextResponse.json(
        { error: 'Provider inconnu' },
        { status: 400 }
      );
    }
    
    // Mise à jour du mapping en mémoire
    TOOL_PROVIDER_MAPPING[toolId] = providerId;
    
    // Optionnel: Sauvegarder dans un fichier de configuration
    // (pour persister les changements entre les redémarrages)
    try {
      const configPath = path.join(process.cwd(), 'config', 'ai-mapping.json');
      const configDir = path.dirname(configPath);
      
      // Créer le dossier config s'il n'existe pas
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(configPath, JSON.stringify(TOOL_PROVIDER_MAPPING, null, 2));
    } catch (fileError) {
      console.warn('Impossible de sauvegarder la configuration:', fileError);
      // Continue sans erreur car le mapping en mémoire fonctionne
    }
    
    return NextResponse.json({
      success: true,
      message: `Outil ${toolId} assigné au provider ${AI_PROVIDERS[providerId].name}`,
      newMapping: TOOL_PROVIDER_MAPPING
    });
    
  } catch (error) {
    console.error('Erreur mise à jour config IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la configuration' },
      { status: 500 }
    );
  }
}

// PUT: Réinitialiser la configuration par défaut
export async function PUT() {
  try {
    // Configuration par défaut optimisée
    const defaultMapping = {
      'titles': 'deepseek',
      'descriptions': 'deepseek', 
      'emails': 'deepseek',
      'veille': 'deepseek',
      'content': 'openai', // Garde OpenAI pour le contenu long
      'usp': 'deepseek',
      'icp': 'deepseek'
    };
    
    // Mise à jour du mapping
    Object.assign(TOOL_PROVIDER_MAPPING, defaultMapping);
    
    // Sauvegarder
    try {
      const configPath = path.join(process.cwd(), 'config', 'ai-mapping.json');
      const configDir = path.dirname(configPath);
      
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(configPath, JSON.stringify(defaultMapping, null, 2));
    } catch (fileError) {
      console.warn('Impossible de sauvegarder la configuration par défaut:', fileError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Configuration réinitialisée aux valeurs optimisées',
      mapping: defaultMapping
    });
    
  } catch (error) {
    console.error('Erreur réinitialisation config IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    );
  }
}