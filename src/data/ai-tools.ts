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
  Zap
} from 'lucide-react';

// Types pour les outils IA
export type AiToolType = 
  | 'ICP_MAKER'
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
    color: 'from-purple-500 to-indigo-600',
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
    id: 'offer-generator',
    name: 'Générateur d\'Offres',
    description: 'Générez des offres irrésistibles avec l\'IA',
    icon: 'Sparkles',
    type: 'OFFER_GENERATOR',
    category: 'Activation',
    href: '/outils/generateur-offre',
    color: 'from-orange-500 to-red-600',
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
    id: 'title-generator',
    name: 'Générateur de Titres',
    description: 'Créez des titres accrocheurs pour vos contenus',
    icon: 'Type',
    type: 'TITLE_GENERATOR',
    category: 'Contenu',
    href: '/outils/titres',
    color: 'from-teal-500 to-cyan-600',
    isPremium: false,
    step: 5,
    stepTitle: 'TRAFIC',
    stepDescription: 'Optimiser vos contenus',
    endpoint: '/api/ai/titles/generate',
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 800,
    systemPrompt: 'Tu es un expert en copywriting et création de titres accrocheurs. Génère des titres optimisés pour maximiser le taux de clic et l\'engagement.'
  },
  {
    id: 'description-generator',
    name: 'Générateur de Descriptions',
    description: 'Rédigez des descriptions qui convertissent',
    icon: 'FileText',
    type: 'DESCRIPTION_GENERATOR',
    category: 'Contenu',
    href: '/outils/descriptions',
    color: 'from-emerald-500 to-teal-600',
    isPremium: false,
    step: 5,
    stepTitle: 'TRAFIC',
    stepDescription: 'Perfectionner vos textes',
    endpoint: '/api/ai/descriptions/generate',
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 1000,
    systemPrompt: 'Tu es un expert en copywriting produit et conversion. Crée des descriptions qui transforment les visiteurs en acheteurs.'
  },
  {
    id: 'content-system',
    name: 'Content System 90J',
    description: 'Planifiez 90 jours de contenu en 10 minutes',
    icon: 'Calendar',
    type: 'CONTENT_SYSTEM',
    category: 'Trafic',
    href: '/outils/content-system',
    color: 'from-indigo-500 to-blue-600',
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
    color: 'from-pink-500 to-rose-600',
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
    icon: 'Users',
    type: 'LEAD_MAGNET',
    category: 'Activation',
    href: '/outils/lead-magnet',
    color: 'from-cyan-500 to-blue-600',
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
    id: 'veille-strategique',
    name: 'Veille Stratégique',
    description: 'Analysez votre marché et trouvez des opportunités',
    icon: 'Brain',
    type: 'VEILLE_STRATEGIQUE',
    category: 'Acquisition',
    href: '/outils/veille',
    color: 'from-violet-500 to-purple-600',
    isPremium: true,
    step: 1,
    stepTitle: 'ACQUISITION',
    stepDescription: 'Analyser le marché',
    endpoint: '/api/ai/veille/generate',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Tu es un expert en veille stratégique, IA et business digital. Détecte des opportunités business innovantes et à fort potentiel.'
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
  PenTool
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