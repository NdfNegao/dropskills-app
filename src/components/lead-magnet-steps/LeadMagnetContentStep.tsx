'use client';

import React from 'react';
import { AlertTriangle, Lightbulb, HelpCircle } from 'lucide-react';
import { LeadMagnetFormData } from '../LeadMagnetWizard';

interface LeadMagnetContentStepProps {
  data: LeadMagnetFormData;
  onChange: (updates: Partial<LeadMagnetFormData>) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function LeadMagnetContentStep({ data, onChange, errors }: LeadMagnetContentStepProps) {
  const handleInputChange = (field: keyof LeadMagnetFormData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Problème principal */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <AlertTriangle className="w-4 h-4" />
          Problème principal à résoudre
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quel est le problème #1 que rencontre votre audience ?
            </div>
          </div>
        </label>
        <textarea
          value={data.problem || ''}
          onChange={(e) => handleInputChange('problem', e.target.value)}
          placeholder="Ex: Manque de visibilité en ligne, Difficultés à générer des leads qualifiés, Problèmes de conversion..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.problem ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.problem && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.problem}
          </p>
        )}
      </div>

      {/* Solution proposée */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Lightbulb className="w-4 h-4" />
          Solution que vous proposez
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Comment votre lead magnet va-t-il résoudre ce problème ?
            </div>
          </div>
        </label>
        <textarea
          value={data.solution || ''}
          onChange={(e) => handleInputChange('solution', e.target.value)}
          placeholder="Ex: Augmenter sa visibilité grâce aux réseaux sociaux, Générer plus de leads avec une stratégie content marketing..."
          rows={3}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.solution ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.solution && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.solution}
          </p>
        )}
      </div>

      {/* Bloc conseil */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed mb-3">
              Un lead magnet efficace résout un problème spécifique et urgent de votre audience. 
              Concentrez-vous sur UN problème principal plutôt que d'essayer de tout couvrir.
            </p>
            <div className="text-blue-300 text-xs">
              <strong>💡 Astuce :</strong> Utilisez les mots exacts que votre audience utilise pour décrire son problème.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadMagnetContentStep;