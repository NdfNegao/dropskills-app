'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import IdeaAnalysisModal from '@/components/IdeaAnalysisModal';
import { 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  ArrowLeft, 
  Target, 
  Star, 
  Zap,
  User,
  MessageSquare,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react';

interface ProductIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  revenue: string;
  trend: number;
  tags: string[];
}

interface PersonalizedIdea {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  marketSize: string;
  difficulty: string;
  revenue: string;
  keyFeatures: string[];
  marketingStrategy: string;
}

export default function IdeesProduitsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // États pour le formulaire personnalisé
  const [formData, setFormData] = useState({
    targetAudience: '',
    topic: '',
    formats: [] as string[]
  });
  const [personalizedIdeas, setPersonalizedIdeas] = useState<PersonalizedIdea[]>([]);
  const [isGeneratingPersonalized, setIsGeneratingPersonalized] = useState(false);
  
  // États pour les idées générales
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    minRevenue: ''
  });
  const [generalIdeas, setGeneralIdeas] = useState<ProductIdea[]>([]);
  const [isGeneratingGeneral, setIsGeneratingGeneral] = useState(false);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(true);

  // États pour le modal d'analyse
  const [selectedIdeaForAnalysis, setSelectedIdeaForAnalysis] = useState<{
    title: string;
    description: string;
    revenue?: string;
  } | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const formatOptions = [
    'E-book', 'Course', 'Template', 'Software', 'Membership', 'Coaching'
  ];

  // Charger les idées tendances au démarrage
  const loadTrendingIdeas = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.minRevenue) params.append('minRevenue', filters.minRevenue);

      const response = await fetch(`/api/ideas/trending?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.ideas) {
          setGeneralIdeas(data.ideas);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des idées tendances:', error);
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  // Charger les idées au démarrage et quand les filtres changent
  useEffect(() => {
    loadTrendingIdeas();
  }, [filters]);

  const handleFormatToggle = (format: string) => {
    setFormData(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format]
    }));
  };

  const generatePersonalizedIdeas = async () => {
    if (!formData.targetAudience.trim()) {
      alert('Veuillez renseigner votre audience cible');
      return;
    }

    setIsGeneratingPersonalized(true);
    
    try {
      console.log('Appel API /api/ideas/generate avec :', {
        targetAudience: formData.targetAudience,
        topic: formData.topic || undefined,
        formats: formData.formats.length > 0 ? formData.formats : undefined
      });

      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetAudience: formData.targetAudience,
          topic: formData.topic || undefined,
          formats: formData.formats.length > 0 ? formData.formats : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erreur lors de la génération');
      }
      
      if (!data.success || !data.ideas) {
        throw new Error('Format de réponse invalide');
      }

      // Convertir les idées de l'API vers le format attendu par l'interface
      const convertedIdeas: PersonalizedIdea[] = data.ideas.map((idea: any) => ({
        id: idea.id || crypto.randomUUID(),
        title: idea.title,
        description: idea.description,
        targetAudience: idea.targetAudience,
        marketSize: idea.marketSize,
        difficulty: idea.difficulty,
        revenue: idea.revenue,
        keyFeatures: idea.keyFeatures || [],
        marketingStrategy: idea.marketingStrategy
      }));
      
      setPersonalizedIdeas(convertedIdeas);
      
    } catch (error) {
      console.error('Erreur détaillée lors de la génération:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la génération des idées');
    } finally {
      setIsGeneratingPersonalized(false);
    }
  };

  const generateGeneralIdeas = async () => {
    setIsGeneratingGeneral(true);
    
    try {
      // Recharger les idées tendances (cela peut déclencher la création de nouvelles idées côté serveur)
      await loadTrendingIdeas();
    } catch (error) {
      console.error('Erreur lors de la génération des nouvelles tendances:', error);
    } finally {
      setIsGeneratingGeneral(false);
    }
  };

  // Fonction pour ouvrir l'analyse d'une idée
  const handleAnalyzeIdea = (idea: ProductIdea) => {
    setSelectedIdeaForAnalysis({
      title: idea.title,
      description: idea.description,
      revenue: idea.revenue
    });
    setIsAnalysisModalOpen(true);
  };

  // Fonction pour fermer le modal d'analyse
  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    setSelectedIdeaForAnalysis(null);
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'text-green-400 bg-green-500/10';
      case 'Moyen': return 'text-yellow-400 bg-yellow-500/10';
      case 'Difficile': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ff0033] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Idées de Produits</h1>
                <p className="text-gray-400">Découvrez des idées de produits rentables</p>
              </div>
            </div>
          </div>

          {/* Digital Product Ideator - Formulaire personnalisé */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ff0033]/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-[#ff0033]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Digital Product Ideator</h2>
                <p className="text-gray-400">Obtenez des idées de produits personnalisées selon vos critères</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulaire */}
              <div className="space-y-6">
                {/* Target Audience */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <User className="w-4 h-4" />
                    Audience Cible
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder="Qui est votre client idéal ? (Ex: Entrepreneurs débutants, Graphistes freelance, Coachs en développement personnel)"
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#ff0033] focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <MessageSquare className="w-4 h-4" />
                    Sujet (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="Dans quel domaine ? (Ex: Marketing digital, Investissement immobilier, Bien-être)"
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#ff0033] focus:outline-none"
                  />
                </div>

                {/* Formats */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <FileText className="w-4 h-4" />
                    Formats souhaités (optionnel)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formatOptions.map((format) => (
                      <button
                        key={format}
                        onClick={() => handleFormatToggle(format)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.formats.includes(format)
                            ? 'bg-[#ff0033] text-white'
                            : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#232323]'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton de génération */}
                <button
                  onClick={generatePersonalizedIdeas}
                  disabled={isGeneratingPersonalized || !formData.targetAudience.trim()}
                  className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGeneratingPersonalized ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Générer mes idées personnalisées
                    </>
                  )}
                </button>
              </div>

              {/* Aperçu des idées personnalisées */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">Vos idées personnalisées</h3>
                
                {personalizedIdeas.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">Remplissez le formulaire pour obtenir des idées personnalisées</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {personalizedIdeas.map((idea) => (
                      <div key={idea.id} className="bg-[#111111] rounded-lg p-4 border border-[#232323]">
                        <h4 className="text-white font-semibold mb-2">{idea.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{idea.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-[#ff0033]/10 text-[#ff0033] px-2 py-1 rounded">
                            {idea.revenue}
                          </span>
                          <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                            {idea.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section des idées générales/tendances */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Tendances & Idées Populaires</h2>
                <p className="text-gray-400">Découvrez les idées qui fonctionnent actuellement</p>
              </div>
              <button
                onClick={generateGeneralIdeas}
                disabled={isGeneratingGeneral}
                className="bg-[#232323] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingGeneral ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Nouvelles tendances
                  </>
                )}
              </button>
            </div>

            {/* Filtres */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Filtres</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  >
                    <option value="">Toutes les catégories</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="SEO">SEO</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulté
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  >
                    <option value="">Toutes les difficultés</option>
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Revenus minimum
                  </label>
                  <select
                    value={filters.minRevenue}
                    onChange={(e) => setFilters({...filters, minRevenue: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  >
                    <option value="">Tous les revenus</option>
                    <option value="500">500€+ /mois</option>
                    <option value="1000">1000€+ /mois</option>
                    <option value="2000">2000€+ /mois</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des idées générales */}
            {isLoadingGeneral ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff0033]" />
                <span className="ml-3 text-gray-400">Chargement des idées tendances...</span>
              </div>
            ) : generalIdeas.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Aucune idée trouvée avec ces filtres</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {generalIdeas.map((idea) => (
                  <div key={idea.id} className="bg-[#111111] rounded-xl p-6 border border-[#232323] hover:border-[#333] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{idea.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{idea.trend}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs bg-[#232323] text-gray-300 px-2 py-1 rounded">
                        {idea.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium text-sm">{idea.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#ff0033]" />
                        <span className="text-gray-400 text-sm">Tendance forte</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#232323]">
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-[#ff0033]/10 text-[#ff0033] px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAnalyzeIdea(idea)}
                      className="w-full mt-4 bg-[#1a1a1a] text-white py-2 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Analyser cette idée
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section informative */}
          <div className="mt-12 bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4">Comment utiliser ces idées ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-medium mb-2">1. Analysez</h4>
                <p className="text-gray-400 text-sm">Étudiez le marché et la concurrence pour valider l'idée</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-2">2. Adaptez</h4>
                <p className="text-gray-400 text-sm">Personnalisez l'idée selon votre expertise et audience</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-2">3. Lancez</h4>
                <p className="text-gray-400 text-sm">Créez un MVP et testez rapidement sur le marché</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal d'analyse */}
      {selectedIdeaForAnalysis && (
        <IdeaAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={handleCloseAnalysisModal}
          idea={selectedIdeaForAnalysis}
        />
      )}
    </div>
  );
} 