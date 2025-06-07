'use client';

import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { MessageSquare, Plus, Search, Edit, Trash2, Eye, Filter, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PromptData {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: 'system' | 'user' | 'complex';
  content: string;
  tool: string;
  isActive: boolean;
  parameters?: string;
  performance: {
    usage: number;
    successRate: number;
    avgResponseTime: number;
  };
  lastModified: string;
  version: number;
  createdBy: string;
}

interface PromptsResponse {
  prompts: PromptData[];
  total: number;
  stats: {
    total: number;
    active: number;
    avgSuccessRate: number;
    totalUsage: number;
  };
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptData | null>(null);
  const [statsData, setStatsData] = useState([
    {
      title: "Total prompts",
      value: "0",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Prompts actifs",
      value: "0",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Taux de succès moyen",
      value: "0%",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Utilisations ce mois",
      value: "0",
      change: "+0%",
      trend: "up" as const
    }
  ]);

  useEffect(() => {
    fetchPrompts();
  }, [categoryFilter, typeFilter, activeFilter]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (activeFilter !== 'all') params.append('active', activeFilter);
      
      const response = await fetch(`/api/admin/prompts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des prompts');
      }
      
      const data: PromptsResponse = await response.json();
      setPrompts(data.prompts);
      
      // Mettre à jour les statistiques
      setStatsData([
        {
          title: "Total prompts",
          value: data.stats.total.toString(),
          change: "+12%",
          trend: "up" as const
        },
        {
          title: "Prompts actifs",
          value: data.stats.active.toString(),
          change: "+8%",
          trend: "up" as const
        },
        {
          title: "Taux de succès moyen",
          value: `${data.stats.avgSuccessRate}%`,
          change: "+2.1%",
          trend: "up" as const
        },
        {
          title: "Utilisations ce mois",
          value: data.stats.totalUsage.toLocaleString(),
          change: "+18%",
          trend: "up" as const
        }
      ]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtrer les prompts localement par le terme de recherche
    // Dans une vraie app, cela devrait être fait côté serveur
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleActiveChange = (active: string) => {
    setActiveFilter(active);
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      system: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
      complex: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const formatPerformance = (performance: PromptData['performance']) => {
    return {
      usage: performance.usage.toLocaleString(),
      successRate: `${performance.successRate}%`,
      avgResponseTime: `${performance.avgResponseTime}s`
    };
  };

  // Filtrer les prompts par terme de recherche
  const filteredPrompts = prompts.filter(prompt => 
    searchTerm === '' || 
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<MessageSquare size={24} />}
        title="Gestion des prompts"
        subtitle="Gérez vos prompts IA et optimisez les performances"
        stats={[]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0033]"></div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<MessageSquare size={24} />}
      title="Gestion des prompts"
      subtitle="Gérez vos prompts IA et optimisez les performances"
      stats={statsData}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={fetchPrompts}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff0033] focus:border-transparent w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium"
            >
              Rechercher
            </button>
          </form>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              <option value="Stratégie">Stratégie</option>
              <option value="Contenu">Contenu</option>
              <option value="Marketing">Marketing</option>
              <option value="Analyse">Analyse</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
            >
              <option value="all">Tous types</option>
              <option value="system">Système</option>
              <option value="user">Utilisateur</option>
              <option value="complex">Complexe</option>
            </select>
            
            <select
              value={activeFilter}
              onChange={(e) => handleActiveChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
            >
              <option value="all">Tous statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
            
            <button 
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouveau prompt
            </button>
          </div>
        </div>
      </div>

      {/* Liste des prompts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Liste des prompts</h2>
        
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun prompt trouvé</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nom</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Catégorie</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Outil</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Performance</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrompts.map((prompt) => {
                const performance = formatPerformance(prompt.performance);
                return (
                  <tr key={prompt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-black font-medium">{prompt.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{prompt.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prompt.category}</td>
                    <td className="py-3 px-4">{getTypeBadge(prompt.type)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {prompt.tool}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="text-green-600 font-semibold">{performance.usage} utilisations</div>
                        <div className="text-gray-500">{performance.successRate} succès</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(prompt.isActive)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Voir">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPrompt(prompt);
                            setShowModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 p-1 rounded" 
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1 rounded" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Prompts les plus populaires */}
      {filteredPrompts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Prompts les plus populaires
          </h3>
          <div className="space-y-3">
            {filteredPrompts
              .filter(prompt => prompt.performance.usage > 0)
              .sort((a, b) => b.performance.usage - a.performance.usage)
              .slice(0, 5)
              .map((prompt) => (
                <div key={prompt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-700 font-medium">{prompt.name}</span>
                    <div className="text-sm text-gray-500">{prompt.category} • {prompt.tool}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">{prompt.performance.usage} utilisations</div>
                    <div className="text-sm text-gray-500">{prompt.performance.successRate}% succès</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Statistiques de performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-black mb-4">Statistiques de performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Prompts système</h4>
            <p className="text-2xl font-bold text-blue-600">
              {filteredPrompts.filter(p => p.type === 'system').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Prompts utilisateur</h4>
            <p className="text-2xl font-bold text-green-600">
              {filteredPrompts.filter(p => p.type === 'user').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Prompts complexes</h4>
            <p className="text-2xl font-bold text-purple-600">
              {filteredPrompts.filter(p => p.type === 'complex').length}
            </p>
          </div>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}