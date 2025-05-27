'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Globe, Briefcase, DollarSign, Clock, Radio, CheckCircle } from 'lucide-react';
import { VeilleFormData } from '@/app/outils/agent-veille/page';

interface VeilleWizardProps {
  onComplete: (data: VeilleFormData) => void;
  isLoading: boolean;
}

const SECTEUR_OPTIONS = [
  'Tech & SaaS',
  'E-commerce',
  'Formation & Education',
  'Marketing & Communication',
  'Finance & Crypto',
  'Santé & Bien-être',
  'Immobilier',
  'Consulting & Services',
  'Industrie & Manufacturing',
  'Autre'
];

const ZONE_OPTIONS = [
  'France',
  'Europe',
  'USA/Canada',
  'International',
  'Francophonie',
  'Local/Régional'
];

const OBJECTIF_OPTIONS = [
  'Trouver de nouveaux marchés',
  'Identifier des partenariats',
  'Veille concurrentielle',
  'Innovation produit',
  'Expansion géographique',
  'Diversification',
  'Optimisation des coûts',
  'Tendances émergentes'
];

const TYPE_OPPORTUNITE_OPTIONS = [
  'Nouveaux produits/services',
  'Partenariats stratégiques',
  'Acquisitions/Rachats',
  'Marchés inexploités',
  'Technologies émergentes',
  'Changements réglementaires',
  'Besoins clients non satisfaits',
  'Modèles business innovants'
];

const BUDGET_OPTIONS = [
  '< 1k€',
  '1k€ - 10k€',
  '10k€ - 50k€',
  '50k€ - 100k€',
  '> 100k€',
  'Ressources humaines uniquement'
];

const FREQUENCE_OPTIONS = [
  'Temps réel',
  'Quotidienne',
  'Hebdomadaire',
  'Mensuelle',
  'Trimestrielle'
];

const CANAUX_VEILLE_OPTIONS = [
  'Réseaux sociaux',
  'Presse spécialisée',
  'Brevets & Publications',
  'Conférences & Events',
  'Communautés en ligne',
  'Newsletters secteur',
  'Podcasts business',
  'Rapports d\'analystes',
  'GitHub & Open Source',
  'ProductHunt & Startups'
];

export function VeilleWizard({ onComplete, isLoading }: VeilleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VeilleFormData>({
    secteur: '',
    zone: '',
    objectif: '',
    typeOpportunite: [],
    budgetRessources: '',
    frequenceVeille: '',
    canauxVeille: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      id: 1,
      title: 'Secteur',
      icon: Briefcase,
      description: 'Votre domaine'
    },
    {
      id: 2,
      title: 'Zone',
      icon: Globe,
      description: 'Géographie cible'
    },
    {
      id: 3,
      title: 'Objectif',
      icon: Target,
      description: 'But de la veille'
    },
    {
      id: 4,
      title: 'Type',
      icon: Radio,
      description: 'Opportunités recherchées'
    },
    {
      id: 5,
      title: 'Budget',
      icon: DollarSign,
      description: 'Ressources disponibles'
    },
    {
      id: 6,
      title: 'Fréquence',
      icon: Clock,
      description: 'Rythme de veille'
    },
    {
      id: 7,
      title: 'Canaux',
      icon: Radio,
      description: 'Sources d\'information'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.secteur.trim()) {
          newErrors.secteur = 'Le secteur est requis';
        }
        break;
      case 2:
        if (!formData.zone.trim()) {
          newErrors.zone = 'La zone géographique est requise';
        }
        break;
      case 3:
        if (!formData.objectif.trim()) {
          newErrors.objectif = 'L\'objectif est requis';
        }
        break;
      case 4:
        if (formData.typeOpportunite.length === 0) {
          newErrors.typeOpportunite = 'Sélectionnez au moins un type d\'opportunité';
        }
        break;
      case 5:
        if (!formData.budgetRessources.trim()) {
          newErrors.budgetRessources = 'Le budget/ressources est requis';
        }
        break;
      case 6:
        if (!formData.frequenceVeille.trim()) {
          newErrors.frequenceVeille = 'La fréquence est requise';
        }
        break;
      case 7:
        if (formData.canauxVeille.length === 0) {
          newErrors.canauxVeille = 'Sélectionnez au moins un canal de veille';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem('dropskills_veille_form_data', JSON.stringify(formData));
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof VeilleFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayToggle = (field: 'typeOpportunite' | 'canauxVeille', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleInputChange(field, newArray);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Dans quel secteur opérez-vous ?
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Votre domaine d'activité principal
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SECTEUR_OPTIONS.map((secteur) => (
                  <button
                    key={secteur}
                    type="button"
                    onClick={() => handleInputChange('secteur', secteur)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.secteur === secteur
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {secteur}
                  </button>
                ))}
              </div>
              {formData.secteur === 'Autre' && (
                <input
                  type="text"
                  placeholder="Précisez votre secteur..."
                  onChange={(e) => handleInputChange('secteur', e.target.value)}
                  className="mt-3 w-full px-4 py-2 bg-[#1a1a1a] border border-[#232323] text-white rounded-lg focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
                />
              )}
              {errors.secteur && (
                <p className="text-red-500 text-sm mt-2">{errors.secteur}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Zone géographique cible
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Où cherchez-vous des opportunités ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ZONE_OPTIONS.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => handleInputChange('zone', zone)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.zone === zone
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
              {errors.zone && (
                <p className="text-red-500 text-sm mt-2">{errors.zone}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Objectif principal de votre veille
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Que voulez-vous accomplir ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {OBJECTIF_OPTIONS.map((objectif) => (
                  <button
                    key={objectif}
                    type="button"
                    onClick={() => handleInputChange('objectif', objectif)}
                    className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.objectif === objectif
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {objectif}
                  </button>
                ))}
              </div>
              {errors.objectif && (
                <p className="text-red-500 text-sm mt-2">{errors.objectif}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Types d'opportunités recherchées
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Sélectionnez plusieurs options
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {TYPE_OPPORTUNITE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleArrayToggle('typeOpportunite', type)}
                    className={`w-full p-3 text-sm rounded-lg border transition-all text-left flex items-center justify-between ${
                      formData.typeOpportunite.includes(type)
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    <span>{type}</span>
                    {formData.typeOpportunite.includes(type) && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
              {errors.typeOpportunite && (
                <p className="text-red-500 text-sm mt-2">{errors.typeOpportunite}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Sélectionnez 2-4 types pour des résultats ciblés
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Budget/Ressources disponibles
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Pour exploiter les opportunités
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => handleInputChange('budgetRessources', budget)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.budgetRessources === budget
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
              {errors.budgetRessources && (
                <p className="text-red-500 text-sm mt-2">{errors.budgetRessources}</p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Fréquence de veille souhaitée
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    À quelle fréquence voulez-vous des mises à jour ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {FREQUENCE_OPTIONS.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => handleInputChange('frequenceVeille', freq)}
                    className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.frequenceVeille === freq
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
              {errors.frequenceVeille && (
                <p className="text-red-500 text-sm mt-2">{errors.frequenceVeille}</p>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Canaux de veille préférés
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Où chercher les informations ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CANAUX_VEILLE_OPTIONS.map((canal) => (
                  <button
                    key={canal}
                    type="button"
                    onClick={() => handleArrayToggle('canauxVeille', canal)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left flex items-center justify-between ${
                      formData.canauxVeille.includes(canal)
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    <span>{canal}</span>
                    {formData.canauxVeille.includes(canal) && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
              {errors.canauxVeille && (
                <p className="text-red-500 text-sm mt-2">{errors.canauxVeille}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Sélectionnez 3-5 canaux pour une veille efficace
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#111111] rounded-xl shadow-lg p-8 border border-[#232323]">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-400">
            Étape {currentStep} sur 7
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / 7) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-[#232323] rounded-full h-2">
          <div 
            className="bg-[#ff0033] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-1 min-w-0 ${
                  isActive ? 'text-[#ff0033]' : isCompleted ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  isActive ? 'bg-[#ff0033]/20' : isCompleted ? 'bg-green-500/20' : 'bg-[#232323]'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {steps[currentStep - 1].title}
        </h2>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 text-gray-400 bg-[#1a1a1a] rounded-lg hover:bg-[#232323] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-[#ff0033] text-white rounded-lg hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <span>{currentStep === 7 ? 'Lancer l\'analyse' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 