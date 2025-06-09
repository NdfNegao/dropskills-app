import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Target,
  AlertTriangle,
  Zap,
  Trophy,
  Users,
  MessageSquare,
  Settings
} from 'lucide-react';
import StepWizard, { WizardStep } from './StepWizard';
import { USPFormData } from '@/types/usp';
import { PromesseStep } from './usp-steps/PromesseStep';
import { ProblemeStep } from './usp-steps/ProblemeStep';
import { DifferenceStep } from './usp-steps/DifferenceStep';
import { PreuveStep } from './usp-steps/PreuveStep';
import { ConcurrentsStep } from './usp-steps/ConcurrentsStep';
import { ClientStep } from './usp-steps/ClientStep';
import { TonaliteStep } from './usp-steps/TonaliteStep';
import { ContraintesStep } from './usp-steps/ContraintesStep';

interface USPWizardV2Props {
  onComplete: (formData: USPFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<USPFormData>;
  icpData?: any;
}

const defaultData: USPFormData = {
  resultatPromesse: '',
  problemePrincipal: '',
  differenceUnique: '',
  preuveArgument: '',
  concurrents: '',
  clientIdeal: '',
  tonalite: '',
  contraintes: ''
};

export function USPWizardV2({ onComplete, isLoading = false, initialData = {}, icpData }: USPWizardV2Props) {
  const [formData, setFormData] = useState<USPFormData>({ ...defaultData, ...initialData });

  // Pré-remplir avec les données ICP si disponibles
  useEffect(() => {
    if (icpData) {
      setFormData(prev => ({
        ...prev,
        clientIdeal: icpData.ficheActionable?.resumeExecutif || 
                    `${icpData.profilSociodemographique?.age}, ${icpData.profilSociodemographique?.situationPro}`,
        problemePrincipal: icpData.problemePrincipaux?.[0] || '',
        tonalite: icpData.messagingImpactant?.styleDiscours || ''
      }));
    }
  }, [icpData]);



  const handleComplete = () => {
    // Sauvegarder les données du formulaire
    localStorage.setItem('dropskills_usp_form_data', JSON.stringify(formData));
    onComplete(formData);
  };

  const steps: WizardStep[] = [
    {
      id: 'promesse',
      title: 'Résultat/Promesse',
      description: 'Que promettez-vous ?',
      icon: Target,
      component: PromesseStep
    },
    {
      id: 'probleme',
      title: 'Problème Principal',
      description: 'Quel problème résolvez-vous ?',
      icon: AlertTriangle,
      component: ProblemeStep
    },
    {
      id: 'difference',
      title: 'Différence Unique',
      description: 'Votre avantage concurrentiel',
      icon: Zap,
      component: DifferenceStep
    },
    {
      id: 'preuve',
      title: 'Preuve & Crédibilité',
      description: 'Votre crédibilité',
      icon: Trophy,
      component: PreuveStep
    },
    {
      id: 'concurrents',
      title: 'Concurrents',
      description: 'Votre environnement',
      icon: Users,
      component: ConcurrentsStep
    },
    {
      id: 'client',
      title: 'Client Idéal',
      description: 'Votre cible',
      icon: Users,
      component: ClientStep
    },
    {
      id: 'tonalite',
      title: 'Tonalité',
      description: 'Votre style',
      icon: MessageSquare,
      component: TonaliteStep
    },
    {
      id: 'contraintes',
      title: 'Contraintes',
      description: 'Vos spécificités',
      icon: Settings,
      component: ContraintesStep,
      isOptional: true
    },
    {
      id: 'finalisation',
      title: 'Finalisation',
      description: 'Vérifiez vos informations avant génération',
      icon: CheckCircle,
      component: ({ data }: { data: USPFormData }) => (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Récapitulatif</h2>
            <p className="text-gray-400">Vérifiez vos informations avant de générer votre USP</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Résultat/Promesse :</h3>
              <p className="text-gray-300 text-sm">{data.resultatPromesse}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Problème principal :</h3>
              <p className="text-gray-300 text-sm">{data.problemePrincipal}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Différence unique :</h3>
              <p className="text-gray-300 text-sm">{data.differenceUnique}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Tonalité :</h3>
              <p className="text-gray-300 text-sm">{data.tonalite}</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <StepWizard
      steps={steps}
      onComplete={handleComplete}
      isLoading={isLoading}
      title="USP Maker avec Dropskills AI"
      description="Créez votre proposition de valeur unique en 8 étapes avec l'intelligence artificielle"
      initialData={formData}
      toolId="usp-maker"
    />
  );
}