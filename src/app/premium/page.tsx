'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Shield, 
  Check, 
  Star,
  BrainCog,
  Rocket,
  Target,
  Mail,
  CalendarCheck,
  FolderKanban
} from 'lucide-react';
import Link from 'next/link';

const PREMIUM_FEATURES = [
  {
    icon: <BrainCog className="w-6 h-6" />,
    title: "ICP Maker IA",
    description: "Créez votre profil client idéal en 7 étapes avec l'IA"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Générateur d'Offre",
    description: "Générez des offres irrésistibles automatiquement"
  },
  {
    icon: <FolderKanban className="w-6 h-6" />,
    title: "Tunnel de Vente IA",
    description: "Créez des tunnels de vente optimisés par l'IA"
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "CopyMoneyMail",
    description: "Rédigez des emails qui convertissent"
  },
  {
    icon: <CalendarCheck className="w-6 h-6" />,
    title: "Content System 90J",
    description: "Planifiez votre contenu pour 90 jours"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Lead Magnet Creator",
    description: "Créez des aimants à prospects efficaces"
  }
];

const PRICING_PLANS = [
  {
    name: "Premium Mensuel",
    price: "47€",
    period: "/mois",
    description: "Accès complet aux outils IA",
    features: [
      "Tous les outils IA premium",
      "Génération illimitée",
      "Support prioritaire",
      "Mises à jour en avant-première",
      "Templates exclusifs"
    ],
    popular: false,
    ctaText: "Commencer maintenant",
    ctaLink: "/checkout?plan=premium-monthly"
  },
  {
    name: "Premium Annuel",
    price: "397€",
    period: "/an",
    originalPrice: "564€",
    description: "2 mois offerts + bonus exclusifs",
    features: [
      "Tous les outils IA premium",
      "Génération illimitée",
      "Support prioritaire VIP",
      "Accès aux bêtas privées",
      "Templates exclusifs",
      "Formation 1-on-1 offerte",
      "Communauté privée"
    ],
    popular: true,
    ctaText: "Économiser 167€",
    ctaLink: "/checkout?plan=premium-yearly"
  }
];

export default function PremiumPage() {
  const { user, canAccessPremium } = useAuth();

  return (
    <LayoutWithSidebar>
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              Premium
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Débloquez tous les outils IA avancés de Dropskills
            </p>

            {canAccessPremium && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Vous avez déjà accès au Premium !</span>
                </div>
                <p className="text-green-300 text-sm mt-2">
                  Profitez de tous les outils IA sans restriction.
                </p>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Outils IA Premium Inclus
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center text-[#ff0033]">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          {!canAccessPremium && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Choisissez votre plan Premium
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {PRICING_PLANS.map((plan, index) => (
                  <div 
                    key={index}
                    className={`relative bg-gradient-to-br from-[#111111] to-[#1a1a1a] border rounded-xl p-8 ${
                      plan.popular 
                        ? 'border-[#ff0033] shadow-lg shadow-[#ff0033]/20' 
                        : 'border-[#232323]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#ff0033] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Plus populaire
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {plan.description}
                      </p>
                      
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-400">
                          {plan.period}
                        </span>
                      </div>
                      
                      {plan.originalPrice && (
                        <div className="mt-2">
                          <span className="text-gray-500 line-through text-lg">
                            {plan.originalPrice}
                          </span>
                          <span className="text-green-400 font-semibold ml-2">
                            Économisez 30%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={plan.ctaLink}
                      className={`block w-full text-center py-4 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white hover:from-[#cc0029] hover:to-[#990022] transform hover:scale-105'
                          : 'bg-[#232323] text-white hover:bg-[#333333]'
                      }`}
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pourquoi choisir Premium ?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#ff0033]/10 rounded-full flex items-center justify-center text-[#ff0033] mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Gain de temps massif
                </h3>
                <p className="text-gray-400">
                  Automatisez vos tâches marketing et concentrez-vous sur l'essentiel
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#ff0033]/10 rounded-full flex items-center justify-center text-[#ff0033] mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Résultats garantis
                </h3>
                <p className="text-gray-400">
                  Des outils testés et approuvés par +300 entrepreneurs
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#ff0033]/10 rounded-full flex items-center justify-center text-[#ff0033] mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Support VIP
                </h3>
                <p className="text-gray-400">
                  Accès prioritaire au support et à la communauté exclusive
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          {!canAccessPremium && (
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-6">
                Rejoignez les entrepreneurs qui transforment leur business avec nos outils IA
              </p>
              <Link
                href="/checkout?plan=premium-yearly"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 transform hover:scale-105"
              >
                <Crown className="w-6 h-6" />
                Commencer maintenant
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 