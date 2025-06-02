// Utilitaire de migration vers les nouveaux providers IA
import AIProviderManager from './ai-providers';

export interface MigrationPlan {
  phase: number;
  tools: string[];
  provider: string;
  priority: 'immediate' | 'next-week' | 'next-month';
  estimatedSavings: string;
}

export const MIGRATION_PHASES: MigrationPlan[] = [
  {
    phase: 1,
    tools: ['icp-maker', 'lead-magnet', 'title-generator'],
    provider: 'deepseek-v3',
    priority: 'immediate',
    estimatedSavings: '~95% de réduction des coûts IA'
  },
  {
    phase: 2,
    tools: ['description-generator'],
    provider: 'gemini-2.0-flash',
    priority: 'next-week',
    estimatedSavings: '~75% de réduction des coûts'
  },
  {
    phase: 3,
    tools: ['offer-generator', 'email-sequence'],
    provider: 'grok-3',
    priority: 'next-week',
    estimatedSavings: 'Créativité améliorée + coûts compétitifs'
  },
  {
    phase: 4,
    tools: ['content-system'],
    provider: 'claude-3.5-sonnet',
    priority: 'next-month',
    estimatedSavings: 'ROI justifié pour planification stratégique'
  }
];

export class AIMigrationManager {
  
  // Retourne le prochain outil à migrer
  static getNextMigration(): MigrationPlan | null {
    return MIGRATION_PHASES.find(phase => phase.priority === 'immediate') || 
           MIGRATION_PHASES.find(phase => phase.priority === 'next-week') ||
           null;
  }
  
  // Génère un prompt adapté au nouveau provider
  static adaptPromptForProvider(originalPrompt: string, targetProvider: string): string {
    switch (targetProvider) {
      case 'deepseek-v3':
        return `Tu es un expert en analyse business. Réponds de manière structurée et précise.\n\n${originalPrompt}`;
      
      case 'grok-3':
        return `Tu es un copywriter créatif et engageant. Utilise un ton percutant et persuasif.\n\n${originalPrompt}`;
      
      case 'gemini-2.0-flash':
        return `Réponds rapidement et efficacement. Sois concis mais complet.\n\n${originalPrompt}`;
      
      case 'claude-3.5-sonnet':
        return `Tu es un consultant stratégique senior. Fournis une analyse approfondie et des recommandations concrètes.\n\n${originalPrompt}`;
      
      default:
        return originalPrompt;
    }
  }
  
  // Estime l'économie potentielle
  static estimateSavings(toolType: string, monthlyUsage: number = 1000): {
    currentCost: number;
    newCost: number;
    savings: number;
    savingsPercentage: number;
  } {
    // Estimation basée sur GPT-3.5 actuel vs nouveaux providers
    const gpt35Cost = 0.0015; // $1.50 per 1M tokens (moyenne input/output)
    
    const newProvider = AIProviderManager.estimateCost(toolType, 500, 500); // 1000 tokens
    const currentCost = monthlyUsage * gpt35Cost;
    const newCostTotal = monthlyUsage * newProvider;
    
    return {
      currentCost,
      newCost: newCostTotal,
      savings: currentCost - newCostTotal,
      savingsPercentage: Math.round(((currentCost - newCostTotal) / currentCost) * 100)
    };
  }
  
  // Génère le plan de migration complet
  static generateMigrationPlan(): {
    totalTools: number;
    estimatedMonthlySavings: number;
    timeline: string;
    nextSteps: string[];
  } {
    const totalTools = MIGRATION_PHASES.reduce((acc, phase) => acc + phase.tools.length, 0);
    
    // Estimation conservative : 500 requêtes/mois par outil
    const estimatedSavings = MIGRATION_PHASES.reduce((acc, phase) => {
      return acc + phase.tools.reduce((toolAcc, tool) => {
        const savings = this.estimateSavings(tool, 500);
        return toolAcc + savings.savings;
      }, 0);
    }, 0);
    
    return {
      totalTools,
      estimatedMonthlySavings: Math.round(estimatedSavings * 100) / 100,
      timeline: '2-4 semaines pour migration complète',
      nextSteps: [
        '1. Configurer DEEPSEEK_API_KEY (priorité immédiate)',
        '2. Tester Phase 1 : ICP Maker + Lead Magnet + Générateur Titres',
        '3. Monitoring performances et coûts',
        '4. Migration progressive des autres outils'
      ]
    };
  }
}

export default AIMigrationManager; 