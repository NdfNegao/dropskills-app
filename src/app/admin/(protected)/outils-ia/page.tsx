import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Bot, Plus, Activity, Zap, Search, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Outils IA | Admin DropSkills',
  description: 'Gestion des outils d\'intelligence artificielle',
};

async function getIaTools() {
  try {
    const tools = await prisma.aiTool.findMany({
      include: {
        _count: {
          select: {
            aiUsage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return tools;
  } catch (error) {
    console.error('Erreur lors de la récupération des outils IA:', error);
    return [];
  }
}

async function getUsageStats() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayUsage = await prisma.aiUsage.count({
      where: {
        createdAt: {
          gte: startOfDay
        }
      }
    });
    const totalUsage = await prisma.aiUsage.count();
    return { todayUsage, totalUsage };
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return { todayUsage: 0, totalUsage: 0 };
  }
}

export default async function OutilsIaPage() {
  const tools = await getIaTools();
  const { todayUsage, totalUsage } = await getUsageStats();
  const stats = {
    total: tools.length,
    active: tools.filter(t => t.isActive).length,
    inactive: tools.filter(t => !t.isActive).length,
    todayUsage,
    totalUsage
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Outils IA</h1>
        <button className="bg-[#00D2FF] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00B8E6] transition-colors flex items-center gap-2">
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

      {/* Liste des outils simplifiée */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-semibold text-white mb-4">Outils IA Disponibles</h2>
        <div className="space-y-4">
          {tools.map((tool) => (
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
          {tools.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              Aucun outil IA configuré
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 