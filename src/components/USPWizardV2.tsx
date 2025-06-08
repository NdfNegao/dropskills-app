import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import StepWizard from './StepWizard';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleFieldChange = (field: keyof USPFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (stepIndex: number): boolean => {




    const newErrors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0: // Promesse
        if (!formData.resultatPromesse.trim()) {
          newErrors.resultatPromesse = 'Le résultat/promesse est requis';
        }
        break;
      case 1: // Problème
        if (!formData.problemePrincipal.trim()) {
          newErrors.problemePrincipal = 'Le problème principal est requis';
        }
        break;
      case 2: // Différence
        if (!formData.differenceUnique.trim()) {
          newErrors.differenceUnique = 'La différence unique est requise';
        }
        break;
      case 3: // Preuve
        if (!formData.preuveArgument.trim()) {
          newErrors.preuveArgument = 'La preuve/argument est requise';
        }
        break;
      case 4: // Concurrents
        if (!formData.concurrents.trim()) {
          newErrors.concurrents = 'Les informations sur les concurrents sont requises';
        }
        break;
      case 5: // Client
        if (!formData.clientIdeal.trim()) {
          newErrors.clientIdeal = 'La description du client idéal est requise';
        }
        break;
      case 6: // Tonalité
        if (!formData.tonalite.trim()) {
          newErrors.tonalite = 'La tonalité est requise';
        }
        break;
      // Étape 7 (contraintes) est optionnelle
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    // Sauvegarder les données du formulaire
    localStorage.setItem('dropskills_usp_form_data', JSON.stringify(formData));
    onComplete(formData);
  };

  const steps = [
    {
      title: 'Résultat/Promesse',
      component: (
        <PromesseStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Problème Principal',
      component: (
        <ProblemeStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Différence Unique',
      component: (
        <DifferenceStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Preuve & Crédibilité',
      component: (
        <PreuveStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Concurrents',
      component: (
        <ConcurrentsStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Client Idéal',
      component: (
        <ClientStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Tonalité',
      component: (
        <TonaliteStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Contraintes',
      component: (
        <ContraintesStep
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
      )
    },
    {
      title: 'Finalisation',
      component: (
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
              <p className="text-gray-300 text-sm">{formData.resultatPromesse}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Problème principal :</h3>
              <p className="text-gray-300 text-sm">{formData.problemePrincipal}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Différence unique :</h3>
              <p className="text-gray-300 text-sm">{formData.differenceUnique}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Tonalité :</h3>
              <p className="text-gray-300 text-sm">{formData.tonalite}</p>
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

      description="Créez votre proposition de valeur unique en 8 étapes avec l'intelligence artificielle"
      initialData={formData}
    />
  );
}