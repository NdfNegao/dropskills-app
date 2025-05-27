import { prisma } from '@/lib/prisma';
import { 
  Users, 
  Package, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Bot,
  MessageSquare
} from 'lucide-react';
import AdminStatsCard from '@/components/admin/AdminStatsCard';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminQuickActions from '@/components/admin/AdminQuickActions';

async function getDashboardStats() {
  const [
    totalUsers,
    totalProducts,
    totalActiveUsers,
    totalRevenue,
    recentUsers,
    topProducts
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.products.count(),
    prisma.profile.count({
      where: { status: 'ACTIVE' }
    }),
    // TODO: Calculer le revenu total depuis une table de transactions
    0, // Temporaire
    prisma.profile.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.products.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        product_stats: true,
        profiles: {
          select: { firstName: true, lastName: true }
        }
      }
    })
  ]);

  return {
    totalUsers,
    totalProducts,
    totalActiveUsers,
    totalRevenue,
    recentUsers,
    topProducts
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-gray-400">Vue d'ensemble de votre plateforme DropSkills</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          icon={Users}
          trend={`${stats.totalActiveUsers} actifs`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Packs actifs"
          value={stats.totalProducts}
          icon={Package}
          trend={`${stats.totalProducts} total`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Revenus totaux"
          value={`${Number(stats.totalRevenue).toFixed(0)}€`}
          icon={DollarSign}
          trend={`${stats.recentUsers.length} cette semaine`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Usage IA"
          value={stats.topProducts.length}
          icon={Bot}
          trend="7 derniers jours"
          trendUp={true}
        />
      </div>

      {/* Actions rapides et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminQuickActions />
        </div>
        
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Alertes
          </h3>
          <div className="space-y-3">
            {stats.topProducts.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">Top produits</span>
                </div>
                <span className="text-sm font-semibold text-yellow-500">{stats.topProducts.length}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm text-white">Système</span>
              </div>
              <span className="text-sm font-semibold text-green-500">Opérationnel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <AdminRecentActivity webhooks={[]} />
    </div>
  );
} 