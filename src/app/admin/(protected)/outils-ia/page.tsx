'use client';

import { useState } from 'react';
import { Bot, Plus, Activity, Zap, Search, Filter } from 'lucide-react';

// Données de démonstration
const mockTools = [
  {
    id: '1',
    name: 'ICP Maker IA',
    description: 'Générateur de profil client idéal avec IA',
    toolType: 'GENERATOR',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 45 }
  },
  {
    id: '2',
    name: 'USP Maker IA',
    description: 'Créateur de proposition de valeur unique',
    toolType: 'GENERATOR',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 32 }
  },
  {
    id: '3',
    name: 'Tunnel Maker IA',
    description: 'Générateur de tunnel de vente optimisé',
    toolType: 'GENERATOR',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 28 }
  },
  {
    id: '4',
    name: 'CopyMoneyMail IA',
    description: 'Séquences email automatisées',
    toolType: 'EMAIL',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 19 }
  },
  {
    id: '5',
    name: 'Content System 90J',
    description: 'Système de contenu pour 90 jours',
    toolType: 'CONTENT',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 15 }
  },
  {
    id: '6',
    name: 'Lead Magnet Creator',
    description: 'Créateur d\'aimants à prospects',
    toolType: 'GENERATOR',
    isActive: false,
    createdAt: new Date('2024-01-01'),
    _count: { aiUsage: 8 }
  }
];

export default function OutilsIaPage() {
  const [tools] = useState(mockTools);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchTerm || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && tool.isActive) ||
      (statusFilter === 'inactive' && !tool.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tools.length,
    active: tools.filter(t => t.isActive).length,
    inactive: tools.filter(t => !t.isActive).length,
    todayUsage: 12,
    totalUsage: tools.reduce((sum, tool) => sum + tool._count.aiUsage, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Outils IA</h1>
        <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvel Outil
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Outils</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Bot className="w-8 h-8 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Inactifs</p>
              <p className="text-2xl font-bold text-white">{stats.inactive}</p>
            </div>
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usage Aujourd'hui</p>
              <p className="text-2xl font-bold text-white">{stats.todayUsage}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usage Total</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsage}</p>
            </div>
            <Zap className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Liste des outils */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-semibold text-white mb-4">Outils IA Disponibles</h2>
        <div className="space-y-4">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="flex items-center justify-between p-4 bg-[#18181b] rounded-lg border border-[#232323]">
              <div className="flex-1">
                <h3 className="text-white font-medium">{tool.name}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">Type: {tool.toolType}</span>
                  <span className="text-xs text-gray-500">Utilisations: {tool._count.aiUsage}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  tool.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {tool.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          ))}
          {filteredTools.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {searchTerm || statusFilter ? 'Aucun outil ne correspond à vos critères' : 'Aucun outil IA configuré'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 