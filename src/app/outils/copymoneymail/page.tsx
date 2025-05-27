'use client';

import { useState, useEffect } from 'react';
import { EmailWizard } from '@/components/EmailWizard';
import { EmailSequenceResult } from '@/components/EmailSequenceResult';

export interface EmailFormData {
  objectifSequence: string;
  offreProduitService: string;
  icpCible: string;
  painPoints: string;
  nombreEmails: number;
  tonaliteStyle: string;
  bonusContent: string;
  callToAction: string;
}

export interface EmailContent {
  numeroEmail: number;
  sujet: string;
  varianteSujet: string;
  corpsMessage: string;
  momentEnvoi: string;
  conseilsEnvoi: string;
  objectifEmail: string;
  metriquesEstimees: {
    tauxOuverture: number;
    tauxClic: number;
    tauxConversion: number;
  };
}

export interface EmailSequenceAnalysis {
  sequenceInfo: {
    titre: string;
    description: string;
    dureeTotal: string;
    objectifGlobal: string;
  };
  emails: EmailContent[];
  conseilsGeneraux: {
    segmentation: string[];
    automatisation: string[];
    optimisation: string[];
    delivrabilite: string[];
  };
  metriquesGlobales: {
    tauxOuvertureEstime: number;
    tauxClicEstime: number;
    tauxConversionEstime: number;
    revenusEstimes: string;
  };
  outilsRecommandes: string[];
  prochainEtapes: string[];
}

export default function CopyMoneyMailPage() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [emailResult, setEmailResult] = useState<EmailSequenceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [icpData, setIcpData] = useState<any>(null);
  const [uspData, setUspData] = useState<any>(null);
  const [tunnelData, setTunnelData] = useState<any>(null);

  // Récupération des données ICP, USP et Tunnel si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    const savedUSP = localStorage.getItem('dropskills_usp_data');
    const savedTunnel = localStorage.getItem('dropskills_tunnel_data');
    
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
    
    if (savedTunnel) {
      try {
        const parsedTunnel = JSON.parse(savedTunnel);
        setTunnelData(parsedTunnel);
      } catch (error) {
        console.error('Erreur lors du parsing des données Tunnel:', error);
      }
    }
  }, []);

  const handleWizardComplete = async (formData: EmailFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icpData: icpData,
          uspData: uspData,
          tunnelData: tunnelData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération des emails');
      }

      const data = await response.json();
      setEmailResult(data.analysis);
      setCurrentStep('result');
      
      // Sauvegarder la séquence générée
      localStorage.setItem('dropskills_email_sequence_data', JSON.stringify(data.analysis));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de la génération de la séquence: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setEmailResult(null);
  };

  const handleRegenerate = async () => {
    if (!emailResult) return;
    
    setIsLoading(true);
    try {
      const savedFormData = localStorage.getItem('dropskills_email_form_data');
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

  const handleAddEmail = async () => {
    if (!emailResult) return;
    
    setIsLoading(true);
    try {
      const savedFormData = localStorage.getItem('dropskills_email_form_data');
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        // Augmenter le nombre d'emails et régénérer
        formData.nombreEmails = (formData.nombreEmails || 5) + 1;
        await handleWizardComplete(formData);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'email:', error);
      alert('Erreur lors de l\'ajout d\'email');
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
            ✉️ CopyMoneyMail AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            L'IA rédige votre séquence emails et relances sur-mesure pour transformer chaque prospect en client fidèle
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
            {tunnelData && (
              <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Tunnel détecté
              </div>
            )}
            {(icpData || uspData || tunnelData) && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Génération optimisée
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {currentStep === 'wizard' && (
          <EmailWizard 
            onComplete={handleWizardComplete}
            isLoading={isLoading}
            icpData={icpData}
            uspData={uspData}
            tunnelData={tunnelData}
          />
        )}

        {currentStep === 'result' && emailResult && (
          <EmailSequenceResult 
            analysis={emailResult}
            onBackToWizard={handleBackToWizard}
            onRegenerate={handleRegenerate}
            onAddEmail={handleAddEmail}
            isRegenerating={isLoading}
          />
        )}
      </div>
    </div>
  );
} 