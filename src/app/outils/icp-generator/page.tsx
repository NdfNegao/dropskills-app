'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import ICPWizardV2 from '@/components/ICPWizardV2';
import ICPResult from '@/components/ICPResult';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  Download,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICPFormData, ICPAnalysis } from '@/types/icp';

function ICPGeneratorContent() {
  const [icpResult, setIcpResult] = useState<ICPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<ICPFormData | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedResult = localStorage.getItem('dropskills_icp_v2_data');
    const savedFormData = localStorage.getItem('dropskills_icp_v2_form_data');
    
    if (savedResult && savedFormData) {
      try {
        setIcpResult(JSON.parse(savedResult));
        setLastFormData(JSON.parse(savedFormData));
        setShowWizard(false);
      } catch (e) {
        console.error('Erreur lors du chargement des données sauvegardées:', e);
      }
    }
  }, []);

  const handleGenerate = async (formData: ICPFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/icp/generate-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      const data = await response.json();
      setIcpResult(data.analysis);
      setLastFormData(formData);
      setShowWizard(false);
      
      // Sauvegarder les données
      localStorage.setItem('dropskills_icp_v2_data', JSON.stringify(data.analysis));
      localStorage.setItem('dropskills_icp_v2_form_data', JSON.stringify(formData));
      
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message || 'Erreur lors de la génération de l\'ICP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGeneration = () => {
    setShowWizard(true);
    setIcpResult(null);
    setError(null);
    localStorage.removeItem('dropskills_icp_v2_data');
    localStorage.removeItem('dropskills_icp_v2_form_data');
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportToPDF = () => {
    // TODO: Implémenter l'export PDF
    console.log('Export PDF à implémenter');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header avec stats */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Dropskills AI</p>
                <p className="text-gray-400 text-sm">Powered by</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">+89%</p>
                <p className="text-gray-400 text-sm">Précision améliorée</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold">4 étapes</p>
                <p className="text-gray-400 text-sm">Flux optimisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        {showWizard ? (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ICPWizardV2 
              onComplete={handleGenerate}
              isLoading={isLoading}
              initialData={lastFormData || {}}
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-400 font-medium">Erreur</span>
                </div>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header des résultats */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Votre ICP généré par Dropskills AI</h2>
                    <p className="text-gray-400 text-sm">Profil client idéal détaillé et actionnable</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNewGeneration}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded-lg hover:bg-[#232323] transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Nouveau</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>Régénérer</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Résultats ICP */}
            {icpResult && (
              <ICPResult 
                analysis={icpResult} 
                onCopy={copyToClipboard}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ICPGeneratorPage() {
  return (
    <ToolLayout toolId="icp-generator">
      <PremiumGuard>
        <ICPGeneratorContent />
      </PremiumGuard>
    </ToolLayout>
  );
}