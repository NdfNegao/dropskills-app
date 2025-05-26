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
    activeUsers,
    totalPacks,
    activePacks,
    totalRevenue,
    recentPurchases,
    iaToolUsage,
    supportTickets,
    recentWebhooks
  ] = await Promise.all([
    // Utilisateurs totaux
    prisma.user.count(),
    
    // Utilisateurs actifs (connectés dans les 30 derniers jours)
    prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    
    // Packs totaux
    prisma.pack.count(),
    
    // Packs actifs
    prisma.pack.count({
      where: { status: 'ACTIVE', visibility: 'PUBLIC' }
    }),
    
    // Revenus totaux
    prisma.packUser.aggregate({
      _sum: { amount: true },
      where: { status: 'ACTIVE' }
    }),
    
    // Achats récents (7 derniers jours)
    prisma.packUser.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        status: 'ACTIVE'
      }
    }),
    
    // Usage outils IA (7 derniers jours)
    prisma.iaToolUsage.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    
    // Tickets de support ouverts
    prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
    }),
    
    // Webhooks récents
    prisma.webhookEvent.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        eventType: true,
        provider: true,
        status: true,
        createdAt: true,
        userEmail: true
      }
    })
  ]);

  return {
    totalUsers,
    activeUsers,
    totalPacks,
    activePacks,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentPurchases,
    iaToolUsage,
    supportTickets,
    recentWebhooks
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
          trend={`${stats.activeUsers} actifs`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Packs actifs"
          value={stats.activePacks}
          icon={Package}
          trend={`${stats.totalPacks} total`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Revenus totaux"
          value={`${Number(stats.totalRevenue).toFixed(0)}€`}
          icon={DollarSign}
          trend={`${stats.recentPurchases} cette semaine`}
          trendUp={true}
        />
        
        <AdminStatsCard
          title="Usage IA"
          value={stats.iaToolUsage}
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
            {stats.supportTickets > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">Tickets ouverts</span>
                </div>
                <span className="text-sm font-semibold text-yellow-500">{stats.supportTickets}</span>
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
      <AdminRecentActivity webhooks={stats.recentWebhooks} />
    </div>
  );
} 