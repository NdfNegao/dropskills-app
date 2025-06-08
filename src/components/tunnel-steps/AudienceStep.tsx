import React from 'react';
import { Users } from 'lucide-react';
import TooltipField from '../ui/TooltipField';
import ConseilBlock from '../ui/ConseilBlock';

const MATURITE_OPTIONS = [
  'Débutants (découvrent le problème)',
  'Conscients (connaissent le problème)',
  'Considèrent (évaluent les solutions)',
  'Prêts à acheter (comparent les offres)',
  'Clients existants (upsell/cross-sell)'
];

interface AudienceStepProps {
  data: {
    maturiteAudience: string;
  };
  onUpdate: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function AudienceStep({ data, onUpdate, errors }: AudienceStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Maturité de l'Audience</h2>
        <p className="text-gray-400">Évaluez le niveau de conscience de votre audience</p>
      </div>

      <TooltipField
        label="Niveau de maturité de votre audience"
        tooltip="Le niveau de maturité détermine le type de contenu et d'approche nécessaire. Une audience débutante nécessite plus d'éducation, tandis qu'une audience mature peut être directement orientée vers l'achat."
        icon={Users}
        required
      >
        <div className="space-y-3">
          {MATURITE_OPTIONS.map((niveau, index) => {
            const isSelected = data.maturiteAudience === niveau;
            const colors = [
              'bg-red-500/10 border-red-500/30 text-red-300',
              'bg-orange-500/10 border-orange-500/30 text-orange-300',
              'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
              'bg-blue-500/10 border-blue-500/30 text-blue-300',
              'bg-green-500/10 border-green-500/30 text-green-300'
            ];
            
            return (
              <button
                key={niveau}
                onClick={() => onUpdate('maturiteAudience', niveau)}
                className={`w-full p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? colors[index]
                    : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current/20">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{niveau}</div>
                    <div className="text-xs opacity-75">
                      {index === 0 && "Nécessite beaucoup d'éducation et de sensibilisation"}
                      {index === 1 && "Comprend le problème, cherche des informations"}
                      {index === 2 && "Compare activement différentes solutions"}
                      {index === 3 && "Prêt à prendre une décision d'achat"}
                      {index === 4 && "Connaît déjà votre marque et vos produits"}
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isSelected ? 'bg-current border-current' : 'border-gray-500'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
        {errors?.maturiteAudience && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.maturiteAudience}
          </p>
        )}
      </TooltipField>

      <ConseilBlock variant="green" icon={<Users className="w-4 h-4" />}>
        <strong>Stratégie selon la maturité :</strong>
        <div className="mt-2 space-y-2 text-sm">
          {data.maturiteAudience?.includes('Débutants') && (
            <div>
              <p>• <strong>Tunnel éducatif long</strong> : 6-8 étapes avec beaucoup de contenu</p>
              <p>• Focus sur la <strong>sensibilisation</strong> et l'éducation avant la vente</p>
              <p>• Utilisez des <strong>lead magnets</strong> pour capturer l'attention</p>
            </div>
          )}
          {data.maturiteAudience?.includes('Conscients') && (
            <div>
              <p>• <strong>Tunnel moyen</strong> : 4-6 étapes avec contenu informatif</p>
              <p>• Mettez l'accent sur les <strong>bénéfices</strong> et solutions</p>
              <p>• Intégrez des <strong>études de cas</strong> et témoignages</p>
            </div>
          )}
          {data.maturiteAudience?.includes('Considèrent') && (
            <div>
              <p>• <strong>Tunnel de comparaison</strong> : 3-5 étapes</p>
              <p>• Highlight vos <strong>avantages concurrentiels</strong></p>
              <p>• Proposez des <strong>démonstrations</strong> ou essais gratuits</p>
            </div>
          )}
          {data.maturiteAudience?.includes('Prêts à acheter') && (
            <div>
              <p>• <strong>Tunnel court et direct</strong> : 2-3 étapes</p>
              <p>• Focus sur l'<strong>urgence</strong> et les offres limitées</p>
              <p>• Simplifiez au maximum le <strong>processus d'achat</strong></p>
            </div>
          )}
          {data.maturiteAudience?.includes('Clients existants') && (
            <div>
              <p>• <strong>Tunnel de fidélisation</strong> : 2-4 étapes</p>
              <p>• Mettez en avant la <strong>continuité</strong> et les upgrades</p>
              <p>• Utilisez l'<strong>historique d'achat</strong> pour personnaliser</p>
            </div>
          )}
          {!data.maturiteAudience && (
            <p>• Sélectionnez le niveau de maturité pour recevoir une stratégie personnalisée</p>
          )}
        </div>
      </ConseilBlock>
    </div>
  );
}

export default AudienceStep;