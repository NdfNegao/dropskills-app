import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { USPFormData } from '@/types/usp';
import { ConseilBlock } from '../ui/ConseilBlock';
import { TooltipField } from '../ui/TooltipField';

interface ProblemeStepProps {
  data: USPFormData;
  onChange: (field: keyof USPFormData, value: string) => void;
  errors: Record<string, string>;
}

export function ProblemeStep({ data, onChange, errors }: ProblemeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Problème Principal</h2>
        <p className="text-gray-400">Quel problème majeur résolvez-vous pour vos clients ?</p>
      </div>

      <div className="space-y-4">
        <TooltipField
          label="Problème principal que vous résolvez"
          tooltip="Décrivez le problème le plus douloureux que vos clients rencontrent"
          required
        >
          <textarea
            value={data.problemePrincipal}
            onChange={(e) => onChange('problemePrincipal', e.target.value)}
            placeholder="Ex: Les entrepreneurs perdent 15h/semaine sur des tâches répétitives, Les régimes traditionnels échouent dans 95% des cas, Le marketing manuel limite la croissance..."
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent transition-all resize-none ${
              errors.problemePrincipal ? 'border-red-500' : 'border-[#232323]'
            }`}
          />
          {errors.problemePrincipal && (
            <p className="text-red-500 text-sm mt-1">{errors.problemePrincipal}</p>
          )}
        </TooltipField>
      </div>

      <ConseilBlock
        title="Conseil Dropskills AI"
        content="Identifiez le problème le plus douloureux et urgent pour votre audience. Plus le problème est spécifique et émotionnellement chargé, plus votre solution paraîtra indispensable. Utilisez des statistiques ou des faits marquants si possible."
      />
    </div>
  );
}