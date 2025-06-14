import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AI_PROVIDERS, TOOL_PROVIDER_MAPPING } from '@/lib/ai-providers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// GET: Récupérer la configuration actuelle


export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
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
        GROK_API_KEY: !!process.env.GROK_API_KEY,
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
    const session = await getServerSession(authOptions);
    if (!session?.user.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

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
    // Configuration par défaut optimisée avec tous les outils
    const defaultMapping = {
      // Anciens noms pour compatibilité
      'titles': 'deepseek-v3',
      'emails': 'deepseek-v3',
      'veille': 'deepseek-v3',
      'content': 'claude-3.5-sonnet',
      'usp': 'deepseek-v3',
      'icp': 'deepseek-v3',
      // Nouveaux noms standardisés
      'icp-maker': 'deepseek-v3',
      'offer-generator': 'grok-3',
      'title-generator': 'deepseek-v3',

      'content-system': 'claude-3.5-sonnet',
      'email-sequence': 'deepseek-v3',
      'lead-magnet': 'deepseek-v3',

  
      'tunnel-maker': 'deepseek-v3',
      'usp-maker': 'deepseek-v3',
      'calculateur': 'deepseek-v3',
  
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