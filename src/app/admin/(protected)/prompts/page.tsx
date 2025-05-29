'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  BarChart3, 
  TestTube, 
  Save,
  X,
  Eye,
  History,
  TrendingUp,
  Zap,
  Brain,
  Target
} from 'lucide-react';
import { SYSTEM_PROMPTS, TONE_DESCRIPTIONS, TONE_GUIDELINES, COMPLEX_PROMPTS } from '@/lib/prompts';

interface PromptData {
  id: string;
  name: string;
  category: string;
  type: 'system' | 'user' | 'complex';
  content: string;
  tool: string;
  isActive: boolean;
  performance: {
    usage: number;
    successRate: number;
    avgResponseTime: number;
  };
  lastModified: string;
  version: number;
}

// Données de démonstration basées sur les prompts existants
const mockPrompts: PromptData[] = [
  {
    id: '1',
    name: 'ICP Maker - Système',
    category: 'Stratégie',
    type: 'complex',
    content: COMPLEX_PROMPTS.icp,
    tool: 'icp-maker',
    isActive: true,
    performance: { usage: 156, successRate: 94, avgResponseTime: 3.2 },
    lastModified: '2024-01-15',
    version: 3
  },
  {
    id: '2',
    name: 'Générateur Titres - Accrocheur',
    category: 'Contenu',
    type: 'user',
    content: 'Génère 8 titres accrocheurs et impactants...',
    tool: 'titles',
    isActive: true,
    performance: { usage: 89, successRate: 91, avgResponseTime: 2.1 },
    lastModified: '2024-01-12',
    version: 2
  },
  {
    id: '3',
    name: 'Descriptions Produit - Commercial',
    category: 'Vente',
    type: 'user',
    content: 'Génère 5 descriptions commerciales et persuasives...',
    tool: 'descriptions',
    isActive: true,
    performance: { usage: 134, successRate: 88, avgResponseTime: 2.8 },
    lastModified: '2024-01-10',
    version: 1
  },
  {
    id: '4',
    name: 'Tunnel de Vente - Système',
    category: 'Marketing',
    type: 'complex',
    content: 'Tu es expert en copywriting, funnel marketing...',
    tool: 'tunnel',
    isActive: true,
    performance: { usage: 67, successRate: 92, avgResponseTime: 4.1 },
    lastModified: '2024-01-08',
    version: 2
  },
  {
    id: '5',
    name: 'Email Marketing - Séquence',
    category: 'Email',
    type: 'complex',
    content: 'Tu es un expert en copywriting et email marketing...',
    tool: 'emails',
    isActive: true,
    performance: { usage: 45, successRate: 89, avgResponseTime: 3.7 },
    lastModified: '2024-01-05',
    version: 1
  },
  {
    id: '6',
    name: 'USP Generator - Système',
    category: 'Stratégie',
    type: 'complex',
    content: 'Tu es expert en copywriting, marketing et différenciation...',
    tool: 'usp',
    isActive: false,
    performance: { usage: 23, successRate: 85, avgResponseTime: 2.9 },
    lastModified: '2024-01-03',
    version: 1
  }
];

export default function PromptsAdminPage() {
  const [prompts, setPrompts] = useState<PromptData[]>(mockPrompts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = !searchTerm || 
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tool.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || prompt.category === categoryFilter;
    const matchesType = !typeFilter || prompt.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const stats = {
    total: prompts.length,
    active: prompts.filter(p => p.isActive).length,
    avgSuccessRate: Math.round(prompts.reduce((sum, p) => sum + p.performance.successRate, 0) / prompts.length),
    totalUsage: prompts.reduce((sum, p) => sum + p.performance.usage, 0)
  };

  const categories = [...new Set(prompts.map(p => p.category))];
  const types = [...new Set(prompts.map(p => p.type))];

  const handleEdit = (prompt: PromptData) => {
    setSelectedPrompt(prompt);
    setEditContent(prompt.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedPrompt) {
      setPrompts(prompts.map(p => 
        p.id === selectedPrompt.id 
          ? { ...p, content: editContent, lastModified: new Date().toISOString().split('T')[0], version: p.version + 1 }
          : p
      ));
      setIsEditing(false);
      setSelectedPrompt(null);
    }
  };

  const handleToggleActive = (id: string) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Brain className="w-4 h-4" />;
      case 'complex': return <Zap className="w-4 h-4" />;
      case 'user': return <Target className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Prompts IA</h1>
          <p className="text-gray-400 mt-2">Administrez et optimisez les prompts de vos outils IA</p>
        </div>
        <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Prompt
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Prompts</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Actifs</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taux de Succès</p>
              <p className="text-2xl font-bold text-white">{stats.avgSuccessRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Utilisations</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsage}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
          >
            <option value="">Tous les types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des prompts */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-semibold text-white mb-4">Prompts Configurés</h2>
        <div className="space-y-4">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="flex items-center justify-between p-4 bg-[#18181b] rounded-lg border border-[#232323] hover:border-[#333] transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getTypeIcon(prompt.type)}
                  <h3 className="text-white font-medium">{prompt.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    prompt.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {prompt.isActive ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                    v{prompt.version}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span>Outil: {prompt.tool}</span>
                  <span>Catégorie: {prompt.category}</span>
                  <span>Utilisations: {prompt.performance.usage}</span>
                  <span className={getPerformanceColor(prompt.performance.successRate)}>
                    Succès: {prompt.performance.successRate}%
                  </span>
                  <span>Temps: {prompt.performance.avgResponseTime}s</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPrompt(prompt)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Voir le prompt"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(prompt)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Éditer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(prompt.content)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Copier"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(prompt.id)}
                  className={`p-2 transition-colors ${
                    prompt.isActive ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'
                  }`}
                  title={prompt.isActive ? 'Désactiver' : 'Activer'}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    prompt.isActive ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                </button>
              </div>
            </div>
          ))}
          {filteredPrompts.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {searchTerm || categoryFilter || typeFilter ? 'Aucun prompt ne correspond à vos critères' : 'Aucun prompt configuré'}
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualisation/édition */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl border border-[#232323] w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#232323]">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedPrompt.name}</h3>
                <p className="text-gray-400 text-sm">
                  {selectedPrompt.tool} • {selectedPrompt.category} • v{selectedPrompt.version}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedPrompt(null);
                    setIsEditing(false);
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#ff0033] resize-none"
                  placeholder="Contenu du prompt..."
                />
              ) : (
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                    {selectedPrompt.content}
                  </pre>
                </div>
              )}
              
              {/* Métriques de performance */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Utilisations</div>
                  <div className="text-2xl font-bold text-white">{selectedPrompt.performance.usage}</div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Taux de succès</div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(selectedPrompt.performance.successRate)}`}>
                    {selectedPrompt.performance.successRate}%
                  </div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Temps moyen</div>
                  <div className="text-2xl font-bold text-white">{selectedPrompt.performance.avgResponseTime}s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 