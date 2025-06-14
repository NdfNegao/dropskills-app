'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Loader2, User, Bot, Sparkles, AlertCircle, PenTool, Target, TrendingUp, Megaphone, Video, Mail, Lightbulb, BarChart3, Users, Palette, MessageSquare, Zap } from 'lucide-react';
import { AIMentor, ChatInterfaceProps } from '@/types/ai-mentor';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'PenTool': PenTool,
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Megaphone': Megaphone,
    'Video': Video,
    'Mail': Mail,
    'Lightbulb': Lightbulb,
    'BarChart3': BarChart3,
    'Users': Users,
    'Palette': Palette,
    'MessageSquare': MessageSquare,
    'Zap': Zap
  };
  
  const IconComponent = iconMap[iconName] || MessageSquare;
  return <IconComponent className="w-6 h-6 text-white" />;
};

export function ChatInterface({ mentorId, mentor, initialMessages = [] }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Utiliser le hook useChat
  const {
    messages,
    sendMessage,
    loading: isLoading,
    error,
    clearError,
    clearMessages
  } = useChat({
    mentorId,
    initialMessages,
    onError: (error) => {
      console.error('Erreur de chat:', error);
    },
    onSuccess: (response) => {
      console.log('Message envoyé avec succès:', response);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ajuster la hauteur du textarea automatiquement
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // Gérer l'envoi d'un message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    
    try {
      await sendMessage(messageContent);
    } catch (error) {
      // L'erreur est déjà gérée par le hook useChat
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  // Gérer la sélection d'un prompt suggéré
  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    // Focus sur le textarea après avoir sélectionné un prompt
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Gérer l'envoi avec Enter (Shift+Enter pour nouvelle ligne)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* En-tête du chat */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
          {getIcon(mentor.icon)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{mentor.name}</h3>
          <p className="text-sm text-gray-400">
            Réponse estimée : {mentor.estimatedResponseTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-400">IA Premium</span>
        </div>
        {messages.length > 0 && (
          <Button
            onClick={clearMessages}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            Effacer
          </Button>
        )}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <Button
            onClick={clearError}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 h-auto p-1"
          >
            ×
          </Button>
        </div>
      )}

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl">
              {getIcon(mentor.icon)}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Commencez une conversation avec {mentor.name}
            </h3>
            <p className="text-gray-400 mb-4">{mentor.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Suggestions de questions :</p>
              {mentor.suggestedPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="block w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm text-gray-300 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{mentor.name} réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Posez votre question à ${mentor.name}...`}
              className="w-full p-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={1}
              disabled={isLoading}
              maxLength={2000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {inputValue.length}/2000
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 h-auto"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
}