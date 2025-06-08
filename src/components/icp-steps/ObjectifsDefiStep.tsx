import React from 'react';
import { Target, AlertTriangle, HelpCircle } from 'lucide-react';

interface ObjectifsDefiStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function ObjectifsDefiStep({ data, onChange, errors }: ObjectifsDefiStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Objectifs */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Target className="w-4 h-4" />
          Objectifs principaux
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quels sont vos objectifs business principaux ?
            </div>
          </div>
        </label>
        <textarea
          value={data.objectifs || ''}
          onChange={(e) => handleInputChange('objectifs', e.target.value)}
          placeholder="Ex: Augmenter le CA de 50%, développer la notoriété, fidéliser la clientèle..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.objectifs ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.objectifs && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.objectifs}
          </p>
        )}
      </div>

      {/* Défis */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <AlertTriangle className="w-4 h-4" />
          Défis et challenges actuels
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quels sont vos principaux défis business ?
            </div>
          </div>
        </label>
        <textarea
          value={data.defis || ''}
          onChange={(e) => handleInputChange('defis', e.target.value)}
          placeholder="Ex: Acquisition client coûteuse, concurrence forte, manque de visibilité..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.defis ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.defis && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.defis}
          </p>
        )}
      </div>

      {/* Valeurs */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Target className="w-4 h-4" />
          Valeurs de l'entreprise
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quelles sont vos valeurs fondamentales ?
            </div>
          </div>
        </label>
        <textarea
          value={data.valeurs || ''}
          onChange={(e) => handleInputChange('valeurs', e.target.value)}
          placeholder="Ex: Innovation, transparence, excellence, proximité client..."
          rows={3}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.valeurs ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.valeurs && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.valeurs}
          </p>
        )}
      </div>
    </div>
  );
}

export default ObjectifsDefiStep;