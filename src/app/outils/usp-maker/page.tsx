'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { USPWizardV2 } from '@/components/USPWizardV2';
import { USPResult } from '@/components/USPResult';
import { USPFormData, USPAnalysis } from '@/types/usp';
import * as lucideReact from 'lucide-react';
import { motion } from 'framer-motion';

function USPMakerContent() {
  const [uspResult, setUSPResult] = useState<USPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
  const [currentFormData, setCurrentFormData] = useState<USPFormData | null>(null);
  const [icpData, setIcpData] = useState<any>(null);

  // Récupération des données ICP si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    if (savedICP) {
      try {
        const parsedICP = JSON.parse(savedICP);
        setIcpData(parsedICP);
      } catch (error) {
        console.error('Erreur lors du parsing des données ICP:', error);
      }
    }
  }, []);

  const handleUSPComplete = async (formData: USPFormData) => {
    setCurrentFormData(formData);
    setIsLoading(true);
    setShowWizard(false);
    
    try {
      const response = await fetch('/api/usp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icpData: icpData // Inclure les données ICP si disponibles
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération de l\'USP');
      }

      const data = await response.json();
      setUSPResult(data.analysis);
      
      // Sauvegarder l'USP générée
      localStorage.setItem('dropskills_usp_data', JSON.stringify(data.analysis));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de la génération de l'USP: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setShowWizard(true);
    setUSPResult(null);
  };

  const handleRegenerate = () => {
    if (currentFormData) {
      handleUSPComplete(currentFormData);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Vous pouvez ajouter une notification ici
  };

  const handleReformulate = async () => {
    if (!uspResult) return;
    
    setIsLoading(true);
    try {
      // Relancer la génération avec les mêmes données
      const savedFormData = localStorage.getItem('dropskills_usp_form_data');
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        await handleUSPComplete(formData);
      }
    } catch (error) {
      console.error('Erreur lors de la reformulation:', error);
      alert('Erreur lors de la reformulation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          ⚡ USP Maker
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Créez votre proposition de valeur unique en 8 étapes avec l'IA
        </p>
        
        {icpData && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Données ICP détectées - Génération optimisée
          </div>
        )}
      </div>

      {/* Content */}
      {showWizard ? (
        <USPWizardV2 
          onComplete={handleUSPComplete}
          isLoading={isLoading}
          icpData={icpData}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header avec actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToWizard}
                className="flex items-center space-x-2 px-4 py-2 bg-[#232323] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <lucideReact.Target className="w-4 h-4" />
                <span>Nouveau USP</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {uspResult && (
                <>
                  <button
                    onClick={() => copyToClipboard(uspResult.uspPrincipale)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#ff0033] text-white rounded-lg hover:bg-[#ff1a4d] transition-colors"
                  >
                    <lucideReact.Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </button>
                  
                  <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#232323] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
                  >
                    <lucideReact.RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Régénérer</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Résultat USP */}
          {uspResult ? (
            <USPResult 
              analysis={uspResult}
              onBackToWizard={handleBackToWizard}
              onReformulate={handleReformulate}
              isReformulating={isLoading}
            />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
                <lucideReact.Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Génération en cours...</h3>
              <p className="text-gray-400">Création de votre USP personnalisée</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function USPMakerPage() {
  return (
    <ToolLayout toolId="usp-maker">
      <PremiumGuard feature="USP Maker IA">
        <USPMakerContent />
      </PremiumGuard>
    </ToolLayout>
  );
}