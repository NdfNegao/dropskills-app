import React from 'react';
import { Target } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface ClientStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function ClientStep({ data, onChange, errors }: ClientStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Client Idéal</h2>
        <p className="text-gray-400">Qui est votre client idéal et quelles sont ses caractéristiques ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Description de votre client idéal"
          tooltip="Profil détaillé de votre client parfait : démographie, besoins, comportements"
          required
        >
          <textarea
            value={data.clientIdeal}
            onChange={(e) => onChange('clientIdeal', e.target.value)}
            placeholder="Ex: Entrepreneurs 30-45 ans, CA 100k-500k€, manquent de temps, veulent automatiser, prêts à investir dans des solutions efficaces, utilisent déjà des outils digitaux..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.clientIdeal ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.clientIdeal && (
            <p className="text-red-500 text-sm mt-1">{errors.clientIdeal}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Plus votre description du client idéal est précise, plus votre USP sera pertinente. Incluez les aspects démographiques, psychographiques et comportementaux. Pensez à leurs frustrations, leurs aspirations et leur pouvoir d'achat."
      />
    </div>
  );
}