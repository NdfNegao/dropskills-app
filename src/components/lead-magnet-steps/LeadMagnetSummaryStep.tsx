'use client';

import React from 'react';
import { CheckCircle, Sparkles, Gift, FileText, Users, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { LeadMagnetFormData } from '../LeadMagnetWizard';

interface LeadMagnetSummaryStepProps {
  data: LeadMagnetFormData;
  onChange: (updates: Partial<LeadMagnetFormData>) => void;
  errors: Record<string, string>;
  isActive: boolean;
  onGenerate?: () => void;
}

export function LeadMagnetSummaryStep({ data, onGenerate }: LeadMagnetSummaryStepProps) {
  const formatLabels: Record<string, string> = {
    'ebook': 'E-book',
    'checklist': 'Checklist',
    'template': 'Template',
    'guide': 'Guide PDF',
    'webinar': 'Webinaire',
    'video': 'Série Vidéo'
  };

  const toneLabels: Record<string, string> = {
    'professionnel': 'Professionnel',
    'amical': 'Amical',
    'expert': 'Expert',
    'accessible': 'Accessible',
    'inspirant': 'Inspirant',
    'educatif': 'Éducatif'
  };

  return (
    <div className="space-y-6">
      {/* Récapitulatif */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Récapitulatif de votre lead magnet</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-400">Business :</span>
              </div>
              <p className="text-white text-sm text-right max-w-[200px]">{data.business}</p>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-400">Audience :</span>
              </div>
              <p className="text-white text-sm text-right max-w-[200px]">{data.audience}</p>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-gray-400">Format :</span>
              </div>
              <p className="text-white text-sm">{formatLabels[data.format] || data.format}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-gray-400">Problème :</span>
              </div>
              <p className="text-white text-sm text-right max-w-[200px] line-clamp-2">{data.problem}</p>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-400">Solution :</span>
              </div>
              <p className="text-white text-sm text-right max-w-[200px] line-clamp-2">{data.solution}</p>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-400">Ton :</span>
              </div>
              <p className="text-white text-sm">{toneLabels[data.tone] || data.tone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloc d'engagement pré-analyse */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-green-300">
            Prêt pour l'analyse Lead Magnet AI ?
          </h3>
        </div>
        
        <p className="text-green-200 mb-6 leading-relaxed">
          Dropskills AI va analyser toutes ces informations pour créer votre lead magnet irrésistible. 
          Vous obtiendrez un titre accrocheur, un plan de contenu détaillé, des call-to-actions optimisés 
          et une séquence email de suivi automatique.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">Titre & Accroche</span>
            </div>
            <p className="text-green-200 text-xs">Titre irrésistible et sous-titre percutant</p>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">Plan Détaillé</span>
            </div>
            <p className="text-green-200 text-xs">Structure complète et contenu actionnable</p>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">Séquence Email</span>
            </div>
            <p className="text-green-200 text-xs">4-5 emails de suivi automatiques</p>
          </div>
        </div>
        
        {onGenerate && (
          <button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Générer mon Lead Magnet avec Dropskills AI
          </button>
        )}
      </div>

      {/* Conseils finaux */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed mb-3">
              Une fois votre lead magnet généré, pensez à créer une landing page dédiée avec un formulaire simple 
              (nom + email uniquement) pour maximiser les conversions.
            </p>
            <div className="text-blue-300 text-xs">
              <strong>🎯 Prochaines étapes :</strong> Landing page → Formulaire → Séquence email → Mesure des résultats
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadMagnetSummaryStep;