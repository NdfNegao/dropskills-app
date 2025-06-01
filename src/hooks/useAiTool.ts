import { useState } from 'react';
import { AiTool } from '@/data/ai-tools';
import { generateAIContent } from '@/lib/openai';

interface UseAiToolOptions {
  tool: AiTool;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

// Fonction pour enregistrer les logs
async function logAiToolUsage(data: any) {
  try {
    await fetch('/api/ai-tools/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Erreur lors du logging:', error);
  }
}

export function useAiTool({ tool, onSuccess, onError }: UseAiToolOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const generate = async (input: any) => {
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    const logData = {
      tool_id: tool.id,
      user_id: null, // À récupérer depuis le contexte utilisateur
      user_email: 'user@example.com', // À récupérer depuis le contexte utilisateur
      input,
      model_used: tool.model,
      status: 'pending' as const
    };

    try {
      // Appel à l'API via le endpoint de l'outil
      const response = await fetch(tool.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Enregistrer le succès
      await logAiToolUsage({
        ...logData,
        output: data,
        tokens_used: data.usage?.total_tokens || 0,
        duration_ms: duration,
        status: 'success'
      });

      setResult(data);
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      const duration = Date.now() - startTime;

      // Enregistrer l'erreur
      await logAiToolUsage({
        ...logData,
        error_message: error.message,
        duration_ms: duration,
        status: 'error'
      });

      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithOpenAI = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    const logData = {
      tool_id: tool.id,
      user_id: null, // À récupérer depuis le contexte utilisateur
      user_email: 'user@example.com', // À récupérer depuis le contexte utilisateur
      input: { prompt },
      model_used: tool.model,
      status: 'pending' as const
    };

    try {
      const response = await generateAIContent(
        prompt,
        tool.model,
        tool.temperature,
        tool.maxTokens
      );
      
      const duration = Date.now() - startTime;

      // Enregistrer le succès
      await logAiToolUsage({
        ...logData,
        output: response,
        tokens_used: response.usage?.total_tokens || 0,
        duration_ms: duration,
        status: 'success'
      });

      setResult(response);
      onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      const duration = Date.now() - startTime;

      // Enregistrer l'erreur
      await logAiToolUsage({
        ...logData,
        error_message: error.message,
        duration_ms: duration,
        status: 'error'
      });

      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generate,
    generateWithOpenAI,
    isLoading,
    error,
    result,
  };
} 