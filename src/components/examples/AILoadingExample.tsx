'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AILoadingLogs from '../AILoadingLogs';
import { Brain, Sparkles, Zap } from 'lucide-react';

/**
 * Exemple d'utilisation du composant AILoadingLogs
 * Ce composant peut être intégré dans n'importe quelle page d'outil IA
 */
export function AILoadingExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setShowResult(false);
    
    // Simuler une génération IA qui prend du temps
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 7500); // Durée légèrement supérieure aux logs pour un effet fluide
  };

  const handleReset = () => {
    setIsLoading(false);
    setShowResult(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Exemple d'Outil IA</h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Cet exemple montre comment intégrer l'effet de logs pendant la génération d'un outil IA.
          Cliquez sur "Générer" pour voir l'animation en action.
        </p>
      </div>

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AILoadingLogs 
              isVisible={true}
              toolName="Générateur d'Exemple"
              onComplete={() => {
                console.log('Génération terminée !');
              }}
            />
          </motion.div>
        ) : showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111111] rounded-xl border border-[#232323] p-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Génération Terminée !</h2>
              </div>
              <p className="text-gray-400">
                Votre contenu a été généré avec succès par Dropskills AI.
              </p>
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#232323]">
                <p className="text-green-400 font-mono text-sm">
                  ✓ Analyse des données d'entrée : Terminée<br/>
                  ✓ Application des algorithmes IA : Terminée<br/>
                  ✓ Génération du contenu : Terminée<br/>
                  ✓ Validation des résultats : Terminée
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Nouvelle Génération
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111111] rounded-xl border border-[#232323] p-6"
          >
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Prêt à générer ?</h2>
                <p className="text-gray-400">
                  Cliquez sur le bouton ci-dessous pour voir l'effet de logs en action.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#232323]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Logs en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">Interface terminal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Barre de progression</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  className="
                    px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white rounded-lg font-medium transition-all
                    hover:from-blue-600 hover:to-purple-600
                    flex items-center gap-2 mx-auto
                  "
                >
                  <Brain className="w-5 h-5" />
                  <span>Générer avec Dropskills AI</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AILoadingExample;