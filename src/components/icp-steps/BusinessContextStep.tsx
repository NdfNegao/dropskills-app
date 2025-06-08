'use client';

import React from 'react';
import { Building, HelpCircle } from 'lucide-react';

interface BusinessContextStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function BusinessContextStep({ data, onChange, errors }: BusinessContextStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Secteur d'activité */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Building className="w-4 h-4" />
          Secteur d'activité
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Ex: E-commerce, SaaS, Formation, Coaching, Consulting
            </div>
          </div>
        </label>
        <input
          type="text"
          value={data.secteur || ''}
          onChange={(e) => handleInputChange('secteur', e.target.value)}
          placeholder="Ex: Formation en ligne, E-commerce mode, Coaching business..."
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
            ${errors.secteur ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.secteur && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.secteur}
          </p>
        )}
      </div>

      {/* Zone géographique */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Building className="w-4 h-4" />
          Zone géographique cible
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Où se trouvent vos clients potentiels ?
            </div>
          </div>
        </label>
        <input
          type="text"
          value={data.zoneGeographique || ''}
          onChange={(e) => handleInputChange('zoneGeographique', e.target.value)}
          placeholder="Ex: France, Europe francophone, International, Paris et région..."
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
            ${errors.zoneGeographique ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.zoneGeographique && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.zoneGeographique}
          </p>
        )}
      </div>

      {/* Contexte supplémentaire */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Plus vous êtes précis sur votre secteur et votre zone géographique, 
              plus Dropskills AI pourra générer un profil client détaillé et actionnable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessContextStep;