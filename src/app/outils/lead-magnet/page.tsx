'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import AILoadingLogs from '@/components/AILoadingLogs';
import { 
  Sparkles, 
  Target, 
  Download, 
  FileText, 
  Users, 
  TrendingUp, 
  Copy,
  RefreshCw,
  CheckCircle,
  Lightbulb,
  Gift,
  Zap,
  Video,
  CheckSquare,
  BookOpen,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadMagnetData {
  business: string;
  audience: string;
  problem: string;
  solution: string;
  format: string;
  tone: string;
}

function LeadMagnetContent() {
  const [formData, setFormData] = useState<LeadMagnetData>({
    business: '',
    audience: '',
    problem: '',
    solution: '',
    format: 'ebook',
    tone: 'professionnel'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [results, setResults] = useState<any>(null);

  const formats = [
    { id: 'ebook', label: 'E-book', icon: <FileText className="w-4 h-4" /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'template', label: 'Template', icon: <Copy className="w-4 h-4" /> },
    { id: 'guide', label: 'Guide PDF', icon: <Download className="w-4 h-4" /> },
    { id: 'webinar', label: 'Webinaire', icon: <Users className="w-4 h-4" /> }
  ];

  const tones = [
    { id: 'professionnel', label: 'Professionnel' },
    { id: 'amical', label: 'Amical' },
    { id: 'expert', label: 'Expert' },
    { id: 'accessible', label: 'Accessible' }
  ];

  const handleGenerate = async () => {
    if (!formData.business || !formData.audience || !formData.problem) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);
    setShowLogs(true);
    
    // Simulation de génération IA
    setTimeout(() => {
      const mockResults = {
        title: `Guide Complet: Comment ${formData.solution} pour ${formData.audience}`,
        subtitle: `Résolvez ${formData.problem} en 7 étapes simples`,
        outline: [
          'Introduction: Pourquoi ce problème vous coûte cher',
          'Les 3 erreurs les plus communes',
          'La méthode en 7 étapes',
          'Outils et ressources recommandés',
          'Plan d\'action immédiat',
          'Bonus: Templates prêts à utiliser'
        ],
        cta: `Téléchargez votre ${formats.find(f => f.id === formData.format)?.label} gratuit`,
        landingPageCopy: `Découvrez comment ${formData.solution.toLowerCase()} grâce à notre ${formats.find(f => f.id === formData.format)?.label.toLowerCase()} exclusif.`,
        emailSequence: [
          'Email 1: Bienvenue + Livraison du lead magnet',
          'Email 2: Cas d\'étude concret',
          'Email 3: Erreurs à éviter absolument',
          'Email 4: Offre spéciale (si applicable)'
        ]
      };
      
      setResults(mockResults);
      setIsGenerating(false);
    }, 3000);
  };

  // Masquer les logs après la génération
  useEffect(() => {
    if (!isGenerating && showLogs) {
      const timer = setTimeout(() => {
        setShowLogs(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, showLogs]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Vous pourriez ajouter une notification toast ici
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">+347%</p>
                <p className="text-gray-400 text-sm">Taux de conversion moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">12,847</p>
                <p className="text-gray-400 text-sm">Lead magnets générés</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-semibold">89%</p>
                <p className="text-gray-400 text-sm">Satisfaction client</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils */}
      <div className="mb-8 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
        <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour un lead magnet efficace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-emerald-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-emerald-200">✨ Création optimisée</h4>
            <ul className="space-y-2 text-emerald-300">
              <li>• <strong>Valeur immédiate :</strong> Résolvez un problème spécifique rapidement</li>
              <li>• <strong>Format adapté :</strong> Choisissez selon votre audience (PDF, vidéo, checklist)</li>
              <li>• <strong>Titre accrocheur :</strong> Promettez un bénéfice clair et mesurable</li>
              <li>• <strong>Design professionnel :</strong> Soignez la présentation visuelle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-emerald-200">🎯 Conversion et suivi</h4>
            <ul className="space-y-2 text-emerald-300">
              <li>• <strong>Landing page dédiée :</strong> Une page spécifique pour chaque lead magnet</li>
              <li>• <strong>Formulaire minimal :</strong> Demandez seulement nom et email</li>
              <li>• <strong>Séquence email :</strong> Préparez 3-5 emails de suivi automatiques</li>
              <li>• <strong>Mesurez les résultats :</strong> Taux de conversion et engagement</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Informations sur votre lead magnet
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Votre business/secteur *
              </label>
              <input
                type="text"
                value={formData.business}
                onChange={(e) => setFormData({...formData, business: e.target.value})}
                placeholder="Ex: Coach en développement personnel, E-commerce, SaaS..."
                className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Votre audience cible *
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                placeholder="Ex: Entrepreneurs débutants, E-commerçants, Freelances..."
                className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Problème principal à résoudre *
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                placeholder="Ex: Manque de visibilité en ligne, Difficultés à générer des leads..."
                rows={3}
                className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Solution que vous proposez
              </label>
              <input
                type="text"
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
                placeholder="Ex: Augmenter sa visibilité, Générer plus de leads..."
                className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Format du lead magnet
              </label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setFormData({...formData, format: format.id})}
                    className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                      formData.format === format.id
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                        : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                    }`}
                  >
                    {format.icon}
                    <span className="text-sm">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Ton de communication
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setFormData({...formData, tone: tone.id})}
                    className={`p-3 rounded-lg border transition-colors ${
                      formData.tone === tone.id
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                        : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Générer mon Lead Magnet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            Votre Lead Magnet Généré
          </h2>

          <AnimatePresence>
            {showLogs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <AILoadingLogs />
              </motion.div>
            )}
          </AnimatePresence>

          {!results ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Remplissez le formulaire et cliquez sur "Générer" pour créer votre lead magnet
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Titre principal</h3>
                  <button
                    onClick={() => copyToClipboard(results.title)}
                    className="text-[#00D2FF] hover:text-blue-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <p className="text-white">{results.title}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Sous-titre</h3>
                  <button
                    onClick={() => copyToClipboard(results.subtitle)}
                    className="text-[#00D2FF] hover:text-blue-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <p className="text-gray-300">{results.subtitle}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Plan du contenu</h3>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <ul className="space-y-2">
                    {results.outline.map((item: string, index: number) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 font-bold">{index + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Call-to-Action</h3>
                  <button
                    onClick={() => copyToClipboard(results.cta)}
                    className="text-[#00D2FF] hover:text-blue-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <p className="text-green-400 font-medium">{results.cta}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Séquence email de suivi</h3>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <ul className="space-y-2">
                    {results.emailSequence.map((email: string, index: number) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400">📧</span>
                        {email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

export default function LeadMagnetPage() {
  return (
    <ToolLayout toolId="lead-magnet">
      <PremiumGuard feature="Lead Magnet IA">
        <LeadMagnetContent />
      </PremiumGuard>
    </ToolLayout>
  );
}