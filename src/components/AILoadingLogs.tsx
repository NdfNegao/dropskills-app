'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Brain, Zap, CheckCircle, Loader2 } from 'lucide-react';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'processing' | 'warning';
  timestamp: string;
}

interface AILoadingLogsProps {
  isVisible: boolean;
  toolName?: string;
  onComplete?: () => void;
  duration?: number; // Durée totale en millisecondes
}

const getLogMessages = (toolName: string) => [
  { message: `Initialisation de ${toolName}...`, type: 'info' as const, delay: 0 },
  { message: 'Connexion aux modèles IA Dropskills...', type: 'info' as const, delay: 800 },
  { message: 'Modèles IA chargés avec succès', type: 'success' as const, delay: 1500 },
  { message: 'Analyse des données d\'entrée...', type: 'processing' as const, delay: 2200 },
  { message: 'Application des algorithmes d\'optimisation...', type: 'processing' as const, delay: 3000 },
  { message: 'Génération du contenu personnalisé...', type: 'processing' as const, delay: 4000 },
  { message: 'Validation et structuration des résultats...', type: 'processing' as const, delay: 5200 },
  { message: 'Finalisation de l\'analyse...', type: 'processing' as const, delay: 6000 },
  { message: 'Génération terminée avec succès !', type: 'success' as const, delay: 6800 }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
    case 'warning':
      return <Zap className="w-4 h-4 text-yellow-400" />;
    default:
      return <Terminal className="w-4 h-4 text-gray-400" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-400';
    case 'processing':
      return 'text-blue-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return 'text-gray-300';
  }
};

export function AILoadingLogs({ 
  isVisible, 
  toolName = 'l\'outil IA', 
  onComplete,
  duration = 7000 
}: AILoadingLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const logMessages = getLogMessages(toolName);

  useEffect(() => {
    if (!isVisible) {
      setLogs([]);
      setCurrentStep(0);
      setIsCompleted(false);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    logMessages.forEach((logMessage, index) => {
      const timeout = setTimeout(() => {
        const newLog: LogEntry = {
          id: `log-${index}`,
          message: logMessage.message,
          type: logMessage.type,
          timestamp: new Date().toLocaleTimeString('fr-FR', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };

        setLogs(prev => [...prev, newLog]);
        setCurrentStep(index + 1);

        // Si c'est le dernier log
        if (index === logMessages.length - 1) {
          setTimeout(() => {
            setIsCompleted(true);
            onComplete?.();
          }, 500);
        }
      }, logMessage.delay);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, toolName, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#0a0a0a] rounded-xl border border-[#232323] overflow-hidden"
    >
      {/* Header du terminal */}
      <div className="bg-[#111111] px-4 py-3 border-b border-[#232323]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-mono">Dropskills AI Terminal</span>
          </div>
        </div>
      </div>

      {/* Contenu du terminal */}
      <div className="p-4 font-mono text-sm max-h-80 overflow-y-auto">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 mb-2"
            >
              <span className="text-gray-500 text-xs min-w-[60px]">
                {log.timestamp}
              </span>
              {getTypeIcon(log.type)}
              <span className={getTypeColor(log.type)}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Curseur clignotant */}
        {!isCompleted && (
          <motion.div
            className="flex items-center gap-3 mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-gray-500 text-xs min-w-[60px]">
              {new Date().toLocaleTimeString('fr-FR', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">_</span>
          </motion.div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="bg-[#111111] px-4 py-2 border-t border-[#232323]">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#232323] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(currentStep / logMessages.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-gray-400 min-w-[60px]">
            {Math.round((currentStep / logMessages.length) * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default AILoadingLogs;