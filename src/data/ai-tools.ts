import {
  Bot, 
  Sparkles, 
  Type, 
  FileText, 
  Mail, 
  Users, 
  Calendar, 
  PenTool,
  Brain,
  Target,
  Zap,
  Calculator
} from 'lucide-react';

// Types pour les outils IA
export type AiToolType = 
  | 'ICP_MAKER'
  | 'ICP_GENERATOR'
  | 'OFFER_GENERATOR'
  | 'TITLE_GENERATOR'
  | 'CONTENT_SYSTEM'
  | 'TUNNEL_BUILDER'
  | 'EMAIL_SEQUENCE'
  | 'LEAD_MAGNET'
  | 'VEILLE_STRATEGIQUE'
  | 'DESCRIPTION_GENERATOR';

export type AiToolCategory = 'Acquisition' | 'Activation' | 'Trafic' | 'Contenu';

export interface AiTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AiToolType;
  category: AiToolCategory;
  href: string;
  color: string;
  isPremium: boolean;
  step: number;
  stepTitle: string;
  stepDescription: string;
  endpoint: string;
  model: string;
  provider?: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// Configuration des outils IA
export const AI_TOOLS: AiTool[] = [
  {
    id: 'icp-maker',
    name: 'ICP Maker',
    description: 'Créez votre profil client idéal en quelques minutes',
    icon: 'Target',
    type: 'ICP_MAKER',
    category: 'Acquisition',
    href: '/outils/icp-maker',
    color: 'purple-500',
    isPremium: true,
    step: 1,
    stepTitle: 'ACQUISITION',
    stepDescription: 'Identifier votre cible',
    endpoint: '/api/ai/icp/generate',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'Tu es un expert en stratégie marketing, persona et IA. À partir des informations fournies, dresse le portrait ultra-précis du client idéal (ICP) pour ce business.'
  },
  {
    id: 'icp-generator',
    name: 'ICP Generator',
    description: 'Générateur avancé de profil client idéal avec analyse approfondie',
    icon: 'Users',
    type: 'ICP_GENERATOR',
    category: 'Acquisition',
    href: '/outils/icp-generator',
    color: 'blue-500',
    isPremium: true,
    step: 1,
    stepTitle: 'ACQUISITION',
    stepDescription: 'Analyser en profondeur',
    endpoint: '/api/icp/generate-v2',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Tu es un expert en stratégie marketing et analyse comportementale. Génère une analyse ICP complète et détaillée avec profil sociodémographique, psychologie, motivations et stratégies d\'acquisition.'
  },
  {
    id: 'offer-generator',
    name: 'Générateur d\'Offres',
    description: 'Générez des offres irrésistibles avec l\'IA',
    icon: 'Sparkles',
    type: 'OFFER_GENERATOR',
    category: 'Activation',
    href: '/outils/generateur-offre',
    color: 'orange-500',
    isPremium: true,
    step: 2,
    stepTitle: 'ACTIVATION',
    stepDescription: 'Créer des offres percutantes',
    endpoint: '/api/ai/offer/generate',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 1500,
    systemPrompt: 'Tu es un expert en copywriting et création d\'offres commerciales. Génère des offres irrésistibles qui convertissent.'
  },


  {
    id: 'content-system',
    name: 'Content System 90J',
    description: 'Planifiez 90 jours de contenu en 10 minutes',
    icon: 'Calendar',
    type: 'CONTENT_SYSTEM',
    category: 'Trafic',
    href: '/outils/content-system',
    color: 'emerald-500',
    isPremium: true,
    step: 5,
    stepTitle: 'TRAFIC',
    stepDescription: 'Générer de l\'audience',
    endpoint: '/api/ai/content-system/generate',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Tu es un expert en stratégie de contenu et marketing digital. Crée un plan de contenu détaillé et optimisé.'
  },
  {
    id: 'email-sequence',
    name: 'CopyMoneyMail',
    description: 'Rédigez des emails qui convertissent',
    icon: 'Mail',
    type: 'EMAIL_SEQUENCE',
    category: 'Activation',
    href: '/outils/copymoneymail',
    color: 'pink-500',
    isPremium: true,
    step: 4,
    stepTitle: 'ACTIVATION',
    stepDescription: 'Engager et convertir',
    endpoint: '/api/ai/emails/generate',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 1500,
    systemPrompt: 'Tu es un expert en copywriting et email marketing automation. Génère des séquences d\'emails qui nurturent et convertissent.'
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet Creator',
    description: 'Créez des aimants à prospects irrésistibles',
    icon: 'Brain',
    type: 'LEAD_MAGNET',
    category: 'Activation',
    href: '/outils/lead-magnet',
    color: 'violet-500',
    isPremium: true,
    step: 4,
    stepTitle: 'ACTIVATION',
    stepDescription: 'Capturer des prospects',
    endpoint: '/api/ai/lead-magnet/generate',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 1500,
    systemPrompt: 'Tu es un expert en marketing d\'acquisition et conversion. Crée des lead magnets irrésistibles qui captent des prospects qualifiés.'
  },



  {
    id: 'tunnel-maker',
    name: 'Tunnel Maker',
    description: 'Créez des tunnels de vente haute conversion',
    icon: 'Zap',
    type: 'TUNNEL_BUILDER',
    category: 'Activation',
    href: '/outils/tunnel-maker',
    color: 'yellow-500',
    isPremium: true,
    step: 3,
    stepTitle: 'ACTIVATION',
    stepDescription: 'Construire des tunnels',
    endpoint: '/api/ai/tunnel/generate',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 2000,
    systemPrompt: 'Tu es un expert en tunnel de vente et conversion. Crée des tunnels optimisés pour maximiser les ventes.'
  },
  {
    id: 'usp-maker',
    name: 'USP Maker',
    description: 'Générez votre proposition de valeur unique',
    icon: 'Target',
    type: 'ICP_MAKER',
    category: 'Acquisition',
    href: '/outils/usp-maker',
    color: 'indigo-500',
    isPremium: true,
    step: 2,
    stepTitle: 'ACQUISITION',
    stepDescription: 'Définir votre USP',
    endpoint: '/api/ai/usp/generate',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 1000,
    systemPrompt: 'Tu es un expert en positionnement et USP. Crée des propositions de valeur unique et percutantes.'
  },
  {
    id: 'calculateur',
    name: 'Calculateur ROI',
    description: 'Calculez le retour sur investissement de vos actions',
    icon: 'Calculator',
    type: 'ICP_MAKER',
    category: 'Acquisition',
    href: '/outils/calculateur',
    color: 'slate-500',
    isPremium: false,
    step: 1,
    stepTitle: 'ACQUISITION',
    stepDescription: 'Calculer le ROI',
    endpoint: '/api/ai/calculator/generate',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 800,
    systemPrompt: 'Tu es un expert en analyse financière et ROI. Calcule et présente des métriques précises.'
  }
];

// Map des icônes pour utilisation dans les composants
export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Target,
  Sparkles,
  Type,
  FileText,
  Calendar,
  Mail,
  Users,
  Brain,
  Bot,
  Zap,
  PenTool,
  Calculator
};

// Fonctions utilitaires
export function getToolById(id: string): AiTool | undefined {
  return AI_TOOLS.find(tool => tool.id === id);
}

export function getToolsByCategory(category: AiToolCategory): AiTool[] {
  return AI_TOOLS.filter(tool => tool.category === category);
}

export function getToolsByStep(step: number): AiTool[] {
  return AI_TOOLS.filter(tool => tool.step === step);
}

export function getPremiumTools(): AiTool[] {
  return AI_TOOLS.filter(tool => tool.isPremium);
}

export function getFreeTools(): AiTool[] {
  return AI_TOOLS.filter(tool => !tool.isPremium);
}

// Nouvelles fonctions pour la gestion des providers
export function getToolProvider(toolId: string): string {
  // Mapping des IDs d'outils vers les clés de providers
  const providerMapping: Record<string, string> = {
    'title-generator': 'titles',
    'email-sequence': 'emails',

    'content-system': 'content',
    'usp-maker': 'usp',
    'icp-maker': 'icp',
    'icp-generator': 'icp'
  };
  
  return providerMapping[toolId] || 'openai'; // fallback
}

export function getToolConfigForProvider(toolId: string) {
  const tool = getToolById(toolId);
  if (!tool) return null;
  
  return {
    toolId,
    providerKey: getToolProvider(toolId),
    name: tool.name,
    endpoint: tool.endpoint,
    systemPrompt: tool.systemPrompt,
    temperature: tool.temperature,
    maxTokens: tool.maxTokens
  };
}