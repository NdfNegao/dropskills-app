'use client';

import React from 'react';
import { MessageSquare, HelpCircle, CheckCircle, Sparkles } from 'lucide-react';

interface TonalityStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

const TONALITE_OPTIONS = [
  {
    id: 'professionnel-expert',
    label: 'Professionnel et expert',
    description: 'Ton sérieux, crédible, avec expertise technique',
    example: '"Nos solutions optimisent votre ROI de 40% en moyenne"',
    color: 'blue'
  },
  {
    id: 'amical-accessible',
    label: 'Amical et accessible',
    description: 'Ton chaleureux, proche, facile à comprendre',
    example: '"On va t\'aider à booster ton business ensemble !"',
    color: 'green'
  },
  {
    id: 'inspirant-motivant',
    label: 'Inspirant et motivant',
    description: 'Ton énergique, qui pousse à l\'action',
    example: '"Transforme ta passion en empire financier !"',
    color: 'orange'
  },
  {
    id: 'direct-detour',
    label: 'Direct et sans détour',
    description: 'Ton franc, efficace, va droit au but',
    example: '"Stop aux excuses. Voici comment réussir."',
    color: 'red'
  },
  {
    id: 'educatif-pedagogue',
    label: 'Éducatif et pédagogue',
    description: 'Ton qui explique, forme, accompagne',
    example: '"Étape 1 : Comprendre votre marché cible..."',
    color: 'purple'
  },
  {
    id: 'luxe-premium',
    label: 'Luxe et premium',
    description: 'Ton exclusif, haut de gamme, sophistiqué',
    example: '"Une expérience d\'exception pour une élite exigeante"',
    color: 'yellow'
  },
  {
    id: 'jeune-dynamique',
    label: 'Jeune et dynamique',
    description: 'Ton moderne, tendance, énergique',
    example: '"Prêt à disrupter ton marché ? Let\'s go ! 🚀"',
    color: 'pink'
  },
  {
    id: 'rassurant-bienveillant',
    label: 'Rassurant et bienveillant',
    description: 'Ton empathique, sécurisant, compréhensif',
    example: '"Nous comprenons vos défis et sommes là pour vous"',
    color: 'teal'
  }
];

const colorClasses = {
  blue: 'border-blue-500 bg-blue-500/20 text-blue-300',
  green: 'border-green-500 bg-green-500/20 text-green-300',
  orange: 'border-orange-500 bg-orange-500/20 text-orange-300',
  red: 'border-red-500 bg-red-500/20 text-red-300',
  purple: 'border-purple-500 bg-purple-500/20 text-purple-300',
  yellow: 'border-yellow-500 bg-yellow-500/20 text-yellow-300',
  pink: 'border-pink-500 bg-pink-500/20 text-pink-300',
  teal: 'border-teal-500 bg-teal-500/20 text-teal-300'
};

export function TonalityStep({ data, onChange, errors, isActive }: TonalityStepProps) {
  const handleTonalityChange = (tonalityId: string) => {
    const tonality = TONALITE_OPTIONS.find(t => t.id === tonalityId);
    onChange({ tonalite: tonality?.label || '' });
  };

  const selectedTonality = TONALITE_OPTIONS.find(t => t.label === data.tonalite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Définissez votre tonalité de communication</h3>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Choisissez le style de communication qui correspond le mieux à votre marque et à votre audience cible.
        </p>
      </div>

      {/* Tonality Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TONALITE_OPTIONS.map((tonality) => (
          <button
            key={tonality.id}
            type="button"
            onClick={() => handleTonalityChange(tonality.id)}
            className={`
              p-4 text-left rounded-lg border transition-all group hover:scale-[1.02]
              ${selectedTonality?.id === tonality.id
                ? colorClasses[tonality.color as keyof typeof colorClasses]
                : 'bg-[#1a1a1a] border-[#232323] text-gray-300 hover:border-[#333333] hover:bg-[#232323]'
              }
            `}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{tonality.label}</div>
                  <div className="text-xs opacity-80">{tonality.description}</div>
                </div>
                {selectedTonality?.id === tonality.id && (
                  <CheckCircle className="w-4 h-4 flex-shrink-0 ml-2" />
                )}
              </div>
              
              <div className="text-xs italic opacity-70 border-l-2 border-current pl-3">
                {tonality.example}
              </div>
            </div>
          </button>
        ))}
      </div>

      {errors.tonalite && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <div className="w-1 h-1 bg-red-400 rounded-full" />
          {errors.tonalite}
        </p>
      )}

      {/* Selected Tonality Preview */}
      {selectedTonality && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-purple-400 font-medium mb-2">Tonalité sélectionnée : {selectedTonality.label}</h4>
              <p className="text-gray-300 text-sm mb-3">{selectedTonality.description}</p>
              <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#232323]">
                <p className="text-xs text-gray-400 mb-1">Exemple de message :</p>
                <p className="text-sm text-white italic">{selectedTonality.example}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Récapitulatif */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          Récapitulatif de votre profil
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Secteur :</span>
            <span className="text-white">{data.secteur || 'Non défini'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Zone géographique :</span>
            <span className="text-white">{data.zoneGeographique || 'Non définie'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Budget cible :</span>
            <span className="text-white">{data.budgetCible || 'Non défini'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Canaux :</span>
            <span className="text-white">
              {data.canaux?.length > 0 ? `${data.canaux.length} sélectionné${data.canaux.length > 1 ? 's' : ''}` : 'Aucun'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tonalité :</span>
            <span className="text-white">{data.tonalite || 'Non définie'}</span>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
            Prêt pour l'analyse Dropskills AI ?
          </h4>
        </div>
        <p className="text-gray-300 text-sm">
          Dropskills AI va analyser toutes ces informations pour créer votre profil client idéal détaillé et actionnable.
        </p>
      </div>
    </div>
  );
}

export default TonalityStep;