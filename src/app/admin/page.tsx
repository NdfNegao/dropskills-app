'use client';

import { useState, useEffect } from 'react';
import { Users, Package, Bot, Activity, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface DashboardStats {
  totalUsers: number;
  totalTools: number;
  totalRequests: number;
  successRate: number;
  trends: {
    users: number;
    tools: number;
    requests: number;
    successRate: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simuler un appel API pour les stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalUsers: 1234,
        totalTools: 15,
        totalRequests: 45200,
        successRate: 98.5,
        trends: {
          users: 12.5,
          tools: 0,
          requests: 23.1,
          successRate: 1.2
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Utilisateurs totaux",
      value: stats?.totalUsers.toLocaleString() || '0',
      change: stats?.trends.users ? `${stats.trends.users > 0 ? '+' : ''}${stats.trends.users}% ce mois` : undefined,
      changeType: (stats?.trends.users || 0) > 0 ? 'positive' as const : (stats?.trends.users || 0) < 0 ? 'negative' as const : 'neutral' as const,
      icon: <Users size={24} />
    },
    {
      title: "Outils IA",
      value: stats?.totalTools || 0,
      change: stats?.trends.tools !== undefined ? `${stats.trends.tools > 0 ? '+' : ''}${stats.trends.tools} nouveaux` : undefined,
      changeType: (stats?.trends.tools || 0) > 0 ? 'positive' as const : (stats?.trends.tools || 0) < 0 ? 'negative' as const : 'neutral' as const,
      icon: <Bot size={24} />
    },
    {
      title: "Requêtes API",
      value: stats?.totalRequests.toLocaleString() || '0',
      change: stats?.trends.requests ? `${stats.trends.requests > 0 ? '+' : ''}${stats.trends.requests}% ce mois` : undefined,
      changeType: (stats?.trends.requests || 0) > 0 ? 'positive' as const : (stats?.trends.requests || 0) < 0 ? 'negative' as const : 'neutral' as const,
      icon: <Activity size={24} />
    },
    {
      title: "Taux de succès",
      value: `${stats?.successRate || 0}%`,
      change: stats?.trends.successRate ? `${stats.trends.successRate > 0 ? '+' : ''}${stats.trends.successRate}% ce mois` : undefined,
      changeType: (stats?.trends.successRate || 0) > 0 ? 'positive' as const : (stats?.trends.successRate || 0) < 0 ? 'negative' as const : 'neutral' as const,
      icon: <TrendingUp size={24} />
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<BarChart3 size={24} />}
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre plateforme"
        stats={[...Array(4)].map((_, i) => ({
          title: "Chargement...",
          value: "---",
          icon: <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
        }))}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<BarChart3 size={24} />}
      title="Tableau de bord"
      subtitle="Vue d'ensemble de votre plateforme"
      stats={statsData}
    >
      {/* Actions rapides */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/admin/utilisateurs" className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gérer les utilisateurs</h3>
                <p className="text-gray-600">Voir et modifier les comptes utilisateurs</p>
              </div>
            </div>
          </a>
          
          <a href="/admin/outils-ia" className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="flex items-center gap-4">
              <Bot className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Outils IA</h3>
                <p className="text-gray-600">Configurer les outils d'intelligence artificielle</p>
              </div>
            </div>
          </a>
          
          <a href="/admin/prompts" className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Prompts</h3>
                <p className="text-gray-600">Gérer les prompts système</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}