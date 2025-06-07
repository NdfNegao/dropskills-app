'use client';

import React from 'react';
import { DollarSign, Users, HelpCircle, CheckCircle } from 'lucide-react';

interface MarketingChannelsStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

const CANAUX_OPTIONS = [
  { id: 'facebook-ads', label: 'Facebook Ads', category: 'Publicité payante' },
  { id: 'google-ads', label: 'Google Ads', category: 'Publicité payante' },
  { id: 'linkedin', label: 'LinkedIn', category: 'Réseaux sociaux' },
  { id: 'instagram', label: 'Instagram', category: 'Réseaux sociaux' },
  { id: 'tiktok', label: 'TikTok', category: 'Réseaux sociaux' },
  { id: 'youtube', label: 'YouTube', category: 'Contenu vidéo' },
  { id: 'email-marketing', label: 'Email Marketing', category: 'Marketing direct' },
  { id: 'seo-blog', label: 'SEO/Blog', category: 'Contenu organique' },
  { id: 'webinaires', label: 'Webinaires', category: 'Événements' },
  { id: 'podcasts', label: 'Podcasts', category: 'Contenu audio' },
  { id: 'evenements', label: 'Événements', category: 'Événements' },
  { id: 'partenariats', label: 'Partenariats', category: 'Collaborations' },
  { id: 'bouche-oreille', label: 'Bouche-à-oreille', category: 'Organique' },
  { id: 'affiliation', label: 'Affiliation', category: 'Partenariats' }
];

const BUDGET_OPTIONS = [
  { id: 'budget-limite', label: 'Budget limité (<100€)', description: 'Clients avec peu de moyens financiers' },
  { id: 'budget-modere', label: 'Budget modéré (100-500€)', description: 'Clients avec budget raisonnable' },
  { id: 'budget-confortable', label: 'Budget confortable (500-2000€)', description: 'Clients prêts à investir' },
  { id: 'budget-premium', label: 'Budget premium (2000€+)', description: 'Clients haut de gamme' },
  { id: 'budget-mensuel', label: 'Abonnement mensuel (50-200€/mois)', description: 'Modèle récurrent' }
];

export function MarketingChannelsStep({ data, onChange, errors, isActive }: MarketingChannelsStepProps) {
  const handleBudgetChange = (budgetId: string) => {
    const budget = BUDGET_OPTIONS.find(b => b.id === budgetId);
    onChange({ budgetCible: budget?.label || '' });
  };

  const handleCanalToggle = (canalId: string) => {
    const canal = CANAUX_OPTIONS.find(c => c.id === canalId);
    if (!canal) return;

    const currentCanaux = data.canaux || [];
    const newCanaux = currentCanaux.includes(canal.label)
      ? currentCanaux.filter((c: string) => c !== canal.label)
      : [...currentCanaux, canal.label];
    
    onChange({ canaux: newCanaux });
  };

  const groupedCanaux = CANAUX_OPTIONS.reduce((acc, canal) => {
    if (!acc[canal.category]) {
      acc[canal.category] = [];
    }
    acc[canal.category].push(canal);
    return acc;
  }, {} as Record<string, typeof CANAUX_OPTIONS>);

  const selectedBudget = BUDGET_OPTIONS.find(b => b.label === data.budgetCible);
  const selectedCanaux = data.canaux || [];

  return (
    <div className="space-y-8">
      {/* Budget cible */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <DollarSign className="w-4 h-4" />
          Budget cible de vos clients
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Combien vos clients peuvent-ils investir ?
            </div>
          </div>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((budget) => (
            <button
              key={budget.id}
              type="button"
              onClick={() => handleBudgetChange(budget.id)}
              className={`
                p-4 text-left rounded-lg border transition-all
                ${selectedBudget?.id === budget.id
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-[#1a1a1a] border-[#232323] text-gray-300 hover:border-[#333333] hover:bg-[#232323]'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{budget.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{budget.description}</div>
                </div>
                {selectedBudget?.id === budget.id && (
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {errors.budgetCible && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.budgetCible}
          </p>
        )}
      </div>

      {/* Canaux marketing */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Canaux marketing envisagés
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Sélectionnez tous les canaux pertinents pour votre business
            </div>
          </div>
        </label>
        
        <div className="space-y-6">
          {Object.entries(groupedCanaux).map(([category, canaux]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {canaux.map((canal) => (
                  <button
                    key={canal.id}
                    type="button"
                    onClick={() => handleCanalToggle(canal.id)}
                    className={`
                      p-3 text-sm rounded-lg border transition-all text-center
                      ${selectedCanaux.includes(canal.label)
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-[#1a1a1a] border-[#232323] text-gray-300 hover:border-[#333333] hover:bg-[#232323]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {selectedCanaux.includes(canal.label) && (
                        <CheckCircle className="w-3 h-3 text-purple-400" />
                      )}
                      <span>{canal.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {selectedCanaux.length > 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              ✓ {selectedCanaux.length} canal{selectedCanaux.length > 1 ? 'aux' : ''} sélectionné{selectedCanaux.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        {errors.canaux && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.canaux}
          </p>
        )}
      </div>

      {/* Conseil Dropskills AI */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium mb-1">
              Optimisation Dropskills AI
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Dropskills AI analysera la cohérence entre votre budget cible et vos canaux marketing 
              pour identifier les segments les plus rentables et les stratégies d'acquisition optimales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingChannelsStep;