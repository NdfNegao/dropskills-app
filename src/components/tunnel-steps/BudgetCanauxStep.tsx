import React from 'react';
import { DollarSign, Megaphone } from 'lucide-react';
import StandardInput from '../ui/StandardInput';
import TooltipField from '../ui/TooltipField';
import ConseilBlock from '../ui/ConseilBlock';

const CANAUX_OPTIONS = [
  'Google Ads',
  'Facebook/Instagram Ads',
  'LinkedIn Ads',
  'TikTok Ads',
  'YouTube Ads',
  'Email Marketing',
  'SEO/Contenu organique',
  'Réseaux sociaux organiques',
  'Influenceurs',
  'Webinaires',
  'Podcasts',
  'Partenariats',
  'Affiliation'
];

interface BudgetCanauxStepProps {
  data: {
    budgetCible: string;
    canauxEntree: string[];
  };
  onUpdate: (field: string, value: string | string[]) => void;
  errors?: Record<string, string>;
}

export function BudgetCanauxStep({ data, onUpdate, errors }: BudgetCanauxStepProps) {
  const handleCanalToggle = (canal: string) => {
    const newCanaux = data.canauxEntree.includes(canal)
      ? data.canauxEntree.filter(c => c !== canal)
      : [...data.canauxEntree, canal];
    
    onUpdate('canauxEntree', newCanaux);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Budget & Canaux</h2>
        <p className="text-gray-400">Définissez votre budget et vos canaux d'acquisition</p>
      </div>

      <StandardInput
        label="Budget cible de vos prospects"
        tooltip="Indiquez le budget moyen que vos prospects sont prêts à investir. Cela aide à calibrer le niveau de sophistication du tunnel et les arguments de vente."
        placeholder="Ex: 500€ - 2000€, Budget serré, Premium 5000€+..."
        value={data.budgetCible}
        onChange={(value) => onUpdate('budgetCible', value)}
        error={errors?.budgetCible}
        icon={DollarSign}
        maxLength={100}
      />

      <TooltipField
        label="Canaux d'entrée dans le tunnel"
        tooltip="Sélectionnez tous les canaux par lesquels vos prospects peuvent découvrir et entrer dans votre tunnel. Chaque canal peut nécessiter une approche légèrement différente."
        icon={Megaphone}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CANAUX_OPTIONS.map((canal) => {
            const isSelected = data.canauxEntree.includes(canal);
            return (
              <button
                key={canal}
                onClick={() => handleCanalToggle(canal)}
                className={`p-3 rounded-lg border text-left transition-all hover:scale-105 ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-purple-500 border-purple-500' 
                      : 'border-gray-500'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{canal}</span>
                </div>
              </button>
            );
          })}
        </div>
        {data.canauxEntree.length > 0 && (
          <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-300 text-sm">
              <strong>{data.canauxEntree.length} canaux sélectionnés :</strong> {data.canauxEntree.join(', ')}
            </p>
          </div>
        )}
        {errors?.canauxEntree && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.canauxEntree}
          </p>
        )}
      </TooltipField>

      <ConseilBlock variant="purple" icon={<Megaphone className="w-4 h-4" />}>
        <strong>Optimisation multi-canaux :</strong>
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <p className="font-medium text-purple-200 mb-1">🎯 Canaux payants sélectionnés :</p>
            {data.canauxEntree.filter(c => c.includes('Ads')).length > 0 ? (
              <ul className="space-y-1">
                {data.canauxEntree.filter(c => c.includes('Ads')).map(canal => (
                  <li key={canal}>• <strong>{canal}</strong> : Landing page optimisée pour la conversion</li>
                ))}
              </ul>
            ) : (
              <p>• Aucun canal payant sélectionné</p>
            )}
          </div>
          
          <div>
            <p className="font-medium text-purple-200 mb-1">🌱 Canaux organiques sélectionnés :</p>
            {data.canauxEntree.filter(c => !c.includes('Ads')).length > 0 ? (
              <ul className="space-y-1">
                {data.canauxEntree.filter(c => !c.includes('Ads')).slice(0, 3).map(canal => (
                  <li key={canal}>• <strong>{canal}</strong> : Contenu éducatif et nurturing</li>
                ))}
                {data.canauxEntree.filter(c => !c.includes('Ads')).length > 3 && (
                  <li>• Et {data.canauxEntree.filter(c => !c.includes('Ads')).length - 3} autres canaux...</li>
                )}
              </ul>
            ) : (
              <p>• Aucun canal organique sélectionné</p>
            )}
          </div>

          {data.budgetCible && (
            <div className="mt-3 p-2 bg-purple-500/5 rounded">
              <p className="font-medium text-purple-200">💰 Recommandation budget :</p>
              <p>Avec un budget cible de <strong>{data.budgetCible}</strong>, votre tunnel devrait refléter ce niveau d'investissement dans sa sophistication et ses arguments.</p>
            </div>
          )}
        </div>
      </ConseilBlock>
    </div>
  );
}

export default BudgetCanauxStep;