'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FileText, Sparkles, Copy, Download, ArrowLeft } from 'lucide-react';

export default function DescriptionsIAPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    targetAudience: '',
    keyFeatures: '',
    tone: 'professionnel'
  });
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      setResult(`🚀 **${formData.productName}** - La Solution Révolutionnaire pour ${formData.targetAudience}

Découvrez ${formData.productName}, l'outil indispensable qui transforme votre approche de ${formData.category}. 

✨ **Pourquoi choisir ${formData.productName} ?**
${formData.keyFeatures.split(',').map(feature => `• ${feature.trim()}`).join('\n')}

🎯 **Parfait pour :** ${formData.targetAudience}

💡 **Résultats garantis :** Optimisez votre productivité et atteignez vos objectifs plus rapidement que jamais.

⚡ **Action immédiate :** Ne laissez pas passer cette opportunité de transformer votre business.`);
      setIsLoading(false);
    }, 2000);
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ff0033] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Descriptions IA</h1>
                <p className="text-gray-400">Rédigez des descriptions de produits persuasives</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4">Paramètres de génération</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: Pack Business Complet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="formation">Formation</option>
                    <option value="design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Public cible
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: entrepreneurs, freelances, startups"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Caractéristiques clés (séparées par des virgules)
                  </label>
                  <textarea
                    value={formData.keyFeatures}
                    onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
                    rows={3}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: Facile à utiliser, Résultats rapides, Support inclus"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ton de la description
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  >
                    <option value="professionnel">Professionnel</option>
                    <option value="enthousiaste">Enthousiaste</option>
                    <option value="persuasif">Persuasif</option>
                    <option value="technique">Technique</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Générer la description
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Résultat */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Description générée</h3>
                {result && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Copier"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([result], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'description.txt';
                        a.click();
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {result ? (
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#232323] text-center">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Remplissez le formulaire et cliquez sur "Générer" pour créer votre description
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 