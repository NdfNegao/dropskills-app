'use client';

import React from 'react';
import { Building, Users, HelpCircle } from 'lucide-react';
import { LeadMagnetFormData } from '../LeadMagnetWizard';

interface LeadMagnetContextStepProps {
  data: LeadMagnetFormData;
  onChange: (updates: Partial<LeadMagnetFormData>) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function LeadMagnetContextStep({ data, onChange, errors }: LeadMagnetContextStepProps) {
  const handleInputChange = (field: keyof LeadMagnetFormData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Business/Secteur */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Building className="w-4 h-4" />
          Votre business/secteur d'activité
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Ex: Coach en développement personnel, E-commerce mode, Formation en ligne
            </div>
          </div>
        </label>
        <input
          type="text"
          value={data.business || ''}
          onChange={(e) => handleInputChange('business', e.target.value)}
          placeholder="Ex: Coach en développement personnel, E-commerce, SaaS, Formation..."
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
            ${errors.business ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.business && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.business}
          </p>
        )}
      </div>

      {/* Audience cible */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Votre audience cible
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Qui sont vos clients potentiels ? Soyez précis sur leur profil
            </div>
          </div>
        </label>
        <input
          type="text"
          value={data.audience || ''}
          onChange={(e) => handleInputChange('audience', e.target.value)}
          placeholder="Ex: Entrepreneurs débutants, E-commerçants, Freelances, Coachs..."
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
            ${errors.audience ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.audience && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.audience}
          </p>
        )}
      </div>

      {/* Bloc conseil */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Plus vous êtes précis sur votre secteur et votre audience, plus votre lead magnet sera ciblé et efficace. 
              Pensez aux caractéristiques démographiques, aux défis spécifiques et aux objectifs de votre audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadMagnetContextStep;