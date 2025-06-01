'use client';

import { useState, useEffect } from 'react';
import { Users, Package, Bot, Activity, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import AdminDashboard, { StatCard } from '@/components/admin/AdminDashboard';

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

  if (loading) {
    return (
      <AdminDashboard
        title="Dashboard"
        description="Vue d'ensemble de votre plateforme"
        icon={BarChart3}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#111] rounded-xl p-6 border border-[#232323] animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard
      title="Dashboard"
      description="Vue d'ensemble de votre plateforme"
      icon={BarChart3}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs totaux"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          color="text-blue-400"
          trend={{
            value: stats?.trends.users || 0,
            isPositive: (stats?.trends.users || 0) > 0
          }}
        />
        <StatCard
          title="Outils IA"
          value={stats?.totalTools || 0}
          icon={Bot}
          color="text-green-400"
          trend={{
            value: stats?.trends.tools || 0,
            isPositive: (stats?.trends.tools || 0) >= 0
          }}
        />
        <StatCard
          title="Requêtes API"
          value={stats?.totalRequests.toLocaleString() || '0'}
          icon={Activity}
          color="text-purple-400"
          trend={{
            value: stats?.trends.requests || 0,
            isPositive: (stats?.trends.requests || 0) > 0
          }}
        />
        <StatCard
          title="Taux de succès"
          value={`${stats?.successRate || 0}%`}
          icon={TrendingUp}
          color="text-yellow-400"
          trend={{
            value: stats?.trends.successRate || 0,
            isPositive: (stats?.trends.successRate || 0) > 0
          }}
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/admin/utilisateurs" className="bg-[#111] rounded-xl p-6 border border-[#232323] hover:border-blue-500 transition-colors group">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-lg font-semibold text-white">Gérer les utilisateurs</h3>
              <p className="text-gray-400">Voir et modifier les comptes utilisateurs</p>
            </div>
          </div>
        </a>
        
        <a href="/admin/outils" className="bg-[#111] rounded-xl p-6 border border-[#232323] hover:border-green-500 transition-colors group">
          <div className="flex items-center gap-4">
            <Bot className="h-8 w-8 text-green-400 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-lg font-semibold text-white">Outils IA</h3>
              <p className="text-gray-400">Configurer les outils d'intelligence artificielle</p>
            </div>
          </div>
        </a>
        
        <a href="/admin/analytics" className="bg-[#111] rounded-xl p-6 border border-[#232323] hover:border-purple-500 transition-colors group">
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-lg font-semibold text-white">Analytics</h3>
              <p className="text-gray-400">Voir les statistiques détaillées</p>
            </div>
          </div>
        </a>
      </div>
    </AdminDashboard>
  );
}