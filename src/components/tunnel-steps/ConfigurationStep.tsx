import React from 'react';
import { Settings, Zap, Palette, BarChart3 } from 'lucide-react';
import StandardInput from '../ui/StandardInput';
import TooltipField from '../ui/TooltipField';
import ConseilBlock from '../ui/ConseilBlock';

const LONGUEUR_OPTIONS = [
  'Court (2-3 étapes)',
  'Moyen (4-5 étapes)',
  'Long (6+ étapes)'
];

const TONALITE_OPTIONS = [
  'Professionnel et expert',
  'Amical et accessible',
  'Urgent et persuasif',
  'Éducatif et pédagogue',
  'Luxe et premium'
];

interface ConfigurationStepProps {
  data: {
    actifsExistants: string;
    automatisationDesiree: string;
    tonaliteStyle: string;
    longueurTunnel: string;
    inclureUpsell: boolean;
  };
  onUpdate: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

export function ConfigurationStep({ data, onUpdate, errors }: ConfigurationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Configuration & Style</h2>
        <p className="text-gray-400">Personnalisez la structure et le style de votre tunnel</p>
      </div>

      <StandardInput
        label="Actifs marketing existants"
        tooltip="Listez vos ressources actuelles : site web, blog, réseaux sociaux, liste email, contenus, témoignages, etc. Cela permet d'optimiser l'intégration du tunnel."
        placeholder="Ex: Site WordPress avec 5000 visiteurs/mois, liste email 2000 contacts, Instagram 10k followers, 50 témoignages clients..."
        value={data.actifsExistants}
        onChange={(value) => onUpdate('actifsExistants', value)}
        error={errors?.actifsExistants}
        multiline
        rows={3}
        maxLength={300}
        icon={BarChart3}
      />

      <StandardInput
        label="Automatisation désirée"
        tooltip="Décrivez le niveau d'automatisation souhaité : emails de suivi, segmentation, scoring, intégrations CRM, notifications, etc."
        placeholder="Ex: Emails automatiques de suivi, segmentation par comportement, intégration CRM, notifications Slack..."
        value={data.automatisationDesiree}
        onChange={(value) => onUpdate('automatisationDesiree', value)}
        error={errors?.automatisationDesiree}
        multiline
        rows={3}
        maxLength={300}
        icon={Zap}
      />

      <TooltipField
        label="Tonalité et style de communication"
        tooltip="Choisissez le ton qui correspond à votre marque et à votre audience. Cela influencera tous les textes et messages du tunnel."
        icon={Palette}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TONALITE_OPTIONS.map((tonalite) => {
            const isSelected = data.tonaliteStyle === tonalite;
            return (
              <button
                key={tonalite}
                onClick={() => onUpdate('tonaliteStyle', tonalite)}
                className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isSelected ? 'bg-indigo-400' : 'bg-gray-600'
                  }`} />
                  <div>
                    <div className="font-medium">{tonalite}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {tonalite === 'Professionnel et expert' && "Crédibilité, autorité, expertise"}
                      {tonalite === 'Amical et accessible' && "Proximité, simplicité, bienveillance"}
                      {tonalite === 'Urgent et persuasif' && "Action immédiate, FOMO, urgence"}
                      {tonalite === 'Éducatif et pédagogue' && "Formation, apprentissage, guidance"}
                      {tonalite === 'Luxe et premium' && "Exclusivité, qualité supérieure, prestige"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors?.tonaliteStyle && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.tonaliteStyle}
          </p>
        )}
      </TooltipField>

      <TooltipField
        label="Longueur du tunnel"
        tooltip="La longueur optimale dépend de votre audience et de la complexité de votre offre. Plus l'offre est chère ou complexe, plus le tunnel peut être long."
        icon={BarChart3}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LONGUEUR_OPTIONS.map((longueur, index) => {
            const isSelected = data.longueurTunnel === longueur;
            const colors = ['bg-green-500/10 border-green-500/30', 'bg-yellow-500/10 border-yellow-500/30', 'bg-red-500/10 border-red-500/30'];
            return (
              <button
                key={longueur}
                onClick={() => onUpdate('longueurTunnel', longueur)}
                className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                  isSelected
                    ? colors[index] + ' text-white'
                    : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-medium mb-2">{longueur}</div>
                <div className="text-xs opacity-75">
                  {index === 0 && "Conversion rapide"}
                  {index === 1 && "Équilibre optimal"}
                  {index === 2 && "Éducation complète"}
                </div>
              </button>
            );
          })}
        </div>
        {errors?.longueurTunnel && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.longueurTunnel}
          </p>
        )}
      </TooltipField>

      <TooltipField
        label="Options avancées"
        tooltip="Configurez des fonctionnalités supplémentaires pour optimiser votre tunnel de vente."
        icon={Settings}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-[#333] rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
            <input
              type="checkbox"
              checked={data.inclureUpsell}
              onChange={(e) => onUpdate('inclureUpsell', e.target.checked)}
              className="w-5 h-5 text-indigo-500 bg-[#1a1a1a] border-[#333] rounded focus:ring-indigo-500 focus:ring-2"
            />
            <div className="flex-1">
              <div className="font-medium text-white">Inclure des upsells/cross-sells</div>
              <div className="text-sm text-gray-400">Ajouter des offres complémentaires pour augmenter le panier moyen</div>
            </div>
          </label>
        </div>
      </TooltipField>

      <ConseilBlock variant="indigo" icon={<Settings className="w-4 h-4" />}>
        <strong>Configuration optimale :</strong>
        <div className="mt-2 space-y-2 text-sm">
          {data.longueurTunnel && (
            <p>• <strong>Tunnel {data.longueurTunnel.toLowerCase()}</strong> : 
              {data.longueurTunnel.includes('Court') && "Idéal pour les offres simples et audiences chaudes"}
              {data.longueurTunnel.includes('Moyen') && "Parfait pour la plupart des offres B2B et formations"}
              {data.longueurTunnel.includes('Long') && "Recommandé pour les offres premium et audiences froides"}
            </p>
          )}
          {data.tonaliteStyle && (
            <p>• <strong>Style {data.tonaliteStyle.toLowerCase()}</strong> : Tous les textes seront adaptés à cette tonalité</p>
          )}
          {data.inclureUpsell && (
            <p>• <strong>Upsells activés</strong> : Peut augmenter le CA de 30-50% en moyenne</p>
          )}
          {data.automatisationDesiree && (
            <p>• <strong>Automatisation</strong> : Réduira votre charge de travail et améliorera le suivi</p>
          )}
        </div>
      </ConseilBlock>
    </div>
  );
}

export default ConfigurationStep;