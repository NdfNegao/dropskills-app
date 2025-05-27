'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Package, Users, Hash, MessageSquare, Image, Calendar, Megaphone, CheckCircle } from 'lucide-react';
import { ContentFormData } from '@/app/outils/content-system/page';

interface ContentWizardProps {
  onComplete: (data: ContentFormData) => void;
  isLoading: boolean;
  icpData?: any;
  uspData?: any;
  tunnelData?: any;
  emailData?: any;
}

const PLATEFORMES_OPTIONS = [
  'LinkedIn', 'Instagram', 'TikTok', 'Twitter/X', 'Facebook',
  'YouTube', 'Newsletter', 'Blog', 'Podcast', 'Pinterest'
];

const FREQUENCE_OPTIONS = [
  '1 post/jour',
  '3-4 posts/semaine',
  '2 posts/semaine',
  '1 post/semaine',
  'Variable selon plateforme'
];

const TON_STYLE_OPTIONS = [
  'Professionnel et expert',
  'Inspirant et motivant',
  'Éducatif et pédagogue',
  'Humoristique et léger',
  'Direct et percutant',
  'Storytelling et émotionnel',
  'Luxe et premium',
  'Jeune et dynamique'
];

export function ContentWizard({ onComplete, isLoading, icpData, uspData, tunnelData, emailData }: ContentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContentFormData>({
    icpCible: '',
    objectifBusiness: '',
    offrePrincipale: '',
    themesAngles: '',
    plateformes: [],
    tonStyle: '',
    ressourcesMedias: '',
    frequence: '',
    evenementsCampagnes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pré-remplir avec les données existantes
  useEffect(() => {
    if (icpData || uspData || tunnelData || emailData) {
      setFormData(prev => ({
        ...prev,
        icpCible: icpData?.ficheActionable?.resumeExecutif || 
                  `${icpData?.profilSociodemographique?.age || ''}, ${icpData?.profilSociodemographique?.situationPro || ''}`,
        offrePrincipale: uspData?.uspPrincipale || tunnelData?.schemaTunnel?.description || '',
        tonStyle: icpData?.messagingImpactant?.styleDiscours || uspData?.conseilUtilisation?.tonalite || '',
        objectifBusiness: tunnelData?.schemaTunnel?.objectifGlobal || emailData?.sequenceInfo?.objectifGlobal || ''
      }));
    }
  }, [icpData, uspData, tunnelData, emailData]);

  const steps = [
    {
      id: 1,
      title: 'ICP/Cible',
      icon: Users,
      description: 'Votre audience'
    },
    {
      id: 2,
      title: 'Objectif',
      icon: Target,
      description: 'But business'
    },
    {
      id: 3,
      title: 'Offre',
      icon: Package,
      description: 'Produit/Service'
    },
    {
      id: 4,
      title: 'Thèmes',
      icon: Hash,
      description: 'Angles de contenu'
    },
    {
      id: 5,
      title: 'Plateformes',
      icon: Megaphone,
      description: 'Canaux de diffusion'
    },
    {
      id: 6,
      title: 'Ton/Style',
      icon: MessageSquare,
      description: 'Voix de marque'
    },
    {
      id: 7,
      title: 'Ressources',
      icon: Image,
      description: 'Médias disponibles'
    },
    {
      id: 8,
      title: 'Planning',
      icon: Calendar,
      description: 'Fréquence & événements'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.icpCible.trim()) {
          newErrors.icpCible = 'La description de la cible est requise';
        }
        break;
      case 2:
        if (!formData.objectifBusiness.trim()) {
          newErrors.objectifBusiness = 'L\'objectif business est requis';
        }
        break;
      case 3:
        if (!formData.offrePrincipale.trim()) {
          newErrors.offrePrincipale = 'L\'offre principale est requise';
        }
        break;
      case 4:
        if (!formData.themesAngles.trim()) {
          newErrors.themesAngles = 'Les thèmes sont requis';
        }
        break;
      case 5:
        if (formData.plateformes.length === 0) {
          newErrors.plateformes = 'Sélectionnez au moins une plateforme';
        }
        break;
      case 6:
        if (!formData.tonStyle.trim()) {
          newErrors.tonStyle = 'Le ton/style est requis';
        }
        break;
      case 8:
        if (!formData.frequence.trim()) {
          newErrors.frequence = 'La fréquence est requise';
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
        localStorage.setItem('dropskills_content_form_data', JSON.stringify(formData));
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof ContentFormData, value: string | string[]) => {
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

  const handlePlateformeToggle = (plateforme: string) => {
    const newPlateformes = formData.plateformes.includes(plateforme)
      ? formData.plateformes.filter(p => p !== plateforme)
      : [...formData.plateformes, plateforme];
    
    handleInputChange('plateformes', newPlateformes);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICP/Cible (Client Idéal)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    À qui s'adresse votre contenu ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.icpCible}
                onChange={(e) => handleInputChange('icpCible', e.target.value)}
                placeholder="Ex: Entrepreneurs 30-45 ans, CA 50-200k€, veulent automatiser leur business, actifs sur LinkedIn et Instagram..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                💡 Plus c'est précis, plus le contenu sera pertinent.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif Business
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Que voulez-vous accomplir avec ce contenu ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.objectifBusiness}
                onChange={(e) => handleInputChange('objectifBusiness', e.target.value)}
                placeholder="Ex: Générer 50 leads qualifiés/mois, Augmenter la notoriété, Vendre 10 formations/semaine, Construire une communauté de 10k..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.objectifBusiness ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.objectifBusiness && (
                <p className="text-red-500 text-sm mt-1">{errors.objectifBusiness}</p>
              )}
              {(tunnelData || emailData) && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec vos objectifs précédents
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offre Principale
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Votre produit/service principal
                  </div>
                </div>
              </label>
              <textarea
                value={formData.offrePrincipale}
                onChange={(e) => handleInputChange('offrePrincipale', e.target.value)}
                placeholder="Ex: Formation en automatisation business à 997€, Coaching 1-to-1, SaaS de gestion, Service de consulting..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.offrePrincipale ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.offrePrincipale && (
                <p className="text-red-500 text-sm mt-1">{errors.offrePrincipale}</p>
              )}
              {uspData && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec votre USP
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thèmes/Angles de contenu
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Sujets principaux à couvrir
                  </div>
                </div>
              </label>
              <textarea
                value={formData.themesAngles}
                onChange={(e) => handleInputChange('themesAngles', e.target.value)}
                placeholder="Ex: Automatisation IA, Productivité, Success stories clients, Tutoriels techniques, Mindset entrepreneur, Tendances du marché..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.themesAngles ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.themesAngles && (
                <p className="text-red-500 text-sm mt-1">{errors.themesAngles}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Listez 5-10 thèmes récurrents pour varier le contenu.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Plateformes de diffusion
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Où publier votre contenu ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PLATEFORMES_OPTIONS.map((plateforme) => (
                  <button
                    key={plateforme}
                    type="button"
                    onClick={() => handlePlateformeToggle(plateforme)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.plateformes.includes(plateforme)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {plateforme}
                  </button>
                ))}
              </div>
              {errors.plateformes && (
                <p className="text-red-500 text-sm mt-2">{errors.plateformes}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Sélectionnez 2-4 plateformes principales pour commencer.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Ton/Style de communication
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Comment parler à votre audience ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TON_STYLE_OPTIONS.map((ton) => (
                  <button
                    key={ton}
                    type="button"
                    onClick={() => handleInputChange('tonStyle', ton)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.tonStyle === ton
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {ton}
                  </button>
                ))}
              </div>
              {errors.tonStyle && (
                <p className="text-red-500 text-sm mt-2">{errors.tonStyle}</p>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ressources médias disponibles
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quels types de contenus pouvez-vous créer ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.ressourcesMedias}
                onChange={(e) => handleInputChange('ressourcesMedias', e.target.value)}
                placeholder="Ex: Photos produits, Vidéos face caméra, Infographies, Screenshots, Témoignages clients, Stock photos, Canva Pro..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-gray-500 text-xs mt-2">
                💡 Optionnel - Aide l'IA à proposer des formats adaptés.
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Fréquence de publication
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien de posts par semaine ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {FREQUENCE_OPTIONS.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => handleInputChange('frequence', freq)}
                    className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.frequence === freq
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
              {errors.frequence && (
                <p className="text-red-500 text-sm mt-2">{errors.frequence}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Événements/Campagnes clés (90 prochains jours)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Lancements, promos, événements spéciaux
                  </div>
                </div>
              </label>
              <textarea
                value={formData.evenementsCampagnes}
                onChange={(e) => handleInputChange('evenementsCampagnes', e.target.value)}
                placeholder="Ex: Lancement formation le 15/02, Black Friday, Webinaire gratuit le 01/03, Sortie podcast mensuel, Challenge 30 jours..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-gray-500 text-xs mt-2">
                💡 Optionnel - L'IA intégrera ces événements dans le calendrier.
              </p>
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
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
                  isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  isActive ? 'bg-green-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
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
          whileHover={{ scale: 1.02, backgroundColor: "#232323" }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 text-gray-400 bg-[#1a1a1a] rounded-lg hover:bg-[#232323] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#cc0029" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-[#ff0033] text-white rounded-lg hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <span>{currentStep === 8 ? 'Générer le Calendrier' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 