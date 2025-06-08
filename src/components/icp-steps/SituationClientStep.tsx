import React from 'react';
import { Users, TrendingUp, HelpCircle } from 'lucide-react';

interface SituationClientStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function SituationClientStep({ data, onChange, errors, isActive }: SituationClientStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Situation actuelle */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Situation actuelle de votre client cible
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Dans quelle situation se trouve actuellement votre client idéal ?
            </div>
          </div>
        </label>
        <textarea
          value={data.situationActuelle || ''}
          onChange={(e) => handleInputChange('situationActuelle', e.target.value)}
          placeholder="Ex: Entrepreneur débordé, manque de temps pour le marketing, CA stagnant, difficultés à trouver des clients..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.situationActuelle ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.situationActuelle && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.situationActuelle}
          </p>
        )}
      </div>

      {/* Situation désirée */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <TrendingUp className="w-4 h-4" />
          Situation désirée par votre client
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quelle est la situation rêvée de votre client ?
            </div>
          </div>
        </label>
        <textarea
          value={data.situationDesiree || ''}
          onChange={(e) => handleInputChange('situationDesiree', e.target.value)}
          placeholder="Ex: Business automatisé, flux régulier de clients qualifiés, plus de temps libre, croissance stable..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.situationDesiree ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.situationDesiree && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.situationDesiree}
          </p>
        )}
      </div>

      {/* Solutions essayées */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Solutions déjà essayées par votre client
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quelles solutions votre client a-t-il déjà testées ?
            </div>
          </div>
        </label>
        <textarea
          value={data.solutionsEssayees || ''}
          onChange={(e) => handleInputChange('solutionsEssayees', e.target.value)}
          placeholder="Ex: Publicité Facebook, SEO, networking, bouche-à-oreille, freelances..."
          rows={3}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.solutionsEssayees ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.solutionsEssayees && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.solutionsEssayees}
          </p>
        )}
      </div>

      {/* Solution idéale */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <TrendingUp className="w-4 h-4" />
          Solution idéale recherchée
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quelle serait la solution parfaite pour votre client ?
            </div>
          </div>
        </label>
        <textarea
          value={data.solutionIdeale || ''}
          onChange={(e) => handleInputChange('solutionIdeale', e.target.value)}
          placeholder="Ex: Solution clé en main, accompagnement personnalisé, résultats garantis, simplicité d'utilisation..."
          rows={3}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.solutionIdeale ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.solutionIdeale && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.solutionIdeale}
          </p>
        )}
      </div>
    </div>
  );
}

export default SituationClientStep;