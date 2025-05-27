'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, AlertTriangle, Zap, Trophy, Users, MessageSquare, Settings, CheckCircle } from 'lucide-react';
import { USPFormData } from '@/app/outils/usp-maker/page';

interface USPWizardProps {
  onComplete: (data: USPFormData) => void;
  isLoading: boolean;
  icpData?: any;
}

const TONALITE_OPTIONS = [
  'Professionnel et expert', 'Amical et accessible', 'Inspirant et motivant',
  'Direct et sans détour', 'Éducatif et pédagogue', 'Luxe et premium',
  'Jeune et dynamique', 'Rassurant et bienveillant', 'Provocateur et disruptif'
];

export function USPWizard({ onComplete, isLoading, icpData }: USPWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<USPFormData>({
    resultatPromesse: '',
    problemePrincipal: '',
    differenceUnique: '',
    preuveArgument: '',
    concurrents: '',
    clientIdeal: '',
    tonalite: '',
    contraintes: ''
  });

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

  const steps = [
    {
      id: 1,
      title: 'Résultat/Promesse',
      icon: Target,
      description: 'Que promettez-vous ?'
    },
    {
      id: 2,
      title: 'Problème principal',
      icon: AlertTriangle,
      description: 'Quel problème résolvez-vous ?'
    },
    {
      id: 3,
      title: 'Différence unique',
      icon: Zap,
      description: 'Votre avantage concurrentiel'
    },
    {
      id: 4,
      title: 'Preuve/Argument',
      icon: Trophy,
      description: 'Votre crédibilité'
    },
    {
      id: 5,
      title: 'Concurrents',
      icon: Users,
      description: 'Votre environnement'
    },
    {
      id: 6,
      title: 'Client idéal',
      icon: Users,
      description: 'Votre cible'
    },
    {
      id: 7,
      title: 'Tonalité',
      icon: MessageSquare,
      description: 'Votre style'
    },
    {
      id: 8,
      title: 'Contraintes',
      icon: Settings,
      description: 'Vos spécificités'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.resultatPromesse.trim()) {
          newErrors.resultatPromesse = 'Le résultat/promesse est requis';
        }
        break;
      case 2:
        if (!formData.problemePrincipal.trim()) {
          newErrors.problemePrincipal = 'Le problème principal est requis';
        }
        break;
      case 3:
        if (!formData.differenceUnique.trim()) {
          newErrors.differenceUnique = 'La différence unique est requise';
        }
        break;
      case 4:
        if (!formData.preuveArgument.trim()) {
          newErrors.preuveArgument = 'La preuve/argument est requise';
        }
        break;
      case 5:
        if (!formData.concurrents.trim()) {
          newErrors.concurrents = 'Les informations sur les concurrents sont requises';
        }
        break;
      case 6:
        if (!formData.clientIdeal.trim()) {
          newErrors.clientIdeal = 'La description du client idéal est requise';
        }
        break;
      case 7:
        if (!formData.tonalite.trim()) {
          newErrors.tonalite = 'La tonalité est requise';
        }
        break;
      // Étape 8 (contraintes) est optionnelle
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      } else {
        // Sauvegarder les données du formulaire
        localStorage.setItem('dropskills_usp_form_data', JSON.stringify(formData));
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof USPFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Résultat/Promesse principale
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quel résultat concret obtiendront vos clients ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.resultatPromesse}
                onChange={(e) => handleInputChange('resultatPromesse', e.target.value)}
                placeholder="Ex: Générer 5000€ de revenus passifs en 90 jours, Perdre 10kg sans régime strict, Automatiser 80% de votre marketing..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.resultatPromesse ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.resultatPromesse && (
                <p className="text-red-500 text-sm mt-1">{errors.resultatPromesse}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Soyez spécifique et quantifiable. Évitez les promesses vagues.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problème principal que vous résolvez
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quelle douleur/frustration éliminez-vous ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.problemePrincipal}
                onChange={(e) => handleInputChange('problemePrincipal', e.target.value)}
                placeholder="Ex: Les entrepreneurs perdent des heures à créer du contenu, Les régimes traditionnels sont impossibles à suivre, Le marketing coûte cher et ne convertit pas..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.problemePrincipal ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.problemePrincipal && (
                <p className="text-red-500 text-sm mt-1">{errors.problemePrincipal}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Décrivez la frustration émotionnelle, pas juste le problème technique.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Votre différence principale/offre unique
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Qu'est-ce qui vous rend unique vs la concurrence ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.differenceUnique}
                onChange={(e) => handleInputChange('differenceUnique', e.target.value)}
                placeholder="Ex: La seule méthode qui utilise l'IA pour automatiser, Approche basée sur 15 ans d'expérience terrain, Système breveté en 3 étapes..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.differenceUnique ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.differenceUnique && (
                <p className="text-red-500 text-sm mt-1">{errors.differenceUnique}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Votre avantage concurrentiel doit être défendable et vérifiable.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preuve/Argument phare
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Quelle preuve renforce votre crédibilité ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.preuveArgument}
                onChange={(e) => handleInputChange('preuveArgument', e.target.value)}
                placeholder="Ex: +10 000 clients satisfaits, Utilisé par Google et Microsoft, 97% de taux de réussite prouvé, Certifié par l'État..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.preuveArgument ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.preuveArgument && (
                <p className="text-red-500 text-sm mt-1">{errors.preuveArgument}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Chiffres, témoignages, certifications, références... Tout ce qui rassure.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Principaux concurrents
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Qui sont vos concurrents directs et indirects ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.concurrents}
                onChange={(e) => handleInputChange('concurrents', e.target.value)}
                placeholder="Ex: Systeme.io, ClickFunnels, les coachs traditionnels, les solutions maison, ne rien faire..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.concurrents ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.concurrents && (
                <p className="text-red-500 text-sm mt-1">{errors.concurrents}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Incluez les alternatives indirectes (ne rien faire, solutions gratuites...).
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client idéal (persona)
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Qui est votre client parfait ?
                  </div>
                </div>
              </label>
              <textarea
                value={formData.clientIdeal}
                onChange={(e) => handleInputChange('clientIdeal', e.target.value)}
                placeholder="Ex: Entrepreneur 30-45 ans, CA 50-200k€, veut automatiser son business, tech-friendly mais pas développeur..."
                rows={3}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all ${
                  errors.clientIdeal ? 'border-red-500' : 'border-[#232323]'
                }`}
              />
              {errors.clientIdeal && (
                <p className="text-red-500 text-sm mt-1">{errors.clientIdeal}</p>
              )}
              {icpData && (
                <p className="text-green-500 text-xs mt-2">
                  ✅ Pré-rempli avec vos données ICP
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                💡 Plus c'est précis, plus l'USP sera adaptée et percutante.
              </p>
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
                    Quel style de communication voulez-vous ?
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

      case 8:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraintes optionnelles
                <div className="inline-flex items-center ml-2 group relative">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Mots à éviter, contraintes légales, spécificités...
                  </div>
                </div>
              </label>
              <textarea
                value={formData.contraintes}
                onChange={(e) => handleInputChange('contraintes', e.target.value)}
                placeholder="Ex: Éviter le mot 'garantie', Respecter la réglementation santé, Ne pas mentionner la concurrence, Rester sous 15 mots..."
                rows={3}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">
                💡 Optionnel - Toute contrainte spécifique à respecter dans votre USP.
              </p>
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
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                ${isActive ? 'bg-purple-500 text-white' : 
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
              <span>{currentStep === 8 ? 'Générer l\'USP' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 