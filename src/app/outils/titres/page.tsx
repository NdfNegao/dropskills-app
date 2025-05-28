'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  Type, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

export default function TitresPage() {
  const [formData, setFormData] = useState({
    subject: '',
    audience: '',
    tone: 'accrocheur',
    type: 'article'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const tones = [
    { id: 'accrocheur', label: 'Accrocheur' },
    { id: 'professionnel', label: 'Professionnel' },
    { id: 'emotionnel', label: 'Émotionnel' },
    { id: 'urgent', label: 'Urgent' }
  ];

  const types = [
    { id: 'article', label: 'Article de blog' },
    { id: 'video', label: 'Vidéo YouTube' },
    { id: 'email', label: 'Email marketing' },
    { id: 'social', label: 'Post réseaux sociaux' }
  ];

  const handleGenerate = async () => {
    if (!formData.subject) {
      alert('Veuillez remplir le sujet');
      return;
    }

    setIsGenerating(true);
    
    // Simulation de génération IA
    setTimeout(() => {
      const mockResults = [
        `🚀 ${formData.subject} : Le Guide Complet pour ${formData.audience || 'Réussir'}`,
        `✨ Découvrez ${formData.subject} en 2024 : Stratégies Gagnantes`,
        `💡 ${formData.subject} : 7 Secrets que Personne ne Vous Dit`,
        `🎯 Comment Maîtriser ${formData.subject} en 30 Jours`,
        `⚡ ${formData.subject} : La Méthode Révolutionnaire qui Change Tout`,
        `🔥 ${formData.subject} : De Débutant à Expert en 5 Étapes`,
        `💰 ${formData.subject} : Transformez Votre Passion en Profit`,
        `🌟 ${formData.subject} : Les Erreurs à Éviter Absolument`
      ];
      
      setResults(mockResults);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
              <Type className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Générateur de Titres</h1>
              <p className="text-gray-400">Créez des titres accrocheurs qui convertissent</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">8,432</p>
                  <p className="text-gray-400 text-sm">Titres générés</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-semibold">+34%</p>
                  <p className="text-gray-400 text-sm">Taux de clic moyen</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">2,156</p>
                  <p className="text-gray-400 text-sm">Créateurs actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Paramètres du titre
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Sujet principal *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Ex: Marketing digital, Développement personnel..."
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Audience cible
                </label>
                <input
                  type="text"
                  value={formData.audience}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  placeholder="Ex: Entrepreneurs, Étudiants, Freelances..."
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-3 rounded-lg border transition-colors text-sm ${
                        formData.type === type.id
                          ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                          : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Ton du titre
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
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer les titres
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Titres générés
            </h2>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <Type className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Remplissez le formulaire et cliquez sur "Générer" pour créer vos titres
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((title, index) => (
                  <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] hover:border-[#00D2FF] transition-colors group">
                    <div className="flex items-start justify-between">
                      <p className="text-gray-300 leading-relaxed flex-1 pr-3">{title}</p>
                      <button
                        onClick={() => copyToClipboard(title)}
                        className="text-gray-500 hover:text-[#00D2FF] transition-colors opacity-0 group-hover:opacity-100"
                        title="Copier"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t border-[#333]">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-[#1a1a1a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#333] transition-colors border border-[#333] flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Générer de nouveaux titres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 