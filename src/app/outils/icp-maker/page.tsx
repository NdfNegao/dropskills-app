'use client';

import { useState } from 'react';
import { ICPWizard } from '@/components/ICPWizard';
import { ICPResult } from '@/components/ICPResult';

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

export default function ICPMakerPage() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [icpResult, setICPResult] = useState<ICPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWizardComplete = async (formData: ICPFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/icp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'ICP');
      }

      const data = await response.json();
      setICPResult(data.analysis);
      setCurrentStep('result');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la génération de l\'ICP. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setICPResult(null);
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
          />
        )}
      </div>
    </div>
  );
} 