import React from 'react';
import { Users } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface ConcurrentsStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function ConcurrentsStep({ data, onChange, errors }: ConcurrentsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Environnement Concurrentiel</h2>
        <p className="text-gray-400">Qui sont vos principaux concurrents et comment vous en différenciez-vous ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Analyse de vos concurrents"
          tooltip="Décrivez vos principaux concurrents et leurs faiblesses que vous exploitez"
          required
        >
          <textarea
            value={data.concurrents}
            onChange={(e) => onChange('concurrents', e.target.value)}
            placeholder="Ex: Concurrents principaux : X, Y, Z. Leurs faiblesses : prix élevés, service client défaillant, solutions complexes. Notre avantage : simplicité, prix accessible, support 24/7..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.concurrents ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.concurrents && (
            <p className="text-red-500 text-sm mt-1">{errors.concurrents}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Analysez objectivement vos concurrents pour identifier leurs points faibles. Votre USP doit exploiter ces faiblesses tout en mettant en avant vos forces. Évitez de dénigrer, concentrez-vous sur votre valeur ajoutée."
      />
    </div>
  );
}