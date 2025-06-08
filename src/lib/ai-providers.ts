// AI Providers System - Version Optimisée 2024
export interface AIProvider {
  name: string;
  apiKey: string;
  baseURL?: string;
  model: string;
  pricing: {
    input: number;    // USD per 1M tokens
    output: number;   // USD per 1M tokens
  };
  capabilities: string[];
  temperature: number;
  maxTokens: number;
  isAvailable: () => boolean;
  generateText: (prompt: string, options?: any) => Promise<string>;
  getCost: (inputTokens: number, outputTokens: number) => number;
}

// Configuration des providers recommandés
export const AI_PROVIDERS: Record<string, AIProvider> = {
  'deepseek-v3': {
    name: 'DeepSeek V3',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-v3',
    pricing: {
      input: 0.14,   // $0.14 per 1M tokens
      output: 0.28   // $0.28 per 1M tokens
    },
    capabilities: ['structured-analysis', 'cost-effective', 'multilingual'],
    temperature: 0.7,
    maxTokens: 8000,
    isAvailable: () => !!process.env.DEEPSEEK_API_KEY,
    generateText: async (prompt: string, options = {}) => {
      // Implémentation DeepSeek API
      const response = await fetch(`${AI_PROVIDERS['deepseek-v3'].baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-v3',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 8000
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    },
    getCost: (inputTokens: number, outputTokens: number) => {
      return (inputTokens * 0.14 / 1000000) + (outputTokens * 0.28 / 1000000);
    }
  },

  'grok-3': {
    name: 'Grok 3',
    apiKey: process.env.GROK_API_KEY || '',
    baseURL: 'https://api.x.ai/v1',
    model: 'grok-3',
    pricing: {
      input: 0.50,   // Estimation basée sur la compétitivité annoncée
      output: 1.50
    },
    capabilities: ['creativity', 'copywriting', 'engagement'],
    temperature: 0.8,
    maxTokens: 4000,
    isAvailable: () => !!process.env.GROK_API_KEY,
    generateText: async (prompt: string, options = {}) => {
      // Implémentation Grok API (quand disponible)
      const response = await fetch(`${AI_PROVIDERS['grok-3'].baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'grok-3',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.8,
          max_tokens: options.maxTokens || 4000
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    },
    getCost: (inputTokens: number, outputTokens: number) => {
      return (inputTokens * 0.50 / 1000000) + (outputTokens * 1.50 / 1000000);
    }
  },

  'claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022',
    pricing: {
      input: 3.00,
      output: 15.00
    },
    capabilities: ['strategic-planning', 'complex-reasoning', 'premium-quality'],
    temperature: 0.7,
    maxTokens: 4000,
    isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
    generateText: async (prompt: string, options = {}) => {
      const response = await fetch(`${AI_PROVIDERS['claude-3.5-sonnet'].baseURL}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: options.maxTokens || 4000,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7
        })
      });
      const data = await response.json();
      return data.content[0].text;
    },
    getCost: (inputTokens: number, outputTokens: number) => {
      return (inputTokens * 3.00 / 1000000) + (outputTokens * 15.00 / 1000000);
    }
  },

  'gemini-2.0-flash': {
    name: 'Gemini 2.0 Flash',
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
    pricing: {
      input: 0.10,
      output: 0.40
    },
    capabilities: ['fast-generation', 'cost-effective', 'multimodal'],
    temperature: 0.8,
    maxTokens: 4000,
    isAvailable: () => !!process.env.GOOGLE_AI_API_KEY,
    generateText: async (prompt: string, options = {}) => {
      const response = await fetch(
        `${AI_PROVIDERS['gemini-2.0-flash'].baseURL}/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options.temperature || 0.8,
              maxOutputTokens: options.maxTokens || 4000
            }
          })
        }
      );
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    },
    getCost: (inputTokens: number, outputTokens: number) => {
      return (inputTokens * 0.10 / 1000000) + (outputTokens * 0.40 / 1000000);
    }
  }
};

// Configuration par défaut du mapping des outils vers les providers
const DEFAULT_TOOL_PROVIDER_MAPPING: Record<string, string> = {
  'titles': 'deepseek-v3',
  'descriptions': 'deepseek-v3',
  'emails': 'deepseek-v3',
  'veille': 'deepseek-v3',
  'content': 'openai', // Garde OpenAI pour le contenu long
  'usp': 'deepseek-v3',
  'icp': 'deepseek-v3'
};

// Fonction pour charger la configuration depuis le fichier ou utiliser les valeurs par défaut
function loadToolProviderMapping(): Record<string, string> {
  try {
    if (typeof window === 'undefined') {
      // Côté serveur - essayer de charger depuis le fichier
      const fs = require('fs');
      const path = require('path');
      const configPath = path.join(process.cwd(), 'config', 'ai-mapping.json');
      
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        const mapping = JSON.parse(configData);
        return { ...DEFAULT_TOOL_PROVIDER_MAPPING, ...mapping };
      }
    }
  } catch (error) {
    console.warn('Impossible de charger la configuration AI, utilisation des valeurs par défaut:', error);
  }
  
  return DEFAULT_TOOL_PROVIDER_MAPPING;
}

// Mapping optimisé des outils vers les providers (chargé dynamiquement)
export const TOOL_PROVIDER_MAPPING: Record<string, string> = loadToolProviderMapping();

// Manager pour auto-sélection et fallback
export class AIProviderManager {
  static async getOptimalProvider(toolType: string): Promise<AIProvider> {
    const preferredProvider = TOOL_PROVIDER_MAPPING[toolType];
    
    if (preferredProvider && AI_PROVIDERS[preferredProvider].isAvailable()) {
      return AI_PROVIDERS[preferredProvider];
    }
    
    // Fallback vers DeepSeek (toujours économique)
    if (AI_PROVIDERS['deepseek-v3'].isAvailable()) {
      return AI_PROVIDERS['deepseek-v3'];
    }
    
    // Fallback final vers Claude si budget permet
    if (AI_PROVIDERS['claude-3.5-sonnet'].isAvailable()) {
      return AI_PROVIDERS['claude-3.5-sonnet'];
    }
    
    throw new Error('Aucun provider IA disponible');
  }
  
  static estimateCost(toolType: string, inputTokens: number, outputTokens: number): number {
    const provider = AI_PROVIDERS[TOOL_PROVIDER_MAPPING[toolType]];
    return provider.getCost(inputTokens, outputTokens);
  }
}

export default AIProviderManager;