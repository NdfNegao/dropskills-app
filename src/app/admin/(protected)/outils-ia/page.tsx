import { Metadata } from 'next';
import { Bot, Plus, Settings, Activity, Zap, Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Outils IA | Admin DropSkills',
  description: 'Gestion des outils d\'intelligence artificielle',
};

async function getIaTools() {
  try {
    const tools = await prisma.iaTool.findMany({
      include: {
        _count: {
          select: {
            usage: true
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
    
    const todayUsage = await prisma.iaToolUsage.count({
      where: {
        createdAt: {
          gte: startOfDay
        }
      }
    });

    const totalUsage = await prisma.iaToolUsage.count();
    
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

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              className="w-full bg-[#18181b] text-white rounded-lg pl-10 pr-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
            />
          </div>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Toutes les catégories</option>
            <option value="TEXT_GENERATOR">Générateur de texte</option>
            <option value="IMAGE_GENERATOR">Générateur d'images</option>
            <option value="PDF_PROCESSOR">Traitement PDF</option>
            <option value="TRANSLATOR">Traducteur</option>
            <option value="SUMMARIZER">Résumeur</option>
          </select>
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Liste des outils */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Outil</th>
                <th className="text-left text-gray-400 p-4 font-medium">Catégorie</th>
                <th className="text-left text-gray-400 p-4 font-medium">Statut</th>
                <th className="text-left text-gray-400 p-4 font-medium">Utilisations</th>
                <th className="text-left text-gray-400 p-4 font-medium">Coût/Usage</th>
                <th className="text-left text-gray-400 p-4 font-medium">Limite/Jour</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#232323] rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tool.name}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{tool.category || 'Non définie'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tool.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tool.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{tool._count.usage}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white">
                      {tool.costPerUse ? `€${tool.costPerUse}` : 'Gratuit'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">
                      {tool.maxUsagePerDay || 'Illimité'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400">
                      {new Date(tool.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun outil IA configuré</p>
            <p className="text-gray-500 text-sm">Ajoutez votre premier outil IA pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
} 