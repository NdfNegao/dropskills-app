'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import AILoadingLogs from '@/components/AILoadingLogs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OfferData {
  businessType: string;
  targetAudience: string;
  productService: string;
  uniqueValue: string;
  priceRange: string;
  urgency: string;
  tone: string;
}

interface GeneratedOffer {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: string[];
  pricing: {
    original: string;
    current: string;
    savings: string;
  };
  urgency: string;
  guarantee: string;
  cta: string;
  bonuses: string[];
}

const BUSINESS_TYPES = [
  'Formation en ligne',
  'Coaching/Consulting',
  'E-commerce',
  'SaaS/Logiciel',
  'Service local',
  'Agence marketing',
  'Freelance',
  'Autre'
];

const PRICE_RANGES = [
  '0-50€',
  '50-200€',
  '200-500€',
  '500-1000€',
  '1000-2000€',
  '2000€+'
];

const URGENCY_LEVELS = [
  'Aucune urgence',
  'Offre limitée dans le temps',
  'Stock limité',
  'Bonus exclusif',
  'Prix promotionnel'
];

const TONE_OPTIONS = [
  {
    name: 'Professionnel',
    description: 'Ton sérieux et expert',
    example: '"Optimisez votre {businessType} avec {productService} - Une solution éprouvée pour {targetAudience}"'
  },
  {
    name: 'Amical',
    description: 'Ton chaleureux et accessible',
    example: '"Découvrez comment {productService} peut transformer votre {businessType} et ravir {targetAudience} !"'
  },
  {
    name: 'Urgent',
    description: 'Ton pressant et motivant',
    example: '"Dernières heures ! {targetAudience}, ne ratez pas {productService} - Opportunité unique !"'
  },
  {
    name: 'Luxe',
    description: 'Ton exclusif et premium',
    example: '"Une expérience d\'exception : {productService} réservé à une élite de {targetAudience}"'
  },
  {
    name: 'Décontracté',
    description: 'Ton détendu et moderne',
    example: '"Prêt à booster ton {businessType} avec {productService} ? C\'est parti {targetAudience} !"'
  }
];

function GenerateurOffreContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OfferData>({
    businessType: '',
    targetAudience: '',
    productService: '',
    uniqueValue: '',
    priceRange: '',
    urgency: '',
    tone: ''
  });

  const [offerResult, setOfferResult] = useState<GeneratedOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 4;

  const stepTitles = [
    'Business & Audience',
    'Produit & Valeur',
    'Prix & Urgence',
    'Tonalité & Récapitulatif'
  ];
  const [expandedSections, setExpandedSections] = useState({
    business: true,
    audience: false,
    product: false,
    value: false,
    pricing: false,
    urgency: false,
    tone: false
  });

  const handleGenerate = async () => {
    if (!formData.businessType || !formData.targetAudience || !formData.productService) {
      alert('Veuillez remplir au moins le type de business, l\'audience et le produit/service');
      return;
    }

    setIsLoading(true);
    setShowResults(false);
    
    try {
      // Simulation de génération IA avec délai pour les logs
      setTimeout(() => {
        const mockOffer: GeneratedOffer = {
          title: `${formData.productService} - La Solution Complète pour ${formData.targetAudience}`,
          subtitle: `Transformez votre ${formData.businessType.toLowerCase()} avec notre méthode éprouvée`,
          description: `Découvrez comment ${formData.uniqueValue || 'notre solution unique'} peut révolutionner votre approche et vous faire gagner du temps tout en augmentant vos résultats.`,
          benefits: [
            `Économisez 10h par semaine grâce à notre système optimisé`,
            `Augmentez vos revenus de 50% en 3 mois`,
            `Accédez à une communauté exclusive de ${formData.targetAudience.toLowerCase()}`,
            `Bénéficiez d'un support personnalisé 7j/7`
          ],
          features: [
            `Module de formation vidéo (4h de contenu)`,
            `Templates et outils prêts à utiliser`,
            `Accès à vie à la plateforme`,
            `Mises à jour gratuites`,
            `Groupe privé Facebook`
          ],
          pricing: {
            original: formData.priceRange ? `${parseInt(formData.priceRange.split('-')[1] || '500') * 2}€` : '997€',
            current: formData.priceRange.split('-')[1] || '497€',
            savings: '500€'
          },
          urgency: formData.urgency || 'Offre limitée - Plus que 48h !',
          guarantee: 'Garantie satisfait ou remboursé 30 jours',
          cta: 'Je veux transformer mon business maintenant !',
          bonuses: [
            'BONUS #1 : Checklist de lancement (valeur 97€)',
            'BONUS #2 : 1h de coaching personnalisé (valeur 200€)',
            'BONUS #3 : Accès VIP aux futures formations (valeur 300€)'
          ]
        };
        
        setOfferResult(mockOffer);
        
        // Délai pour laisser les logs se terminer avant d'afficher les résultats
        setTimeout(() => {
          setIsLoading(false);
          setShowResults(true);
        }, 500);
        
      }, 7500); // Durée des logs + délai
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'offre');
      setIsLoading(false);
      setShowResults(false);
    }
  };

  const handleInputChange = (field: keyof OfferData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType && formData.targetAudience;
      case 2:
        return formData.productService;
      case 3:
        return formData.priceRange && formData.urgency;
      case 4:
        return formData.tone;
      default:
        return false;
    }
  };

  const isFormComplete = () => {
    return formData.businessType && formData.targetAudience && formData.productService && formData.tone;
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setFormData({
      businessType: '',
      targetAudience: '',
      productService: '',
      uniqueValue: '',
      priceRange: '',
      urgency: '',
      tone: ''
    });
    setOfferResult(null);
    setShowResults(false);
    setCurrentStep(1);
  };

  const handleRegenerate = () => {
    setShowResults(false);
    handleGenerate();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Type de business *</label>
              <div className="grid grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleInputChange('businessType', type)}
                    className={`p-4 rounded-lg border text-sm transition-colors text-left ${
                      formData.businessType === type
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                        : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-3">Audience cible *</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Ex: Entrepreneurs débutants, PME, particuliers..."
                className="w-full p-4 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Produit/Service *</label>
              <textarea
                value={formData.productService}
                onChange={(e) => handleInputChange('productService', e.target.value)}
                placeholder="Décrivez votre produit ou service en quelques mots..."
                rows={4}
                className="w-full p-4 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-3">Proposition de valeur unique</label>
              <input
                type="text"
                value={formData.uniqueValue}
                onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                placeholder="Ce qui vous différencie de la concurrence..."
                className="w-full p-4 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Gamme de prix *</label>
              <div className="grid grid-cols-3 gap-3">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => handleInputChange('priceRange', range)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      formData.priceRange === range
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                        : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-3">Niveau d'urgence *</label>
              <div className="space-y-2">
                {URGENCY_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => handleInputChange('urgency', level)}
                    className={`w-full p-3 rounded-lg border text-sm transition-colors text-left ${
                      formData.urgency === level
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                        : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Tonalité de communication *</label>
              <p className="text-gray-400 text-sm mb-4">Choisissez le style qui correspond à votre marque</p>
              <div className="space-y-3 mb-6">
                {TONE_OPTIONS.map((tone) => {
                  // Personnaliser l'exemple en fonction des données saisies
                  const personalizedExample = tone.example
                    .replace('{productService}', formData.productService || 'votre produit/service')
                    .replace('{targetAudience}', formData.targetAudience || 'votre audience')
                    .replace('{businessType}', formData.businessType || 'votre business');
                  
                  return (
                    <button
                      key={tone.name}
                      onClick={() => handleInputChange('tone', tone.name)}
                      className={`w-full p-4 rounded-lg border transition-colors text-left ${
                        formData.tone === tone.name
                          ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                          : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${
                            formData.tone === tone.name ? 'text-black' : 'text-white'
                          }`}>
                            {tone.name}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            formData.tone === tone.name ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {tone.description}
                          </p>
                        </div>
                        {formData.tone === tone.name && <CheckCircle className="w-5 h-5 text-black" />}
                      </div>
                      <div className={`mt-3 p-3 rounded border-l-4 ${
                        formData.tone === tone.name 
                          ? 'bg-black/20 border-black text-gray-800' 
                          : 'bg-[#0a0a0a] border-[#00D2FF] text-gray-300'
                      }`}>
                        <p className="text-xs opacity-70 mb-1">Exemple personnalisé :</p>
                        <p className="text-sm italic">{personalizedExample}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Récapitulatif */}
              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Récapitulatif de votre offre
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type de business :</span>
                    <span className="text-white">{formData.businessType || 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audience cible :</span>
                    <span className="text-white">{formData.targetAudience || 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Produit/Service :</span>
                    <span className="text-white">{formData.productService ? (formData.productService.length > 30 ? formData.productService.substring(0, 30) + '...' : formData.productService) : 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valeur unique :</span>
                    <span className="text-white">{formData.uniqueValue || 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gamme de prix :</span>
                    <span className="text-white">{formData.priceRange || 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Urgence :</span>
                    <span className="text-white">{formData.urgency || 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tonalité :</span>
                    <span className="text-white">{formData.tone || 'Non définie'}</span>
                  </div>
                </div>
              </div>

              {/* Bloc "Prêt pour l'analyse" */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
                    Prêt pour l'analyse Dropskills IA ?
                  </h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Dropskills IA va analyser toutes ces informations pour créer votre offre irrésistible personnalisée et optimisée pour la conversion.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">12,847</p>
                <p className="text-gray-400 text-sm">Offres générées</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">+127%</p>
                <p className="text-gray-400 text-sm">Taux de conversion</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-white font-semibold">€2.4M</p>
                <p className="text-gray-400 text-sm">CA généré</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils */}
      <div className="mb-8 bg-green-900/20 border border-green-500/30 rounded-xl p-6">
        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour une offre efficace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-green-200">✨ Optimisation de l'offre</h4>
            <ul className="space-y-2 text-green-300">
              <li>• <strong>Soyez spécifique :</strong> Définissez précisément votre audience cible</li>
              <li>• <strong>Mettez en avant vos bénéfices uniques :</strong> Ce qui vous différencie vraiment</li>
              <li>• <strong>Utilisez des chiffres concrets :</strong> Résultats mesurables et témoignages</li>
              <li>• <strong>Prix psychologique :</strong> Testez différentes gammes de prix</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-green-200">🎯 Conversion maximale</h4>
            <ul className="space-y-2 text-green-300">
              <li>• <strong>Créez un sentiment d'urgence :</strong> Offre limitée dans le temps</li>
              <li>• <strong>Proposez une garantie :</strong> Réduisez le risque perçu</li>
              <li>• <strong>Incluez un appel à l'action clair :</strong> Dites exactement quoi faire</li>
              <li>• <strong>Testez et mesurez :</strong> A/B testez vos offres pour optimiser</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire Wizard */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Créateur d'Offre IA
            </h2>
            
            {/* Indicateur de progression */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Étape {currentStep} sur {totalSteps}</span>
                <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-[#232323] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <h3 className="text-white font-medium mt-3">{stepTitles[currentStep - 1]}</h3>
            </div>
          </div>

          {/* Contenu de l'étape */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-[#232323] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Précédent
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Suivant
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isLoading || !isFormComplete()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer mon offre
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Votre Offre Générée
          </h2>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AILoadingLogs 
                  isVisible={true}
                  toolName="Générateur d'Offre IA"
                  onComplete={() => console.log('Génération terminée')}
                />
              </motion.div>
            ) : !showResults ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Prêt à créer votre offre irrésistible ?</p>
                <p className="text-gray-500 text-sm">Remplissez le formulaire et cliquez sur "Générer mon offre"</p>
              </motion.div>
            ) : offerResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Titre principal */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-bold text-xl mb-2">{offerResult.title}</h3>
                <p className="text-gray-300 text-lg">{offerResult.subtitle}</p>
                <p className="text-gray-400 mt-2">{offerResult.description}</p>
              </div>

              {/* Prix */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Tarification
                </h4>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 line-through text-lg">{offerResult.pricing.original}</span>
                  <span className="text-green-400 font-bold text-2xl">{offerResult.pricing.current}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">-{offerResult.pricing.savings}</span>
                </div>
              </div>

              {/* Bénéfices */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Bénéfices
                </h4>
                <ul className="space-y-2">
                  {offerResult.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bonus */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Bonus inclus
                </h4>
                <ul className="space-y-2">
                  {offerResult.bonuses.map((bonus, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-center">
                <p className="text-white font-bold text-lg mb-2">{offerResult.cta}</p>
                <p className="text-white/80 text-sm">{offerResult.urgency}</p>
                <p className="text-white/60 text-xs mt-2">{offerResult.guarantee}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(offerResult, null, 2))}
                  className="flex-1 bg-[#1a1a1a] text-white py-2 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex-1 bg-[#1a1a1a] text-white py-2 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Régénérer
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Nouveau
                </button>
              </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>


    </div>
  );
}

export default function GenerateurOffrePage() {
  return (
    <ToolLayout toolId="generateur-offre">
      <PremiumGuard feature="Générateur d'Offre IA">
        <GenerateurOffreContent />
      </PremiumGuard>
    </ToolLayout>
  );
}