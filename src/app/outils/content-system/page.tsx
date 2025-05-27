'use client';

import { useState, useEffect } from 'react';
import { ContentWizard } from '@/components/ContentWizard';
import { ContentCalendarResult } from '@/components/ContentCalendarResult';

export interface ContentFormData {
  icpCible: string;
  objectifBusiness: string;
  offrePrincipale: string;
  themesAngles: string;
  plateformes: string[];
  tonStyle: string;
  ressourcesMedias: string;
  frequence: string;
  evenementsCampagnes: string;
}

export interface ContentPost {
  id: string;
  date: string;
  semaine: number;
  typeContenu: string;
  sujetTitre: string;
  format: string;
  plateforme: string;
  objectif: string;
  callToAction: string;
  contenuGenere?: string;
  briefIAImage?: string;
  hashtags?: string[];
  dureeEstimee?: string;
}

export interface ContentAnalysis {
  calendrierInfo: {
    titre: string;
    description: string;
    dureeTotal: string;
    nombrePosts: number;
    dateDebut: string;
    dateFin: string;
  };
  calendrierEditorial: ContentPost[];
  exemplesPostsGeneres: {
    id: string;
    type: string;
    plateforme: string;
    titre: string;
    contenu: string;
    instructionsVisuels?: string;
    format: string;
  }[];
  conseilsRecyclage: {
    crossPlatform: string[];
    adaptation: string[];
    repurposing: string[];
  };
  metriques: {
    postsParSemaine: number;
    diversiteFormats: number;
    tauxEngagementEstime: number;
    porteeEstimee: string;
  };
  outilsRecommandes: string[];
  prochainEtapes: string[];
}

export default function ContentSystemPage() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'result'>('wizard');
  const [contentResult, setContentResult] = useState<ContentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [icpData, setIcpData] = useState<any>(null);
  const [uspData, setUspData] = useState<any>(null);
  const [tunnelData, setTunnelData] = useState<any>(null);
  const [emailData, setEmailData] = useState<any>(null);

  // Récupération des données ICP, USP, Tunnel et Email si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    const savedUSP = localStorage.getItem('dropskills_usp_data');
    const savedTunnel = localStorage.getItem('dropskills_tunnel_data');
    const savedEmail = localStorage.getItem('dropskills_email_sequence_data');
    
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
    
    if (savedEmail) {
      try {
        const parsedEmail = JSON.parse(savedEmail);
        setEmailData(parsedEmail);
      } catch (error) {
        console.error('Erreur lors du parsing des données Email:', error);
      }
    }
  }, []);

  const handleWizardComplete = async (formData: ContentFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icpData: icpData,
          uspData: uspData,
          tunnelData: tunnelData,
          emailData: emailData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du calendrier');
      }

      const data = await response.json();
      setContentResult(data.analysis);
      setCurrentStep('result');
      
      // Sauvegarder le calendrier généré
      localStorage.setItem('dropskills_content_calendar_data', JSON.stringify(data.analysis));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de la génération du calendrier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setContentResult(null);
  };

  const handleRegenerate = async () => {
    if (!contentResult) return;
    
    setIsLoading(true);
    try {
      const savedFormData = localStorage.getItem('dropskills_content_form_data');
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
            📅 Content System 90J
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            90 jours de contenus personnalisés : posts, visuels, carrousels… Calendrier éditorial prêt à publier
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
            {emailData && (
              <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Emails détectés
              </div>
            )}
            {(icpData || uspData || tunnelData || emailData) && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Génération optimisée
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {currentStep === 'wizard' && (
          <ContentWizard 
            onComplete={handleWizardComplete}
            isLoading={isLoading}
            icpData={icpData}
            uspData={uspData}
            tunnelData={tunnelData}
            emailData={emailData}
          />
        )}

        {currentStep === 'result' && contentResult && (
          <ContentCalendarResult 
            analysis={contentResult}
            onBackToWizard={handleBackToWizard}
            onRegenerate={handleRegenerate}
            isRegenerating={isLoading}
          />
        )}
      </div>
    </div>
  );
} 