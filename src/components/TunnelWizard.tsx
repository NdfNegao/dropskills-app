'use client';

import React from 'react';
import { Package, Target, Users, DollarSign, Settings, CheckCircle } from 'lucide-react';
import StepWizard from './StepWizard';
import OffreStep from './tunnel-steps/OffreStep';
import ObjectifStep from './tunnel-steps/ObjectifStep';
import AudienceStep from './tunnel-steps/AudienceStep';
import BudgetCanauxStep from './tunnel-steps/BudgetCanauxStep';
import ConfigurationStep from './tunnel-steps/ConfigurationStep';

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

interface TunnelWizardProps {
  onComplete: (data: TunnelFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<TunnelFormData>;
}

export function TunnelWizard({ onComplete, isLoading = false, initialData = {} }: TunnelWizardProps) {
  const steps = [
    {
      id: 'offre',
      title: 'Votre Offre',
      description: 'Décrivez votre produit ou service',
      icon: Package,
      component: OffreStep,
      validation: (data: TunnelFormData) => {
        const errors: Record<string, string> = {};
        if (!data.offreProduitService?.trim()) {
          errors.offreProduitService = 'La description de votre offre est requise';
        } else if (data.offreProduitService.length < 20) {
          errors.offreProduitService = 'Veuillez fournir une description plus détaillée (minimum 20 caractères)';
        }
        return errors;
      }
    },
    {
      id: 'objectif',
      title: 'Objectif',
      description: 'Définissez votre objectif principal',
      icon: Target,
      component: ObjectifStep,
      validation: (data: TunnelFormData) => {
        const errors: Record<string, string> = {};
        if (!data.objectifTunnel) {
          errors.objectifTunnel = 'Veuillez sélectionner un objectif pour votre tunnel';
        }
        return errors;
      }
    },
    {
      id: 'audience',
      title: 'Audience',
      description: 'Évaluez la maturité de votre audience',
      icon: Users,
      component: AudienceStep,
      validation: (data: TunnelFormData) => {
        const errors: Record<string, string> = {};
        if (!data.maturiteAudience) {
          errors.maturiteAudience = 'Veuillez sélectionner le niveau de maturité de votre audience';
        }
        return errors;
      }
    },
    {
      id: 'budget-canaux',
      title: 'Budget & Canaux',
      description: 'Définissez budget et canaux d\'acquisition',
      icon: DollarSign,
      component: BudgetCanauxStep,
      validation: (data: TunnelFormData) => {
        const errors: Record<string, string> = {};
        if (!data.budgetCible?.trim()) {
          errors.budgetCible = 'Veuillez indiquer le budget cible de vos prospects';
        }
        if (!data.canauxEntree || data.canauxEntree.length === 0) {
          errors.canauxEntree = 'Veuillez sélectionner au moins un canal d\'acquisition';
        }
        return errors;
      }
    },
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'Personnalisez structure et style',
      icon: Settings,
      component: ConfigurationStep,
      validation: (data: TunnelFormData) => {
        const errors: Record<string, string> = {};
        if (!data.tonaliteStyle) {
          errors.tonaliteStyle = 'Veuillez sélectionner une tonalité de communication';
        }
        if (!data.longueurTunnel) {
          errors.longueurTunnel = 'Veuillez choisir la longueur de votre tunnel';
        }
        return errors;
      }
    },
    {
      id: 'finalisation',
      title: 'Finalisation',
      description: 'Vérifiez et générez votre tunnel',
      icon: CheckCircle,
      component: ({ data }: { data: TunnelFormData }) => (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Récapitulatif</h2>
            <p className="text-gray-400">Vérifiez vos informations avant génération</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
            <h3 className="text-lg font-semibold text-white mb-4">Votre configuration :</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Offre :</span> <span className="text-white">{data.offreProduitService?.substring(0, 100)}...</span></div>
              <div><span className="text-gray-400">Objectif :</span> <span className="text-white">{data.objectifTunnel}</span></div>
              <div><span className="text-gray-400">Audience :</span> <span className="text-white">{data.maturiteAudience}</span></div>
              <div><span className="text-gray-400">Budget :</span> <span className="text-white">{data.budgetCible}</span></div>
              <div><span className="text-gray-400">Canaux :</span> <span className="text-white">{data.canauxEntree?.join(', ')}</span></div>
              <div><span className="text-gray-400">Longueur :</span> <span className="text-white">{data.longueurTunnel}</span></div>
              <div><span className="text-gray-400">Tonalité :</span> <span className="text-white">{data.tonaliteStyle}</span></div>
              {data.inclureUpsell && <div><span className="text-gray-400">Options :</span> <span className="text-white">Upsells inclus</span></div>}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">🚀 Prêt pour la génération</h4>
            <p className="text-blue-300 text-sm">
              Votre tunnel sera optimisé selon vos paramètres. La génération prendra quelques secondes.
            </p>
          </div>
        </div>
      ),
      validation: () => ({})
    }
  ];

  const defaultData: TunnelFormData = {
    offreProduitService: '',
    objectifTunnel: '',
    maturiteAudience: '',
    budgetCible: '',
    canauxEntree: [],
    actifsExistants: '',
    automatisationDesiree: '',
    tonaliteStyle: '',
    longueurTunnel: '',
    inclureUpsell: false,
    ...initialData
  };

  return (
    <StepWizard
      steps={steps}
      onComplete={onComplete}
      isLoading={isLoading}
      initialData={defaultData}

      subtitle="Créez votre tunnel de conversion optimisé en 6 étapes avec l'intelligence artificielle"
    />
  );
}