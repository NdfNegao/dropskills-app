'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Building,
  Users,
  Package,
  Zap,
  DollarSign,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Copy,
  RefreshCw,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import StepWizard, { WizardStep } from '@/components/StepWizard';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import ConseilBlock from '@/components/ui/ConseilBlock';
import TooltipField from '@/components/ui/TooltipField';
import AILoadingLogs from '@/components/AILoadingLogs';

// Types
interface OfferFormData {
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
  pricing: {
    original: string;
    current: string;
    savings: string;
  };
  benefits: string[];
  bonuses: string[];
  cta: string;
  urgency: string;
  guarantee: string;
}

// Options prédéfinies
const BUSINESS_TYPES = [
  'Coach/Consultant',
  'Formation en ligne',
  'E-commerce',
  'SaaS/Logiciel',
  'Agence de services',
  'Freelance',
  'Autre'
];

const PRICE_RANGES = [
  'Moins de 100€',
  '100€ - 500€',
  '500€ - 1000€',
  '1000€ - 5000€',
  'Plus de 5000€'
];

const URGENCY_LEVELS = [
  'Offre limitée dans le temps',
  'Places limitées',
  'Bonus exclusif',
  'Prix promotionnel',
  'Lancement spécial'
];

const TONE_OPTIONS = [
  {
    name: 'Professionnel',
    description: 'Ton sérieux et expert',
    example: '"Optimisez vos performances avec notre solution éprouvée"'
  },
  {
    name: 'Amical',
    description: 'Ton chaleureux et accessible',
    example: '"Rejoignez notre communauté et transformez votre business !"'
  },
  {
    name: 'Urgent',
    description: 'Ton pressant et motivant',
    example: '"Dernières heures pour profiter de cette offre exceptionnelle !"'
  },
  {
    name: 'Inspirant',
    description: 'Ton motivant et aspirationnel',
    example: '"Réalisez enfin vos rêves d\'entrepreneur avec notre méthode"'
  }
];

// Composants des étapes
interface StepProps {
  data: OfferFormData;
  onChange: (updates: Partial<OfferFormData>) => void;
  errors: Record<string, string>;
}

function BusinessTypeStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Type de Business</h2>
        <p className="text-gray-400">Quel est votre secteur d'activité principal ?</p>
      </div>

      <ConseilBlock variant="blue" icon={<Lightbulb className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Soyez précis dans votre choix. 
          Chaque secteur a ses spécificités et notre IA adaptera le ton et les arguments 
          selon votre domaine d'expertise.
        </p>
      </ConseilBlock>

      <div className="space-y-3">
        <TooltipField
          label="Sélectionnez votre type de business"
          tooltip="Choisissez le secteur qui correspond le mieux à votre activité principale"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onChange({ businessType: type })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.businessType === type
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{type}</span>
                  {data.businessType === type && <CheckCircle className="w-5 h-5 text-blue-400" />}
                </div>
              </button>
            ))}
          </div>
        </TooltipField>
        {errors.businessType && (
          <p className="text-red-400 text-sm">{errors.businessType}</p>
        )}
      </div>
    </div>
  );
}

function AudienceStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Audience Cible</h2>
        <p className="text-gray-400">Qui sont vos clients idéaux ?</p>
      </div>

      <ConseilBlock variant="green" icon={<Target className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Plus vous êtes spécifique sur votre audience, 
          plus l'offre sera percutante. Pensez démographie, problèmes, aspirations et comportements d'achat.
        </p>
      </ConseilBlock>

      <div className="space-y-4">
        <TooltipField
          label="Décrivez votre audience cible"
          tooltip="Soyez précis : âge, profession, problèmes, objectifs, niveau de revenus..."
          required
        >
          <textarea
            value={data.targetAudience || ''}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="Ex: Entrepreneurs débutants 25-45 ans, qui luttent pour générer des leads qualifiés et cherchent une solution simple et efficace..."
            className="w-full h-32 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </TooltipField>
        {errors.targetAudience && (
          <p className="text-red-400 text-sm">{errors.targetAudience}</p>
        )}
      </div>
    </div>
  );
}

function ProductStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Produit/Service</h2>
        <p className="text-gray-400">Que proposez-vous exactement ?</p>
      </div>

      <ConseilBlock variant="purple" icon={<Package className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Concentrez-vous sur les bénéfices plutôt que sur les caractéristiques. 
          Que va obtenir concrètement votre client après avoir utilisé votre solution ?
        </p>
      </ConseilBlock>

      <div className="space-y-4">
        <TooltipField
          label="Décrivez votre produit/service"
          tooltip="Expliquez clairement ce que vous vendez et les résultats que cela apporte"
          required
        >
          <textarea
            value={data.productService || ''}
            onChange={(e) => onChange({ productService: e.target.value })}
            placeholder="Ex: Formation complète en marketing digital avec 50 vidéos, templates prêts à l'emploi et accompagnement personnalisé pendant 3 mois..."
            className="w-full h-32 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </TooltipField>
        {errors.productService && (
          <p className="text-red-400 text-sm">{errors.productService}</p>
        )}

        <TooltipField
          label="Votre proposition de valeur unique"
          tooltip="Qu'est-ce qui vous différencie de vos concurrents ? Votre avantage unique ?"
          required
        >
          <textarea
            value={data.uniqueValue || ''}
            onChange={(e) => onChange({ uniqueValue: e.target.value })}
            placeholder="Ex: Seule méthode qui garantit 100 leads qualifiés en 30 jours ou remboursé, basée sur 10 ans d'expérience et 500+ clients satisfaits..."
            className="w-full h-24 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </TooltipField>
        {errors.uniqueValue && (
          <p className="text-red-400 text-sm">{errors.uniqueValue}</p>
        )}
      </div>
    </div>
  );
}

function PricingStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Stratégie Tarifaire</h2>
        <p className="text-gray-400">Définissez votre gamme de prix et créez l'urgence</p>
      </div>

      <ConseilBlock variant="orange" icon={<TrendingUp className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Le prix psychologique et l'urgence sont cruciaux. 
          Notre IA optimisera votre stratégie tarifaire pour maximiser les conversions selon votre marché.
        </p>
      </ConseilBlock>

      <div className="space-y-6">
        <TooltipField
          label="Gamme de prix"
          tooltip="Sélectionnez la fourchette de prix qui correspond à votre offre"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRICE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => onChange({ priceRange: range })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.priceRange === range
                    ? 'border-yellow-500 bg-yellow-500/10 text-white'
                    : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:border-yellow-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{range}</span>
                  {data.priceRange === range && <CheckCircle className="w-5 h-5 text-yellow-400" />}
                </div>
              </button>
            ))}
          </div>
        </TooltipField>
        {errors.priceRange && (
          <p className="text-red-400 text-sm">{errors.priceRange}</p>
        )}

        <TooltipField
          label="Type d'urgence"
          tooltip="Choisissez le levier d'urgence le plus adapté à votre offre"
          required
        >
          <div className="space-y-3">
            {URGENCY_LEVELS.map((urgency) => (
              <button
                key={urgency}
                onClick={() => onChange({ urgency })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.urgency === urgency
                    ? 'border-orange-500 bg-orange-500/10 text-white'
                    : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="font-medium">{urgency}</span>
                  </div>
                  {data.urgency === urgency && <CheckCircle className="w-5 h-5 text-orange-400" />}
                </div>
              </button>
            ))}
          </div>
        </TooltipField>
        {errors.urgency && (
          <p className="text-red-400 text-sm">{errors.urgency}</p>
        )}
      </div>
    </div>
  );
}

function ToneStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Tonalité de Communication</h2>
        <p className="text-gray-400">Quel style de communication voulez-vous adopter ?</p>
      </div>

      <ConseilBlock variant="purple" icon={<MessageSquare className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> La tonalité doit correspondre à votre audience et à votre secteur. 
          Un ton professionnel pour du B2B, plus décontracté pour du B2C jeune.
        </p>
      </ConseilBlock>

      <div className="space-y-4">
        <TooltipField
          label="Choisissez votre tonalité"
          tooltip="Sélectionnez le ton qui correspond le mieux à votre marque et audience"
          required
        >
          <div className="space-y-4">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.name}
                onClick={() => onChange({ tone: tone.name })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.tone === tone.name
                    ? 'border-pink-500 bg-pink-500/10 text-white'
                    : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:border-pink-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{tone.name}</h4>
                    <p className="text-sm text-gray-400">{tone.description}</p>
                  </div>
                  {data.tone === tone.name && <CheckCircle className="w-5 h-5 text-pink-400" />}
                </div>
                <div className={`p-3 rounded border-l-4 ${
                  data.tone === tone.name
                    ? 'bg-pink-500/20 border-pink-400 text-pink-100'
                    : 'bg-[#0a0a0a] border-gray-600 text-gray-300'
                }`}>
                  <p className="text-xs opacity-70 mb-1">Exemple :</p>
                  <p className="text-sm italic">{tone.example}</p>
                </div>
              </button>
            ))}
          </div>
        </TooltipField>
        {errors.tone && (
          <p className="text-red-400 text-sm">{errors.tone}</p>
        )}
      </div>
    </div>
  );
}

interface SummaryStepProps {
  data: OfferFormData;
  onGenerate: () => void;
}

function SummaryStep({ data, onGenerate }: SummaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Récapitulatif</h2>
        <p className="text-gray-400">Vérifiez vos informations avant la génération</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#232323] p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Récapitulatif de votre offre</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Type de business :</span>
              <span className="text-white">{data.businessType || 'Non défini'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Gamme de prix :</span>
              <span className="text-white">{data.priceRange || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Urgence :</span>
              <span className="text-white">{data.urgency || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Tonalité :</span>
              <span className="text-white">{data.tone || 'Non définie'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 font-medium block mb-1">Audience cible :</span>
              <span className="text-white text-sm">
                {data.targetAudience ? 
                  (data.targetAudience.length > 60 ? 
                    data.targetAudience.substring(0, 60) + '...' : 
                    data.targetAudience
                  ) : 'Non définie'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block mb-1">Produit/Service :</span>
              <span className="text-white text-sm">
                {data.productService ? 
                  (data.productService.length > 60 ? 
                    data.productService.substring(0, 60) + '...' : 
                    data.productService
                  ) : 'Non défini'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">
            Prêt pour l'analyse Générateur d'Offre AI ?
          </h3>
        </div>
        <p className="text-blue-700 mb-4">
          Générateur d'Offre AI va analyser toutes ces informations pour créer votre offre irrésistible détaillée et optimisée pour la conversion.
        </p>
        <button 
          onClick={onGenerate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Générer avec Générateur d'Offre AI
        </button>
      </div>
    </div>
  );
}

// Composant principal
function OfferGeneratorWizard({ onComplete, isLoading }: { onComplete: (data: OfferFormData) => void; isLoading: boolean }) {
  const steps: WizardStep[] = [
    {
      id: 'business-type',
      title: 'Business',
      description: 'Type d\'activité',
      icon: Building,
      component: BusinessTypeStep,
      validation: (data: OfferFormData) => ({
        isValid: !!data.businessType,
        errors: {
          businessType: !data.businessType ? 'Veuillez sélectionner votre type de business' : ''
        }
      })
    },
    {
      id: 'audience',
      title: 'Audience',
      description: 'Clients cibles',
      icon: Users,
      component: AudienceStep,
      validation: (data: OfferFormData) => ({
        isValid: !!data.targetAudience && data.targetAudience.length >= 20,
        errors: {
          targetAudience: !data.targetAudience ? 'Veuillez décrire votre audience cible' :
                          data.targetAudience.length < 20 ? 'Description trop courte (minimum 20 caractères)' : ''
        }
      })
    },
    {
      id: 'product',
      title: 'Produit',
      description: 'Offre & valeur',
      icon: Package,
      component: ProductStep,
      validation: (data: OfferFormData) => ({
        isValid: !!data.productService && data.productService.length >= 20 && !!data.uniqueValue && data.uniqueValue.length >= 15,
        errors: {
          productService: !data.productService ? 'Veuillez décrire votre produit/service' :
                         data.productService.length < 20 ? 'Description trop courte (minimum 20 caractères)' : '',
          uniqueValue: !data.uniqueValue ? 'Veuillez définir votre proposition de valeur unique' :
                      data.uniqueValue.length < 15 ? 'Description trop courte (minimum 15 caractères)' : ''
        }
      })
    },
    {
      id: 'pricing',
      title: 'Prix',
      description: 'Tarifs & urgence',
      icon: DollarSign,
      component: PricingStep,
      validation: (data: OfferFormData) => ({
        isValid: !!data.priceRange && !!data.urgency,
        errors: {
          priceRange: !data.priceRange ? 'Veuillez sélectionner une gamme de prix' : '',
          urgency: !data.urgency ? 'Veuillez choisir un type d\'urgence' : ''
        }
      })
    },
    {
      id: 'tone',
      title: 'Tonalité',
      description: 'Style de communication',
      icon: MessageSquare,
      component: ToneStep,
      validation: (data: OfferFormData) => ({
        isValid: !!data.tone,
        errors: {
          tone: !data.tone ? 'Veuillez choisir une tonalité' : ''
        }
      })
    },
    {
      id: 'summary',
      title: 'Récapitulatif',
      description: 'Validation finale',
      icon: CheckCircle,
      component: SummaryStep,
      validation: () => ({ isValid: true, errors: {} })
    }
  ];

  return (
    <StepWizard
      steps={steps}
      onComplete={onComplete}
      isLoading={isLoading}
      title="Générateur d'Offre IA"
      description="Créez des offres irrésistibles qui convertissent"
      className="max-w-4xl mx-auto"
    />
  );
}

// Composant de résultats
function OfferResult({ result, onCopy, onRegenerate, onReset, isLoading }: {
  result: GeneratedOffer;
  onCopy: () => void;
  onRegenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] rounded-xl border border-[#232323] p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
          <Target className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Votre Offre Générée</h2>
          <p className="text-gray-400">Optimisée pour maximiser les conversions</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Titre principal */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
          <h3 className="text-white font-bold text-2xl mb-2">{result.title}</h3>
          <p className="text-gray-300 text-lg mb-3">{result.subtitle}</p>
          <p className="text-gray-400">{result.description}</p>
        </div>

        {/* Prix */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Tarification Optimisée
          </h4>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 line-through text-xl">{result.pricing.original}</span>
            <span className="text-green-400 font-bold text-3xl">{result.pricing.current}</span>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              -{result.pricing.savings}
            </span>
          </div>
        </div>

        {/* Bénéfices */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Bénéfices Clés
          </h4>
          <ul className="space-y-3">
            {result.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bonus */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Bonus Exclusifs
          </h4>
          <ul className="space-y-3">
            {result.bonuses.map((bonus, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{bonus}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-center">
          <p className="text-white font-bold text-xl mb-2">{result.cta}</p>
          <p className="text-white/90 mb-2">{result.urgency}</p>
          <p className="text-white/70 text-sm">{result.guarantee}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCopy}
            className="flex-1 bg-[#1a1a1a] text-white py-3 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2 border border-[#232323]"
          >
            <Copy className="w-4 h-4" />
            Copier l'offre
          </button>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex-1 bg-[#1a1a1a] text-white py-3 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2 border border-[#232323] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Régénérer
          </button>
          <button
            onClick={onReset}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Nouvelle offre
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Composant principal de contenu
function OfferGeneratorContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedOffer | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleGenerate = async (data: OfferFormData) => {
    setIsGenerating(true);
    setShowLogs(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 7000));
      
      // Données mockées pour la démonstration
      const mockResult: GeneratedOffer = {
        title: "🚀 Formation Marketing Digital Complète",
        subtitle: "Transformez votre business en machine à leads en 30 jours",
        description: "La seule formation qui vous garantit 100+ leads qualifiés par mois ou remboursé. Méthode éprouvée sur 500+ entrepreneurs.",
        pricing: {
          original: "1997€",
          current: "497€",
          savings: "75%"
        },
        benefits: [
          "50+ vidéos de formation étape par étape",
          "Templates et outils prêts à l'emploi",
          "Accompagnement personnalisé 3 mois",
          "Accès à la communauté privée",
          "Garantie résultats 30 jours"
        ],
        bonuses: [
          "🎁 Audit gratuit de votre stratégie actuelle (valeur 297€)",
          "🎁 Pack de 100 templates de posts sociaux (valeur 197€)",
          "🎁 Masterclass exclusive 'Vendre sans vendre' (valeur 497€)"
        ],
        cta: "🔥 REJOIGNEZ LES 500+ ENTREPRENEURS QUI ONT TRANSFORMÉ LEUR BUSINESS",
        urgency: "⏰ Offre limitée : Plus que 48h pour profiter de -75%",
        guarantee: "✅ Garantie satisfait ou remboursé 30 jours"
      };
      
      setResults(mockResult);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowLogs(false), 1000);
    }
  };

  const handleCopy = () => {
    if (results) {
      const offerText = `${results.title}\n\n${results.subtitle}\n\n${results.description}\n\nPrix: ${results.pricing.current} (au lieu de ${results.pricing.original})\n\nBénéfices:\n${results.benefits.map(b => `• ${b}`).join('\n')}\n\nBonus:\n${results.bonuses.map(b => `• ${b}`).join('\n')}\n\n${results.cta}\n${results.urgency}\n${results.guarantee}`;
      
      navigator.clipboard.writeText(offerText);
      // Ici vous pourriez ajouter une notification de succès
    }
  };

  const handleRegenerate = () => {
    // Logique pour régénérer avec les mêmes données
  };

  const handleReset = () => {
    setResults(null);
    setShowLogs(false);
    // Réinitialiser le wizard
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-semibold text-2xl">12,847</p>
                  <p className="text-gray-400">Offres générées</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-semibold text-2xl">+127%</p>
                  <p className="text-gray-400">Taux de conversion</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-white font-semibold text-2xl">€2.4M</p>
                  <p className="text-gray-400">CA généré</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wizard */}
            <div>
              <OfferGeneratorWizard 
                onComplete={handleGenerate}
                isLoading={isGenerating}
              />
            </div>

            {/* Résultats */}
            <div>
              <AnimatePresence mode="wait">
                {showLogs && isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-[#111111] rounded-xl border border-[#232323] p-6"
                  >
                    <AILoadingLogs 
                      isVisible={true}
                      toolName="Générateur d'Offre IA"
                      onComplete={() => console.log('Génération terminée')}
                    />
                  </motion.div>
                ) : results ? (
                  <OfferResult
                    key="results"
                    result={results}
                    onCopy={handleCopy}
                    onRegenerate={handleRegenerate}
                    onReset={handleReset}
                    isLoading={isGenerating}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111111] rounded-xl border border-[#232323] p-6 text-center py-12"
                  >
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">
                      Prêt à créer votre offre irrésistible ?
                    </h3>
                    <p className="text-gray-400">
                      Complétez le wizard et générez votre offre optimisée
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

// Page principale
export default function OfferGeneratorPage() {
  return (
    <ToolLayout toolId="generateur-offre">
      <PremiumGuard feature="Générateur d'Offre IA">
        <OfferGeneratorContent />
      </PremiumGuard>
    </ToolLayout>
  );
}
