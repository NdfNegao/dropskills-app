'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Users, DollarSign, MapPin, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';
import { ICPFormData } from '@/app/outils/icp-maker/page';

interface ICPWizardProps {
  onComplete: (data: ICPFormData) => void;
  isLoading: boolean;
}

const CANAUX_OPTIONS = [
  'Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'TikTok', 
  'YouTube', 'Email Marketing', 'SEO/Blog', 'Webinaires', 'Podcasts',
  'Événements', 'Partenariats', 'Bouche-à-oreille', 'Affiliation'
];

const TONALITE_OPTIONS = [
  'Professionnel et expert', 'Amical et accessible', 'Inspirant et motivant',
  'Direct et sans détour', 'Éducatif et pédagogue', 'Luxe et premium',
  'Jeune et dynamique', 'Rassurant et bienveillant'
];

export function ICPWizard({ onComplete, isLoading }: ICPWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ICPFormData>({
    secteur: '',
    produitService: '',
    promesseUnique: '',
    budgetCible: '',
    canaux: [],
    zoneGeographique: '',
    tonalite: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      id: 1,
      title: 'Secteur d\'activité',
      icon: Target,
      description: 'Définissez votre marché'
    },
    {
      id: 2,
      title: 'Produit/Service',
      icon: Sparkles,
      description: 'Décrivez votre offre'
    },
    {
      id: 3,
      title: 'Promesse unique',
      icon: MessageSquare,
      description: 'Votre valeur ajoutée'
    },
    {
      id: 4,
      title: 'Budget cible',
      icon: DollarSign,
      description: 'Capacité d\'investissement'
    },
    {
      id: 5,
      title: 'Canaux marketing',
      icon: Users,
      description: 'Où toucher vos clients'
    },
    {
      id: 6,
      title: 'Zone géographique',
      icon: MapPin,
      description: 'Votre territoire'
    },
    {
      id: 7,
      title: 'Tonalité',
      icon: MessageSquare,
      description: 'Style de communication'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.secteur.trim()) {
          newErrors.secteur = 'Le secteur d\'activité est requis';
        }
        break;
      case 2:
        if (!formData.produitService.trim()) {
          newErrors.produitService = 'La description du produit/service est requise';
        }
        break;
      case 3:
        if (!formData.promesseUnique.trim()) {
          newErrors.promesseUnique = 'La promesse unique est requise';
        }
        break;
      case 4:
        if (!formData.budgetCible.trim()) {
          newErrors.budgetCible = 'Le budget cible est requis';
        }
        break;
      case 5:
        if (formData.canaux.length === 0) {
          newErrors.canaux = 'Sélectionnez au moins un canal';
        }
        break;
      case 6:
        if (!formData.zoneGeographique.trim()) {
          newErrors.zoneGeographique = 'La zone géographique est requise';
        }
        break;
      case 7:
        if (!formData.tonalite.trim()) {
          newErrors.tonalite = 'La tonalité est requise';
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
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof ICPFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCanalToggle = (canal: string) => {
    const newCanaux = formData.canaux.includes(canal)
      ? formData.canaux.filter((c: string) => c !== canal)
      : [...formData.canaux, canal];
    
    handleInputChange('canaux', newCanaux);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secteur d'activité / Marché
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Ex: E-commerce, SaaS, Formation, Coaching, etc.
                  </div>
                </div>
              </label>
              <input
                type="text"
                value={formData.secteur}
                onChange={(e) => handleInputChange('secteur', e.target.value)}
                placeholder="Ex: Formation en ligne, E-commerce mode, Coaching business..."
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.secteur ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.secteur && (
                <p className="text-red-500 text-sm mt-1">{errors.secteur}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Produit/Service
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Décrivez précisément ce que vous vendez
                  </div>
                </div>
              </label>
              <textarea
                value={formData.produitService}
                onChange={(e) => handleInputChange('produitService', e.target.value)}
                placeholder="Ex: Formation complète pour créer et vendre des produits digitaux, incluant templates, vidéos et accompagnement..."
                rows={4}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.produitService ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.produitService && (
                <p className="text-red-500 text-sm mt-1">{errors.produitService}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Promesse unique
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Qu'est-ce qui vous différencie de la concurrence ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.promesseUnique}
                onChange={(e) => handleInputChange('promesseUnique', e.target.value)}
                placeholder="Ex: La seule méthode qui garantit 1000€ de revenus passifs en 90 jours, même sans expérience technique..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.promesseUnique ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.promesseUnique && (
                <p className="text-red-500 text-sm mt-1">{errors.promesseUnique}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget cible du client
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Combien vos clients peuvent-ils investir ?
                  </div>
                </div>
              </label>
              <input
                type="text"
                value={formData.budgetCible}
                onChange={(e) => handleInputChange('budgetCible', e.target.value)}
                placeholder="Ex: 500-2000€, 50-200€/mois, Budget limité (<100€)..."
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.budgetCible ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.budgetCible && (
                <p className="text-red-500 text-sm mt-1">{errors.budgetCible}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Canaux marketing envisagés
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Sélectionnez tous les canaux pertinents
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CANAUX_OPTIONS.map((canal) => (
                  <button
                    key={canal}
                    type="button"
                    onClick={() => handleCanalToggle(canal)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.canaux.includes(canal)
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {canal}
                  </button>
                ))}
              </div>
              {errors.canaux && (
                <p className="text-red-500 text-sm mt-2">{errors.canaux}</p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zone géographique
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Où se trouvent vos clients cibles ?
                  </div>
                </div>
              </label>
              <input
                type="text"
                value={formData.zoneGeographique}
                onChange={(e) => handleInputChange('zoneGeographique', e.target.value)}
                placeholder="Ex: France, Europe francophone, International, Paris et région..."
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.zoneGeographique ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.zoneGeographique && (
                <p className="text-red-500 text-sm mt-1">{errors.zoneGeographique}</p>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Tonalité souhaitée
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Comment voulez-vous communiquer avec vos clients ?
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TONALITE_OPTIONS.map((tonalite) => (
                  <button
                    key={tonalite}
                    type="button"
                    onClick={() => handleInputChange('tonalite', tonalite)}
                    className={`p-3 text-sm rounded-lg border transition-all text-left ${
                      formData.tonalite === tonalite
                        ? 'bg-[#ff0033] text-white border-[#ff0033]'
                        : 'bg-[#1a1a1a] text-gray-300 border-[#232323] hover:border-[#ff0033]/50'
                    }`}
                  >
                    {tonalite}
                  </button>
                ))}
              </div>
              {errors.tonalite && (
                <p className="text-red-500 text-sm mt-2">{errors.tonalite}</p>
              )}
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
            Étape {currentStep} sur 7
          </span>
          <span className="text-sm font-medium text-gray-400">
            {Math.round((currentStep / 7) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-[#232323] rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isActive ? 'bg-blue-500 text-white' : 
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
          {steps[currentStep - 1]?.title || 'Étape'}
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
              <span>{currentStep === 7 ? 'Générer l\'ICP' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}