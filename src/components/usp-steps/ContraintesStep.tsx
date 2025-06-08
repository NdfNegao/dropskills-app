import React from 'react';
import { Settings } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface ContraintesStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function ContraintesStep({ data, onChange, errors }: ContraintesStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Contraintes & Spécificités</h2>
        <p className="text-gray-400">Y a-t-il des contraintes particulières à prendre en compte ? (Optionnel)</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Contraintes et spécificités"
          tooltip="Limitations, réglementations, spécificités sectorielles à considérer"
          required={false}
        >
          <textarea
            value={data.contraintes}
            onChange={(e) => onChange('contraintes', e.target.value)}
            placeholder="Ex: Réglementation RGPD, Budget limité, Marché local uniquement, Contraintes techniques, Saisonnalité, Délais courts..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.contraintes ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.contraintes && (
            <p className="text-red-500 text-sm mt-1">{errors.contraintes}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Les contraintes peuvent devenir des avantages concurrentiels si elles sont bien exploitées. Par exemple, une contrainte géographique peut devenir un argument de proximité et de service local personnalisé."
      />
    </div>
  );
}