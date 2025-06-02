# 🚀 Guide d'Implémentation DeepSeek pour DropSkills

## Vue d'ensemble

Ce guide détaille l'implémentation de DeepSeek V3 dans la plateforme DropSkills pour optimiser les coûts et performances des outils IA.

## 📋 Prérequis

### 1. Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```bash
# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optionnel : Autres providers
XAI_API_KEY=your_grok_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

### 2. Installation des dépendances

```bash
npm install axios
# ou si vous préférez fetch natif (déjà disponible)
```

## 🔧 Étapes d'implémentation

### Phase 1 : Configuration de base (30 min)

#### 1.1 Mise à jour du système de providers

Le fichier `src/lib/ai-providers.ts` est déjà configuré avec DeepSeek. Vérifiez que la configuration est correcte :

```typescript
// Déjà implémenté dans ai-providers.ts
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
    // ... reste de la configuration
  }
};
```

#### 1.2 Création du service DeepSeek

Créez `src/lib/deepseek.ts` :

```typescript
import { AIResponse } from './openai';

class DeepSeekService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  async generateContent(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    } = {}
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'deepseek-v3',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en marketing digital et copywriting. Réponds toujours en français avec un ton professionnel et engageant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 8000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0
      }
    };
  }

  calculateCost(inputTokens: number, outputTokens: number): number {
    return (inputTokens * 0.14 / 1000000) + (outputTokens * 0.28 / 1000000);
  }
}

export const deepseek = new DeepSeekService();
export default deepseek;
```

### Phase 2 : Routage intelligent (45 min)

#### 2.1 Mise à jour du générateur de contenu principal

Modifiez `src/lib/openai.ts` pour inclure le routage :

```typescript
import { deepseek } from './deepseek';
import { AIProviderManager } from './ai-providers';

// Ajoutez cette fonction après les imports
export async function generateAIContentWithProvider(
  prompt: string,
  toolType: string,
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<AIResponse> {
  try {
    // Utilise le provider optimal selon le mapping
    const provider = await AIProviderManager.getOptimalProvider(toolType);
    
    if (provider.name === 'DeepSeek V3') {
      return await deepseek.generateContent(prompt, {
        temperature,
        maxTokens
      });
    }
    
    // Fallback vers OpenAI pour les autres providers non implémentés
    return await generateAIContent(prompt, toolType, temperature, maxTokens);
    
  } catch (error) {
    console.error(`Erreur provider ${toolType}:`, error);
    // Fallback vers OpenAI en cas d'erreur
    return await generateAIContent(prompt, toolType, temperature, maxTokens);
  }
}
```

#### 2.2 Mise à jour des endpoints API

Modifiez les endpoints pour utiliser le nouveau système. Exemple pour `src/app/api/ai/titles/generate/route.ts` :

```typescript
import { generateAIContentWithProvider } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { subject, audience, tone, type } = await request.json();

    if (!subject) {
      return NextResponse.json(
        { error: 'Le sujet est requis' },
        { status: 400 }
      );
    }

    const prompt = buildTitlesPrompt({ subject, audience, tone, type });

    // Utilise le nouveau système avec DeepSeek
    const response = await generateAIContentWithProvider(
      prompt, 
      'title-generator', // Sera routé vers DeepSeek
      0.8, 
      800
    );

    // Reste du code identique...
    let titles: string[] = [];
    try {
      const parsed = JSON.parse(response.content);
      titles = parsed.titles || [];
    } catch {
      titles = response.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(title => title.length > 0)
        .slice(0, 8);
    }

    return NextResponse.json({
      titles,
      usage: response.usage,
      provider: 'deepseek-v3', // Ajout pour tracking
      estimatedCost: (response.usage?.total_tokens || 0) * 0.21 / 1000000 // Coût DeepSeek
    });

  } catch (error) {
    console.error('Erreur génération titres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des titres' },
      { status: 500 }
    );
  }
}
```

### Phase 3 : Mise à jour des outils prioritaires (60 min)

#### 3.1 Outils à migrer vers DeepSeek en priorité

1. **Veille Stratégique** (`/api/veille/analyze/route.ts`)
2. **ICP Maker** (`/api/ai/icp/generate/route.ts`)
3. **Générateur de Titres** (`/api/ai/titles/generate/route.ts`)
4. **Générateur de Descriptions** (`/api/ai/descriptions/generate/route.ts`)
5. **Générateur d'Emails** (`/api/emails/generate/route.ts`)

#### 3.2 Template de migration pour chaque endpoint

```typescript
// Remplacez dans chaque endpoint :
// AVANT :
const response = await generateAIContent(prompt, 'tool-type', temperature, maxTokens);

// APRÈS :
const response = await generateAIContentWithProvider(prompt, 'tool-type', temperature, maxTokens);
```

### Phase 4 : Monitoring et analytics (30 min)

#### 4.1 Ajout du tracking des providers

Modifiez `src/hooks/useAiTool.ts` :

```typescript
// Ajoutez dans la fonction logAiToolUsage
async function logAiToolUsage(data: any) {
  try {
    await fetch('/api/ai-tools/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        provider_used: data.provider_used || 'openai', // Nouveau champ
        estimated_cost: data.estimated_cost || 0,       // Nouveau champ
        cost_savings: data.cost_savings || 0            // Nouveau champ
      })
    });
  } catch (error) {
    console.error('Erreur lors du logging:', error);
  }
}
```

## 🧪 Tests et validation

### 1. Test de connectivité DeepSeek

Créez `src/app/api/test/deepseek/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { deepseek } from '@/lib/deepseek';

export async function GET() {
  try {
    const response = await deepseek.generateContent(
      'Dis bonjour en français de manière professionnelle.',
      { temperature: 0.7, maxTokens: 100 }
    );
    
    return NextResponse.json({
      success: true,
      response: response.content,
      usage: response.usage,
      cost: deepseek.calculateCost(
        response.usage?.prompt_tokens || 0,
        response.usage?.completion_tokens || 0
      )
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### 2. Test de comparaison des coûts

Accédez à `/api/test/deepseek` pour vérifier que DeepSeek fonctionne.

## 📊 Monitoring des économies

### Dashboard des économies

Ajoutez dans votre admin panel une section pour tracker :

- Coût par outil avant/après DeepSeek
- Volume de tokens traités
- Économies réalisées
- Performance des différents providers

## 🚀 Déploiement

### 1. Déploiement progressif

1. **Phase 1** : Déployez avec DeepSeek en fallback uniquement
2. **Phase 2** : Activez DeepSeek pour les outils gratuits
3. **Phase 3** : Migrez les outils premium vers DeepSeek
4. **Phase 4** : Optimisation complète

### 2. Variables d'environnement en production

```bash
# Vercel/Production
vercel env add DEEPSEEK_API_KEY
# Entrez votre clé API DeepSeek
```

## 💰 Impact financier estimé

### Économies par outil (mensuel)

- **Générateur de Titres** : -85% (de $50 à $7.50)
- **ICP Maker** : -95% (de $200 à $10)
- **Veille Stratégique** : -95% (de $300 à $15)
- **Descriptions** : -90% (de $100 à $10)
- **Total estimé** : **-90% des coûts IA**

### ROI projeté

- **Économies mensuelles** : $500-1000
- **Temps d'implémentation** : 3-4 heures
- **ROI** : Positif dès le premier mois

## ⚠️ Points d'attention

1. **Rate Limits** : DeepSeek a des limites, implémentez un système de retry
2. **Fallback** : Gardez toujours OpenAI en fallback
3. **Monitoring** : Surveillez la qualité des réponses
4. **Coûts** : Trackez les économies réelles vs estimées

## 🔄 Prochaines étapes

1. Implémenter Grok pour les outils créatifs
2. Intégrer Perplexity pour la veille stratégique
3. Système de A/B testing automatique
4. Dashboard de performance des providers

---

**Temps total d'implémentation estimé : 2-3 heures**
**Économies estimées : 85-95% des coûts IA actuels**