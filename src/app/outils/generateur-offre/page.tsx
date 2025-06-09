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
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import ConseilBlock from '@/components/ui/ConseilBlock';
import StepWizard, { WizardStep } from '@/components/StepWizard';
import TooltipField from '@/components/ui/TooltipField';
import AILoadingLogs from '@/components/AILoadingLogs';

// Types
interface OfferFormData {
  businessType?: string;
  targetAudience?: string;
  productName?: string;
  productType?: string;
  productDescription?: string;
  productService?: string;
  uniqueValue?: string;
  price?: string;
  pricePositioning?: string;
  priceJustification?: string;
  priceRange?: string;
  urgency?: string;
  tone?: string;
  brandKeywords?: string;
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
  onGenerate?: () => void;
  isGenerating?: boolean;
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
          <strong>Conseil Dropskills AI :</strong> Choisir le bon secteur permet à notre IA 
          d'adapter le ton, les arguments et la structure de votre offre selon les codes 
          de votre marché.
        </p>
      </ConseilBlock>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Secteur d'activité *</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              Sélectionnez le secteur qui correspond le mieux à votre activité principale
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'coaching', label: 'Coaching/Formation', icon: '🎯', example: 'Formation marketing digital' },
            { id: 'ecommerce', label: 'E-commerce', icon: '🛒', example: 'Boutique en ligne' },
            { id: 'saas', label: 'SaaS/Tech', icon: '💻', example: 'Logiciel de gestion' },
            { id: 'consulting', label: 'Consulting', icon: '📊', example: 'Conseil en stratégie' },
            { id: 'freelance', label: 'Freelance', icon: '✨', example: 'Services créatifs' },
            { id: 'agency', label: 'Agence', icon: '🏢', example: 'Agence marketing' },
            { id: 'health', label: 'Santé/Bien-être', icon: '🏥', example: 'Coaching nutrition' },
            { id: 'other', label: 'Autre', icon: '🔧', example: 'Secteur spécialisé' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => onChange({ businessType: option.id })}
              className={`p-4 rounded-lg border-2 transition-all text-left group ${
                data.businessType === option.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium mb-1">{option.label}</div>
              <div className="text-xs text-gray-500 group-hover:text-gray-400">{option.example}</div>
            </button>
          ))}
        </div>
        
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
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Audience cible *</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
              Soyez précis : âge, profession, problèmes, objectifs. Ex: "Entrepreneurs de 30-45 ans qui luttent pour générer des leads"
            </div>
          </div>
        </div>
        
        <textarea
          value={data.targetAudience || ''}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          placeholder="Ex: Entrepreneurs de 30-45 ans dans le e-commerce qui ont du mal à augmenter leur chiffre d'affaires et cherchent des stratégies marketing efficaces..."
          className="w-full h-32 p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none"
        />
        
        {errors.targetAudience && (
          <p className="text-red-400 text-sm">{errors.targetAudience}</p>
        )}
        
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
          <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Exemples d'audiences bien définies
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <span className="text-green-400">Coaching :</span> "Femmes entrepreneures de 35-50 ans qui veulent équilibrer vie pro/perso"</p>
            <p>• <span className="text-blue-400">E-commerce :</span> "Propriétaires de boutiques en ligne avec 10-50K€/mois de CA"</p>
            <p>• <span className="text-purple-400">SaaS :</span> "PME de 20-100 employés cherchant à digitaliser leurs processus"</p>
          </div>
        </div>
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

      <ConseilBlock variant="purple" icon={<Lightbulb className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Concentrez-vous sur les bénéfices et la transformation 
          que votre produit apporte, pas seulement sur ses caractéristiques techniques.
        </p>
      </ConseilBlock>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Description de votre produit/service *</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
              Décrivez votre produit, ses bénéfices, et comment il résout le problème de votre audience
            </div>
          </div>
        </div>
        <textarea
          value={data.productService || ''}
          onChange={(e) => onChange({ productService: e.target.value })}
          placeholder="Ex: Une formation complète de 8 semaines qui enseigne les stratégies marketing digital les plus efficaces pour doubler son chiffre d'affaires..."
          className="w-full h-32 p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
        />
        {errors?.productService && (
          <p className="text-red-400 text-sm">{errors.productService}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Proposition de valeur unique *</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
              Qu'est-ce qui vous différencie de la concurrence ? Pourquoi choisir votre solution ?
            </div>
          </div>
        </div>
        <textarea
          value={data.uniqueValue || ''}
          onChange={(e) => onChange({ uniqueValue: e.target.value })}
          placeholder="Ex: La seule méthode qui garantit des résultats en 30 jours grâce à notre système breveté de..."
          className="w-full h-24 p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
        />
        {errors?.uniqueValue && (
          <p className="text-red-400 text-sm">{errors.uniqueValue}</p>
        )}
        
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
          <h4 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Structure recommandée
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <span className="text-purple-400">Problème :</span> Quel problème résolvez-vous ?</p>
            <p>• <span className="text-blue-400">Solution :</span> Comment votre produit aide-t-il ?</p>
            <p>• <span className="text-green-400">Résultat :</span> Quelle transformation apportez-vous ?</p>
            <p>• <span className="text-yellow-400">Preuve :</span> Avez-vous des résultats à partager ?</p>
          </div>
        </div>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Gamme de prix *</label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                Sélectionnez la fourchette de prix qui correspond à votre offre
              </div>
            </div>
          </div>
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
          {errors.priceRange && (
            <p className="text-red-400 text-sm">{errors.priceRange}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Type d'urgence *</label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                Choisissez le levier d'urgence le plus adapté à votre offre
              </div>
            </div>
          </div>
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
          {errors.urgency && (
            <p className="text-red-400 text-sm">{errors.urgency}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ToneStep({ data, onChange, errors }: StepProps) {
  const toneOptions = [
    { 
      value: 'professionnel', 
      label: 'Professionnel', 
      desc: 'Sérieux et expert',
      example: '"Notre expertise vous garantit des résultats mesurables."',
      color: 'blue'
    },
    { 
      value: 'amical', 
      label: 'Amical', 
      desc: 'Chaleureux et accessible',
      example: '"On va vous aider à atteindre vos objectifs ensemble !"',
      color: 'green'
    },
    { 
      value: 'dynamique', 
      label: 'Dynamique', 
      desc: 'Énergique et motivant',
      example: '"Prêt à transformer votre business ? C\'est parti !"',
      color: 'orange'
    },
    { 
      value: 'premium', 
      label: 'Premium', 
      desc: 'Luxueux et exclusif',
      example: '"Une expérience d\'exception pour une clientèle exigeante."',
      color: 'purple'
    },
    { 
      value: 'decontracte', 
      label: 'Décontracté', 
      desc: 'Relax et naturel',
      example: '"Pas de blabla, juste ce qui marche vraiment."',
      color: 'yellow'
    },
    { 
      value: 'expert', 
      label: 'Expert', 
      desc: 'Technique et précis',
      example: '"Méthodologie éprouvée basée sur 10 ans de R&D."',
      color: 'indigo'
    }
  ];

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
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Ton de communication *</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
              Choisissez le style qui correspond le mieux à votre marque et votre audience
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toneOptions.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => onChange({ tone: tone.value })}
              className={`group p-4 rounded-lg border-2 text-left transition-all ${
                data.tone === tone.value
                  ? `border-${tone.color}-500 bg-${tone.color}-500/10`
                  : 'border-[#232323] bg-[#1a1a1a] hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-white">{tone.label}</div>
              <div className="text-sm text-gray-400 mt-1">{tone.desc}</div>
              <div className="text-xs text-gray-500 mt-2 italic group-hover:text-gray-400 transition-colors">
                {tone.example}
              </div>
            </button>
          ))}
        </div>
        
        {errors?.tone && (
          <p className="text-red-400 text-sm">{errors.tone}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Mots-clés de votre marque</label>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
              Listez 3-5 mots qui définissent l'essence de votre marque
            </div>
          </div>
        </div>
        
        <input
          type="text"
          value={data.brandKeywords || ''}
          onChange={(e) => onChange({ brandKeywords: e.target.value })}
          placeholder="Ex: Innovation, Excellence, Proximité, Résultats, Authenticité"
          className="w-full p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        
        {errors?.brandKeywords && (
          <p className="text-red-400 text-sm">{errors.brandKeywords}</p>
        )}
        
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Impact du ton sur votre offre
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <span className="text-blue-400">Professionnel :</span> Rassure et inspire confiance</p>
            <p>• <span className="text-green-400">Amical :</span> Crée de la proximité et réduit les barrières</p>
            <p>• <span className="text-orange-400">Dynamique :</span> Motive à l'action et crée l'urgence</p>
            <p>• <span className="text-purple-400">Premium :</span> Justifie un prix élevé et attire une clientèle aisée</p>
          </div>
        </div>
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

      <ConseilBlock variant="green" icon={<CheckCircle className="w-4 h-4" />}>
        <p>
          <strong>Conseil Dropskills AI :</strong> Prenez un moment pour relire vos informations. 
          Plus elles sont précises, plus votre offre sera percutante et adaptée.
        </p>
      </ConseilBlock>

      <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Récapitulatif de votre offre
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-blue-400 font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Type d'activité
            </h4>
            <p className="text-gray-300 bg-[#0a0a0a] p-3 rounded border-l-4 border-blue-500">
              {data.businessType || 'Non renseigné'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-green-400 font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Audience cible
            </h4>
            <p className="text-gray-300 text-sm bg-[#0a0a0a] p-3 rounded border-l-4 border-green-500">
              {data.targetAudience ? data.targetAudience.substring(0, 120) + (data.targetAudience.length > 120 ? '...' : '') : 'Non renseigné'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-purple-400 font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produit/Service
            </h4>
            <p className="text-gray-300 text-sm bg-[#0a0a0a] p-3 rounded border-l-4 border-purple-500">
              {data.productService ? data.productService.substring(0, 120) + (data.productService.length > 120 ? '...' : '') : 'Non renseigné'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-yellow-400 font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Gamme de prix
            </h4>
            <p className="text-gray-300 bg-[#0a0a0a] p-3 rounded border-l-4 border-yellow-500">
              {data.priceRange || 'Non renseigné'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-pink-400 font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Ton de communication
            </h4>
            <p className="text-gray-300 bg-[#0a0a0a] p-3 rounded border-l-4 border-pink-500">
              {data.tone || 'Non renseigné'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-indigo-400 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Type d'urgence
            </h4>
            <p className="text-gray-300 bg-[#0a0a0a] p-3 rounded border-l-4 border-indigo-500">
              {data.urgency || 'Non renseigné'}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Prêt pour la génération
          </h4>
          <p className="text-gray-300 text-sm">
            Notre IA va analyser toutes ces informations pour créer une offre personnalisée et irrésistible.
          </p>
        </div>
      </div>

      <button 
        onClick={onGenerate}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Sparkles className="w-5 h-5" />
        Générer mon offre irrésistible
      </button>
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
      toolId="offer-generator"
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
  const [formData, setFormData] = useState<OfferFormData | null>(null);

  const handleGenerate = async (data: OfferFormData) => {
    setFormData(data);
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
    if (formData) {
      handleGenerate(formData);
    }
  };

  const handleReset = () => {
    setResults(null);
    setShowLogs(false);
    setFormData(null);
  };

  return (
    <div className="space-y-8">
      {/* Wizard */}
      <OfferGeneratorWizard 
        onComplete={handleGenerate}
        isLoading={isGenerating}
      />

      {/* Résultats */}
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
  );
}

// Page principale
export default function OfferGeneratorPage() {
  const stats = [
    {
      icon: <Sparkles className="w-6 h-6 text-green-400" />,
      value: "12,847",
      label: "Offres générées"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      value: "+127%",
      label: "Taux de conversion"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      value: "€2.4M",
      label: "CA généré"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      value: "4.8/5",
      label: "Satisfaction client"
    }
  ];

  return (
    <ToolLayout toolId="generateur-offre" stats={stats}>
      <PremiumGuard feature="Générateur d'Offre IA">
        <OfferGeneratorContent />
      </PremiumGuard>
    </ToolLayout>
  );
}
