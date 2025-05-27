'use client';

import { useState, useEffect } from 'react';
import { TunnelWizard } from '@/components/TunnelWizard';
import { TunnelResult } from '@/components/TunnelResult';

export interface TunnelFormData {
  offreProduitService: string;
  objectifTunnel: string;
  maturiteAudience: string;
  budgetCible: string;
  canauxEntree: string[];
  actifsExistants: string;
  automatisationDesiree: string;
  tonaliteStyle: string;
  longueurTunnel: string;
  inclureUpsell: boolean;
}

export interface TunnelEtape {
  nom: string;
  objectif: string;
  messageCle: string;
  callToAction: string;
  objectionALever: string;
  conseilsCopywriting: string[];
  automatisationSuggestions: string[];
}

export interface TunnelAnalysis {
  schemaTunnel: {
    etapes: string[];
    description: string;
    dureeEstimee: string;
  };
  etapesDetaillees: TunnelEtape[];
  conseilsGeneraux: {
    copywriting: string[];
    automatisation: string[];
    optimisation: string[];
  };
  sequenceEmail: {
    description: string;
    emails: Array<{
      jour: number;
      sujet: string;
      objectif: string;
      contenuCle: string;
    }>;
  };
  metriques: {
    tauxConversionEstime: number;
    complexite: number;
    potentielROI: number;
  };
  outilsRecommandes: string[];
}

export default function TunnelMakerPage() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [tunnelResult, setTunnelResult] = useState<TunnelAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [icpData, setIcpData] = useState<any>(null);
  const [uspData, setUspData] = useState<any>(null);

  // Récupération des données ICP et USP si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    const savedUSP = localStorage.getItem('dropskills_usp_data');
    
    if (savedICP) {
      try {
        const parsedICP = JSON.parse(savedICP);
        setIcpData(parsedICP);
      } catch (error) {
        console.error('Erreur lors du parsing des données ICP:', error);
      }
    }
    
    if (savedUSP) {
      try {
        const parsedUSP = JSON.parse(savedUSP);
        setUspData(parsedUSP);
      } catch (error) {
        console.error('Erreur lors du parsing des données USP:', error);
      }
    }
  }, []);

  const handleWizardComplete = async (formData: TunnelFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tunnel/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icpData: icpData,
          uspData: uspData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du tunnel');
      }

      const data = await response.json();
      setTunnelResult(data.analysis);
      setCurrentStep('result');
      
      // Sauvegarder le tunnel généré
      localStorage.setItem('dropskills_tunnel_data', JSON.stringify(data.analysis));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de la génération du tunnel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setTunnelResult(null);
  };

  const handleRegenerate = async () => {
    if (!tunnelResult) return;
    
    setIsLoading(true);
    try {
      const savedFormData = localStorage.getItem('dropskills_tunnel_form_data');
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        await handleWizardComplete(formData);
      }
    } catch (error) {
      console.error('Erreur lors de la régénération:', error);
      alert('Erreur lors de la régénération');
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
            🚀 Tunnel Maker IA
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Concevez votre tunnel de vente optimisé en 8 étapes avec l'IA
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {icpData && (
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                ICP détecté
              </div>
            )}
            {uspData && (
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                USP détectée
              </div>
            )}
            {(icpData || uspData) && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Génération optimisée
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {currentStep === 'wizard' && (
          <TunnelWizard 
            onComplete={handleWizardComplete}
            isLoading={isLoading}
            icpData={icpData}
            uspData={uspData}
          />
        )}

        {currentStep === 'result' && tunnelResult && (
          <TunnelResult 
            analysis={tunnelResult}
            onBackToWizard={handleBackToWizard}
            onRegenerate={handleRegenerate}
            isRegenerating={isLoading}
          />
        )}
      </div>
    </div>
  );
} 