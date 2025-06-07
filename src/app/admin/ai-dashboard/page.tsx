'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { 
  Brain, 
  Plus, 
  Edit, 
  BarChart3, 
  Settings, 
  Clock, 
  DollarSign,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  provider: string;
  usageCount: number;
  avgResponseTime: number;
  avgCost: number;
  successRate: number;
  lastUsed: string;
}

interface PerformanceMetrics {
  totalRequests: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;
  topPerformingTool: string;
  costSavings: number;
}

export default function AIDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tools, setTools] = useState<AITool[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Vérification des permissions
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email) {
      router.push('/');
      return;
    }
    
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      router.push('/dashboard');
      return;
    }

    loadDashboardData();
  }, [session, status, router, timeRange]);

  useEffect(() => {
    if (session?.user?.email === 'cyril.iriebi@gmail.com') {
      loadDashboardData();
    }
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      // Charger les métriques analytics
      const analyticsResponse = await fetch(`/api/admin/analytics?period=${timeRange}`);
      const toolsResponse = await fetch('/api/admin/ai-tools');
      
      if (analyticsResponse.ok && toolsResponse.ok) {
        const analyticsResult = await analyticsResponse.json();
        const toolsResult = await toolsResponse.json();
        
        // Transformer les données analytics en métriques
        const analytics = analyticsResult.data;
        setMetrics({
          totalRequests: analytics.totalRequests || 0,
          totalCost: analytics.totalCost || 0,
          avgResponseTime: analytics.avgResponseTime || 0,
          successRate: analytics.successRate || 0,
          topPerformingTool: analytics.topTool || 'N/A',
          costSavings: analytics.costSavings || 0
        });
        
        // Transformer les outils pour correspondre à l'interface
        const transformedTools = toolsResult.data.map((tool: any) => ({
          id: tool.id,
          name: tool.name,
          type: tool.type || 'AI Tool',
          status: tool.is_active ? 'active' : 'paused',
          provider: tool.provider || 'Unknown',
          usageCount: tool.usage_count || 0,
          avgResponseTime: tool.avg_response_time || 0,
          avgCost: tool.avg_cost || 0,
          successRate: tool.success_rate || 0,
          lastUsed: tool.last_used || new Date().toISOString()
        }));
        
        setTools(transformedTools);
      } else {
        console.error('Erreur chargement métriques IA');
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => `€${amount.toFixed(3)}`;
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Stats pour le header
  const statsData = metrics ? [
    {
      title: "Requêtes Totales",
      value: metrics.totalRequests.toLocaleString(),
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: "Coût Total",
      value: formatCurrency(metrics.totalCost),
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: "Temps Réponse",
      value: formatTime(metrics.avgResponseTime),
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Taux de Succès",
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: <CheckCircle className="w-5 h-5" />
    }
  ] : [];

  // Actions du header
  const actions = [
    {
      label: "Gérer Outils",
      onClick: () => router.push('/admin/outils-ia'),
      icon: <Plus className="w-4 h-4" />
    },
    {
      label: "Prompts",
      onClick: () => router.push('/admin/prompts'),
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: "Configuration",
      onClick: () => router.push('/admin/config-providers'),
      icon: <Settings className="w-4 h-4" />
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Brain className="w-5 h-5" />}
        title="Dashboard IA"
        subtitle="Chargement des métriques..."
        stats={[]}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement des données...</span>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Brain className="w-5 h-5" />}
      title="Dashboard IA"
      subtitle="Gestion et monitoring des outils d'intelligence artificielle"
      stats={statsData}
      actions={actions}
    >
      <div className="space-y-6">
        
        {/* Filtres */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Outils IA</h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="24h">24 dernières heures</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des Outils */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût Moyen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Utilisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tool.status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tool.status)}`}>
                          {tool.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tool.provider}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{tool.usageCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{formatTime(tool.avgResponseTime)}</div>
                        <div className="text-gray-500">{tool.successRate}% succès</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(tool.avgCost)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(tool.lastUsed)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTool(tool)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir détails"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/outils-ia/${tool.id}`}
                          className="text-gray-600 hover:text-gray-800"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/outils-ia/${tool.id}/config`}
                          className="text-gray-600 hover:text-gray-800"
                          title="Configuration"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Performers</h3>
            <div className="space-y-3">
              {tools
                .filter(t => t.status === 'active')
                .sort((a, b) => b.successRate - a.successRate)
                .slice(0, 3)
                .map((tool, index) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-400">#{index + 1}</span>
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.successRate}% succès</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{tool.usageCount} usages</div>
                      <div className="text-xs text-gray-500">{formatTime(tool.avgResponseTime)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">💰 Économies Réalisées</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{formatCurrency(metrics?.costSavings || 0)}</div>
                <div className="text-sm text-green-600">Économisé vs. OpenAI seul</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>DeepSeek V3 (vs GPT-4)</span>
                  <span className="font-medium text-green-600">-95%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Optimisation moyenne</span>
                  <span className="font-medium text-green-600">-78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ROI mensuel estimé</span>
                  <span className="font-medium text-blue-600">+€{((metrics?.costSavings || 0) * 4).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Détails Outil */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Détails - {selectedTool.name}</h3>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider Actuel</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTool.provider}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTool.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Utilisation (7j)</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTool.usageCount} requêtes</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temps Réponse Moyen</label>
                <p className="mt-1 text-sm text-gray-900">{formatTime(selectedTool.avgResponseTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coût par Requête</label>
                <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedTool.avgCost)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Taux de Succès</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTool.successRate}%</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSelectedTool(null);
                  window.location.href = `/admin/outils-ia/${selectedTool.id}/config`;
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Configurer
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </AdminLayoutWithSidebar>
  );
}