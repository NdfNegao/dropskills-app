import React from 'react';
import { Trophy } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface PreuveStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function PreuveStep({ data, onChange, errors }: PreuveStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Preuve & Crédibilité</h2>
        <p className="text-gray-400">Quelles preuves démontrent votre expertise et vos résultats ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Preuves et arguments de crédibilité"
          tooltip="Témoignages, résultats, certifications, expérience qui prouvent votre expertise"
          required
        >
          <textarea
            value={data.preuveArgument}
            onChange={(e) => onChange('preuveArgument', e.target.value)}
            placeholder="Ex: +500 clients satisfaits, 15 ans d'expérience, Certifié Google Partner, Résultats moyens de +300% de ROI, Témoignages vidéo disponibles..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.preuveArgument ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.preuveArgument && (
            <p className="text-red-500 text-sm mt-1">{errors.preuveArgument}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Les preuves sociales sont cruciales pour la crédibilité. Privilégiez les chiffres concrets, les témoignages spécifiques et les résultats mesurables. Une seule preuve forte vaut mieux que plusieurs preuves faibles."
      />
    </div>
  );
}