'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Package, Users, AlertTriangle, Hash, MessageSquare, Gift, MousePointer, CheckCircle } from 'lucide-react';
import { EmailFormData } from '@/app/outils/copymoneymail/page';

interface EmailWizardProps {
  onComplete: (data: EmailFormData) => void;
  isLoading: boolean;
  icpData?: any;
  uspData?: any;
  tunnelData?: any;
}

const OBJECTIF_SEQUENCE_OPTIONS = [
  'Convertir des prospects en clients',
  'Nurturing post-inscription',
  'Lancement de produit',
  'Réactivation clients inactifs',
  'Upsell/Cross-sell',
  'Onboarding nouveaux clients',
  'Webinaire/Événement',
  'Fidélisation et rétention'
];

const TONALITE_OPTIONS = [
  'Professionnel et expert',
  'Amical et conversationnel',
  'Urgent et persuasif',
  'Éducatif et informatif',
  'Inspirant et motivant',
  'Direct et sans détour',
  'Humoristique et léger',
  'Premium et exclusif'
];

const CTA_OPTIONS = [
  'Acheter maintenant',
  'Réserver un appel',
  'S\'inscrire au webinaire',
  'Télécharger la ressource',
  'Commencer l\'essai gratuit',
  'Rejoindre la communauté',
  'Obtenir le guide',
  'Profiter de l\'offre'
];

export function EmailWizard({ onComplete, isLoading, icpData, uspData, tunnelData }: EmailWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmailFormData>({
    objectifSequence: '',
    offreProduitService: '',
    icpCible: '',
    painPoints: '',
    nombreEmails: 5,
    tonaliteStyle: '',
    bonusContent: '',
    callToAction: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pré-remplir avec les données ICP, USP et Tunnel si disponibles
  useEffect(() => {
    if (icpData || uspData || tunnelData) {
      setFormData(prev => ({
        ...prev,
        offreProduitService: uspData?.uspPrincipale || tunnelData?.schemaTunnel?.description || '',
        icpCible: icpData?.ficheActionable?.resumeExecutif || 
                  `${icpData?.profilSociodemographique?.age || ''}, ${icpData?.profilSociodemographique?.situationPro || ''}`,
        painPoints: icpData?.problemePrincipaux?.slice(0, 3).join(', ') || '',
        tonaliteStyle: icpData?.messagingImpactant?.styleDiscours || uspData?.conseilUtilisation?.tonalite || '',
        nombreEmails: tunnelData?.sequenceEmail?.emails?.length || 5
      }));
    }
  }, [icpData, uspData, tunnelData]);

  const steps = [
    {
      id: 1,
      title: 'Objectif',
      icon: Target,
      description: 'But de la séquence'
    },
    {
      id: 2,
      title: 'Offre',
      icon: Package,
      description: 'Votre produit/service'
    },
    {
      id: 3,
      title: 'Cible',
      icon: Users,
      description: 'Votre ICP'
    },
    {
      id: 4,
      title: 'Pain Points',
      icon: AlertTriangle,
      description: 'Problèmes à résoudre'
    },
    {
      id: 5,
      title: 'Nombre',
      icon: Hash,
      description: 'Emails dans la séquence'
    },
    {
      id: 6,
      title: 'Tonalité',
      icon: MessageSquare,
      description: 'Style de communication'
    },
    {
      id: 7,
      title: 'Bonus',
      icon: Gift,
      description: 'Contenus additionnels'
    },
    {
      id: 8,
      title: 'CTA',
      icon: MousePointer,
      description: 'Action attendue'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.objectifSequence.trim()) {
          newErrors.objectifSequence = 'L\'objectif de la séquence est requis';
        }
        break;
      case 2:
        if (!formData.offreProduitService.trim()) {
          newErrors.offreProduitService = 'La description de l\'offre est requise';
        }
        break;
      case 3:
        if (!formData.icpCible.trim()) {
          newErrors.icpCible = 'La description de la cible est requise';
        }
        break;
      case 4:
        if (!formData.painPoints.trim()) {
          newErrors.painPoints = 'Les pain points sont requis';
        }
        break;
      case 5:
        if (formData.nombreEmails < 1 || formData.nombreEmails > 30) {
          newErrors.nombreEmails = 'Le nombre d\'emails doit être entre 1 et 30';
        }
        break;
      case 6:
        if (!formData.tonaliteStyle.trim()) {
          newErrors.tonaliteStyle = 'La tonalité est requise';
        }
        break;
      case 8:
        if (!formData.callToAction.trim()) {
          newErrors.callToAction = 'Le call-to-action est requis';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem('dropskills_email_form_data', JSON.stringify(formData));
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof EmailFormData, value: string | number) => {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Objectif principal de la séquence email
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Que voulez-vous accomplir avec cette séquence ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {OBJECTIF_SEQUENCE_OPTIONS.map((objectif) => (
                  <button
                    key={objectif}
                    type="button"
                    onClick={() => handleInputChange('objectifSequence', objectif)}
                    className={`p-4 text-sm rounded-lg border transition-all text-left ${
                      formData.objectifSequence === objectif
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {objectif}
                  </button>
                ))}
              </div>
              {errors.objectifSequence && (
                <p className="text-red-500 text-sm mt-2">{errors.objectifSequence}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offre/Produit/Service
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Décrivez ce que vous vendez ou proposez
                  </div>
                </div>
              </label>
              <textarea
                value={formData.offreProduitService}
                onChange={(e) => handleInputChange('offreProduitService', e.target.value)}
                placeholder="Ex: Formation complète en marketing digital à 997€, Coaching business 1-to-1, SaaS de gestion de projet à 49€/mois..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.offreProduitService ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.offreProduitService && (
                <p className="text-red-500 text-sm mt-1">{errors.offreProduitService}</p>
              )}
              {uspData && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec votre USP
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Incluez le prix et les bénéfices principaux.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICP/Cible (Client Idéal)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    À qui s'adresse cette séquence ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.icpCible}
                onChange={(e) => handleInputChange('icpCible', e.target.value)}
                placeholder="Ex: Entrepreneurs 30-45 ans, CA 50-200k€, veulent automatiser leur business, tech-friendly mais pas développeurs..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.icpCible ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.icpCible && (
                <p className="text-red-500 text-sm mt-1">{errors.icpCible}</p>
              )}
              {icpData && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec vos données ICP
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Plus c'est précis, plus les emails seront pertinents.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Points principaux
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quels problèmes votre cible rencontre-t-elle ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.painPoints}
                onChange={(e) => handleInputChange('painPoints', e.target.value)}
                placeholder="Ex: Perd 3h/jour en tâches répétitives, Ne sait pas comment automatiser, Peur de la technique, Budget limité..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.painPoints ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.painPoints && (
                <p className="text-red-500 text-sm mt-1">{errors.painPoints}</p>
              )}
              {icpData && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec les problèmes identifiés dans l'ICP
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Listez 3-5 frustrations majeures de votre cible.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'emails dans la séquence
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien d'emails voulez-vous générer ?
                  </div>
                </div>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.nombreEmails}
                  onChange={(e) => handleInputChange('nombreEmails', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-16 text-center">
                  <span className="text-2xl font-bold text-indigo-600">{formData.nombreEmails}</span>
                  <p className="text-xs text-gray-500">emails</p>
                </div>
              </div>
              {errors.nombreEmails && (
                <p className="text-red-500 text-sm mt-2">{errors.nombreEmails}</p>
              )}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('nombreEmails', 5)}
                  className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  5 emails (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('nombreEmails', 7)}
                  className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  7 emails (Complet)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('nombreEmails', 14)}
                  className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  14 emails (Long)
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                💡 5-7 emails est optimal pour la plupart des séquences.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tonalité/Style de communication
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Comment voulez-vous parler à votre audience ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TONALITE_OPTIONS.map((tonalite) => (
                  <button
                    key={tonalite}
                    type="button"
                    onClick={() => handleInputChange('tonaliteStyle', tonalite)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.tonaliteStyle === tonalite
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {tonalite}
                  </button>
                ))}
              </div>
              {errors.tonaliteStyle && (
                <p className="text-red-500 text-sm mt-2">{errors.tonaliteStyle}</p>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bonus (témoignages, FAQ, objections)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Éléments additionnels à inclure dans les emails
                  </div>
                </div>
              </label>
              <textarea
                value={formData.bonusContent}
                onChange={(e) => handleInputChange('bonusContent', e.target.value)}
                placeholder="Ex: Témoignage de Jean qui a gagné 10k€, FAQ sur le temps nécessaire, Objection sur le prix, Garantie 30 jours, Bonus exclusif..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-gray-500 text-xs mt-2">
                💡 Optionnel - Ces éléments seront intégrés intelligemment dans la séquence.
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Call-to-Action principal
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quelle action voulez-vous que vos lecteurs fassent ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CTA_OPTIONS.map((cta) => (
                  <button
                    key={cta}
                    type="button"
                    onClick={() => handleInputChange('callToAction', cta)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.callToAction === cta
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {cta}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={formData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  placeholder="Ou entrez votre propre CTA..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.callToAction ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.callToAction && (
                <p className="text-red-500 text-sm mt-2">{errors.callToAction}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Étape {currentStep} sur 8
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / 8) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
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
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  isActive ? 'bg-indigo-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <span>{currentStep === 8 ? 'Générer la Séquence' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 