'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import MentorStatsCard from '@/components/admin/MentorStatsCard';
import { Users, Package, Bot, Activity, BarChart3, TrendingUp, TrendingDown, Minus, Loader2, Settings, Brain, FileText } from 'lucide-react';
import type { DashboardStats } from '@/types/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
    
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/dashboard/stats', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const statsData = stats ? [
    {
      title: "Utilisateurs",
      value: formatNumber(stats.users.total),
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Packs Vendus", 
      value: formatNumber(stats.packs.sold),
      icon: <Package className="w-5 h-5" />
    },
    {
      title: "Outils IA",
      value: formatNumber(stats.tools.total),
      icon: <Bot className="w-5 h-5" />
    },
    {
      title: "Activité",
      value: `${stats.activity.percentage}%`,
      icon: <Activity className="w-5 h-5" />
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<BarChart3 className="w-5 h-5" />}
        title="Dashboard Admin"
        subtitle="Chargement des données..."
        stats={[]}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement des statistiques...</span>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  if (error) {
    return (
      <AdminLayoutWithSidebar
        icon={<BarChart3 className="w-5 h-5" />}
        title="Dashboard Admin"
        subtitle="Erreur de chargement"
        stats={[]}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchDashboardStats}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<BarChart3 className="w-5 h-5" />}
      title="Dashboard Admin"
      subtitle="Vue d'ensemble de la plateforme DropSkills"
      stats={statsData}
    >
      {/* Actions rapides avec navigation réelle */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Actions rapides</h2>
          <button 
            onClick={fetchDashboardStats}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/utilisateurs"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
          >
            <Users className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-blue-700 font-medium">Gérer les utilisateurs</span>
          </a>
          <a 
            href="/admin/packs"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
          >
            <Package className="w-5 h-5 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-green-700 font-medium">Gérer les packs</span>
          </a>
          <a 
            href="/admin/ai-dashboard"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
          >
            <Bot className="w-5 h-5 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-purple-700 font-medium">Dashboard IA</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <a 
            href="/admin/outils"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
          >
            <Settings className="w-5 h-5 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-orange-700 font-medium">Configurer Outils</span>
          </a>
          <a 
            href="/admin/ai-config"
            className="flex items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors group"
          >
            <Brain className="w-5 h-5 text-teal-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-teal-700 font-medium">Config Providers</span>
          </a>
          <a 
            href="/admin/docs"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <FileText className="w-5 h-5 text-gray-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium">Documentation</span>
          </a>
        </div>
      </div>

      {/* Métriques détaillées */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {/* Utilisateurs */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Utilisateurs</h3>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Actifs</span>
                <span className="font-semibold text-blue-600">{formatNumber(stats.users.active)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nouveaux (30j)</span>
                <span className="font-semibold text-green-600">{formatNumber(stats.users.new_this_month)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-black">{formatNumber(stats.users.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Packs */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Packs</h3>
              <Package className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Disponibles</span>
                <span className="font-semibold text-blue-600">{formatNumber(stats.packs.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenus</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.packs.revenue)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendus</span>
                  <span className="text-xl font-bold text-black">{formatNumber(stats.packs.sold)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outils IA */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Outils IA</h3>
              <Bot className="w-6 h-6 text-purple-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Premium</span>
                <span className="font-semibold text-purple-600">{formatNumber(stats.tools.premium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilisations/jour</span>
                <span className="font-semibold text-orange-600">{formatNumber(stats.tools.usage_today)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Activité</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-black">{stats.activity.percentage}%</span>
                    {getTrendIcon(stats.activity.trend)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentors IA */}
          <div className="lg:col-span-2 xl:col-span-1">
            <MentorStatsCard />
          </div>
        </div>
      )}

      {/* Footer avec dernière mise à jour */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
        </p>
      </div>
    </AdminLayoutWithSidebar>
  );
}