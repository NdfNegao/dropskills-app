'use client';

import { useState } from 'react';
import { ICPWizard } from '@/components/ICPWizard';
import { ICPResult } from '@/components/ICPResult';
import PremiumGuard from '@/components/auth/PremiumGuard';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export interface ICPFormData {
  secteur: string;
  produitService: string;
  promesseUnique: string;
  budgetCible: string;
  canaux: string[];
  zoneGeographique: string;
  tonalite: string;
}

export interface ICPAnalysis {
  profilSociodemographique: {
    age: string;
    sexe: string;
    localisation: string;
    situationPro: string;
    niveauRevenus: string;
  };
  psychologieMotivations: {
    besoins: string[];
    desirs: string[];
    peurs: string[];
    objections: string[];
  };
  problemePrincipaux: string[];
  ouLeTrouver: {
    canaux: string[];
    plateformes: string[];
    groupes: string[];
    evenements: string[];
  };
  messagingImpactant: {
    expressions: string[];
    accroches: string[];
    styleDiscours: string;
  };
  budgetPouvoirAchat: {
    budgetTypique: string;
    frequenceAchat: string;
    facteursPrix: string[];
  };
  segments: {
    principal: {
      nom: string;
      description: string;
      pourcentage: string;
    };
    variantes: Array<{
      nom: string;
      description: string;
      pourcentage: string;
    }>;
  };
  ficheActionable: {
    resumeExecutif: string;
    prioritesMarketing: string[];
    prochainEtapes: string[];
    metriquesACles: string[];
  };
}

function ICPMakerContent() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [icpResult, setICPResult] = useState<ICPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWizardComplete = async (formData: ICPFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/icp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération de l\'ICP');
      }

      const data = await response.json();
      setICPResult(data.analysis);
      setCurrentStep('result');
      
      // Sauvegarder l'ICP généré
      localStorage.setItem('dropskills_icp_data', JSON.stringify(data.analysis));
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération de l\'ICP. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setICPResult(null);
  };

  const handleReformulate = async () => {
    if (!icpResult) return;
    
    setIsLoading(true);
    try {
      // Relancer la génération avec les mêmes données
      const savedFormData = localStorage.getItem('dropskills_icp_form_data');
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
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 ICP Maker IA
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            La machine à avatar client nouvelle génération. Créez votre profil client idéal en 7 étapes avec l'IA.
          </p>
        </div>

        {/* Content */}
        {currentStep === 'wizard' && (
          <ICPWizard 
            onComplete={handleWizardComplete}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'result' && icpResult && (
          <ICPResult 
            analysis={icpResult}
            onBackToWizard={handleBackToWizard}
            onReformulate={handleReformulate}
            isReformulating={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default function ICPMakerPage() {
  return (
    <LayoutWithSidebar>
      <PremiumGuard feature="l'ICP Maker IA">
        <ICPMakerContent />
      </PremiumGuard>
    </LayoutWithSidebar>
  );
} 