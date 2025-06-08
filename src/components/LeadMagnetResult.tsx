'use client';

import React from 'react';
import { 
  Gift, 
  FileText, 
  Copy, 
  Download, 
  Mail, 
  Target, 
  Sparkles,
  CheckCircle,
  Users,
  TrendingUp,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadMagnetAnalysis {
  titre: string;
  sousTitre: string;
  planContenu: string[];
  callToAction: string;
  landingPageCopy: string;
  sequenceEmail: string[];
  conseils: {
    creation: string[];
    promotion: string[];
    optimisation: string[];
  };
  metriques: {
    tauxConversionEstime: string;
    potentielLeads: string;
    roiEstime: string;
  };
}

interface LeadMagnetResultProps {
  analysis: LeadMagnetAnalysis;
  formData: any;
}

export function LeadMagnetResult({ analysis, formData }: LeadMagnetResultProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Vous pourriez ajouter une notification toast ici
  };

  const Section = ({ title, icon, children, className = '' }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-[#111111] rounded-xl p-6 border border-[#232323] ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-semibold">{analysis.metriques?.tauxConversionEstime || '15-25%'}</p>
              <p className="text-gray-400 text-sm">Taux de conversion estimé</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-semibold">{analysis.metriques?.potentielLeads || '500+'}</p>
              <p className="text-gray-400 text-sm">Leads potentiels/mois</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-semibold">{analysis.metriques?.roiEstime || '300%'}</p>
              <p className="text-gray-400 text-sm">ROI estimé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Titre et sous-titre */}
      <Section title="🎯 Titre & Accroche" icon={<Gift className="w-5 h-5 text-green-400" />}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Titre principal</h4>
              <button
                onClick={() => copyToClipboard(analysis.titre)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
              <p className="text-white font-semibold text-lg">{analysis.titre}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Sous-titre</h4>
              <button
                onClick={() => copyToClipboard(analysis.sousTitre)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
              <p className="text-gray-300">{analysis.sousTitre}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Plan du contenu */}
      <Section title="📋 Plan du Contenu" icon={<FileText className="w-5 h-5 text-blue-400" />}>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
          <ul className="space-y-3">
            {analysis.planContenu?.map((item: string, index: number) => (
              <li key={index} className="text-gray-300 flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm bg-blue-500/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Call-to-Action */}
      <Section title="🚀 Call-to-Action Optimisé" icon={<Sparkles className="w-5 h-5 text-yellow-400" />}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">CTA Principal</h4>
            <button
              onClick={() => copyToClipboard(analysis.callToAction)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-200 font-semibold text-center">{analysis.callToAction}</p>
          </div>
        </div>
      </Section>

      {/* Copy de landing page */}
      <Section title="🎨 Copy de Landing Page" icon={<ExternalLink className="w-5 h-5 text-purple-400" />}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Texte d'accroche</h4>
            <button
              onClick={() => copyToClipboard(analysis.landingPageCopy)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
            <p className="text-gray-300 leading-relaxed">{analysis.landingPageCopy}</p>
          </div>
        </div>
      </Section>

      {/* Séquence email */}
      <Section title="📧 Séquence Email de Suivi" icon={<Mail className="w-5 h-5 text-cyan-400" />}>
        <div className="space-y-3">
          {analysis.sequenceEmail?.map((email: string, index: number) => (
            <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold text-sm bg-cyan-500/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-300 leading-relaxed">{email}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Conseils stratégiques */}
      <Section title="💡 Conseils Stratégiques" icon={<Lightbulb className="w-5 h-5 text-orange-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Création
            </h4>
            <ul className="space-y-2 text-green-300 text-sm">
              {analysis.conseils?.creation?.map((conseil: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Promotion
            </h4>
            <ul className="space-y-2 text-blue-300 text-sm">
              {analysis.conseils?.promotion?.map((conseil: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Optimisation
            </h4>
            <ul className="space-y-2 text-purple-300 text-sm">
              {analysis.conseils?.optimisation?.map((conseil: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Télécharger le Lead Magnet
        </button>
        <button className="flex-1 bg-[#232323] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#333333] transition-all flex items-center justify-center gap-2 border border-[#333]">
          <Copy className="w-5 h-5" />
          Copier tout le contenu
        </button>
      </div>
    </div>
  );
}

export default LeadMagnetResult;