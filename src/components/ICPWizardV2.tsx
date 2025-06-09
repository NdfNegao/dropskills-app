'use client';

import React from 'react';
import { Building, Package, Users, MessageSquare, Target, TrendingUp } from 'lucide-react';
import StepWizard, { WizardStep } from './StepWizard';
import BusinessContextStep from './icp-steps/BusinessContextStep';
import ProductServiceStep from './icp-steps/ProductServiceStep';
import MarketingChannelsStep from './icp-steps/MarketingChannelsStep';
import TonalityStep from './icp-steps/TonalityStep';
import ObjectifsDefiStep from './icp-steps/ObjectifsDefiStep';
import SituationClientStep from './icp-steps/SituationClientStep';
import { ICPFormData } from '@/types/icp';

interface ICPWizardV2Props {
  onComplete: (data: ICPFormData) => void;
  isLoading: boolean;
  initialData?: Partial<ICPFormData>;
}

export function ICPWizardV2({ onComplete, isLoading, initialData = {} }: ICPWizardV2Props) {
  const steps: WizardStep[] = [
    {
      id: 'business-context',
      title: 'Contexte Business',
      description: 'Définissez votre secteur d\'activité et votre zone géographique cible',
      icon: Building,
      component: BusinessContextStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.secteur?.trim()) {
          errors.secteur = 'Le secteur d\'activité est requis';
        }
        
        if (!data.zoneGeographique?.trim()) {
          errors.zoneGeographique = 'La zone géographique est requise';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'product-service',
      title: 'Produit/Service',
      description: 'Décrivez votre offre et votre promesse unique de valeur',
      icon: Package,
      component: ProductServiceStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.produitService?.trim()) {
          errors.produitService = 'La description du produit/service est requise';
        } else if (data.produitService.trim().length < 20) {
          errors.produitService = 'Veuillez fournir une description plus détaillée (minimum 20 caractères)';
        }
        
        if (!data.promesseUnique?.trim()) {
          errors.promesseUnique = 'La promesse unique est requise';
        } else if (data.promesseUnique.trim().length < 15) {
          errors.promesseUnique = 'Veuillez détailler davantage votre promesse unique (minimum 15 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'marketing-channels',
      title: 'Budget & Canaux',
      description: 'Définissez le budget de vos clients et vos canaux marketing',
      icon: Users,
      component: MarketingChannelsStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.budgetCible?.trim()) {
          errors.budgetCible = 'Le budget cible est requis';
        }
        
        if (!data.canaux || data.canaux.length === 0) {
          errors.canaux = 'Sélectionnez au moins un canal marketing';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'objectifs-defis',
      title: 'Objectifs & Défis',
      description: 'Définissez vos objectifs business et vos principaux défis',
      icon: Target,
      component: ObjectifsDefiStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        // Validation optionnelle pour ces champs enrichis
        return {
          isValid: true,
          errors
        };
      }
    },
    {
      id: 'situation-client',
      title: 'Situation Client',
      description: 'Décrivez la situation actuelle et désirée de votre client cible',
      icon: TrendingUp,
      component: SituationClientStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        // Validation optionnelle pour ces champs enrichis
        return {
          isValid: true,
          errors
        };
      }
    },
    {
      id: 'tonality',
      title: 'Tonalité & Finalisation',
      description: 'Choisissez votre style de communication et finalisez votre profil',
      icon: MessageSquare,
      component: TonalityStep,
      validation: (data: ICPFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.tonalite?.trim()) {
          errors.tonalite = 'La tonalité de communication est requise';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    }
  ];

  const defaultFormData: ICPFormData = {
    secteur: '',
    produitService: '',
    promesseUnique: '',
    budgetCible: '',
    canaux: [],
    zoneGeographique: '',
    tonalite: '',
    ...initialData
  };

  const handleComplete = (formData: ICPFormData) => {
    // Validation finale avant envoi
    const requiredFields = ['secteur', 'produitService', 'promesseUnique', 'budgetCible', 'zoneGeographique', 'tonalite'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ICPFormData]);
    
    if (missingFields.length > 0 || !formData.canaux || formData.canaux.length === 0) {
      console.error('Données incomplètes:', { missingFields, canaux: formData.canaux });
      return;
    }

    onComplete(formData);
  };

  const handleStepChange = (stepIndex: number, data: ICPFormData) => {
    // Optionnel : sauvegarder les données à chaque étape
    if (typeof window !== 'undefined') {
      localStorage.setItem('dropskills_icp_wizard_progress', JSON.stringify({
        currentStep: stepIndex,
        formData: data,
        timestamp: Date.now()
      }));
    }
  };

  return (
    <StepWizard
      steps={steps}
      onComplete={handleComplete}
      onStepChange={handleStepChange}
      isLoading={isLoading}
      title="Générateur ICP avec Dropskills AI"
      description="Créez votre profil client idéal en 4 étapes avec l'intelligence artificielle"
      initialData={defaultFormData}
      className="max-w-4xl mx-auto"
      toolId="icp-generator"
    />
  );
}

export default ICPWizardV2;