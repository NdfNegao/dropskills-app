'use client';

import React from 'react';
import { Package, HelpCircle, Lightbulb } from 'lucide-react';

interface ProductServiceStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function ProductServiceStep({ data, onChange, errors, isActive }: ProductServiceStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Description du produit/service */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Package className="w-4 h-4" />
          Description détaillée de votre produit/service
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg max-w-xs">
              Décrivez précisément ce que vous vendez, incluez les bénéfices
            </div>
          </div>
        </label>
        <textarea
          value={data.produitService || ''}
          onChange={(e) => handleInputChange('produitService', e.target.value)}
          placeholder="Ex: Formation complète pour créer et vendre des produits digitaux, incluant templates, vidéos et accompagnement personnalisé sur 3 mois..."
          rows={4}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.produitService ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.produitService && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.produitService}
          </p>
        )}
      </div>

      {/* Promesse unique */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Lightbulb className="w-4 h-4" />
          Votre promesse unique (USP)
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg max-w-xs">
              Qu'est-ce qui vous différencie de la concurrence ?
            </div>
          </div>
        </label>
        <textarea
          value={data.promesseUnique || ''}
          onChange={(e) => handleInputChange('promesseUnique', e.target.value)}
          placeholder="Ex: La seule méthode qui garantit 1000€ de revenus passifs en 90 jours, même sans expérience technique, avec un accompagnement personnalisé..."
          rows={3}
          className={`
            w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none
            ${errors.promesseUnique ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'}
          `}
        />
        {errors.promesseUnique && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.promesseUnique}
          </p>
        )}
      </div>

      {/* Conseils Dropskills AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-purple-400 font-medium mb-1">Produit/Service</h4>
              <p className="text-purple-300 text-sm leading-relaxed">
                Incluez les fonctionnalités, bénéfices, format de livraison et durée d'accompagnement.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Promesse Unique</h4>
              <p className="text-blue-300 text-sm leading-relaxed">
                Mentionnez les résultats spécifiques, délais et ce qui vous rend unique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductServiceStep;