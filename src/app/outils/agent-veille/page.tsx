'use client';

import { useState, useEffect } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { VeilleWizard } from '@/components/VeilleWizard';
import { OpportunitiesDashboard } from '@/components/OpportunitiesDashboard';

export interface VeilleFormData {
  secteur: string;
  zone: string;
  objectif: string;
  typeOpportunite: string[];
  budgetRessources: string;
  frequenceVeille: string;
  canauxVeille: string[];
}

export interface Opportunity {
  id: string;
  titre: string;
  description: string;
  secteur: string;
  canal: string;
  scoring: {
    pertinence: number;
    nouveaute: number;
    difficulte: number;
    potentielFinancier: number;
    niveauConcurrence: number;
    scoreGlobal: number;
  };
  actionsRecommandees: string[];
  lienReference?: string;
  dateDetection: string;
  tags: string[];
  isBlueOcean?: boolean;
}

export interface VeilleAnalysis {
  veilleInfo: {
    titre: string;
    description: string;
    dateAnalyse: string;
    nombreOpportunites: number;
  };
  opportunites: Opportunity[];
  syntheseTendances: {
    titre: string;
    tendancesPrincipales: string[];
    signauxFaibles: string[];
    recommandationsStrategiques: string[];
  };
  metriques: {
    opportunitesBlueOcean: number;
    scoreMovenPertinence: number;
    secteursPrioritaires: string[];
    potentielTotalEstime: string;
  };
  prochainEtapes: string[];
  outilsRecommandes: string[];
}

function AgentVeilleContent() {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'dashboard'>('wizard');
  const [veilleResult, setVeilleResult] = useState<VeilleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});

  // Charger les opportunités sauvegardées et alertes
  useEffect(() => {
    const saved = localStorage.getItem('dropskills_saved_opportunities');
    const savedAlerts = localStorage.getItem('dropskills_opportunity_alerts');
    
    if (saved) {
      try {
        setSavedOpportunities(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur lors du chargement des opportunités sauvegardées:', error);
      }
    }
    
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error);
      }
    }
  }, []);

  const handleWizardComplete = async (formData: VeilleFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/veille/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'analyse');
      }

      const data = await response.json();
      setVeilleResult(data.analysis);
      setCurrentStep('dashboard');
      
      // Sauvegarder l'analyse
      localStorage.setItem('dropskills_veille_data', JSON.stringify(data.analysis));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de l'analyse: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setVeilleResult(null);
  };

  const handleRefreshAnalysis = async () => {
    if (!veilleResult) return;
    
    setIsLoading(true);
    try {
      const savedFormData = localStorage.getItem('dropskills_veille_form_data');
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        await handleWizardComplete(formData);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      alert('Erreur lors du rafraîchissement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOpportunity = (opportunityId: string) => {
    const newSaved = savedOpportunities.includes(opportunityId)
      ? savedOpportunities.filter(id => id !== opportunityId)
      : [...savedOpportunities, opportunityId];
    
    setSavedOpportunities(newSaved);
    localStorage.setItem('dropskills_saved_opportunities', JSON.stringify(newSaved));
  };

  const handleToggleAlert = (opportunityId: string) => {
    const newAlerts = {
      ...alerts,
      [opportunityId]: !alerts[opportunityId]
    };
    
    setAlerts(newAlerts);
    localStorage.setItem('dropskills_opportunity_alerts', JSON.stringify(newAlerts));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          🦾 Agent IA Veille & Opportunités
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Détectez automatiquement les opportunités business et tendances de votre marché. 
          L'IA analyse et score chaque opportunité pour vous.
        </p>
        
        {savedOpportunities.length > 0 && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-[#ff0033]/10 text-[#ff0033] rounded-lg text-sm border border-[#ff0033]/20">
            <span className="w-2 h-2 bg-[#ff0033] rounded-full mr-2 animate-pulse"></span>
            {savedOpportunities.length} opportunité{savedOpportunities.length > 1 ? 's' : ''} sauvegardée{savedOpportunities.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      {currentStep === 'wizard' && (
        <VeilleWizard 
          onComplete={handleWizardComplete}
          isLoading={isLoading}
        />
      )}

      {currentStep === 'dashboard' && veilleResult && (
        <OpportunitiesDashboard 
          analysis={veilleResult}
          onBackToWizard={handleBackToWizard}
          onRefresh={handleRefreshAnalysis}
          isRefreshing={isLoading}
          savedOpportunities={savedOpportunities}
          onSaveOpportunity={handleSaveOpportunity}
          alerts={alerts}
          onToggleAlert={handleToggleAlert}
        />
      )}
    </div>
  );
}

export default function AgentVeillePage() {
  return (
    <LayoutWithSidebar>
      <PremiumGuard feature="Agent Veille IA">
        <AgentVeilleContent />
      </PremiumGuard>
    </LayoutWithSidebar>
  );
} 