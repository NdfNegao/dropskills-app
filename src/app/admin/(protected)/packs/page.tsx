import { Metadata } from 'next';
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Gestion des Packs | Admin DropSkills',
  description: 'Gérer les packs et produits digitaux',
};

async function getPacks() {
  try {
    const packs = await prisma.pack.findMany({
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        stats: true,
        _count: {
          select: {
            purchases: true,
            files: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return packs;
  } catch (error) {
    console.error('Erreur lors de la récupération des packs:', error);
    return [];
  }
}

export default async function PacksPage() {
  const packs = await getPacks();

  const stats = {
    total: packs.length,
    active: packs.filter(p => p.status === 'ACTIVE').length,
    draft: packs.filter(p => p.status === 'DRAFT').length,
    revenue: packs.reduce((sum, p) => sum + (p.stats?.revenue || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestion des Packs</h1>
        <button className="bg-[#00D2FF] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00B8E6] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Pack
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Packs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Brouillons</p>
              <p className="text-2xl font-bold text-white">{stats.draft}</p>
            </div>
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenus</p>
              <p className="text-2xl font-bold text-white">€{stats.revenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
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
              placeholder="Rechercher un pack..."
              className="w-full bg-[#18181b] text-white rounded-lg pl-10 pr-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
            />
          </div>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="DRAFT">Brouillon</option>
            <option value="ARCHIVED">Archivé</option>
            <option value="SUSPENDED">Suspendu</option>
          </select>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Toutes les catégories</option>
            <option value="DIGITAL_PRODUCT">Produit Digital</option>
            <option value="COURSE">Formation</option>
            <option value="TEMPLATE">Template</option>
            <option value="TOOL">Outil</option>
            <option value="SERVICE">Service</option>
          </select>
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Liste des packs */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Pack</th>
                <th className="text-left text-gray-400 p-4 font-medium">Créateur</th>
                <th className="text-left text-gray-400 p-4 font-medium">Statut</th>
                <th className="text-left text-gray-400 p-4 font-medium">Prix</th>
                <th className="text-left text-gray-400 p-4 font-medium">Ventes</th>
                <th className="text-left text-gray-400 p-4 font-medium">Revenus</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((pack) => (
                <tr key={pack.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#232323] rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{pack.title}</p>
                        <p className="text-gray-400 text-sm">{pack.category?.name || 'Sans catégorie'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">
                        {pack.creator.firstName} {pack.creator.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{pack.creator.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pack.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
                      pack.status === 'DRAFT' ? 'bg-orange-500/10 text-orange-400' :
                      pack.status === 'ARCHIVED' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {pack.status === 'ACTIVE' ? 'Actif' :
                       pack.status === 'DRAFT' ? 'Brouillon' :
                       pack.status === 'ARCHIVED' ? 'Archivé' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-white">
                      {pack.price ? `€${pack.price}` : 'Gratuit'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-white">{pack._count.purchases}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-white">€{(pack.stats?.revenue || 0).toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400">
                      {new Date(pack.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
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

        {packs.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun pack trouvé</p>
            <p className="text-gray-500 text-sm">Créez votre premier pack pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
} 