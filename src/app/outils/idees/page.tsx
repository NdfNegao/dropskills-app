'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Lightbulb, TrendingUp, DollarSign, ArrowLeft, Target, Star, Zap } from 'lucide-react';

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

const mockIdeas: ProductIdea[] = [
  {
    id: '1',
    title: 'Templates de Newsletters IA',
    description: 'Pack de templates de newsletters optimisés avec des prompts IA pour générer du contenu engageant automatiquement.',
    category: 'Marketing',
    difficulty: 'Facile',
    revenue: '500-2000€/mois',
    trend: 95,
    tags: ['IA', 'Email Marketing', 'Templates']
  },
  {
    id: '2',
    title: 'Calculateur de ROI SaaS',
    description: 'Outil interactif pour calculer le retour sur investissement des logiciels SaaS avec tableaux de bord personnalisés.',
    category: 'Business',
    difficulty: 'Moyen',
    revenue: '1000-5000€/mois',
    trend: 88,
    tags: ['SaaS', 'ROI', 'Analytics']
  },
  {
    id: '3',
    title: 'Pack Créateur de Contenu TikTok',
    description: 'Scripts, hooks, et stratégies pour créer du contenu viral sur TikTok avec des templates prêts à utiliser.',
    category: 'Social Media',
    difficulty: 'Facile',
    revenue: '300-1500€/mois',
    trend: 92,
    tags: ['TikTok', 'Viral', 'Scripts']
  }
];

export default function IdeesProduitsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    minRevenue: ''
  });
  const [ideas, setIdeas] = useState<ProductIdea[]>(mockIdeas);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewIdeas = () => {
    setIsGenerating(true);
    
    // Simulation de génération d'idées
    setTimeout(() => {
      const newIdeas: ProductIdea[] = [
        {
          id: '4',
          title: 'Audit SEO Automatisé',
          description: 'Outil d\'audit SEO complet avec recommandations personnalisées et plan d\'action détaillé.',
          category: 'SEO',
          difficulty: 'Difficile',
          revenue: '2000-8000€/mois',
          trend: 85,
          tags: ['SEO', 'Audit', 'Automatisation']
        },
        {
          id: '5',
          title: 'Générateur de Personas Client',
          description: 'Créez des personas clients détaillés avec IA basés sur vos données et votre marché cible.',
          category: 'Marketing',
          difficulty: 'Moyen',
          revenue: '800-3000€/mois',
          trend: 90,
          tags: ['Personas', 'IA', 'Marketing']
        }
      ];
      
      setIdeas(prev => [...newIdeas, ...prev]);
      setIsGenerating(false);
    }, 2000);
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

            {/* Bouton de génération */}
            <button
              onClick={generateNewIdeas}
              disabled={isGenerating}
              className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Générer de nouvelles idées
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

          {/* Liste des idées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ideas.map((idea) => (
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

                <button className="w-full mt-4 bg-[#1a1a1a] text-white py-2 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Analyser cette idée
                </button>
              </div>
            ))}
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
    </div>
  );
} 