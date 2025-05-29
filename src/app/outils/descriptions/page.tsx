'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

export default function DescriptionsPage() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    features: '',
    targetAudience: '',
    tone: 'professionnel'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const tones = [
    { id: 'professionnel', label: 'Professionnel' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'emotionnel', label: 'Émotionnel' },
    { id: 'technique', label: 'Technique' },
    { id: 'casual', label: 'Casual' }
  ];

  const handleGenerate = async () => {
    if (!formData.productName || !formData.category) {
      alert('Veuillez remplir au moins le nom du produit et la catégorie');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/descriptions/generate', {
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
      setResults(data.descriptions || []);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des descriptions');
    } finally {
      setIsGenerating(false);
    }
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Générateur de Descriptions</h1>
              <p className="text-gray-400">Créez des descriptions produits captivantes avec l'IA</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">5,247</p>
                  <p className="text-gray-400 text-sm">Descriptions générées</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-semibold">+23%</p>
                  <p className="text-gray-400 text-sm">Taux de conversion moyen</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">1,892</p>
                  <p className="text-gray-400 text-sm">Utilisateurs actifs</p>
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
              Informations produit
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="Ex: iPhone 15 Pro, Nike Air Max..."
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Catégorie *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Ex: Smartphone, Chaussures de sport, Logiciel..."
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Caractéristiques principales
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="Ex: Écran OLED 6.1 pouces, Puce A17 Pro, Triple caméra..."
                  rows={3}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Audience cible
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Ex: Professionnels créatifs, Sportifs, Entrepreneurs..."
                  className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                />
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
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer les descriptions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Descriptions générées
            </h2>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Remplissez le formulaire et cliquez sur "Générer" pour créer vos descriptions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((description, index) => (
                  <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">Description {index + 1}</h3>
                      <button
                        onClick={() => copyToClipboard(description)}
                        className="text-[#00D2FF] hover:text-blue-300 transition-colors"
                        title="Copier"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            💡 Conseils pour des descriptions efficaces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-purple-300 text-sm">
            <div>
              <h4 className="font-medium mb-3 text-purple-200">✨ Rédaction optimisée</h4>
              <ul className="space-y-2 text-purple-300">
                <li>• <strong>Mots-clés stratégiques :</strong> Intégrez naturellement vos mots-clés SEO</li>
                <li>• <strong>Bénéfices avant fonctionnalités :</strong> Mettez en avant ce que ça apporte</li>
                <li>• <strong>Émojis pertinents :</strong> 2-3 émojis pour capter l'attention</li>
                <li>• <strong>Longueur optimale :</strong> 80-150 mots pour un bon équilibre</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-purple-200">🎯 Conversion et engagement</h4>
              <ul className="space-y-2 text-purple-300">
                <li>• <strong>Adaptez le ton :</strong> Choisissez le ton selon votre audience</li>
                <li>• <strong>Créez de l'émotion :</strong> Utilisez des mots qui touchent</li>
                <li>• <strong>Preuve sociale :</strong> Mentionnez avis, témoignages ou chiffres</li>
                <li>• <strong>Call-to-action :</strong> Terminez par une incitation à l'action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 