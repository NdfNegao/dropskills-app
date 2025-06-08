import React from 'react';
import { MessageSquare } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface TonaliteStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

const TONALITE_OPTIONS = [
  'Professionnel et expert',
  'Amical et accessible', 
  'Inspirant et motivant',
  'Direct et sans détour',
  'Éducatif et pédagogue',
  'Luxe et premium',
  'Jeune et dynamique',
  'Rassurant et bienveillant',
  'Provocateur et disruptif'
];

export function TonaliteStep({ data, onChange, errors }: TonaliteStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Tonalité & Style</h2>
        <p className="text-gray-400">Quel style de communication correspond à votre marque ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Tonalité de communication"
          tooltip="Le style de communication qui reflète votre personnalité de marque"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TONALITE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange('tonalite', option)}
                className={`p-4 rounded-lg border text-left transition-all hover:border-[#ff0033] ${
                  data.tonalite === option
                    ? 'border-[#ff0033] bg-[#ff0033]/10 text-white'
                    : 'border-[#232323] bg-[#1a1a1a] text-gray-300 hover:text-white'
                }`}
              >
                <div className="font-medium">{option}</div>
              </button>
            ))}
          </div>
          {errors.tonalite && (
            <p className="text-red-500 text-sm mt-1">{errors.tonalite}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock title="Conseil Dropskills AI">
        La tonalité doit être cohérente avec votre audience cible et votre
        positionnement. Une tonalité professionnelle convient aux services B2B,
        tandis qu'une approche plus décontractée peut mieux fonctionner pour le
        B2C.
      </ConseilBlock>
    </div>
  );
}