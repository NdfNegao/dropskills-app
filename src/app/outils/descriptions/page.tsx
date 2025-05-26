'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { BrainCircuit, Sparkles, Target, Palette, Languages } from 'lucide-react';

type ProductInfo = {
  name: string;
  type: string;
  targetAudience: string;
  keyFeatures: string;
  tone: string;
  language: string;
};

export default function ProductDescriptions() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    type: '',
    targetAudience: '',
    keyFeatures: '',
    tone: 'professionnel',
    language: 'fr'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simuler la génération
    setTimeout(() => {
      const description = `${productInfo.name} est un ${productInfo.type} innovant conçu spécialement pour ${productInfo.targetAudience}. 

Caractéristiques principales :
${productInfo.keyFeatures.split(',').map(feature => `• ${feature.trim()}`).join('\n')}

Ce produit unique vous permettra d'atteindre vos objectifs plus rapidement et plus efficacement. Ne manquez pas cette opportunité d'améliorer votre business digital.`;
      
      setGeneratedDescription(description);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        {/* En-tête */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="text-[#ff0033] w-8 h-8" />
            <h1 className="text-4xl font-bold text-white">Product Descriptions</h1>
          </div>
          <p className="text-xl text-gray-400">Générez des descriptions de produits persuasives et optimisées pour la vente</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">1. Informations du produit</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Nom du produit</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Sparkles className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    name="name"
                    value={productInfo.name}
                    onChange={handleInputChange}
                    placeholder="ex: Guide du Marketing Digital"
                    className="bg-transparent text-white w-full focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Type de produit</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Palette className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    name="type"
                    value={productInfo.type}
                    onChange={handleInputChange}
                    placeholder="ex: ebook, formation, template..."
                    className="bg-transparent text-white w-full focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Public cible</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Target className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    name="targetAudience"
                    value={productInfo.targetAudience}
                    onChange={handleInputChange}
                    placeholder="ex: entrepreneurs débutants"
                    className="bg-transparent text-white w-full focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Caractéristiques principales (séparées par des virgules)</label>
                <textarea
                  name="keyFeatures"
                  value={productInfo.keyFeatures}
                  onChange={handleInputChange}
                  placeholder="ex: 10 chapitres détaillés, exercices pratiques, accès illimité..."
                  className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Ton</label>
                  <select
                    name="tone"
                    value={productInfo.tone}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none"
                  >
                    <option value="professionnel">Professionnel</option>
                    <option value="amical">Amical</option>
                    <option value="expert">Expert</option>
                    <option value="persuasif">Persuasif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Langue</label>
                  <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                    <Languages className="text-gray-500 w-5 h-5 mr-2" />
                    <select
                      name="language"
                      value={productInfo.language}
                      onChange={handleInputChange}
                      className="bg-transparent text-white w-full focus:outline-none"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                  isGenerating
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-[#ff0033] text-white hover:bg-[#cc0029]'
                }`}
              >
                {isGenerating ? 'Génération en cours...' : 'Générer la description'}
              </button>
            </form>
          </div>

          {/* Résultat */}
          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">2. Description générée</h2>
            
            {generatedDescription ? (
              <div className="bg-[#1a1a1a] p-6 rounded-lg">
                <pre className="text-white whitespace-pre-wrap font-sans">{generatedDescription}</pre>
                <div className="mt-4 flex gap-2">
                  <button 
                    className="bg-[#242424] text-white px-4 py-2 rounded hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => navigator.clipboard.writeText(generatedDescription)}
                  >
                    Copier
                  </button>
                  <button 
                    className="bg-[#242424] text-white px-4 py-2 rounded hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => setGeneratedDescription('')}
                  >
                    Effacer
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] p-6 rounded-lg text-gray-400 text-center">
                Remplissez le formulaire et cliquez sur "Générer" pour créer votre description
              </div>
            )}
          </div>
        </div>

        {/* Section Pro */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Version Pro</h2>
              <p className="text-white/80">Accédez à plus de fonctionnalités : tons personnalisés, SEO optimisé, variations multiples...</p>
            </div>
            <button className="bg-white text-[#ff0033] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Débloquer les Options Pro
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 