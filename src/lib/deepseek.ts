import { AIResponse } from './openai';

/**
 * Service DeepSeek V3 pour DropSkills
 * Optimisé pour des coûts 95% inférieurs à OpenAI
 */
class DeepSeekService {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1';
    this.model = 'deepseek-chat';
  }

  /**
   * Vérifie si DeepSeek est disponible
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Génère du contenu avec DeepSeek V3
   */
  async generateContent(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
      systemPrompt?: string;
    } = {}
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Add DEEPSEEK_API_KEY to your environment variables.');
    }

    const systemPrompt = options.systemPrompt || 
      'Tu es un expert en marketing digital et copywriting. Réponds toujours en français avec un ton professionnel et engageant.';

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'DropSkills/1.0'
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: Math.min(options.maxTokens || 8000, 8000), // DeepSeek V3 limit
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return {
        content: data.choices[0].message.content,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  /**
   * Calcule le coût d'utilisation DeepSeek
   * Input: $0.14 per 1M tokens
   * Output: $0.28 per 1M tokens
   */
  calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens * 0.14) / 1000000;
    const outputCost = (outputTokens * 0.28) / 1000000;
    return inputCost + outputCost;
  }

  /**
   * Compare les coûts avec OpenAI
   */
  compareCostWithOpenAI(inputTokens: number, outputTokens: number): {
    deepseekCost: number;
    openaiCost: number;
    savings: number;
    savingsPercentage: number;
  } {
    const deepseekCost = this.calculateCost(inputTokens, outputTokens);
    // GPT-4o pricing: $2.50 input, $10.00 output per 1M tokens
    const openaiCost = (inputTokens * 2.50 / 1000000) + (outputTokens * 10.00 / 1000000);
    const savings = openaiCost - deepseekCost;
    const savingsPercentage = ((savings / openaiCost) * 100);

    return {
      deepseekCost,
      openaiCost,
      savings,
      savingsPercentage
    };
  }

  /**
   * Génère du contenu avec retry automatique
   */
  async generateWithRetry(
    prompt: string,
    options: Parameters<typeof this.generateContent>[1] = {},
    maxRetries: number = 3
  ): Promise<AIResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateContent(prompt, options);
      } catch (error) {
        lastError = error as Error;
        console.warn(`DeepSeek attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          // Attendre avant de retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }
}

// Instance singleton
export const deepseek = new DeepSeekService();

// Export par défaut
export default deepseek;

// Types utiles
export interface DeepSeekOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  systemPrompt?: string;
}

export interface CostComparison {
  deepseekCost: number;
  openaiCost: number;
  savings: number;
  savingsPercentage: number;
}