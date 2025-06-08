import React from 'react';
import { Target, HelpCircle } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface PromesseStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function PromesseStep({ data, onChange, errors }: PromesseStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Résultat/Promesse</h2>
        <p className="text-gray-400">Quel résultat concret obtiendront vos clients ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Résultat/Promesse principale"
          tooltip="Quel résultat concret obtiendront vos clients ?"
          required
        >
          <textarea
            value={data.resultatPromesse}
            onChange={(e) => onChange('resultatPromesse', e.target.value)}
            placeholder="Ex: Générer 5000€ de revenus passifs en 90 jours, Perdre 10kg sans régime strict, Automatiser 80% de votre marketing..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.resultatPromesse ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.resultatPromesse && (
            <p className="text-red-500 text-sm mt-1">{errors.resultatPromesse}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Une promesse efficace doit être spécifique, mesurable et limitée dans le temps. Évitez les termes vagues comme 'succès' ou 'amélioration'. Préférez des résultats concrets avec des chiffres et des délais précis."
      />
    </div>
  );
}