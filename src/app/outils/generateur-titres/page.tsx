"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Sparkles, Copy, Download, RefreshCw } from "lucide-react";

interface GeneratedTitle {
  titre: string;
  score: number;
  explication: string;
}

export default function GenerateurTitresPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    sujet: "",
    type: "article" as const,
    emotion: "curiosite" as const,
    nombreTitres: 5
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedTitle[]>([]);
  const [error, setError] = useState("");

  // Redirection si non connecté
  if (status === "loading") {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white">Chargement...</div>
    </div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/outils/generateur-titres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      if (data.success && data.data?.titres) {
        setResults(data.data.titres);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Vous pourriez ajouter une notification toast ici
  };

  const exportResults = () => {
    const content = results.map((r, i) => 
      `${i + 1}. ${r.titre}\n   Score: ${r.score}/10\n   ${r.explication}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `titres-${formData.sujet.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Générateur de Titres IA</h1>
                <p className="text-gray-400">Créez des titres accrocheurs qui convertissent</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h2 className="text-xl font-semibold text-white mb-6">Configuration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sujet */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sujet principal *
                  </label>
                  <input
                    type="text"
                    value={formData.sujet}
                    onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                    placeholder="Ex: Comment créer un business en ligne"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF]"
                    required
                  />
                </div>

                {/* Type de contenu */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type de contenu
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="article">Article de blog</option>
                    <option value="video">Vidéo YouTube</option>
                    <option value="ebook">Ebook</option>
                    <option value="formation">Formation en ligne</option>
                  </select>
                </div>

                {/* Émotion cible */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Émotion cible
                  </label>
                  <select
                    value={formData.emotion}
                    onChange={(e) => setFormData({...formData, emotion: e.target.value as any})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="curiosite">Curiosité</option>
                    <option value="urgence">Urgence</option>
                    <option value="benefice">Bénéfice</option>
                    <option value="probleme">Résolution de problème</option>
                  </select>
                </div>

                {/* Nombre de titres */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de titres ({formData.nombreTitres})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={formData.nombreTitres}
                    onChange={(e) => setFormData({...formData, nombreTitres: parseInt(e.target.value)})}
                    className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Bouton de génération */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.sujet}
                  className="w-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Générer les titres
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Résultats */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Résultats</h2>
                {results.length > 0 && (
                  <button
                    onClick={exportResults}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-300 hover:bg-[#232323] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {results.length === 0 && !isLoading && !error && (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configurez vos paramètres et générez vos premiers titres</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 text-[#00D2FF] animate-spin" />
                  <p className="text-gray-400">Génération de vos titres en cours...</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-[#00D2FF] text-black px-2 py-1 rounded font-medium">
                              Score: {result.score}/10
                            </span>
                          </div>
                          <h3 className="text-white font-medium mb-2">{result.titre}</h3>
                          <p className="text-sm text-gray-400">{result.explication}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.titre)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors"
                          title="Copier le titre"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 