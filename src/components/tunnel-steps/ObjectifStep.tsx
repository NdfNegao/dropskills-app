import React from 'react';
import { Target } from 'lucide-react';
import TooltipField from '../ui/TooltipField';
import ConseilBlock from '../ui/ConseilBlock';

const OBJECTIFS_OPTIONS = [
  'Vendre un produit/service',
  'Générer des leads qualifiés',
  'Construire une liste email',
  'Promouvoir un événement',
  'Lancer un nouveau produit',
  'Fidéliser les clients existants',
  'Recruter des partenaires',
  'Autre objectif spécifique'
];

interface ObjectifStepProps {
  data: {
    objectifTunnel: string;
  };
  onUpdate: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function ObjectifStep({ data, onUpdate, errors }: ObjectifStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Objectif du Tunnel</h2>
        <p className="text-gray-400">Définissez clairement votre objectif principal</p>
      </div>

      <TooltipField
        label="Objectif principal du tunnel"
        tooltip="Choisissez l'objectif principal que vous souhaitez atteindre avec ce tunnel de vente. Cela déterminera la structure et les étapes optimales."
        icon={Target}
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OBJECTIFS_OPTIONS.map((objectif) => (
            <button
              key={objectif}
              onClick={() => onUpdate('objectifTunnel', objectif)}
              className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${
                data.objectifTunnel === objectif
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  data.objectifTunnel === objectif ? 'bg-blue-400' : 'bg-gray-600'
                }`} />
                <span className="font-medium">{objectif}</span>
              </div>
            </button>
          ))}
        </div>
        {errors?.objectifTunnel && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.objectifTunnel}
          </p>
        )}
      </TooltipField>

      <ConseilBlock variant="blue" icon={<Target className="w-4 h-4" />}>
        <strong>Optimisation selon votre objectif :</strong>
        <div className="mt-2 space-y-2 text-sm">
          {data.objectifTunnel === 'Vendre un produit/service' && (
            <p>• Focus sur la <strong>conversion directe</strong> avec pages de vente optimisées et gestion des objections</p>
          )}
          {data.objectifTunnel === 'Générer des leads qualifiés' && (
            <p>• Emphasis sur la <strong>qualification</strong> avec formulaires progressifs et scoring automatique</p>
          )}
          {data.objectifTunnel === 'Construire une liste email' && (
            <p>• Priorité au <strong>lead magnet</strong> attractif et séquence de nurturing automatisée</p>
          )}
          {data.objectifTunnel === 'Promouvoir un événement' && (
            <p>• Structure orientée <strong>inscription</strong> avec rappels automatiques et gestion des places</p>
          )}
          {!data.objectifTunnel && (
            <p>• Sélectionnez un objectif pour recevoir des conseils personnalisés</p>
          )}
        </div>
      </ConseilBlock>
    </div>
  );
}

export default ObjectifStep;