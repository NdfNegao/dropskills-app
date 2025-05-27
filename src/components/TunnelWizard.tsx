'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Users, DollarSign, Megaphone, Package, Zap, MessageSquare, Settings, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { TunnelFormData } from '@/app/outils/tunnel-maker/page';

interface TunnelWizardProps {
  onComplete: (data: TunnelFormData) => void;
  isLoading: boolean;
  icpData?: any;
  uspData?: any;
}

const OBJECTIF_TUNNEL_OPTIONS = [
  'Générer des leads qualifiés',
  'Vendre un produit/service directement',
  'Construire une liste email',
  'Éduquer avant de vendre',
  'Lancer un nouveau produit',
  'Réactiver des prospects froids'
];

const MATURITE_AUDIENCE_OPTIONS = [
  'Froide (ne connaît pas le problème)',
  'Tiède (connaît le problème, cherche des solutions)',
  'Chaude (prête à acheter, compare les options)',
  'Mixte (audience variée)'
];

const CANAUX_ENTREE_OPTIONS = [
  'Facebook Ads', 'Google Ads', 'LinkedIn Ads', 'Instagram', 'TikTok',
  'YouTube', 'SEO/Blog', 'Email Marketing', 'Webinaires', 'Podcasts',
  'Partenariats', 'Bouche-à-oreille', 'Événements', 'Affiliation'
];

const LONGUEUR_TUNNEL_OPTIONS = [
  'Court (1-3 étapes) - Conversion rapide',
  'Moyen (4-6 étapes) - Équilibré',
  'Long (7+ étapes) - Nurturing approfondi'
];

const AUTOMATISATION_OPTIONS = [
  'Minimale (emails de base)',
  'Modérée (séquences email + chatbot)',
  'Avancée (IA, scoring, personnalisation)',
  'Complète (tout automatisé)'
];

export function TunnelWizard({ onComplete, isLoading, icpData, uspData }: TunnelWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TunnelFormData>({
    offreProduitService: '',
    objectifTunnel: '',
    maturiteAudience: '',
    budgetCible: '',
    canauxEntree: [],
    actifsExistants: '',
    automatisationDesiree: '',
    tonaliteStyle: '',
    longueurTunnel: '',
    inclureUpsell: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pré-remplir avec les données ICP et USP si disponibles
  useEffect(() => {
    if (icpData || uspData) {
      setFormData(prev => ({
        ...prev,
        budgetCible: icpData?.budgetPouvoirAchat?.budgetTypique || '',
        tonaliteStyle: icpData?.messagingImpactant?.styleDiscours || uspData?.conseilUtilisation?.tonalite || '',
        offreProduitService: uspData?.uspPrincipale || ''
      }));
    }
  }, [icpData, uspData]);

  const steps = [
    {
      id: 1,
      title: 'Offre/Produit',
      icon: Package,
      description: 'Votre offre principale'
    },
    {
      id: 2,
      title: 'Objectif tunnel',
      icon: Target,
      description: 'But du tunnel'
    },
    {
      id: 3,
      title: 'Maturité audience',
      icon: Users,
      description: 'Niveau de conscience'
    },
    {
      id: 4,
      title: 'Budget cible',
      icon: DollarSign,
      description: 'Capacité d\'investissement'
    },
    {
      id: 5,
      title: 'Canaux d\'entrée',
      icon: Megaphone,
      description: 'Sources de trafic'
    },
    {
      id: 6,
      title: 'Actifs existants',
      icon: Package,
      description: 'Ressources disponibles'
    },
    {
      id: 7,
      title: 'Automatisation',
      icon: Zap,
      description: 'Niveau souhaité'
    },
    {
      id: 8,
      title: 'Paramètres',
      icon: Settings,
      description: 'Finalisation'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.offreProduitService.trim()) {
          newErrors.offreProduitService = 'La description de l\'offre est requise';
        }
        break;
      case 2:
        if (!formData.objectifTunnel.trim()) {
          newErrors.objectifTunnel = 'L\'objectif du tunnel est requis';
        }
        break;
      case 3:
        if (!formData.maturiteAudience.trim()) {
          newErrors.maturiteAudience = 'La maturité de l\'audience est requise';
        }
        break;
      case 4:
        if (!formData.budgetCible.trim()) {
          newErrors.budgetCible = 'Le budget cible est requis';
        }
        break;
      case 5:
        if (formData.canauxEntree.length === 0) {
          newErrors.canauxEntree = 'Sélectionnez au moins un canal d\'entrée';
        }
        break;
      case 6:
        if (!formData.actifsExistants.trim()) {
          newErrors.actifsExistants = 'Les actifs existants sont requis';
        }
        break;
      case 7:
        if (!formData.automatisationDesiree.trim()) {
          newErrors.automatisationDesiree = 'Le niveau d\'automatisation est requis';
        }
        break;
      case 8:
        if (!formData.longueurTunnel.trim()) {
          newErrors.longueurTunnel = 'La longueur du tunnel est requise';
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
        localStorage.setItem('dropskills_tunnel_form_data', JSON.stringify(formData));
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof TunnelFormData, value: string | string[] | boolean) => {
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

  const handleCanalToggle = (canal: string) => {
    const newCanaux = formData.canauxEntree.includes(canal)
      ? formData.canauxEntree.filter(c => c !== canal)
      : [...formData.canauxEntree, canal];
    
    handleInputChange('canauxEntree', newCanaux);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offre/Produit/Service
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Décrivez précisément ce que vous vendez
                  </div>
                </div>
              </label>
              <textarea
                value={formData.offreProduitService}
                onChange={(e) => handleInputChange('offreProduitService', e.target.value)}
                placeholder="Ex: Formation complète en marketing digital, Coaching business 1-to-1, SaaS de gestion de projet, E-book sur l'investissement..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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
                💡 Plus c'est détaillé, plus le tunnel sera adapté à votre offre.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Objectif principal du tunnel
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quel est le but principal de votre tunnel ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {OBJECTIF_TUNNEL_OPTIONS.map((objectif) => (
                  <button
                    key={objectif}
                    type="button"
                    onClick={() => handleInputChange('objectifTunnel', objectif)}
                    className={`p-4 text-sm rounded-lg border transition-all text-left ${
                      formData.objectifTunnel === objectif
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {objectif}
                  </button>
                ))}
              </div>
              {errors.objectifTunnel && (
                <p className="text-red-500 text-sm mt-2">{errors.objectifTunnel}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Maturité de votre audience
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    À quel point votre audience connaît-elle son problème ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {MATURITE_AUDIENCE_OPTIONS.map((maturite) => (
                  <button
                    key={maturite}
                    type="button"
                    onClick={() => handleInputChange('maturiteAudience', maturite)}
                    className={`w-full p-4 text-sm rounded-lg border transition-all text-left ${
                      formData.maturiteAudience === maturite
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {maturite}
                  </button>
                ))}
              </div>
              {errors.maturiteAudience && (
                <p className="text-red-500 text-sm mt-2">{errors.maturiteAudience}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget cible de vos clients
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien vos clients peuvent-ils investir ?
                  </div>
                </div>
              </label>
              <input
                type="text"
                value={formData.budgetCible}
                onChange={(e) => handleInputChange('budgetCible', e.target.value)}
                placeholder="Ex: 100-500€, 1000-5000€, 50€/mois, Budget limité..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.budgetCible ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.budgetCible && (
                <p className="text-red-500 text-sm mt-1">{errors.budgetCible}</p>
              )}
              {icpData && (
                <p className="text-green-600 text-xs mt-2">
                  ✅ Pré-rempli avec vos données ICP
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Cela influence la structure et la complexité du tunnel.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Canaux d'entrée dans le tunnel
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    D'où viennent vos prospects ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CANAUX_ENTREE_OPTIONS.map((canal) => (
                  <button
                    key={canal}
                    type="button"
                    onClick={() => handleCanalToggle(canal)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.canauxEntree.includes(canal)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {canal}
                  </button>
                ))}
              </div>
              {errors.canauxEntree && (
                <p className="text-red-500 text-sm mt-2">{errors.canauxEntree}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Sélectionnez tous les canaux que vous utilisez ou prévoyez d'utiliser.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actifs existants (contenus, outils, équipe...)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quelles ressources avez-vous déjà ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.actifsExistants}
                onChange={(e) => handleInputChange('actifsExistants', e.target.value)}
                placeholder="Ex: Blog avec 1000 articles, Liste email 5000 contacts, Équipe de 3 personnes, Chatbot configuré, Vidéos YouTube, Témoignages clients..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.actifsExistants ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.actifsExistants && (
                <p className="text-red-500 text-sm mt-1">{errors.actifsExistants}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Listez tout ce que vous avez déjà pour optimiser le tunnel.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Niveau d'automatisation désiré
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien voulez-vous automatiser ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {AUTOMATISATION_OPTIONS.map((auto) => (
                  <button
                    key={auto}
                    type="button"
                    onClick={() => handleInputChange('automatisationDesiree', auto)}
                    className={`w-full p-4 text-sm rounded-lg border transition-all text-left ${
                      formData.automatisationDesiree === auto
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {auto}
                  </button>
                ))}
              </div>
              {errors.automatisationDesiree && (
                <p className="text-red-500 text-sm mt-2">{errors.automatisationDesiree}</p>
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Longueur du tunnel préférée
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien d'étapes voulez-vous ?
                  </div>
                </div>
              </label>
              <div className="space-y-3">
                {LONGUEUR_TUNNEL_OPTIONS.map((longueur) => (
                  <button
                    key={longueur}
                    type="button"
                    onClick={() => handleInputChange('longueurTunnel', longueur)}
                    className={`w-full p-4 text-sm rounded-lg border transition-all text-left ${
                      formData.longueurTunnel === longueur
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {longueur}
                  </button>
                ))}
              </div>
              {errors.longueurTunnel && (
                <p className="text-red-500 text-sm mt-2">{errors.longueurTunnel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Inclure des upsells/cross-sells ?
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Voulez-vous maximiser la valeur par client ?
                  </div>
                </div>
              </label>
              <button
                type="button"
                onClick={() => handleInputChange('inclureUpsell', !formData.inclureUpsell)}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {formData.inclureUpsell ? (
                  <ToggleRight className="w-6 h-6 text-orange-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {formData.inclureUpsell ? 'Oui, inclure des upsells' : 'Non, vente simple'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formData.inclureUpsell 
                      ? 'L\'IA proposera des offres complémentaires'
                      : 'Focus sur la vente principale uniquement'
                    }
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Étape {currentStep} sur 8
          </span>
          <span className="text-sm font-medium text-gray-400">
            {Math.round((currentStep / 8) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-[#232323] rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          
          return (
            <div key={step.id} className="flex flex-col items-center min-w-[60px]">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isActive ? 'bg-orange-500 text-white' : 
                  isCompleted ? 'bg-green-500 text-white' : 
                  'bg-[#232323] text-gray-500'}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs mt-2 text-center ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
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
              <span>{currentStep === 8 ? 'Générer le Tunnel' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 