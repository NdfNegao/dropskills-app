'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
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

function TitresContent() {
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
    
    try {
      const response = await fetch('/api/ai/titles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      setResults(data.titles || []);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des titres');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">


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

      {/* Conseils */}
      <div className="mb-8 bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
        <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour des titres efficaces
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-orange-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-orange-200">✨ Techniques de rédaction</h4>
            <ul className="space-y-2 text-orange-300">
              <li>• <strong>Chiffres et listes :</strong> "7 secrets", "5 étapes" attirent l'œil</li>
              <li>• <strong>Mots puissants :</strong> "Révolutionnaire", "Secret", "Exclusif"</li>
              <li>• <strong>Questions intrigantes :</strong> Créez de la curiosité chez le lecteur</li>
              <li>• <strong>Urgence temporelle :</strong> "Maintenant", "Aujourd'hui", "2024"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-orange-200">🎯 Optimisation par plateforme</h4>
            <ul className="space-y-2 text-orange-300">
              <li>• <strong>YouTube :</strong> 60 caractères max, émojis en début</li>
              <li>• <strong>Articles blog :</strong> 50-60 caractères pour le SEO</li>
              <li>• <strong>Réseaux sociaux :</strong> Adaptez selon l'algorithme</li>
              <li>• <strong>Email marketing :</strong> Évitez les mots spam, testez A/B</li>
            </ul>
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
  );
}

export default function TitresPage() {
  return (
    <ToolLayout toolId="titres">
      <TitresContent />
    </ToolLayout>
  );
}