'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { 
  BarChart3, TrendingUp, DollarSign, Zap, Users, 
  Bot, AlertTriangle, Loader2, Calendar, Download
} from 'lucide-react';
import AdvancedCharts from '@/components/admin/AdvancedCharts';

interface Analytics {
  global: {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    successRate: number;
  };
  tools: Array<{
    id: string;
    name: string;
    category: string;
    usage: number;
    tokens: number;
    cost: number;
    errors: number;
    successRate: number;
  }>;
  topUsers: Array<{
    email: string;
    usage: number;
    tokens: number;
    cost: number;
  }>;
  evolution: Array<{
    date: string;
    usage: number;
    tokens: number;
    cost: number;
  }>;
  period: string;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  // Charger les analytics
  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/ai-tools/analytics?period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(num);
  };

  const handleExport = async (format: 'csv' | 'pdf', type: 'tools' | 'logs') => {
    try {
      const response = await fetch(`/api/admin/export?format=${format}&type=${type}&period=${period}`);
      if (!response.ok) throw new Error('Erreur lors de l\'export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  if (loading || !analytics) {
    return (
      <AdminLayoutWithSidebar>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  // Calculer le max pour l'échelle du graphique
  const maxUsage = Math.max(...analytics.evolution.map(d => d.usage), 1);

  // Calculer les données pour les graphiques
  const categoriesData = analytics.tools.reduce((acc: any[], tool) => {
    const existingCategory = acc.find(c => c.category === tool.category);
    if (existingCategory) {
      existingCategory.usage += tool.usage;
    } else {
      acc.push({ category: tool.category, usage: tool.usage });
    }
    return acc;
  }, []);

  return (
    <AdminLayoutWithSidebar>
      <div className="h-full">
        {/* Header */}
        <header className="bg-[#111] border-b border-[#232323] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-[#ff0033]" />
              <h1 className="text-2xl font-bold text-white">Analytics IA</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="all">Tout</option>
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('csv', 'tools')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white hover:border-[#ff0033] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  CSV Outils
                </button>
                <button
                  onClick={() => handleExport('pdf', 'tools')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white hover:border-[#ff0033] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF Outils
                </button>
                <button
                  onClick={() => handleExport('csv', 'logs')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white hover:border-[#ff0033] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  CSV Logs
                </button>
                <button
                  onClick={() => handleExport('pdf', 'logs')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white hover:border-[#ff0033] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF Logs
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
                <span className="text-xs text-gray-400">{period === '7d' ? '7j' : period === '30d' ? '30j' : 'Total'}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{formatNumber(analytics.global.totalRequests)}</h3>
              <p className="text-gray-400 text-sm mt-1">Requêtes totales</p>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
                <span className="text-xs text-gray-400">{formatNumber(analytics.global.totalTokens)}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{formatNumber(analytics.global.totalTokens / 1000)}k</h3>
              <p className="text-gray-400 text-sm mt-1">Tokens utilisés</p>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(analytics.global.totalCost)}</h3>
              <p className="text-gray-400 text-sm mt-1">Coût estimé</p>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-[#ff0033]" />
                <span className="text-xs text-gray-400">{analytics.global.successRate.toFixed(1)}%</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{analytics.global.successRate.toFixed(0)}%</h3>
              <p className="text-gray-400 text-sm mt-1">Taux de succès</p>
            </div>
          </div>

          {/* Graphiques avancés */}
          <AdvancedCharts
            evolution={analytics.evolution}
            tools={analytics.tools}
            categories={categoriesData}
          />

          {/* Tableau des outils */}
          <div className="bg-[#111] rounded-xl border border-[#232323] overflow-hidden">
            <div className="p-4 border-b border-[#232323]">
              <h2 className="text-lg font-semibold text-white">Performance par outil</h2>
            </div>
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-[#232323]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Utilisation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Tokens</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Coût</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Succès</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232323]">
                {analytics.tools.slice(0, 10).map((tool) => (
                  <tr key={tool.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{tool.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{tool.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatNumber(tool.usage)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatNumber(tool.tokens)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatCurrency(tool.cost)}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        tool.successRate >= 90 ? 'bg-green-900/20 text-green-400' :
                        tool.successRate >= 70 ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-red-900/20 text-red-400'
                      }`}>
                        {tool.successRate.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top utilisateurs */}
          <div className="bg-[#111] rounded-xl border border-[#232323] overflow-hidden">
            <div className="p-4 border-b border-[#232323]">
              <h2 className="text-lg font-semibold text-white">Top utilisateurs</h2>
            </div>
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-[#232323]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Requêtes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Tokens</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Coût</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232323]">
                {analytics.topUsers.map((user, index) => (
                  <tr key={user.email} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                      {index < 3 && <span className="text-yellow-400">🏆</span>}
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatNumber(user.usage)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatNumber(user.tokens)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatCurrency(user.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}