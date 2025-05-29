"use client";

import { useState } from "react";
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  Sparkles, 
  Type, 
  Target, 
  TrendingUp, 
  Copy,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface TitleData {
  topic: string;
  platform: string;
  tone: string;
  audience: string;
  goal: string;
}

function GenerateurTitresContent() {
  const [formData, setFormData] = useState<TitleData>({
    topic: '',
    platform: 'blog',
    tone: 'engaging',
    audience: '',
    goal: 'traffic'
  });

  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      setGeneratedTitles(data.titles);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des titres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Erreur de copie:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
            <Type className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Générateur de Titres IA</h1>
            <p className="text-gray-400">Créez des titres irrésistibles qui captent l'attention</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Taux de clic</span>
            </div>
            <div className="text-2xl font-bold text-white">+73%</div>
            <div className="text-xs text-gray-400">vs titres standards</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-white">+156%</div>
            <div className="text-xs text-gray-400">sur les réseaux sociaux</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Titres générés</span>
            </div>
            <div className="text-2xl font-bold text-white">45,231</div>
            <div className="text-xs text-gray-400">ce mois-ci</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Paramètres de génération</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sujet principal
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                placeholder="Ex: Marketing digital, Productivité, Cuisine..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plateforme
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                <option value="blog">Article de blog</option>
                <option value="youtube">Vidéo YouTube</option>
                <option value="linkedin">Post LinkedIn</option>
                <option value="facebook">Post Facebook</option>
                <option value="instagram">Post Instagram</option>
                <option value="twitter">Tweet</option>
                <option value="email">Email marketing</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audience cible
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                placeholder="Ex: Entrepreneurs, Parents, Étudiants..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ton
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                >
                  <option value="engaging">Engageant</option>
                  <option value="professional">Professionnel</option>
                  <option value="funny">Humoristique</option>
                  <option value="urgent">Urgent</option>
                  <option value="mysterious">Mystérieux</option>
                  <option value="educational">Éducatif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objectif
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                >
                  <option value="traffic">Générer du trafic</option>
                  <option value="engagement">Augmenter l'engagement</option>
                  <option value="conversion">Convertir</option>
                  <option value="awareness">Sensibiliser</option>
                  <option value="education">Éduquer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Générer 10 titres
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Titres générés</h2>

          {generatedTitles.length > 0 ? (
            <div className="space-y-3">
              {generatedTitles.map((title, index) => (
                <div key={index} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 group hover:border-[#ff0033]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-gray-300 leading-relaxed flex-1">{title}</p>
                    <button
                      onClick={() => handleCopy(title, index)}
                      className="opacity-0 group-hover:opacity-100 bg-[#ff0033] text-white px-3 py-1 rounded text-sm hover:bg-[#cc0029] transition-all flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedIndex === index ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
              <Type className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Vos titres apparaîtront ici</p>
              <p className="text-gray-500 text-sm">
                Remplissez le formulaire et cliquez sur "Générer" pour créer 10 titres optimisés
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-blue-400 font-semibold mb-4">💡 Conseils pour des titres efficaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-300 text-sm">
          <div>
            <h4 className="font-medium mb-2">✨ Structure optimale</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• Utilisez des chiffres (5 façons de...)</li>
              <li>• Posez des questions intrigantes</li>
              <li>• Promettez un bénéfice clair</li>
              <li>• Créez de la curiosité</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Mots puissants</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• "Secret", "Révélé", "Exclusif"</li>
              <li>• "Gratuit", "Rapide", "Simple"</li>
              <li>• "Prouvé", "Garanti", "Testé"</li>
              <li>• "Nouveau", "Ultime", "Complet"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateurTitresPage() {
  return (
    <LayoutWithSidebar>
      <GenerateurTitresContent />
    </LayoutWithSidebar>
  );
} 