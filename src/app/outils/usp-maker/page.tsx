'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { USPWizard } from '@/components/USPWizard';
import { USPResult } from '@/components/USPResult';

export interface USPFormData {
  resultatPromesse: string;
  problemePrincipal: string;
  differenceUnique: string;
  preuveArgument: string;
  concurrents: string;
  clientIdeal: string;
  tonalite: string;
  contraintes: string;
}

export interface USPAnalysis {
  uspPrincipale: string;
  variantes: {
    rationnel: string;
    emotionnel: string;
    exclusif: string;
  };
  explication: {
    pourquoi: string;
    differenciateur: string;
    impact: string;
  };
  conseilUtilisation: {
    pageSale: string;
    publicite: string;
    reseauxSociaux: string;
    emailMarketing: string;
  };
  metriques: {
    scoreImpact: number;
    memorabilite: number;
    clarte: number;
  };
}

function USPMakerContent() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [uspResult, setUSPResult] = useState<USPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleWizardComplete = async (formData: USPFormData) => {
    setIsLoading(true);
    
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
      setCurrentStep('result');
      
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
    setCurrentStep('wizard');
    setUSPResult(null);
  };

  const handleReformulate = async () => {
    if (!uspResult) return;
    
    setIsLoading(true);
    try {
      // Relancer la génération avec les mêmes données
      const savedFormData = localStorage.getItem('dropskills_usp_form_data');
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        await handleWizardComplete(formData);
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
          ⚡ USP Maker IA
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
      {currentStep === 'wizard' && (
        <USPWizard 
          onComplete={handleWizardComplete}
          isLoading={isLoading}
          icpData={icpData}
        />
      )}

      {currentStep === 'result' && uspResult && (
        <USPResult 
          analysis={uspResult}
          onBackToWizard={handleBackToWizard}
          onReformulate={handleReformulate}
          isReformulating={isLoading}
        />
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