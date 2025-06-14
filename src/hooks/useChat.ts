'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, UseChatReturn, ChatAPIResponse } from '@/types/ai-mentor';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface UseChatOptions {
  mentorId: string;
  initialMessages?: ChatMessage[];
  onError?: (error: string) => void;
  onSuccess?: (response: ChatAPIResponse) => void;
}

export function useChat({
  mentorId,
  initialMessages = [],
  onError,
  onSuccess
}: UseChatOptions): UseChatReturn {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fonction pour générer un ID unique pour les messages
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Fonction pour créer un message utilisateur
  const createUserMessage = useCallback((content: string): ChatMessage => {
    return {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
      mentorId,
      userId: session?.user?.id || 'anonymous'
    };
  }, [generateMessageId, mentorId, session?.user?.id]);

  // Fonction pour créer un message assistant
  const createAssistantMessage = useCallback((content: string): ChatMessage => {
    return {
      id: generateMessageId(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      mentorId,
      userId: session?.user?.id || 'anonymous'
    };
  }, [generateMessageId, mentorId, session?.user?.id]);

  // Fonction pour envoyer un message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) {
      setError('Le message ne peut pas être vide');
      return;
    }

    if (!session?.user) {
      setError('Vous devez être connecté pour utiliser cette fonctionnalité');
      toast.error('Connexion requise');
      return;
    }

    // Vérifier l'accès premium
    const user = session.user as any;
    if (!user.premium && user.role !== 'ADMIN') {
      setError('Un accès premium est requis pour utiliser les mentors IA');
      toast.error('Accès premium requis');
      return;
    }

    setLoading(true);
    setError(null);

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Créer un nouveau contrôleur d'annulation
    abortControllerRef.current = new AbortController();

    try {
      // Ajouter le message utilisateur immédiatement
      const userMessage = createUserMessage(content);
      setMessages(prev => [...prev, userMessage]);

      // Envoyer la requête à l'API
      const response = await fetch(`/api/ai-mentor/${mentorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: user.id
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data: ChatAPIResponse = await response.json();

      // Ajouter la réponse du mentor
      const assistantMessage = createAssistantMessage(data.response);
      setMessages(prev => [...prev, assistantMessage]);

      // Appeler le callback de succès
      if (onSuccess) {
        onSuccess(data);
      }

      toast.success('Message envoyé avec succès');

    } catch (err: any) {
      // Ignorer les erreurs d'annulation
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Une erreur est survenue lors de l\'envoi du message';
      setError(errorMessage);
      
      // Appeler le callback d'erreur
      if (onError) {
        onError(errorMessage);
      }

      toast.error(errorMessage);
      
      // Retirer le message utilisateur en cas d'erreur
      setMessages(prev => prev.slice(0, -1));
      
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [mentorId, session, createUserMessage, createAssistantMessage, onError, onSuccess]);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction pour effacer tous les messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Nettoyer le contrôleur d'annulation lors du démontage
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Mettre à jour les messages initiaux si ils changent
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, messages.length]);

  return {
    messages,
    sendMessage,
    loading,
    error,
    clearError,
    clearMessages
  };
}

// Hook pour récupérer l'historique des conversations
export function useConversationHistory(mentorId: string) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai-mentor/${mentorId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setHistory(data.history || []);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du chargement de l\'historique';
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    if (mentorId) {
      fetchHistory();
    }
  }, [mentorId, fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory
  };
}