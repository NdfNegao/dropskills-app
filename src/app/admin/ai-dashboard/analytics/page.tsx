'use client';

import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { BarChart3, TrendingUp, Clock, Users, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  overview: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    totalTokensUsed: number;
    totalCost: number;
    activeUsers: number;
    popularTools: string[];
  };
  timeSeriesData: {
    timestamp: string;
    requests: number;
    responseTime: number;
    successRate: number;
    tokensUsed: number;
    cost: number;
  }[];
  toolMetrics: {
    toolId: string;
    toolName: string;
    requests: number;
    successRate: number;
    avgResponseTime: number;
    tokensUsed: number;
    cost: number;
    errors: {
      type: string;
      count: number;
      lastOccurrence: string;
    }[];
  }[];
  modelMetrics: {
    model: string;
    requests: number;
    successRate: number;
    avgResponseTime: number;
    tokensUsed: number;
    cost: number;
    avgTokensPerRequest: number;
  }[];
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    topUsers: {
      userId: string;
      username: string;
      requests: number;
      tokensUsed: number;
    }[];
  };
  alerts: {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    resolved: boolean;
  }[];
}

interface FilterOptions {
  timeRange: '1h' | '24h' | '7d' | '30d';
  tools: string[];
  models: string[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: '24h',
    tools: [],
    models: []
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'requests' | 'responseTime' | 'successRate' | 'cost'>('requests');

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshAnalytics();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, filters]);

  const loadAnalytics = async () => {
    try {
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        tools: filters.tools.join(','),
        models: filters.models.join(',')
      });
      
      const response = await fetch(`/api/admin/analytics?${params}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const exportData = async () => {
    try {
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        tools: filters.tools.join(','),
        models: filters.models.join(','),
        format: 'csv'
      });
      
      const response = await fetch(`/api/admin/analytics/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${filters.timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/resolve`, {
        method: 'PATCH'
      });
      
      if (response.ok && data) {
        setData({
          ...data,
          alerts: data.alerts.map(alert => 
            alert.id === alertId ? { ...alert, resolved: true } : alert
          )
        });
      }
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMetricColor = (value: number, type: 'successRate' | 'responseTime'): string => {
    if (type === 'successRate') {
      if (value >= 95) return 'text-green-600';
      if (value >= 90) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value <= 1000) return 'text-green-600';
      if (value <= 3000) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        icon={<BarChart3 className="w-6 h-6" />}
        title="Analytics Avancées"
        subtitle="Monitoring et métriques détaillées"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!data) {
    return (
      <AdminPageLayout
        icon={<BarChart3 className="w-6 h-6" />}
        title="Analytics Avancées"
        subtitle="Monitoring et métriques détaillées"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      </AdminPageLayout>
    );
  }

  const stats = [
    {
      title: 'Requêtes totales',
      value: formatNumber(data.overview.totalRequests),
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      change: '+12%'
    },
    {
      title: 'Taux de succès',
      value: `${Math.round((data.overview.successfulRequests / data.overview.totalRequests) * 100)}%`,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      change: '+2%'
    },
    {
      title: 'Temps de réponse moyen',
      value: `${data.overview.avgResponseTime}ms`,
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      change: '-5%'
    },
    {
      title: 'Coût total',
      value: formatCurrency(data.overview.totalCost),
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      change: '+8%'
    }
  ];

  const actions = [
    {
      label: autoRefresh ? 'Arrêter auto-refresh' : 'Activer auto-refresh',
      onClick: () => setAutoRefresh(!autoRefresh),
      icon: <Zap className={`w-4 h-4 ${autoRefresh ? 'text-green-600' : 'text-gray-600'}`} />
    },
    {
      label: 'Actualiser',
      onClick: refreshAnalytics,
      loading: refreshing,
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: 'Exporter',
      onClick: exportData,
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  return (
    <AdminPageLayout
      icon={<BarChart3 className="w-6 h-6" />}
      title="Analytics Avancées"
      subtitle="Monitoring et métriques détaillées"
      stats={stats}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filtres */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {refreshing && (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                  <span>Actualisation...</span>
                </div>
              )}
              {autoRefresh && (
                <span className="text-green-600">Auto-refresh actif</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({...filters, timeRange: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Dernière heure</option>
                <option value="24h">Dernières 24h</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Métrique</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="requests">Requêtes</option>
                <option value="responseTime">Temps de réponse</option>
                <option value="successRate">Taux de succès</option>
                <option value="cost">Coût</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alertes */}
        {data.alerts.filter(alert => !alert.resolved).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alertes actives</h3>
            <div className="space-y-2">
              {data.alerts.filter(alert => !alert.resolved).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    alert.type === 'error' ? 'border-red-200 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => resolveAlert(alert.id)}
                    variant="outline"
                    size="sm"
                  >
                    Résoudre
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Métriques par outil */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance par outil</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.toolMetrics.map(tool => (
                <div key={tool.toolId} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{tool.toolName}</h4>
                    <span className={`text-sm font-medium ${
                      getMetricColor(tool.successRate, 'successRate')
                    }`}>
                      {tool.successRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="block font-medium">{formatNumber(tool.requests)}</span>
                      <span className="text-xs">Requêtes</span>
                    </div>
                    <div>
                      <span className={`block font-medium ${
                        getMetricColor(tool.avgResponseTime, 'responseTime')
                      }`}>
                        {tool.avgResponseTime}ms
                      </span>
                      <span className="text-xs">Temps moyen</span>
                    </div>
                    <div>
                      <span className="block font-medium">{formatCurrency(tool.cost)}</span>
                      <span className="text-xs">Coût</span>
                    </div>
                  </div>
                  {tool.errors.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-xs text-red-600">
                        {tool.errors.length} type(s) d'erreur détecté(s)
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Métriques par modèle */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance par modèle</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.modelMetrics.map(model => (
                <div key={model.model} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{model.model}</h4>
                    <span className={`text-sm font-medium ${
                      getMetricColor(model.successRate, 'successRate')
                    }`}>
                      {model.successRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="block font-medium">{formatNumber(model.requests)}</span>
                      <span className="text-xs">Requêtes</span>
                    </div>
                    <div>
                      <span className={`block font-medium ${
                        getMetricColor(model.avgResponseTime, 'responseTime')
                      }`}>
                        {model.avgResponseTime}ms
                      </span>
                      <span className="text-xs">Temps moyen</span>
                    </div>
                    <div>
                      <span className="block font-medium">{formatNumber(model.tokensUsed)}</span>
                      <span className="text-xs">Tokens utilisés</span>
                    </div>
                    <div>
                      <span className="block font-medium">{formatCurrency(model.cost)}</span>
                      <span className="text-xs">Coût</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Moyenne: {model.avgTokensPerRequest} tokens/requête
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métriques utilisateurs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques utilisateurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{data.userMetrics.totalUsers}</div>
              <div className="text-sm text-gray-600">Utilisateurs totaux</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.userMetrics.activeUsers}</div>
              <div className="text-sm text-gray-600">Utilisateurs actifs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.userMetrics.newUsers}</div>
              <div className="text-sm text-gray-600">Nouveaux utilisateurs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((data.userMetrics.activeUsers / data.userMetrics.totalUsers) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Taux d'engagement</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Top utilisateurs</h4>
            <div className="space-y-2">
              {data.userMetrics.topUsers.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{user.username}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatNumber(user.requests)} requêtes</span>
                    <span>{formatNumber(user.tokensUsed)} tokens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}